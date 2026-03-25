import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { FiUser, FiMail, FiPhone, FiBriefcase, FiKey, FiSave, FiUserCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import authService from '../services/authService';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department: ''
  });
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await authService.getCurrentUser();
      setUser(response.data);
      setFormData({
        first_name: response.data.first_name || '',
        last_name: response.data.last_name || '',
        email: response.data.email || '',
        phone: response.data.profile?.phone || '',
        department: response.data.profile?.department || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await authService.updateProfile(formData);
      toast.success('Profile updated successfully');
      fetchUserProfile(); // Refresh data
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.new_password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setChangingPassword(true);
    
    try {
      await authService.changePassword(passwordData.old_password, passwordData.new_password);
      toast.success('Password changed successfully');
      setPasswordData({
        old_password: '',
        new_password: '',
        confirm_password: ''
      });
      setChangingPassword(false);
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.error || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

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
    avatar: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #00E5A8, #4F9EF8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '40px',
      fontWeight: 800,
      color: '#07101F',
      marginBottom: '16px'
    },
    roleBadge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: 600,
      background: user?.profile?.role === 'admin' ? 'rgba(0, 229, 168, 0.12)' : 'rgba(79, 158, 248, 0.09)',
      color: user?.profile?.role === 'admin' ? '#00E5A8' : '#4F9EF8'
    },
    formLabel: {
      fontSize: '11px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      color: '#6B8FAE',
      marginBottom: '6px',
      fontWeight: 600
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
      gap: '8px'
    },
    btnSecondary: {
      background: '#162234',
      color: '#D8EAF8',
      border: '1px solid #243B54',
      padding: '8px 20px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: 500
    }
  };

  const getUserInitials = () => {
    const first = formData.first_name?.charAt(0) || '';
    const last = formData.last_name?.charAt(0) || '';
    return (first + last).toUpperCase() || user?.username?.charAt(0).toUpperCase() || 'U';
  };

  const getRoleLabel = () => {
    const roles = {
      admin: 'Administrator',
      manager: 'Store Manager',
      staff: 'Staff Member',
      viewer: 'Viewer'
    };
    return roles[user?.profile?.role] || 'Staff Member';
  };

  return (
    <div>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>My Profile</h1>
        <p style={styles.pageSubtitle}>Manage your account information and preferences</p>
      </div>

      <Row>
        <Col md={4}>
          <Card style={styles.card}>
            <div style={{ textAlign: 'center', padding: '30px 20px' }}>
              <div style={styles.avatar}>
                {getUserInitials()}
              </div>
              <h3 style={{ color: '#D8EAF8', marginBottom: '8px' }}>
                {formData.first_name} {formData.last_name}
              </h3>
              <p style={{ color: '#6B8FAE', marginBottom: '8px' }}>@{user?.username}</p>
              <span style={styles.roleBadge}>{getRoleLabel()}</span>
            </div>
            
            <div style={{ borderTop: '1px solid #1C2E44', padding: '16px 20px' }}>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', color: '#3D5A78', marginBottom: '4px' }}>Email</div>
                <div style={{ color: '#D8EAF8', wordBreak: 'break-all' }}>{user?.email}</div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', color: '#3D5A78', marginBottom: '4px' }}>Member Since</div>
                <div style={{ color: '#D8EAF8' }}>{new Date(user?.date_joined).toLocaleDateString()}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#3D5A78', marginBottom: '4px' }}>Last Login</div>
                <div style={{ color: '#D8EAF8' }}>{new Date(user?.last_login).toLocaleString()}</div>
              </div>
            </div>
          </Card>
        </Col>

        <Col md={8}>
          <Card style={styles.card}>
            <div style={styles.cardHeader}>
              <FiUser style={{ marginRight: '8px' }} /> Personal Information
            </div>
            <div style={styles.cardBody}>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group style={{ marginBottom: '16px' }}>
                      <Form.Label style={styles.formLabel}>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        style={styles.formControl}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group style={{ marginBottom: '16px' }}>
                      <Form.Label style={styles.formLabel}>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        style={styles.formControl}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group style={{ marginBottom: '16px' }}>
                  <Form.Label style={styles.formLabel}>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={styles.formControl}
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group style={{ marginBottom: '16px' }}>
                      <Form.Label style={styles.formLabel}>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        style={styles.formControl}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group style={{ marginBottom: '16px' }}>
                      <Form.Label style={styles.formLabel}>Department</Form.Label>
                      <Form.Control
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        style={styles.formControl}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <Button type="submit" style={styles.btnPrimary} disabled={saving}>
                    <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </Form>
            </div>
          </Card>

          <Card style={styles.card}>
            <div style={styles.cardHeader}>
              <FiKey style={{ marginRight: '8px' }} /> Change Password
            </div>
            <div style={styles.cardBody}>
              <Form onSubmit={handlePasswordSubmit}>
                <Form.Group style={{ marginBottom: '16px' }}>
                  <Form.Label style={styles.formLabel}>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="old_password"
                    value={passwordData.old_password}
                    onChange={handlePasswordChange}
                    style={styles.formControl}
                    required
                  />
                </Form.Group>

                <Form.Group style={{ marginBottom: '16px' }}>
                  <Form.Label style={styles.formLabel}>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    style={styles.formControl}
                    required
                  />
                </Form.Group>

                <Form.Group style={{ marginBottom: '16px' }}>
                  <Form.Label style={styles.formLabel}>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirm_password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    style={styles.formControl}
                    required
                  />
                </Form.Group>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <Button type="submit" style={styles.btnPrimary} disabled={changingPassword}>
                    <FiKey /> {changingPassword ? 'Changing...' : 'Change Password'}
                  </Button>
                </div>
              </Form>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;