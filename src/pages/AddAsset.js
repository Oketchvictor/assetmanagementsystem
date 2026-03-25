import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { FiSave, FiX, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import assetService from '../services/assetService';

const AddAsset = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    serial: '',
    brand: '',
    model: '',
    specs: '',
    condition: 'Good',
    location: '',
    value: '',
    purchase_date: '',
    warranty_expiry: '',
    status: 'stock'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await assetService.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback categories
      setCategories([
        { id: 1, name: 'Tablet', code: 'TAB', prefix: 'SV-T' },
        { id: 2, name: 'Laptop', code: 'LAP', prefix: 'SV-L' },
        { id: 3, name: 'Furniture', code: 'FUR', prefix: 'SV-F' },
        { id: 4, name: 'Vehicle', code: 'VEH', prefix: 'SV-V' },
        { id: 5, name: 'AV Equipment', code: 'AV', prefix: 'SV-AV' },
        { id: 6, name: 'Appliance', code: 'APP', prefix: 'SV-AP' },
        { id: 7, name: 'Networking', code: 'NET', prefix: 'SV-NET' },
        { id: 8, name: 'Other', code: 'OTH', prefix: 'SV-O' }
      ]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.location) {
      toast.warn('Please fill in Asset Name and Location');
      return;
    }

    setLoading(true);
    
    try {
      const selectedCategory = categories.find(c => c.id === parseInt(formData.category));
      const assetData = {
        name: formData.name,
        category: parseInt(formData.category),
        serial: formData.serial,
        brand: formData.brand,
        model: formData.model,
        specs: formData.specs,
        condition: formData.condition,
        location: formData.location,
        status: formData.status,
        value: formData.value ? parseFloat(formData.value) : null,
        purchase_date: formData.purchase_date || null,
        warranty_expiry: formData.warranty_expiry || null
      };
      
      await assetService.createAsset(assetData);
      toast.success('Asset created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error creating asset:', error);
      toast.error(error.response?.data?.message || 'Failed to create asset');
    } finally {
      setLoading(false);
    }
  };

  const locations = [
    'Stores Room A',
    'Stores Room B',
    'Board Room A',
    'Board Room B',
    'CEO Office',
    'Finance Dept.',
    'ICT / Stores',
    'HR & Admin Office',
    'Staff Lounge',
    'Server Room',
    'Parking Bay A',
    'Parking Bay B',
    'Field / Offsite',
    'Ghana — Accra',
    'Zimbabwe — Harare',
    'USA — Washington DC'
  ];

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
      borderRadius: '14px'
    },
    cardBody: {
      padding: '24px'
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
      padding: '10px 12px',
      fontSize: '13px'
    },
    btnPrimary: {
      background: 'linear-gradient(135deg, #00E5A8, #00C49A)',
      color: '#07101F',
      border: 'none',
      padding: '10px 24px',
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
      padding: '10px 24px',
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
        <h1 style={styles.pageTitle}>Add New Asset</h1>
        <p style={styles.pageSubtitle}>Register a new asset in the management system</p>
      </div>

      <Card style={styles.card}>
        <Card.Body style={styles.cardBody}>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group style={{ marginBottom: '16px' }}>
                  <Form.Label style={styles.formLabel}>Category *</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    style={styles.formControl}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group style={{ marginBottom: '16px' }}>
                  <Form.Label style={styles.formLabel}>Asset Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Dell XPS 15, iPad Pro"
                    style={styles.formControl}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group style={{ marginBottom: '16px' }}>
                  <Form.Label style={styles.formLabel}>Serial Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="serial"
                    value={formData.serial}
                    onChange={handleChange}
                    placeholder="Manufacturer serial number"
                    style={styles.formControl}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group style={{ marginBottom: '16px' }}>
                  <Form.Label style={styles.formLabel}>Brand / Make</Form.Label>
                  <Form.Control
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Apple, Dell, Samsung, etc."
                    style={styles.formControl}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group style={{ marginBottom: '16px' }}>
                  <Form.Label style={styles.formLabel}>Model / Specs</Form.Label>
                  <Form.Control
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="e.g., XPS 15 9530, iPad Pro 12.9"
                    style={styles.formControl}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group style={{ marginBottom: '16px' }}>
                  <Form.Label style={styles.formLabel}>Condition</Form.Label>
                  <Form.Select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    style={styles.formControl}
                  >
                    <option value="New">New</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group style={{ marginBottom: '16px' }}>
                  <Form.Label style={styles.formLabel}>Location *</Form.Label>
                  <Form.Select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    style={styles.formControl}
                    required
                  >
                    <option value="">Select Location</option>
                    {locations.map((loc, idx) => (
                      <option key={idx} value={loc}>{loc}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group style={{ marginBottom: '16px' }}>
                  <Form.Label style={styles.formLabel}>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    style={styles.formControl}
                  >
                    <option value="stock">In Stock</option>
                    <option value="active">Active</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group style={{ marginBottom: '16px' }}>
                  <Form.Label style={styles.formLabel}>Purchase Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="purchase_date"
                    value={formData.purchase_date}
                    onChange={handleChange}
                    style={styles.formControl}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group style={{ marginBottom: '16px' }}>
                  <Form.Label style={styles.formLabel}>Value (KES)</Form.Label>
                  <Form.Control
                    type="number"
                    name="value"
                    value={formData.value}
                    onChange={handleChange}
                    placeholder="0"
                    style={styles.formControl}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group style={{ marginBottom: '24px' }}>
              <Form.Label style={styles.formLabel}>Warranty Expiry</Form.Label>
              <Form.Control
                type="date"
                name="warranty_expiry"
                value={formData.warranty_expiry}
                onChange={handleChange}
                style={styles.formControl}
              />
            </Form.Group>

            <Alert variant="info" style={{ background: 'rgba(79, 158, 248, 0.09)', border: '1px solid rgba(79, 158, 248, 0.22)', color: '#4F9EF8', fontSize: '12px', marginBottom: '24px' }}>
              <FiPlus style={{ marginRight: '8px' }} />
              The asset tag will be automatically generated based on the category.
            </Alert>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button style={styles.btnSecondary} onClick={() => navigate('/')}>
                <FiX /> Cancel
              </Button>
              <Button type="submit" style={styles.btnPrimary} disabled={loading}>
                <FiSave /> {loading ? 'Saving...' : 'Save Asset'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddAsset;