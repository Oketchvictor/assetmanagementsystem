import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FiMove, FiX } from 'react-icons/fi';

const TransferModal = ({ show, onHide, asset, onConfirm }) => {
  const [formData, setFormData] = useState({
    destination: '',
    transferDate: new Date().toISOString().split('T')[0],
    authorizedBy: '',
    reason: ''
  });

  const destinations = [
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
    'USA — Washington DC',
    'External Vendor (Repair)'
  ];

  useEffect(() => {
    if (show && asset) {
      setFormData(prev => ({
        ...prev,
        transferDate: new Date().toISOString().split('T')[0]
      }));
    }
  }, [show, asset]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.destination) {
      alert('Please select a destination');
      return;
    }

    let locationType = 'floor';
    const destLower = formData.destination.toLowerCase();
    if (destLower.includes('stores')) {
      locationType = 'stores';
    } else if (destLower.includes('field') || destLower.includes('ghana') || 
               destLower.includes('zimbabwe') || destLower.includes('usa') || 
               destLower.includes('vendor')) {
      locationType = 'offsite';
    }

    onConfirm({
      destination: formData.destination,
      locationType,
      transferDate: formData.transferDate,
      authorizedBy: formData.authorizedBy,
      reason: formData.reason
    });
  };

  const styles = {
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
      background: '#0F1A2B'
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
    assetDisplay: {
      opacity: 0.7,
      background: '#0C1829',
      cursor: 'not-allowed'
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
      marginBottom: '14px'
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

  if (!asset) return null;

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      className="transfer-modal"
    >
      <Modal.Header style={styles.modalHead}>
        <Modal.Title style={styles.modalTitle}>
          <FiMove style={{ color: '#A78BFA' }} /> Move / Transfer Asset
        </Modal.Title>
        <Button variant="link" className="modal-close" style={styles.modalClose} onClick={onHide}>
          <FiX />
        </Button>
      </Modal.Header>

      <Modal.Body style={styles.modalBody}>
        <Form>
          <Form.Group style={styles.formGroup}>
            <Form.Label style={styles.formLabel}>Asset</Form.Label>
            <Form.Control
              type="text"
              value={`${asset.tag} — ${asset.name}`}
              readOnly
              className="form-ctrl"
              style={{ ...styles.formCtrl, ...styles.assetDisplay }}
            />
          </Form.Group>

          <Form.Group style={styles.formGroup}>
            <Form.Label style={styles.formLabel}>New Location *</Form.Label>
            <Form.Select
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className="form-ctrl"
              style={styles.formCtrl}
            >
              <option value="">-- Select destination --</option>
              {destinations.map((dest, idx) => (
                <option key={idx} value={dest}>{dest}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="form-row" style={styles.formRow}>
            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>Transfer Date</Form.Label>
              <Form.Control
                type="date"
                name="transferDate"
                value={formData.transferDate}
                onChange={handleChange}
                className="form-ctrl"
                style={styles.formCtrl}
              />
            </Form.Group>

            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>Authorized By</Form.Label>
              <Form.Control
                type="text"
                name="authorizedBy"
                value={formData.authorizedBy}
                onChange={handleChange}
                placeholder="Officer name"
                className="form-ctrl"
                style={styles.formCtrl}
              />
            </Form.Group>
          </div>

          <Form.Group style={styles.formGroup}>
            <Form.Label style={styles.formLabel}>Reason</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Reason for transfer…"
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
          <FiMove /> Confirm Move
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TransferModal;