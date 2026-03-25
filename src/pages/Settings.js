import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { FiSettings, FiBell, FiMoon, FiGlobe, FiSave, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: true,
    emailAlerts: true,
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    autoRefresh: 30
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    toast.success('Settings saved successfully');
  };

  const handleReset = () => {
    const defaultSettings = {
      theme: 'dark',
      notifications: true,
      emailAlerts: true,
      language: 'en',
      dateFormat: 'DD/MM/YYYY',
      autoRefresh: 30
    };
    setSettings(defaultSettings);
    toast.info('Settings reset to default');
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
    card: {
      background: '#0F1A2B',
      border: '1px solid #1C2E44',
      borderRadius: '14px',
      marginBottom: '24px'
    },
    cardHeader: {
      padding: '16px 20px',
      borderBottom: '1px solid #1C2E44',
      background: 'rgba(255, 255, 255, 0.012)',
      fontFamily: 'Syne, sans-serif',
      fontSize: '14px',
      fontWeight: 700,
      color: '#D8EAF8'
    },
    cardBody: {
      padding: '20px'
    },
    formLabel: {
      fontSize: '12px',
      color: '#6B8FAE',
      marginBottom: '6px',
      fontWeight: 500
    },
    formControl: {
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
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
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
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer'
    }
  };

  return (
    <div>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Settings</h1>
        <p style={styles.pageSubtitle}>Manage your application preferences and account settings</p>
      </div>

      <Row>
        <Col md={8}>
          <Card style={styles.card}>
            <div style={styles.cardHeader}>
              <FiSettings style={{ marginRight: '8px' }} /> General Settings
            </div>
            <div style={styles.cardBody}>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group style={{ marginBottom: '20px' }}>
                      <Form.Label style={styles.formLabel}>Theme</Form.Label>
                      <Form.Select
                        name="theme"
                        value={settings.theme}
                        onChange={handleChange}
                        style={styles.formControl}
                      >
                        <option value="dark">Dark Theme</option>
                        <option value="light">Light Theme (Coming Soon)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group style={{ marginBottom: '20px' }}>
                      <Form.Label style={styles.formLabel}>Language</Form.Label>
                      <Form.Select
                        name="language"
                        value={settings.language}
                        onChange={handleChange}
                        style={styles.formControl}
                      >
                        <option value="en">English</option>
                        <option value="sw">Swahili (Coming Soon)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group style={{ marginBottom: '20px' }}>
                      <Form.Label style={styles.formLabel}>Date Format</Form.Label>
                      <Form.Select
                        name="dateFormat"
                        value={settings.dateFormat}
                        onChange={handleChange}
                        style={styles.formControl}
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group style={{ marginBottom: '20px' }}>
                      <Form.Label style={styles.formLabel}>Auto Refresh (seconds)</Form.Label>
                      <Form.Control
                        type="number"
                        name="autoRefresh"
                        value={settings.autoRefresh}
                        onChange={handleChange}
                        style={styles.formControl}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </div>
          </Card>

          <Card style={styles.card}>
            <div style={styles.cardHeader}>
              <FiBell style={{ marginRight: '8px' }} /> Notification Settings
            </div>
            <div style={styles.cardBody}>
              <Form>
                <Form.Check
                  type="switch"
                  label="Enable Desktop Notifications"
                  name="notifications"
                  checked={settings.notifications}
                  onChange={handleChange}
                  style={{ marginBottom: '16px', color: '#D8EAF8' }}
                />
                <Form.Check
                  type="switch"
                  label="Email Alerts for Critical Issues"
                  name="emailAlerts"
                  checked={settings.emailAlerts}
                  onChange={handleChange}
                  style={{ marginBottom: '16px', color: '#D8EAF8' }}
                />
                <Alert variant="info" style={{ background: 'rgba(79, 158, 248, 0.09)', border: '1px solid rgba(79, 158, 248, 0.22)', color: '#4F9EF8', fontSize: '12px', marginTop: '16px' }}>
                  <FiBell style={{ marginRight: '8px' }} />
                  Notifications will be sent for asset assignments, transfers, and maintenance reports.
                </Alert>
              </Form>
            </div>
          </Card>
        </Col>

        <Col md={4}>
          <Card style={styles.card}>
            <div style={styles.cardHeader}>
              <FiGlobe style={{ marginRight: '8px' }} /> Actions
            </div>
            <div style={styles.cardBody}>
              <Button style={{ ...styles.btnPrimary, width: '100%', marginBottom: '12px' }} onClick={handleSave}>
                <FiSave /> Save Changes
              </Button>
              <Button style={{ ...styles.btnSecondary, width: '100%' }} onClick={handleReset}>
                <FiRefreshCw /> Reset to Default
              </Button>
            </div>
          </Card>

          <Card style={styles.card}>
            <div style={styles.cardHeader}>
              <FiSettings style={{ marginRight: '8px' }} /> System Info
            </div>
            <div style={styles.cardBody}>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', color: '#3D5A78' }}>Version</div>
                <div style={{ color: '#D8EAF8', fontWeight: 600 }}>Seovo AMS v2.1.0</div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', color: '#3D5A78' }}>Last Updated</div>
                <div style={{ color: '#D8EAF8', fontWeight: 600 }}>March 2026</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#3D5A78' }}>Support</div>
                <div style={{ color: '#00E5A8' }}>support@seovo.com</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Settings;