import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Badge } from 'react-bootstrap';
import { 
  FiUsers, 
  FiUserPlus, 
  FiDownload, 
  FiSearch, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiEdit, 
  FiTrash2, 
  FiUserCheck 
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const Staff = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [staff, setStaff] = useState([
    {
      id: 1,
      name: 'John Maina',
      employeeId: 'EMP001',
      email: 'john.maina@seovo.com',
      phone: '+254 712 345 678',
      department: 'ICT',
      position: 'Senior IT Officer',
      location: 'Nairobi HQ',
      joinDate: 'Jan 2023',
      status: 'active'
    },
    {
      id: 2,
      name: 'Alice Njeri',
      employeeId: 'EMP002',
      email: 'alice.njeri@seovo.com',
      phone: '+254 723 456 789',
      department: 'Finance',
      position: 'Finance Manager',
      location: 'Nairobi HQ',
      joinDate: 'Mar 2022',
      status: 'active'
    },
    {
      id: 3,
      name: 'Peter Kamau',
      employeeId: 'EMP003',
      email: 'peter.kamau@seovo.com',
      phone: '+254 734 567 890',
      department: 'Admin',
      position: 'Administrative Officer',
      location: 'Nairobi HQ',
      joinDate: 'Jun 2023',
      status: 'active'
    },
    {
      id: 4,
      name: 'Mary Wanjiku',
      employeeId: 'EMP004',
      email: 'mary.wanjiku@seovo.com',
      phone: '+254 745 678 901',
      department: 'HR',
      position: 'HR Manager',
      location: 'Nairobi HQ',
      joinDate: 'Jan 2022',
      status: 'active'
    },
    {
      id: 5,
      name: 'Grace Nyambura',
      employeeId: 'EMP005',
      email: 'grace.nyambura@seovo.com',
      phone: '+254 756 789 012',
      department: 'Admin',
      position: 'Executive Assistant',
      location: 'Nairobi HQ',
      joinDate: 'Apr 2023',
      status: 'active'
    },
    {
      id: 6,
      name: 'David Onyango',
      employeeId: 'EMP006',
      email: 'david.onyango@seovo.com',
      phone: '+254 767 890 123',
      department: 'ICT',
      position: 'Network Administrator',
      location: 'Nairobi HQ',
      joinDate: 'Aug 2022',
      status: 'active'
    },
    {
      id: 7,
      name: 'Samuel Odhiambo',
      employeeId: 'EMP007',
      email: 'samuel.odhiambo@seovo.com',
      phone: '+254 778 901 234',
      department: 'Logistics',
      position: 'Logistics Coordinator',
      location: 'Kisumu',
      joinDate: 'Oct 2023',
      status: 'active'
    },
    {
      id: 8,
      name: 'Christine Kamau',
      employeeId: 'EMP008',
      email: 'christine.kamau@seovo.com',
      phone: '+254 789 012 345',
      department: 'Finance',
      position: 'Accounts Officer',
      location: 'Nairobi HQ',
      joinDate: 'Feb 2023',
      status: 'active'
    },
    {
      id: 9,
      name: 'Ruth Kiplagat',
      employeeId: 'EMP009',
      email: 'ruth.kiplagat@seovo.com',
      phone: '+254 790 123 456',
      department: 'Design',
      position: 'Creative Designer',
      location: 'Nairobi HQ',
      joinDate: 'May 2023',
      status: 'active'
    },
    {
      id: 10,
      name: 'Faith Ndung\'u',
      employeeId: 'EMP010',
      email: 'faith.ndungu@seovo.com',
      phone: '+254 701 234 567',
      department: 'Admin',
      position: 'Office Administrator',
      location: 'Nairobi HQ',
      joinDate: 'Nov 2022',
      status: 'active'
    }
  ]);

  const stats = {
    total: staff.length,
    active: staff.filter(s => s.status === 'active').length,
    departments: [...new Set(staff.map(s => s.department))].length,
    locations: [...new Set(staff.map(s => s.location))].length
  };

  const filteredStaff = staff.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    return (
      <span style={{
        display: 'inline-block',
        padding: '3px 9px',
        borderRadius: '99px',
        fontSize: '10.5px',
        fontWeight: 700,
        background: 'rgba(0, 229, 168, 0.12)',
        color: '#00E5A8'
      }}>
        {status}
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
          <h1 style={styles.pageTitle}>Staff Directory</h1>
          <p style={styles.pageSubtitle}>Manage employee records, assignments, and contact information</p>
        </div>
        <div style={styles.pageActions}>
          <button 
            className="btn-outline" 
            style={styles.btnSecondary} 
            onClick={() => toast.info('Exporting staff list...')}
            onMouseEnter={(e) => e.currentTarget.style.background = '#1C2E44'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#162234'}
          >
            <FiDownload /> Export
          </button>
          <button 
            className="btn-primary-custom" 
            style={styles.btnPrimary} 
            onClick={() => toast.info('Add staff form coming soon')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 229, 168, 0.36)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 229, 168, 0.22)';
            }}
          >
            <FiUserPlus /> Add Staff
          </button>
        </div>
      </div>

      <Row className="g-3 mb-4">
        <Col xs={6} xl={3}>
          <StatCard icon={FiUsers} value={stats.total} label="Total Staff" color="g" />
        </Col>
        <Col xs={6} xl={3}>
          <StatCard icon={FiUserCheck} value={stats.active} label="Active" color="b" />
        </Col>
        <Col xs={6} xl={3}>
          <StatCard icon={FiUsers} value={stats.departments} label="Departments" color="a" />
        </Col>
        <Col xs={6} xl={3}>
          <StatCard icon={FiMapPin} value={stats.locations} label="Locations" color="r" />
        </Col>
      </Row>

      <div style={styles.dataCard}>
        <div style={styles.dcHeader}>
          <div style={styles.dcTitle}>
            <FiUsers /> Employee Register
          </div>
          <div>
            <input
              type="text"
              placeholder="Search name, ID, email..."
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
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', letterSpacing: '0.09em', textTransform: 'uppercase', color: '#3D5A78', fontWeight: 700, background: 'rgba(255, 255, 255, 0.014)', borderBottom: '1px solid #1C2E44' }}>Employee ID</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', letterSpacing: '0.09em', textTransform: 'uppercase', color: '#3D5A78', fontWeight: 700, background: 'rgba(255, 255, 255, 0.014)', borderBottom: '1px solid #1C2E44' }}>Name</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', letterSpacing: '0.09em', textTransform: 'uppercase', color: '#3D5A78', fontWeight: 700, background: 'rgba(255, 255, 255, 0.014)', borderBottom: '1px solid #1C2E44' }}>Email</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', letterSpacing: '0.09em', textTransform: 'uppercase', color: '#3D5A78', fontWeight: 700, background: 'rgba(255, 255, 255, 0.014)', borderBottom: '1px solid #1C2E44' }}>Phone</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', letterSpacing: '0.09em', textTransform: 'uppercase', color: '#3D5A78', fontWeight: 700, background: 'rgba(255, 255, 255, 0.014)', borderBottom: '1px solid #1C2E44' }}>Department</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', letterSpacing: '0.09em', textTransform: 'uppercase', color: '#3D5A78', fontWeight: 700, background: 'rgba(255, 255, 255, 0.014)', borderBottom: '1px solid #1C2E44' }}>Position</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', letterSpacing: '0.09em', textTransform: 'uppercase', color: '#3D5A78', fontWeight: 700, background: 'rgba(255, 255, 255, 0.014)', borderBottom: '1px solid #1C2E44' }}>Location</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', letterSpacing: '0.09em', textTransform: 'uppercase', color: '#3D5A78', fontWeight: 700, background: 'rgba(255, 255, 255, 0.014)', borderBottom: '1px solid #1C2E44' }}>Join Date</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', letterSpacing: '0.09em', textTransform: 'uppercase', color: '#3D5A78', fontWeight: 700, background: 'rgba(255, 255, 255, 0.014)', borderBottom: '1px solid #1C2E44' }}>Status</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', letterSpacing: '0.09em', textTransform: 'uppercase', color: '#3D5A78', fontWeight: 700, background: 'rgba(255, 255, 255, 0.014)', borderBottom: '1px solid #1C2E44' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map(employee => (
                <tr key={employee.id}>
                  <td style={styles.mono}>{employee.employeeId}</td>
                  <td>{employee.name}</td>
                  <td><span style={{ color: '#6B8FAE' }}>{employee.email}</span></td>
                  <td>{employee.phone}</td>
                  <td>{employee.department}</td>
                  <td>{employee.position}</td>
                  <td>{employee.location}</td>
                  <td>{employee.joinDate}</td>
                  <td>{getStatusBadge(employee.status)}</td>
                  <td>
                    <button 
                      className="action-btn" 
                      style={styles.actionBtn}
                      onClick={() => toast.info(`Editing ${employee.name}`)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#162234';
                        e.currentTarget.style.color = '#D8EAF8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none';
                        e.currentTarget.style.color = '#3D5A78';
                      }}
                      title="Edit"
                    >
                      <FiEdit />
                    </button>
                    <button 
                      className="action-btn" 
                      style={styles.actionBtn}
                      onClick={() => toast.info(`Delete ${employee.name}?`)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#162234';
                        e.currentTarget.style.color = '#D8EAF8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none';
                        e.currentTarget.style.color = '#3D5A78';
                      }}
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStaff.length === 0 && (
            <div style={{
              padding: '48px',
              textAlign: 'center',
              color: '#3D5A78'
            }}>
              <FiSearch style={{ fontSize: '34px', marginBottom: '12px', opacity: 0.3 }} />
              <p>No staff members found matching your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Staff;