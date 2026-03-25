import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { 
  FiFileText, FiDownload, FiBarChart2, FiPieChart, 
  FiCalendar, FiBox, FiFile, FiFilePlus, FiClock,
  FiCheckCircle, FiAlertCircle, FiX, FiTrash2, 
  FiMail, FiRepeat, FiSunrise, FiSunset, FiStar,
  FiSend, FiEdit2
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import reportService from '../services/reportService';

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showSchedulesModal, setShowSchedulesModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('html');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [schedules, setSchedules] = useState([]);
  const [scheduleForm, setScheduleForm] = useState({
    reportType: '',
    reportName: '',
    format: 'html',
    frequency: 'weekly',
    dayOfWeek: 'Monday',
    time: '09:00',
    email: '',
    startDate: '',
    endDate: '',
    active: true
  });
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [processingSchedules, setProcessingSchedules] = useState(false);

  // Load schedules from localStorage on mount
  useEffect(() => {
    loadSchedules();
    
    // Set up interval to check for scheduled reports every minute
    const interval = setInterval(() => {
      checkAndProcessSchedules();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const loadSchedules = () => {
    const savedSchedules = localStorage.getItem('reportSchedules');
    if (savedSchedules) {
      try {
        const parsed = JSON.parse(savedSchedules);
        setSchedules(parsed);
      } catch (e) {
        console.error('Error parsing schedules:', e);
        setSchedules([]);
      }
    }
  };

  const saveSchedules = (newSchedules) => {
    localStorage.setItem('reportSchedules', JSON.stringify(newSchedules));
    setSchedules(newSchedules);
  };

  const checkAndProcessSchedules = async () => {
    if (processingSchedules) return;
    
    setProcessingSchedules(true);
    try {
      const now = new Date();
      let updated = false;
      const updatedSchedules = [...schedules];
      
      for (let i = 0; i < updatedSchedules.length; i++) {
        const schedule = updatedSchedules[i];
        
        if (schedule.active && schedule.nextRun) {
          const nextRunDate = new Date(schedule.nextRun);
          if (nextRunDate <= now) {
            try {
              // Send the report
              await reportService.sendReportByEmail(
                schedule.reportType,
                schedule.format,
                schedule.email,
                {
                  start_date: schedule.startDate || '',
                  end_date: schedule.endDate || ''
                }
              );
              
              // Update schedule with new next run time
              const newNextRun = calculateNextRun(schedule);
              updatedSchedules[i] = {
                ...schedule,
                lastSent: now.toISOString(),
                nextRun: newNextRun
              };
              updated = true;
              
              toast.success(`Report sent to ${schedule.email}`);
            } catch (error) {
              console.error(`Failed to send scheduled report ${schedule.id}:`, error);
            }
          }
        }
      }
      
      if (updated) {
        saveSchedules(updatedSchedules);
      }
    } finally {
      setProcessingSchedules(false);
    }
  };

  const calculateNextRun = (schedule) => {
    const [hours, minutes] = schedule.time.split(':').map(Number);
    const now = new Date();
    let nextRun = new Date();
    nextRun.setHours(hours, minutes, 0, 0);
    
    if (schedule.frequency === 'daily') {
      if (nextRun <= now) {
        nextRun.setDate(nextRun.getDate() + 1);
      }
    } else if (schedule.frequency === 'weekly') {
      const targetDay = getDayNumber(schedule.dayOfWeek);
      const currentDay = nextRun.getDay();
      let daysToAdd = targetDay - currentDay;
      if (daysToAdd <= 0) daysToAdd += 7;
      nextRun.setDate(nextRun.getDate() + daysToAdd);
      if (nextRun <= now) {
        nextRun.setDate(nextRun.getDate() + 7);
      }
    } else if (schedule.frequency === 'monthly') {
      const targetDay = parseInt(schedule.dayOfWeek);
      nextRun.setDate(targetDay);
      if (nextRun <= now) {
        nextRun.setMonth(nextRun.getMonth() + 1);
      }
    }
    
    return nextRun.toISOString();
  };

  const getDayNumber = (day) => {
    const days = {
      'Sunday': 0,
      'Monday': 1,
      'Tuesday': 2,
      'Wednesday': 3,
      'Thursday': 4,
      'Friday': 5,
      'Saturday': 6
    };
    return days[day];
  };

  const formatNextRun = (nextRun) => {
    if (!nextRun) return 'Not scheduled';
    const date = new Date(nextRun);
    return date.toLocaleString();
  };

  const reportTypes = [
    { 
      id: 'asset-inventory', 
      name: 'Asset Inventory Report', 
      icon: FiBox, 
      description: 'Complete list of all assets with details including tags, locations, status, and values',
      color: 'g',
      hasFilters: true
    },
    { 
      id: 'asset-assignment', 
      name: 'Asset Assignment Report', 
      icon: FiFileText, 
      description: 'Assets assigned to staff members with assignment dates and expected returns',
      color: 'b',
      hasFilters: true
    },
    { 
      id: 'maintenance', 
      name: 'Maintenance History Report', 
      icon: FiBarChart2, 
      description: 'All maintenance requests, status, severity, and resolution details',
      color: 'a',
      hasFilters: true
    },
    { 
      id: 'transfer-history', 
      name: 'Transfer History Report', 
      icon: FiCalendar, 
      description: 'Asset movement and transfer logs between locations and departments',
      color: 'r',
      hasFilters: true
    },
    { 
      id: 'category-summary', 
      name: 'Category Summary', 
      icon: FiPieChart, 
      description: 'Asset distribution by category with status breakdowns',
      color: 'v',
      hasFilters: false
    },
    { 
      id: 'location-inventory', 
      name: 'Location Inventory', 
      icon: FiBox, 
      description: 'Assets grouped by location with category breakdowns and total values',
      color: 'g',
      hasFilters: true
    }
  ];

  const formatOptions = [
    { id: 'html', label: 'HTML', icon: FiFile, mime: 'text/html' },
    { id: 'txt', label: 'Text', icon: FiFilePlus, mime: 'text/plain' },
    { id: 'doc', label: 'Word', icon: FiFileText, mime: 'application/msword' }
  ];

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const frequencies = [
    { id: 'daily', label: 'Daily', icon: FiSunrise },
    { id: 'weekly', label: 'Weekly', icon: FiCalendar },
    { id: 'monthly', label: 'Monthly', icon: FiSunset }
  ];

  const handleGenerateReport = async (reportType) => {
    if (reportType.hasFilters) {
      setSelectedReport(reportType);
      setShowFilterModal(true);
    } else {
      await generateReport(reportType.id);
    }
  };

  const generateReport = async (reportId, filters = {}) => {
    setLoading(true);
    try {
      const result = await reportService.generateReport(reportId, selectedFormat, {
        ...filters,
        start_date: dateRange.startDate,
        end_date: dateRange.endDate
      });
      toast.success(`Report generated successfully: ${result.fileName}`);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error(error.message || 'Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
      setShowFilterModal(false);
      setSelectedReport(null);
    }
  };

  const handleFilterSubmit = () => {
    if (selectedReport) {
      generateReport(selectedReport.id);
    }
  };

  const handleOpenScheduleModal = (reportType = null) => {
    if (reportType) {
      setScheduleForm({
        ...scheduleForm,
        reportType: reportType.id,
        reportName: reportType.name,
        format: selectedFormat,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });
    }
    setEditingScheduleId(null);
    setShowScheduleModal(true);
  };

  const handleEditSchedule = (schedule) => {
    setScheduleForm({
      reportType: schedule.reportType,
      reportName: schedule.reportName || getReportName(schedule.reportType),
      format: schedule.format,
      frequency: schedule.frequency,
      dayOfWeek: schedule.dayOfWeek || 'Monday',
      time: schedule.time,
      email: schedule.email,
      startDate: schedule.startDate || '',
      endDate: schedule.endDate || '',
      active: schedule.active
    });
    setEditingScheduleId(schedule.id);
    setShowScheduleModal(true);
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setScheduleForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSchedule = () => {
    if (!scheduleForm.email) {
      toast.warn('Please enter an email address');
      return;
    }

    if (!scheduleForm.reportType) {
      toast.warn('Please select a report type');
      return;
    }

    const nextRun = calculateNextRun(scheduleForm);
    
    const newSchedule = {
      id: editingScheduleId || Date.now(),
      reportType: scheduleForm.reportType,
      reportName: scheduleForm.reportName,
      format: scheduleForm.format,
      frequency: scheduleForm.frequency,
      dayOfWeek: scheduleForm.dayOfWeek,
      time: scheduleForm.time,
      email: scheduleForm.email,
      startDate: scheduleForm.startDate,
      endDate: scheduleForm.endDate,
      active: scheduleForm.active,
      createdAt: editingScheduleId ? (schedules.find(s => s.id === editingScheduleId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
      lastSent: editingScheduleId ? (schedules.find(s => s.id === editingScheduleId)?.lastSent || null) : null,
      nextRun: nextRun
    };

    let updatedSchedules;
    if (editingScheduleId) {
      updatedSchedules = schedules.map(s => s.id === editingScheduleId ? newSchedule : s);
      toast.success('Schedule updated successfully!');
    } else {
      updatedSchedules = [...schedules, newSchedule];
      toast.success('Report schedule created successfully!');
    }
    
    saveSchedules(updatedSchedules);
    setShowScheduleModal(false);
    resetScheduleForm();
  };

  const resetScheduleForm = () => {
    setScheduleForm({
      reportType: '',
      reportName: '',
      format: 'html',
      frequency: 'weekly',
      dayOfWeek: 'Monday',
      time: '09:00',
      email: '',
      startDate: '',
      endDate: '',
      active: true
    });
    setEditingScheduleId(null);
  };

  const handleDeleteSchedule = (id) => {
    if (window.confirm('Are you sure you want to delete this scheduled report?')) {
      const updatedSchedules = schedules.filter(s => s.id !== id);
      saveSchedules(updatedSchedules);
      toast.info('Schedule deleted');
    }
  };

  const handleToggleSchedule = (id) => {
    const updatedSchedules = schedules.map(s => 
      s.id === id ? { ...s, active: !s.active } : s
    );
    saveSchedules(updatedSchedules);
    const schedule = updatedSchedules.find(s => s.id === id);
    toast.info(`Schedule ${schedule.active ? 'activated' : 'paused'}`);
  };

  const handleTestSend = async (schedule) => {
    setLoading(true);
    try {
      await reportService.sendReportByEmail(
        schedule.reportType,
        schedule.format,
        schedule.email,
        {
          start_date: schedule.startDate || '',
          end_date: schedule.endDate || ''
        }
      );
      toast.success(`Test email sent to ${schedule.email}`);
    } catch (error) {
      toast.error('Failed to send test email');
    } finally {
      setLoading(false);
    }
  };

  const getFrequencyIcon = (frequency) => {
    const freq = frequencies.find(f => f.id === frequency);
    return freq ? <freq.icon size={12} /> : <FiRepeat size={12} />;
  };

  const getReportName = (reportTypeId) => {
    const report = reportTypes.find(r => r.id === reportTypeId);
    return report ? report.name : reportTypeId;
  };

  const getIconColor = (color) => {
    const colors = {
      g: { bg: 'rgba(0, 229, 168, 0.08)', color: '#00E5A8' },
      b: { bg: 'rgba(79, 158, 248, 0.09)', color: '#4F9EF8' },
      a: { bg: 'rgba(255, 197, 66, 0.09)', color: '#FFC542' },
      r: { bg: 'rgba(255, 90, 101, 0.09)', color: '#FF5A65' },
      v: { bg: 'rgba(167, 139, 250, 0.09)', color: '#A78BFA' }
    };
    return colors[color] || colors.g;
  };

  const styles = {
    pageHeader: {
      marginBottom: '24px'
    },
    pageTitle: {
      fontFamily: 'Syne, sans-serif',
      fontSize: '24px',
      fontWeight: 800,
      background: 'linear-gradient(90deg, #D8EAF8 50%, #00E5A8)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: 0
    },
    pageSubtitle: {
      color: '#6B8FAE',
      fontSize: '12px',
      marginTop: '3px'
    },
    reportCard: {
      background: '#0F1A2B',
      border: '1px solid #1C2E44',
      borderRadius: '14px',
      padding: '20px',
      cursor: 'pointer',
      transition: 'all 0.22s',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    reportIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      marginBottom: '16px'
    },
    reportName: {
      fontFamily: 'Syne, sans-serif',
      fontSize: '16px',
      fontWeight: 700,
      color: '#D8EAF8',
      marginBottom: '8px'
    },
    reportDescription: {
      fontSize: '12px',
      color: '#6B8FAE',
      marginBottom: '16px',
      lineHeight: 1.5,
      flex: 1
    },
    formatButtons: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
      flexWrap: 'wrap'
    },
    formatBtn: {
      padding: '8px 16px',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.15s',
      border: '1px solid #1C2E44',
      background: '#162234',
      color: '#6B8FAE'
    },
    formatBtnActive: {
      background: 'linear-gradient(135deg, #00E5A8, #00C49A)',
      color: '#07101F',
      border: 'none'
    },
    modalHead: {
      padding: '20px 22px 16px',
      borderBottom: '1px solid #1C2E44',
      background: '#0C1829',
      fontFamily: 'Syne, sans-serif',
      fontSize: '14px',
      fontWeight: 700,
      color: '#D8EAF8'
    },
    modalBody: {
      padding: '20px 22px',
      background: '#0F1A2B',
      maxHeight: '70vh',
      overflowY: 'auto'
    },
    modalFoot: {
      padding: '14px 22px',
      borderTop: '1px solid #1C2E44',
      background: 'rgba(255, 255, 255, 0.011)',
      display: 'flex',
      gap: '10px',
      justifyContent: 'flex-end'
    },
    formLabel: {
      fontSize: '11px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      color: '#6B8FAE',
      marginBottom: '6px',
      fontWeight: 600,
      display: 'block'
    },
    formControl: {
      width: '100%',
      background: '#162234',
      border: '1px solid #1C2E44',
      color: '#D8EAF8',
      borderRadius: '8px',
      padding: '8px 12px',
      fontSize: '13px'
    },
    btnPrimary: {
      background: 'linear-gradient(135deg, #00E5A8, #00C49A)',
      color: '#07101F',
      border: 'none',
      padding: '8px 20px',
      borderRadius: '8px',
      fontWeight: 600,
      fontSize: '13px',
      cursor: 'pointer'
    },
    btnSecondary: {
      background: '#162234',
      color: '#D8EAF8',
      border: '1px solid #243B54',
      padding: '8px 20px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: 500,
      cursor: 'pointer'
    },
    btnDanger: {
      background: 'rgba(255, 90, 101, 0.1)',
      color: '#FF5A65',
      border: '1px solid rgba(255, 90, 101, 0.2)',
      padding: '6px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px'
    },
    btnSuccess: {
      background: 'rgba(0, 229, 168, 0.1)',
      color: '#00E5A8',
      border: '1px solid rgba(0, 229, 168, 0.2)',
      padding: '6px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px'
    },
    scheduleCard: {
      background: '#0F1A2B',
      border: '1px solid #1C2E44',
      borderRadius: '14px',
      marginTop: '24px',
      overflow: 'hidden'
    },
    scheduleHeader: {
      padding: '16px 20px',
      borderBottom: '1px solid #1C2E44',
      background: 'rgba(255, 255, 255, 0.012)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px'
    },
    scheduleTitle: {
      fontFamily: 'Syne, sans-serif',
      fontSize: '14px',
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#D8EAF8'
    },
    scheduleTable: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    scheduleTableHeader: {
      padding: '12px 16px',
      textAlign: 'left',
      fontSize: '11px',
      fontWeight: 600,
      color: '#3D5A78',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      borderBottom: '1px solid #1C2E44'
    },
    scheduleTableCell: {
      padding: '12px 16px',
      fontSize: '12px',
      color: '#D8EAF8',
      borderBottom: '1px solid rgba(28, 46, 68, 0.6)'
    },
    loadingOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(7, 16, 31, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    },
    loadingContent: {
      background: '#0F1A2B',
      border: '1px solid #1C2E44',
      borderRadius: '14px',
      padding: '30px',
      textAlign: 'center',
      minWidth: '300px'
    },
    scheduleBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 8px',
      borderRadius: '20px',
      fontSize: '10px',
      fontWeight: 600,
      background: 'rgba(79, 158, 248, 0.12)',
      color: '#4F9EF8'
    }
  };

  return (
    <div>
      {loading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingContent}>
            <Spinner animation="border" variant="success" style={{ marginBottom: '16px' }} />
            <h3 style={{ color: '#D8EAF8', marginBottom: '8px' }}>Processing</h3>
            <p style={{ color: '#6B8FAE', fontSize: '12px' }}>Please wait...</p>
          </div>
        </div>
      )}

      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Reports Dashboard</h1>
          <p style={styles.pageSubtitle}>Generate, download, and schedule automated reports</p>
        </div>
      </div>

      {/* Format Selection */}
      <div style={styles.formatButtons}>
        {formatOptions.map(format => {
          const Icon = format.icon;
          return (
            <button
              key={format.id}
              style={{
                ...styles.formatBtn,
                ...(selectedFormat === format.id ? styles.formatBtnActive : {})
              }}
              onClick={() => setSelectedFormat(format.id)}
              onMouseEnter={(e) => {
                if (selectedFormat !== format.id) {
                  e.currentTarget.style.background = '#1C2E44';
                  e.currentTarget.style.color = '#D8EAF8';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedFormat !== format.id) {
                  e.currentTarget.style.background = '#162234';
                  e.currentTarget.style.color = '#6B8FAE';
                }
              }}
            >
              <Icon style={{ marginRight: '6px' }} /> {format.label}
            </button>
          );
        })}
      </div>

      <Row className="g-4">
        {reportTypes.map(report => {
          const Icon = report.icon;
          const iconStyle = getIconColor(report.color);
          return (
            <Col md={6} lg={4} key={report.id}>
              <div 
                className="report-card" 
                style={styles.reportCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = '#00E5A8';
                  e.currentTarget.style.boxShadow = '0 8px 28px rgba(0, 229, 168, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#1C2E44';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ ...styles.reportIcon, background: iconStyle.bg, color: iconStyle.color }}>
                  <Icon />
                </div>
                <h3 style={styles.reportName}>{report.name}</h3>
                <p style={styles.reportDescription}>{report.description}</p>
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                  <button 
                    className="btn-generate" 
                    style={styles.btnPrimary}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 229, 168, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenerateReport(report);
                    }}
                  >
                    <FiDownload /> Generate
                  </button>
                  <button 
                    className="btn-schedule" 
                    style={styles.btnSecondary}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#1C2E44'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#162234'}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenScheduleModal(report);
                    }}
                  >
                    <FiCalendar /> Schedule
                  </button>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>

      {/* Schedule Reports Section */}
      <Card style={styles.scheduleCard}>
        <div style={styles.scheduleHeader}>
          <div style={styles.scheduleTitle}>
            <FiClock /> Scheduled Reports
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button 
              variant="link" 
              style={styles.btnSecondary}
              onClick={() => setShowSchedulesModal(true)}
            >
              <FiStar /> View All Schedules ({schedules.filter(s => s.active).length} active)
            </Button>
          </div>
        </div>
        <div style={{ padding: '20px' }}>
          {schedules.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6B8FAE' }}>
              <FiCalendar size={40} style={{ marginBottom: '16px', opacity: 0.3 }} />
              <p>No scheduled reports yet. Click "Schedule" on any report to set up automatic delivery.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.scheduleTable}>
                <thead>
                  <tr>
                    <th style={styles.scheduleTableHeader}>Report</th>
                    <th style={styles.scheduleTableHeader}>Frequency</th>
                    <th style={styles.scheduleTableHeader}>Schedule</th>
                    <th style={styles.scheduleTableHeader}>Format</th>
                    <th style={styles.scheduleTableHeader}>Email</th>
                    <th style={styles.scheduleTableHeader}>Next Run</th>
                    <th style={styles.scheduleTableHeader}>Status</th>
                    <th style={styles.scheduleTableHeader}>Actions</th>
                  </thead>
                <tbody>
                  {schedules.slice(0, 3).map(schedule => (
                    <tr key={schedule.id}>
                      <td style={styles.scheduleTableCell}>
                        <strong>{schedule.reportName || getReportName(schedule.reportType)}</strong>
                       </td>
                      <td style={styles.scheduleTableCell}>
                        <span style={styles.scheduleBadge}>
                          {getFrequencyIcon(schedule.frequency)} {schedule.frequency.charAt(0).toUpperCase() + schedule.frequency.slice(1)}
                        </span>
                       </td>
                      <td style={styles.scheduleTableCell}>
                        {schedule.frequency === 'daily' ? 'Every day' :
                         schedule.frequency === 'weekly' ? `Every ${schedule.dayOfWeek}` :
                         `Day ${schedule.dayOfWeek} of month`} at {schedule.time}
                       </td>
                      <td style={styles.scheduleTableCell}>
                        <span style={styles.scheduleBadge}>{schedule.format.toUpperCase()}</span>
                       </td>
                      <td style={styles.scheduleTableCell}>{schedule.email}</td>
                      <td style={styles.scheduleTableCell}>
                        <span style={{ fontSize: '11px', color: '#00E5A8' }}>
                          {formatNextRun(schedule.nextRun)}
                        </span>
                       </td>
                      <td style={styles.scheduleTableCell}>
                        <span style={{
                          ...styles.scheduleBadge,
                          background: schedule.active ? 'rgba(0, 229, 168, 0.12)' : 'rgba(61, 90, 120, 0.12)',
                          color: schedule.active ? '#00E5A8' : '#6B8FAE'
                        }}>
                          {schedule.active ? 'Active' : 'Paused'}
                        </span>
                       </td>
                      <td style={styles.scheduleTableCell}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button
                            style={styles.btnSuccess}
                            onClick={() => handleTestSend(schedule)}
                            title="Send Test Email"
                          >
                            <FiSend size={12} />
                          </button>
                          <button
                            style={styles.btnSuccess}
                            onClick={() => handleEditSchedule(schedule)}
                            title="Edit"
                          >
                            <FiEdit2 size={12} />
                          </button>
                          <button
                            style={styles.btnSuccess}
                            onClick={() => handleToggleSchedule(schedule.id)}
                            title={schedule.active ? 'Pause' : 'Activate'}
                          >
                            {schedule.active ? <FiClock size={12} /> : <FiRepeat size={12} />}
                          </button>
                          <button
                            style={styles.btnDanger}
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            title="Delete"
                          >
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                       </td>
                     </tr>
                  ))}
                </tbody>
              </table>
              {schedules.length > 3 && (
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <button 
                    style={styles.btnSecondary}
                    onClick={() => setShowSchedulesModal(true)}
                  >
                    View all {schedules.length} schedules
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Filter Modal */}
      <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)} centered size="lg">
        <Modal.Header style={styles.modalHead}>
          <Modal.Title style={{ color: '#D8EAF8', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiCalendar /> Filter {selectedReport?.name}
          </Modal.Title>
          <button 
            onClick={() => setShowFilterModal(false)}
            style={{
              background: '#162234',
              border: '1px solid #1C2E44',
              color: '#3D5A78',
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <FiX />
          </button>
        </Modal.Header>
        <Modal.Body style={styles.modalBody}>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group style={{ marginBottom: '16px' }}>
                  <Form.Label style={styles.formLabel}>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                    style={styles.formControl}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group style={{ marginBottom: '16px' }}>
                  <Form.Label style={styles.formLabel}>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                    style={styles.formControl}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Alert variant="info" style={{ background: 'rgba(79, 158, 248, 0.09)', border: '1px solid rgba(79, 158, 248, 0.22)', color: '#4F9EF8', fontSize: '12px' }}>
              <FiAlertCircle style={{ marginRight: '8px' }} />
              Leave dates empty to include all records
            </Alert>
          </Form>
        </Modal.Body>
        <Modal.Footer style={styles.modalFoot}>
          <button style={styles.btnSecondary} onClick={() => setShowFilterModal(false)}>
            Cancel
          </button>
          <button style={styles.btnPrimary} onClick={handleFilterSubmit}>
            <FiDownload /> Generate Report
          </button>
        </Modal.Footer>
      </Modal>

      {/* Schedule Modal */}
      <Modal show={showScheduleModal} onHide={() => {
        setShowScheduleModal(false);
        resetScheduleForm();
      }} centered size="lg">
        <Modal.Header style={styles.modalHead}>
          <Modal.Title style={{ color: '#D8EAF8', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiCalendar /> {editingScheduleId ? 'Edit' : 'Schedule'} Automated Report
          </Modal.Title>
          <button 
            onClick={() => {
              setShowScheduleModal(false);
              resetScheduleForm();
            }}
            style={{
              background: '#162234',
              border: '1px solid #1C2E44',
              color: '#3D5A78',
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <FiX />
          </button>
        </Modal.Header>
        <Modal.Body style={styles.modalBody}>
          <Form>
            <Form.Group style={{ marginBottom: '16px' }}>
              <Form.Label style={styles.formLabel}>Report Type</Form.Label>
              <Form.Select
                name="reportType"
                value={scheduleForm.reportType}
                onChange={handleScheduleChange}
                style={styles.formControl}
              >
                <option value="">Select Report</option>
                {reportTypes.map(report => (
                  <option key={report.id} value={report.id}>{report.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group style={{ marginBottom: '16px' }}>
                  <Form.Label style={styles.formLabel}>Format</Form.Label>
                  <Form.Select
                    name="format"
                    value={scheduleForm.format}
                    onChange={handleScheduleChange}
                    style={styles.formControl}
                  >
                    {formatOptions.map(format => (
                      <option key={format.id} value={format.id}>{format.label}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group style={{ marginBottom: '16px' }}>
                  <Form.Label style={styles.formLabel}>Frequency</Form.Label>
                  <Form.Select
                    name="frequency"
                    value={scheduleForm.frequency}
                    onChange={handleScheduleChange}
                    style={styles.formControl}
                  >
                    {frequencies.map(freq => (
                      <option key={freq.id} value={freq.id}>{freq.label}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {scheduleForm.frequency !== 'daily' && (
              <Row>
                <Col md={6}>
                  <Form.Group style={{ marginBottom: '16px' }}>
                    <Form.Label style={styles.formLabel}>
                      {scheduleForm.frequency === 'weekly' ? 'Day of Week' : 'Day of Month'}
                    </Form.Label>
                    {scheduleForm.frequency === 'weekly' ? (
                      <Form.Select
                        name="dayOfWeek"
                        value={scheduleForm.dayOfWeek}
                        onChange={handleScheduleChange}
                        style={styles.formControl}
                      >
                        {weekDays.map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </Form.Select>
                    ) : (
                      <Form.Select
                        name="dayOfWeek"
                        value={scheduleForm.dayOfWeek}
                        onChange={handleScheduleChange}
                        style={styles.formControl}
                      >
                        {[...Array(28)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>Day {i + 1}</option>
                        ))}
                      </Form.Select>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group style={{ marginBottom: '16px' }}>
                    <Form.Label style={styles.formLabel}>Time (24h)</Form.Label>
                    <Form.Control
                      type="time"
                      name="time"
                      value={scheduleForm.time}
                      onChange={handleScheduleChange}
                      style={styles.formControl}
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}

            {scheduleForm.frequency === 'daily' && (
              <Row>
                <Col md={6}>
                  <Form.Group style={{ marginBottom: '16px' }}>
                    <Form.Label style={styles.formLabel}>Time (24h)</Form.Label>
                    <Form.Control
                      type="time"
                      name="time"
                      value={scheduleForm.time}
                      onChange={handleScheduleChange}
                      style={styles.formControl}
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}

            <Form.Group style={{ marginBottom: '16px' }}>
              <Form.Label style={styles.formLabel}>Delivery Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={scheduleForm.email}
                onChange={handleScheduleChange}
                placeholder="reports@example.com"
                style={styles.formControl}
              />
              <Form.Text style={{ color: '#6B8FAE', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                Reports will be sent to this email address
              </Form.Text>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group style={{ marginBottom: '16px' }}>
                  <Form.Label style={styles.formLabel}>Start Date (Optional)</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={scheduleForm.startDate}
                    onChange={handleScheduleChange}
                    style={styles.formControl}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group style={{ marginBottom: '16px' }}>
                  <Form.Label style={styles.formLabel}>End Date (Optional)</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={scheduleForm.endDate}
                    onChange={handleScheduleChange}
                    style={styles.formControl}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Alert variant="info" style={{ background: 'rgba(79, 158, 248, 0.09)', border: '1px solid rgba(79, 158, 248, 0.22)', color: '#4F9EF8', fontSize: '12px', marginTop: '8px' }}>
              <FiMail style={{ marginRight: '8px' }} />
              Reports will be automatically generated and sent to the specified email at the scheduled time.
              You can test the schedule by clicking "Send Test Email" after saving.
            </Alert>
          </Form>
        </Modal.Body>
        <Modal.Footer style={styles.modalFoot}>
          <button style={styles.btnSecondary} onClick={() => {
            setShowScheduleModal(false);
            resetScheduleForm();
          }}>
            Cancel
          </button>
          <button style={styles.btnPrimary} onClick={handleAddSchedule}>
            <FiCalendar /> {editingScheduleId ? 'Update Schedule' : 'Schedule Report'}
          </button>
        </Modal.Footer>
      </Modal>

      {/* All Schedules Modal */}
      <Modal show={showSchedulesModal} onHide={() => setShowSchedulesModal(false)} centered size="lg">
        <Modal.Header style={styles.modalHead}>
          <Modal.Title style={{ color: '#D8EAF8', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiClock /> All Scheduled Reports
          </Modal.Title>
          <button 
            onClick={() => setShowSchedulesModal(false)}
            style={{
              background: '#162234',
              border: '1px solid #1C2E44',
              color: '#3D5A78',
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <FiX />
          </button>
        </Modal.Header>
        <Modal.Body style={styles.modalBody}>
          {schedules.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6B8FAE' }}>
              <FiCalendar size={40} style={{ marginBottom: '16px', opacity: 0.3 }} />
              <p>No scheduled reports yet.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.scheduleTable}>
                <thead>
                  <tr>
                    <th style={styles.scheduleTableHeader}>Report</th>
                    <th style={styles.scheduleTableHeader}>Frequency</th>
                    <th style={styles.scheduleTableHeader}>Schedule</th>
                    <th style={styles.scheduleTableHeader}>Format</th>
                    <th style={styles.scheduleTableHeader}>Email</th>
                    <th style={styles.scheduleTableHeader}>Next Run</th>
                    <th style={styles.scheduleTableHeader}>Last Sent</th>
                    <th style={styles.scheduleTableHeader}>Status</th>
                    <th style={styles.scheduleTableHeader}>Actions</th>
                    </tr>
                   </thead>
                <tbody>
                  {schedules.map(schedule => (
                    <tr key={schedule.id}>
                      <td style={styles.scheduleTableCell}>
                        <strong>{schedule.reportName || getReportName(schedule.reportType)}</strong>
                        </td>
                      <td style={styles.scheduleTableCell}>
                        <span style={styles.scheduleBadge}>
                          {getFrequencyIcon(schedule.frequency)} {schedule.frequency.charAt(0).toUpperCase() + schedule.frequency.slice(1)}
                        </span>
                        </td>
                      <td style={styles.scheduleTableCell}>
                        {schedule.frequency === 'daily' ? 'Every day' :
                         schedule.frequency === 'weekly' ? `Every ${schedule.dayOfWeek}` :
                         `Day ${schedule.dayOfWeek} of month`} at {schedule.time}
                        </td>
                      <td style={styles.scheduleTableCell}>
                        <span style={styles.scheduleBadge}>{schedule.format.toUpperCase()}</span>
                        </td>
                      <td style={styles.scheduleTableCell}>{schedule.email}</td>
                      <td style={styles.scheduleTableCell}>
                        <span style={{ fontSize: '11px', color: '#00E5A8' }}>
                          {formatNextRun(schedule.nextRun)}
                        </span>
                        </td>
                      <td style={styles.scheduleTableCell}>
                        <span style={{ fontSize: '11px', color: '#6B8FAE' }}>
                          {schedule.lastSent ? new Date(schedule.lastSent).toLocaleString() : 'Never'}
                        </span>
                        </td>
                      <td style={styles.scheduleTableCell}>
                        <span style={{
                          ...styles.scheduleBadge,
                          background: schedule.active ? 'rgba(0, 229, 168, 0.12)' : 'rgba(61, 90, 120, 0.12)',
                          color: schedule.active ? '#00E5A8' : '#6B8FAE'
                        }}>
                          {schedule.active ? 'Active' : 'Paused'}
                        </span>
                        </td>
                      <td style={styles.scheduleTableCell}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button
                            style={styles.btnSuccess}
                            onClick={() => handleTestSend(schedule)}
                            title="Send Test Email"
                          >
                            <FiSend size={12} />
                          </button>
                          <button
                            style={styles.btnSuccess}
                            onClick={() => {
                              setShowSchedulesModal(false);
                              handleEditSchedule(schedule);
                            }}
                            title="Edit"
                          >
                            <FiEdit2 size={12} />
                          </button>
                          <button
                            style={styles.btnSuccess}
                            onClick={() => {
                              handleToggleSchedule(schedule.id);
                              loadSchedules();
                            }}
                            title={schedule.active ? 'Pause' : 'Activate'}
                          >
                            {schedule.active ? <FiClock size={12} /> : <FiRepeat size={12} />}
                          </button>
                          <button
                            style={styles.btnDanger}
                            onClick={() => {
                              handleDeleteSchedule(schedule.id);
                              loadSchedules();
                            }}
                            title="Delete"
                          >
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                        </td>
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={styles.modalFoot}>
          <button style={styles.btnSecondary} onClick={() => setShowSchedulesModal(false)}>
            Close
          </button>
          <button style={styles.btnPrimary} onClick={() => {
            setShowSchedulesModal(false);
            handleOpenScheduleModal();
          }}>
            <FiCalendar /> New Schedule
          </button>
        </Modal.Footer>
      </Modal>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: none; }
        }
        .report-card {
          animation: fadeIn 0.38s ease both;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
};

export default Reports;