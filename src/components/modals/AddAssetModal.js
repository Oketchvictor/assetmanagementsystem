import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FiPlus, FiSave, FiX } from 'react-icons/fi';

const AddAssetModal = ({ show, onHide, category = 'T', onSave }) => {
  const [formData, setFormData] = useState({
    category: category,
    name: '',
    serial: '',
    assetTag: '',
    brand: '',
    model: '',
    purchaseDate: '',
    value: '',
    condition: 'New',
    location: '',
    warrantyExpiry: '',
    notes: ''
  });

  const [tagCounters, setTagCounters] = useState({
    T: 22, L: 35, F: 18, V: 3, AV: 10, AP: 8, A: 12, O: 12
  });

  const prefixes = {
    T: 'SV-T',
    L: 'SV-L',
    F: 'SV-F',
    V: 'SV-V',
    AV: 'SV-AV',
    AP: 'SV-AP',
    A: 'SV-A',
    O: 'SV-O'
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

  useEffect(() => {
    if (show) {
      updateAssetTag();
    }
  }, [formData.category, show]);

  const updateAssetTag = () => {
    const cat = formData.category;
    if (!cat) {
      setFormData(prev => ({ ...prev, assetTag: '' }));
      return;
    }
    const next = (tagCounters[cat] || 0) + 1;
    const newTag = (prefixes[cat] || 'SV-O') + '-' + String(next).padStart(3, '0');
    setFormData(prev => ({ ...prev, assetTag: newTag }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setFormData(prev => ({ ...prev, category: newCategory }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.location) {
      alert('Please fill in Asset Name and Location');
      return;
    }

    onSave({
      ...formData,
      tag: formData.assetTag,
      acquired: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      history: [{ where: formData.location, when: 'Today', by: 'Admin Kuria' }]
    });

    setFormData({
      category: 'T',
      name: '',
      serial: '',
      assetTag: '',
      brand: '',
      model: '',
      purchaseDate: '',
      value: '',
      condition: 'New',
      location: '',
      warrantyExpiry: '',
      notes: ''
    });
  };

  const styles = {
    modalWide: { maxWidth: '760px' },
    modalHead: {
      padding: '20px 22px 16px',
      borderBottom: '1px solid #1C2E44',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: '#0C1829'
    },
    modalTitle: {
      fontFamily: 'Syne, sans-serif',
      fontSize: '14px',
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#D8EAF8'
    },
    modalClose: {
      background: '#162234',
      border: '1px solid #1C2E44',
      color: '#3D5A78',
      width: '28px',
      height: '28px',
      borderRadius: '7px',
      fontSize: '17px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.13s',
      padding: 0
    },
    modalBody: {
      padding: '20px 22px',
      background: '#0F1A2B',
      maxHeight: '70vh',
      overflowY: 'auto'
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
      marginBottom: '14px'
    },
    formGroup: {
      marginBottom: '14px'
    },
    formLabel: {
      display: 'block',
      fontSize: '10px',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: '#3D5A78',
      fontWeight: 700,
      marginBottom: '5px'
    },
    formCtrl: {
      width: '100%',
      background: '#162234',
      border: '1px solid #1C2E44',
      color: '#D8EAF8',
      borderRadius: '9px',
      padding: '9px 12px',
      fontSize: '13px',
      outline: 'none',
      transition: 'all 0.15s'
    },
    assetTag: {
      opacity: 0.6,
      background: '#0C1829',
      cursor: 'not-allowed'
    },
    modalFoot: {
      padding: '14px 22px',
      borderTop: '1px solid #1C2E44',
      display: 'flex',
      gap: '8px',
      justifyContent: 'flex-end',
      background: 'rgba(255, 255, 255, 0.011)'
    },
    btnSecondary: {
      background: '#162234',
      color: '#D8EAF8',
      border: '1px solid #243B54',
      padding: '8px 18px',
      borderRadius: '9px',
      fontSize: '12.5px',
      fontWeight: 500,
      transition: 'all 0.15s'
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
      transition: 'all 0.18s',
      boxShadow: '0 4px 14px rgba(0, 229, 168, 0.22)'
    }
  };

  const globalStyle = document.createElement("style");
  globalStyle.textContent = `
    .form-ctrl:focus {
      border-color: #00E5A8;
      box-shadow: 0 0 0 3px rgba(0, 229, 168, 0.1);
      background: rgba(22, 34, 52, 0.8);
    }
    .form-ctrl::placeholder {
      color: #3D5A78;
    }
    select.form-ctrl option {
      background: #162234;
      color: #D8EAF8;
    }
    .modal-close:hover {
      background: rgba(255, 90, 101, 0.09);
      color: #FF5A65;
      border-color: rgba(255, 90, 101, 0.3);
    }
    .btn-secondary:hover {
      background: #1C2E44;
      border-color: #243B54;
      color: #D8EAF8;
    }
    .btn-primary-custom:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(0, 229, 168, 0.36);
    }
    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
        gap: 0;
      }
      .modal-body {
        padding: 16px;
      }
    }
  `;
  document.head.appendChild(globalStyle);

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      className="add-asset-modal"
      dialogClassName="modal-wide"
    >
      <Modal.Header style={styles.modalHead}>
        <Modal.Title style={styles.modalTitle}>
          <FiPlus style={{ color: '#00E5A8' }} /> Register New Asset
        </Modal.Title>
        <Button variant="link" className="modal-close" style={styles.modalClose} onClick={onHide}>
          <FiX />
        </Button>
      </Modal.Header>

      <Modal.Body style={styles.modalBody}>
        <Form>
          <div className="form-row" style={styles.formRow}>
            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>Category *</Form.Label>
              <Form.Select 
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
                className="form-ctrl"
                style={styles.formCtrl}
              >
                <option value="">-- Select --</option>
                <option value="T">Tablet / Device</option>
                <option value="L">Laptop</option>
                <option value="F">Furniture</option>
                <option value="V">Vehicle</option>
                <option value="AV">AV Equipment</option>
                <option value="AP">Appliance</option>
                <option value="A">Accessory</option>
                <option value="O">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>Asset Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Dell XPS 15"
                className="form-ctrl"
                style={styles.formCtrl}
              />
            </Form.Group>
          </div>

          <div className="form-row" style={styles.formRow}>
            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>Serial Number</Form.Label>
              <Form.Control
                type="text"
                name="serial"
                value={formData.serial}
                onChange={handleChange}
                placeholder="Manufacturer serial"
                className="form-ctrl"
                style={styles.formCtrl}
              />
            </Form.Group>

            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>Auto Asset Tag</Form.Label>
              <Form.Control
                type="text"
                name="assetTag"
                value={formData.assetTag}
                readOnly
                className="form-ctrl"
                style={{ ...styles.formCtrl, ...styles.assetTag }}
              />
            </Form.Group>
          </div>

          <div className="form-row" style={styles.formRow}>
            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>Brand / Make</Form.Label>
              <Form.Control
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Apple, Dell, Samsung…"
                className="form-ctrl"
                style={styles.formCtrl}
              />
            </Form.Group>

            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>Model / Specs</Form.Label>
              <Form.Control
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. M3, 16GB, 512GB"
                className="form-ctrl"
                style={styles.formCtrl}
              />
            </Form.Group>
          </div>

          <div className="form-row" style={styles.formRow}>
            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>Purchase Date</Form.Label>
              <Form.Control
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                className="form-ctrl"
                style={styles.formCtrl}
              />
            </Form.Group>

            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>Value (KES)</Form.Label>
              <Form.Control
                type="number"
                name="value"
                value={formData.value}
                onChange={handleChange}
                placeholder="0"
                className="form-ctrl"
                style={styles.formCtrl}
              />
            </Form.Group>
          </div>

          <div className="form-row" style={styles.formRow}>
            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>Condition</Form.Label>
              <Form.Select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="form-ctrl"
                style={styles.formCtrl}
              >
                <option>New</option>
                <option>Excellent</option>
                <option>Good</option>
                <option>Fair</option>
              </Form.Select>
            </Form.Group>

            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>Initial Location *</Form.Label>
              <Form.Select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-ctrl"
                style={styles.formCtrl}
              >
                <option value="">-- Select --</option>
                {locations.map((loc, idx) => (
                  <option key={idx} value={loc}>{loc}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>

          <Form.Group style={styles.formGroup}>
            <Form.Label style={styles.formLabel}>Warranty Expiry</Form.Label>
            <Form.Control
              type="date"
              name="warrantyExpiry"
              value={formData.warrantyExpiry}
              onChange={handleChange}
              className="form-ctrl"
              style={styles.formCtrl}
            />
          </Form.Group>

          <Form.Group style={styles.formGroup}>
            <Form.Label style={styles.formLabel}>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional remarks…"
              className="form-ctrl"
              style={styles.formCtrl}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer style={styles.modalFoot}>
        <Button variant="secondary" style={styles.btnSecondary} onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" className="btn-primary-custom" style={styles.btnPrimary} onClick={handleSubmit}>
          <FiSave /> Save Asset
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddAssetModal;