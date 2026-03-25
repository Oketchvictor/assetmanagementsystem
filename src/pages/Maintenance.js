import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Badge } from 'react-bootstrap';
import { FiTool, FiDownload, FiEye, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Maintenance = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const [reports] = useState([
    {
      id: 1,
      assetTag: 'SV-T-005',
      assetName: 'iPad Mini 6th Gen',
      issueType: 'Screen Damage',
      severity: 'High',
      status: 'in_progress',
      reportedBy: 'Admin Kuria',
      reportedDate: '2026-03-10',
      description: 'Cracked screen after accidental drop'
    },
    {
      id: 2,
      assetTag: 'SV-L-006',
      assetName: 'HP EliteBook 650 G9',
      issueType: 'Hardware Fault',
      severity: 'Critical',
      status: 'pending',
      reportedBy: 'James Otieno',
      reportedDate: '2026-03-12',
      description: 'Motherboard failure, won\'t boot'
    },
    {
      id: 3,
      assetTag: 'SV-AP-004',
      assetName: 'Water Dispenser',
      issueType: 'Routine Maintenance',
      severity: 'Low',
      status: 'completed',
      reportedBy: 'Admin Kuria',
      reportedDate: '2026-03-08',
      description: 'Filter replacement required'
    }
  ]);

  const getSeverityBadge = (severity) => {
    const colors = {
      Low: { bg: 'rgba(0, 229, 168, 0.12)', color: '#00E5A8' },
      Medium: { bg: 'rgba(79, 158, 248, 0.12)', color: '#4F9EF8' },
      High: { bg: 'rgba(255, 197, 66, 0.12)', color: '#FFC542' },
      Critical: { bg: 'rgba(255, 90, 101, 0.12)', color: '#FF5A65' }
    };
    const c = colors[severity] || colors.Low;
    return (
      <span style={{
        display: 'inline-block',
        padding: '3px 9px',
        borderRadius: '99px',
        fontSize: '10.5px',
        fontWeight: 700,
        background: c.bg,
        color: c.color
      }}>
        {severity}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const statuses = {
      pending: { bg: 'rgba(255, 197, 66, 0.12)', color: '#FFC542', text: 'Pending' },
      in_progress: { bg: 'rgba(79, 158, 248, 0.12)', color: '#4F9EF8', text: 'In Progress' },
      completed: { bg: 'rgba(0, 229, 168, 0.12)', color: '#00E5A8', text: 'Completed' }
    };
    const s = statuses[status] || statuses.pending;
    return (
      <span style={{
        display: 'inline-block',
        padding: '3px 9px',
        borderRadius: '99px',
        fontSize: '10.5px',
        fontWeight: 700,
        background: s.bg,
        color: s.color
      }}>
        {s.text}
      </span>
    );
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: '24px',
            fontWeight: 800,
            background: 'linear-gradient(90deg, #D8EAF8 50%, #00E5A8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>Maintenance Reports</h1>
          <p style={{ color: '#6B8FAE', fontSize: '12px', marginTop: '3px' }}>Track and manage asset maintenance requests</p>
        </div>
        <div style={{ display: 'flex', gap: '7px' }}>
          <button style={{
            background: '#162234',
            color: '#D8EAF8',
            border: '1px solid #243B54',
            padding: '8px 18px',
            borderRadius: '9px',
            fontSize: '12.5px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            cursor: 'pointer'
          }} onClick={() => toast.info('Exporting maintenance reports...')}>
            <FiDownload /> Export
          </button>
          <button style={{
            background: 'linear-gradient(135deg, #00E5A8, #00C49A)',
            color: '#07101F',
            border: 'none',
            padding: '8px 18px',
            borderRadius: '9px',
            fontWeight: 700,
            fontSize: '12.5px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            cursor: 'pointer'
          }} onClick={() => toast.info('New maintenance report form coming soon')}>
            <FiTool /> New Report
          </button>
        </div>
      </div>

      <Card style={{
        background: '#0F1A2B',
        border: '1px solid #1C2E44',
        borderRadius: '14px',
        overflow: 'hidden'
      }}>
        <Card.Header style={{
          padding: '13px 18px',
          borderBottom: '1px solid #1C2E44',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.012)'
        }}>
          <div style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            color: '#D8EAF8'
          }}>
            <FiTool /> Maintenance Queue
          </div>
          <div>
            <input
              type="text"
              placeholder="Search by asset..."
              style={{
                background: '#162234',
                border: '1px solid #1C2E44',
                color: '#D8EAF8',
                borderRadius: '9px',
                padding: '7px 30px 7px 11px',
                fontSize: '12px',
                outline: 'none',
                width: '200px'
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </Card.Header>
        <Card.Body style={{ padding: 0 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', color: '#3D5A78', borderBottom: '1px solid #1C2E44' }}>Asset Tag</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', color: '#3D5A78', borderBottom: '1px solid #1C2E44' }}>Asset Name</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', color: '#3D5A78', borderBottom: '1px solid #1C2E44' }}>Issue Type</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', color: '#3D5A78', borderBottom: '1px solid #1C2E44' }}>Severity</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', color: '#3D5A78', borderBottom: '1px solid #1C2E44' }}>Status</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', color: '#3D5A78', borderBottom: '1px solid #1C2E44' }}>Reported By</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', color: '#3D5A78', borderBottom: '1px solid #1C2E44' }}>Date</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', color: '#3D5A78', borderBottom: '1px solid #1C2E44' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(report => (
                  <tr key={report.id} style={{ borderBottom: '1px solid rgba(28, 46, 68, 0.6)' }}>
                    <td style={{ padding: '11px 14px', fontFamily: 'DM Mono, monospace', fontSize: '11.5px', color: '#4F9EF8' }}>{report.assetTag}</td>
                    <td style={{ padding: '11px 14px' }}>{report.assetName}</td>
                    <td style={{ padding: '11px 14px' }}>{report.issueType}</td>
                    <td style={{ padding: '11px 14px' }}>{getSeverityBadge(report.severity)}</td>
                    <td style={{ padding: '11px 14px' }}>{getStatusBadge(report.status)}</td>
                    <td style={{ padding: '11px 14px' }}>{report.reportedBy}</td>
                    <td style={{ padding: '11px 14px' }}>{report.reportedDate}</td>
                    <td style={{ padding: '11px 14px' }}>
                      <button style={{ background: 'none', border: 'none', color: '#3D5A78', cursor: 'pointer' }} title="View Details">
                        <FiEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Maintenance;