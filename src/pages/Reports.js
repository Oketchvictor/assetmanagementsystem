import React, { useState } from 'react';
import { Card, Row, Col, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { 
  FiFileText, FiDownload, FiBarChart2, FiPieChart, 
  FiCalendar, FiBox, FiFile, FiFilePlus, FiPrinter,
  FiCheckCircle, FiAlertCircle, FiX
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import reportService from '../services/reportService';

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('html');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

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
      height: '100%'
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
      lineHeight: 1.5
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
      background: '#0F1A2B'
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
    }
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

  const formatOptions = [
    { id: 'html', label: 'HTML', icon: FiFile, mime: 'text/html' },
    { id: 'pdf', label: 'PDF', icon: FiFileText, mime: 'application/pdf' },
    { id: 'txt', label: 'Text', icon: FiFilePlus, mime: 'text/plain' },
    { id: 'doc', label: 'Word', icon: FiFileText, mime: 'application/msword' }
  ];

  return (
    <div>
      {loading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingContent}>
            <Spinner animation="border" variant="success" style={{ marginBottom: '16px' }} />
            <h3 style={{ color: '#D8EAF8', marginBottom: '8px' }}>Generating Report</h3>
            <p style={{ color: '#6B8FAE', fontSize: '12px' }}>Please wait while we prepare your report...</p>
          </div>
        </div>
      )}

      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Reports Dashboard</h1>
        <p style={styles.pageSubtitle}>Generate and download asset management reports in multiple formats</p>
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
                onClick={() => handleGenerateReport(report)}
              >
                <div style={{ ...styles.reportIcon, background: iconStyle.bg, color: iconStyle.color }}>
                  <Icon />
                </div>
                <h3 style={styles.reportName}>{report.name}</h3>
                <p style={styles.reportDescription}>{report.description}</p>
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
                  <FiDownload /> Generate {formatOptions.find(f => f.id === selectedFormat)?.label} Report
                </button>
              </div>
            </Col>
          );
        })}
      </Row>

      {/* Schedule Reports Card */}
      <Card style={{
        background: '#0F1A2B',
        border: '1px solid #1C2E44',
        borderRadius: '14px',
        marginTop: '24px'
      }}>
        <Card.Body style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <FiCalendar style={{ color: '#00E5A8', fontSize: '20px' }} />
            <div>
              <h4 style={{ fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: 700, color: '#D8EAF8', margin: 0 }}>Schedule Automated Reports</h4>
              <p style={{ fontSize: '11px', color: '#6B8FAE', margin: 0 }}>Set up automatic report delivery to your email</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              style={styles.btnSecondary}
              onClick={() => toast.info('Daily report scheduling coming soon')}
              onMouseEnter={(e) => e.currentTarget.style.background = '#1C2E44'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#162234'}
            >
              Daily Report
            </button>
            <button 
              style={styles.btnSecondary}
              onClick={() => toast.info('Weekly report scheduling coming soon')}
              onMouseEnter={(e) => e.currentTarget.style.background = '#1C2E44'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#162234'}
            >
              Weekly Report
            </button>
            <button 
              style={styles.btnSecondary}
              onClick={() => toast.info('Monthly report scheduling coming soon')}
              onMouseEnter={(e) => e.currentTarget.style.background = '#1C2E44'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#162234'}
            >
              Monthly Report
            </button>
          </div>
        </Card.Body>
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

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: none; }
        }
        .report-card {
          animation: fadeIn 0.38s ease both;
        }
      `}</style>
    </div>
  );
};

export default Reports;