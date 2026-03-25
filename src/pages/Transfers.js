import React, { useState } from 'react';
import { Row, Col, Card, Table, Form, Button, Badge } from 'react-bootstrap';
import { FiRepeat, FiDownload, FiEye, FiMapPin, FiCheckCircle, FiClock, FiAlertCircle, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Transfers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [transfers, setTransfers] = useState([
    {
      id: 1,
      assetTag: 'SV-T-001',
      assetName: 'iPad Pro 12.9"',
      fromLocation: 'ICT Dept.',
      toLocation: 'Finance Dept.',
      transferredBy: 'Admin Kuria',
      transferredDate: '2026-03-15',
      status: 'completed',
      reason: 'Department reassignment'
    },
    {
      id: 2,
      assetTag: 'SV-L-002',
      assetName: 'HP EliteBook 840 G9',
      fromLocation: 'Stores Room A',
      toLocation: 'ICT Dept.',
      transferredBy: 'Admin Kuria',
      transferredDate: '2026-03-14',
      status: 'completed',
      reason: 'New staff allocation'
    },
    {
      id: 3,
      assetTag: 'SV-F-004',
      assetName: 'Staff Desks × 6',
      fromLocation: 'Stores Room A',
      toLocation: 'Finance Dept.',
      transferredBy: 'Admin Kuria',
      transferredDate: '2026-03-12',
      status: 'completed',
      reason: 'Office renovation'
    },
    {
      id: 4,
      assetTag: 'SV-T-005',
      assetName: 'iPad Mini 6th Gen',
      fromLocation: 'HR Office',
      toLocation: 'ICT Workshop',
      transferredBy: 'Admin Kuria',
      transferredDate: '2026-03-10',
      status: 'pending',
      reason: 'Repair required'
    },
    {
      id: 5,
      assetTag: 'SV-V-001',
      assetName: 'Toyota Hiace Van',
      fromLocation: 'Parking Bay A',
      toLocation: 'Field / Kisumu',
      transferredBy: 'Admin Kuria',
      transferredDate: '2026-03-08',
      status: 'in_transit',
      reason: 'Field operations'
    }
  ]);

  const stats = {
    total: transfers.length,
    completed: transfers.filter(t => t.status === 'completed').length,
    pending: transfers.filter(t => t.status === 'pending').length,
    inTransit: transfers.filter(t => t.status === 'in_transit').length
  };

  const filteredTransfers = transfers.filter(t =>
    t.assetTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.fromLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.toLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const statuses = {
      completed: { bg: 'rgba(0, 229, 168, 0.12)', color: '#00E5A8', text: 'Completed', icon: <FiCheckCircle style={{ marginRight: '4px' }} /> },
      pending: { bg: 'rgba(255, 197, 66, 0.12)', color: '#FFC542', text: 'Pending', icon: <FiClock style={{ marginRight: '4px' }} /> },
      in_transit: { bg: 'rgba(79, 158, 248, 0.12)', color: '#4F9EF8', text: 'In Transit', icon: <FiMapPin style={{ marginRight: '4px' }} /> }
    };
    const s = statuses[status] || statuses.pending;
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 9px',
        borderRadius: '99px',
        fontSize: '10.5px',
        fontWeight: 700,
        background: s.bg,
        color: s.color
      }}>
        {s.icon} {s.text}
      </span>
    );
  };

  const StatCard = ({ icon: Icon, value, label, color }) => (
    <Card style={{
      background: '#0F1A2B',
      border: '1px solid #1C2E44',
      borderRadius: '14px',
      padding: '15px',
      cursor: 'pointer',
      transition: 'transform 0.22s, border-color 0.22s, box-shadow 0.22s'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-3px)';
      e.currentTarget.style.borderColor = '#243B54';
      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.45)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = '#1C2E44';
      e.currentTarget.style.boxShadow = 'none';
    }}>
      <Card.Body>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          marginBottom: '14px',
          background: color === 'g' ? 'rgba(0, 229, 168, 0.08)' : 
                      color === 'b' ? 'rgba(79, 158, 248, 0.09)' :
                      color === 'a' ? 'rgba(255, 197, 66, 0.09)' : 'rgba(255, 90, 101, 0.09)',
          color: color === 'g' ? '#00E5A8' : 
                 color === 'b' ? '#4F9EF8' :
                 color === 'a' ? '#FFC542' : '#FF5A65'
        }}>
          <Icon />
        </div>
        <div style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '30px',
          fontWeight: 800,
          lineHeight: 1,
          color: '#D8EAF8'
        }}>
          {value}
        </div>
        <div style={{
          fontSize: '10px',
          color: '#3D5A78',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginTop: '4px'
        }}>
          {label}
        </div>
      </Card.Body>
    </Card>
  );

  const styles = {
    pageHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '12px'
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
    pageActions: {
      display: 'flex',
      gap: '7px',
      flexWrap: 'wrap',
      alignItems: 'center'
    },
    btnPrimary: {
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
      cursor: 'pointer',
      transition: 'transform 0.18s, box-shadow 0.18s'
    },
    btnSecondary: {
      background: '#162234',
      color: '#D8EAF8',
      border: '1px solid #243B54',
      padding: '8px 18px',
      borderRadius: '9px',
      fontSize: '12.5px',
      fontWeight: 500,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '7px',
      cursor: 'pointer',
      transition: 'background 0.15s'
    },
    dataCard: {
      background: '#0F1A2B',
      border: '1px solid #1C2E44',
      borderRadius: '14px',
      overflow: 'hidden'
    },
    dcHeader: {
      padding: '13px 18px',
      borderBottom: '1px solid #1C2E44',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '8px',
      background: 'rgba(255, 255, 255, 0.012)'
    },
    dcTitle: {
      fontFamily: 'Syne, sans-serif',
      fontSize: '13px',
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      gap: '7px',
      color: '#D8EAF8'
    },
    tableSearch: {
      background: '#162234',
      border: '1px solid #1C2E44',
      color: '#D8EAF8',
      borderRadius: '9px',
      padding: '7px 30px 7px 11px',
      fontSize: '12px',
      outline: 'none',
      width: '200px',
      transition: 'border-color 0.15s, box-shadow 0.15s',
      backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'13\' height=\'13\' fill=\'%233D5A78\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z\'/%3E%3C/svg%3E")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 9px center'
    },
    customTable: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    mono: {
      fontFamily: 'DM Mono, monospace',
      fontSize: '11.5px',
      color: '#4F9EF8',
      letterSpacing: '0.04em'
    },
    actionBtn: {
      background: 'none',
      border: 'none',
      color: '#3D5A78',
      padding: '4px 7px',
      borderRadius: '6px',
      fontSize: '13px',
      cursor: 'pointer',
      transition: 'background 0.11s, color 0.11s'
    }
  };

  // Add global styles
  const globalStyle = document.createElement("style");
  globalStyle.textContent = `
    .btn-primary-custom:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(0, 229, 168, 0.36);
    }
    .btn-outline:hover {
      background: #1C2E44;
      border-color: #243B54;
    }
    .table-search:focus {
      border-color: #00E5A8;
      box-shadow: 0 0 0 3px rgba(0, 229, 168, 0.1);
    }
    .custom-table thead th {
      padding: 10px 14px;
      text-align: left;
      font-size: 10px;
      letter-spacing: 0.09em;
      text-transform: uppercase;
      color: #3D5A78;
      font-weight: 700;
      white-space: nowrap;
      background: rgba(255, 255, 255, 0.014);
      border-bottom: 1px solid #1C2E44;
    }
    .custom-table tbody tr {
      border-bottom: 1px solid rgba(28, 46, 68, 0.6);
      transition: background 0.11s;
    }
    .custom-table tbody tr:hover {
      background: rgba(255, 255, 255, 0.026);
    }
    .custom-table tbody td {
      padding: 11px 14px;
      font-size: 13px;
      vertical-align: middle;
    }
    .action-btn:hover {
      background: #162234;
      color: #D8EAF8;
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(14px);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }
  `;
  document.head.appendChild(globalStyle);

  return (
    <div style={{ animation: 'fadeIn 0.38s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Asset Transfers</h1>
          <p style={styles.pageSubtitle}>Track movement of assets between locations and departments</p>
        </div>
        <div style={styles.pageActions}>
          <button 
            className="btn-outline" 
            style={styles.btnSecondary} 
            onClick={() => toast.info('Exporting transfers...')}
            onMouseEnter={(e) => e.currentTarget.style.background = '#1C2E44'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#162234'}
          >
            <FiDownload /> Export
          </button>
          <button 
            className="btn-primary-custom" 
            style={styles.btnPrimary} 
            onClick={() => toast.info('New transfer form coming soon')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 229, 168, 0.36)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 229, 168, 0.22)';
            }}
          >
            <FiRepeat /> New Transfer
          </button>
        </div>
      </div>

      <Row className="g-3 mb-4">
        <Col xs={6} xl={3}>
          <StatCard icon={FiRepeat} value={stats.total} label="Total Transfers" color="g" />
        </Col>
        <Col xs={6} xl={3}>
          <StatCard icon={FiCheckCircle} value={stats.completed} label="Completed" color="b" />
        </Col>
        <Col xs={6} xl={3}>
          <StatCard icon={FiClock} value={stats.pending} label="Pending" color="a" />
        </Col>
        <Col xs={6} xl={3}>
          <StatCard icon={FiMapPin} value={stats.inTransit} label="In Transit" color="r" />
        </Col>
      </Row>

      <div style={styles.dataCard}>
        <div style={styles.dcHeader}>
          <div style={styles.dcTitle}>
            <FiRepeat /> Transfer History
          </div>
          <div>
            <input
              type="text"
              placeholder="Search by asset, location..."
              className="table-search"
              style={styles.tableSearch}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table" style={styles.customTable}>
            <thead>
              <tr>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', letterSpacing: '0.09em', textTransform: 'uppercase', color: '#3D5A78', fontWeight: 700, background: 'rgba(255, 255, 255, 0.014)', borderBottom: '1px solid #1C2E44' }}>Asset Tag</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', letterSpacing: '0.09em', textTransform: 'uppercase', color: '#3D5A78', fontWeight: 700, background: 'rgba(255, 255, 255, 0.014)', borderBottom: '1px solid #1C2E44' }}>Asset Name</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', letterSpacing: '0.09em', textTransform: 'uppercase', color: '#3D5A78', fontWeight: 700, background: 'rgba(255, 255, 255, 0.014)', borderBottom: '1px solid #1C2E44' }}>From</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', letterSpacing: '0.09em', textTransform: 'uppercase', color: '#3D5A78', fontWeight: 700, background: 'rgba(255, 255, 255, 0.014)', borderBottom: '1px solid #1C2E44' }}>To</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', letterSpacing: '0.09em', textTransform: 'uppercase', color: '#3D5A78', fontWeight: 700, background: 'rgba(255, 255, 255, 0.014)', borderBottom: '1px solid #1C2E44' }}>Transferred By</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', letterSpacing: '0.09em', textTransform: 'uppercase', color: '#3D5A78', fontWeight: 700, background: 'rgba(255, 255, 255, 0.014)', borderBottom: '1px solid #1C2E44' }}>Date</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', letterSpacing: '0.09em', textTransform: 'uppercase', color: '#3D5A78', fontWeight: 700, background: 'rgba(255, 255, 255, 0.014)', borderBottom: '1px solid #1C2E44' }}>Status</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', letterSpacing: '0.09em', textTransform: 'uppercase', color: '#3D5A78', fontWeight: 700, background: 'rgba(255, 255, 255, 0.014)', borderBottom: '1px solid #1C2E44' }}>Reason</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', letterSpacing: '0.09em', textTransform: 'uppercase', color: '#3D5A78', fontWeight: 700, background: 'rgba(255, 255, 255, 0.014)', borderBottom: '1px solid #1C2E44' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransfers.map(transfer => (
                <tr key={transfer.id}>
                  <td style={styles.mono}>{transfer.assetTag} </td>
                  <td>{transfer.assetName}</td>
                  <td>{transfer.fromLocation}</td>
                  <td>{transfer.toLocation}</td>
                  <td>{transfer.transferredBy}</td>
                  <td>{transfer.transferredDate}</td>
                  <td>{getStatusBadge(transfer.status)}</td>
                  <td style={{ color: '#6B8FAE' }}>{transfer.reason}</td>
                  <td>
                    <button 
                      className="action-btn" 
                      style={styles.actionBtn}
                      onClick={() => toast.info(`Viewing details for transfer of ${transfer.assetName}`)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#162234';
                        e.currentTarget.style.color = '#D8EAF8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none';
                        e.currentTarget.style.color = '#3D5A78';
                      }}
                      title="View Details"
                    >
                      <FiEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTransfers.length === 0 && (
            <div style={{
              padding: '48px',
              textAlign: 'center',
              color: '#3D5A78'
            }}>
              <FiSearch style={{ fontSize: '34px', marginBottom: '12px', opacity: 0.3 }} />
              <p>No transfers found matching your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transfers;