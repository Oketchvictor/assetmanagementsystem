import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FiUserPlus, FiPaperclip, FiX } from 'react-icons/fi';

const AssignModal = ({ show, onHide, asset, onConfirm }) => {
  const [formData, setFormData] = useState({
    staff: '',
    issueDate: new Date().toISOString().split('T')[0],
    expectedReturn: '',
    location: '',
    confirmReceipt: false
  });

  const staffList = [
    'John Maina — ICT',
    'Alice Njeri — Finance',
    'Peter Kamau — Admin',
    'Mary Wanjiku — HR',
    'Grace Nyambura — Admin',
    'David Onyango — ICT',
    'Samuel Odhiambo — Logistics',
    'Christine Kamau — Finance',
    'Ruth Kiplagat — Design',
    "Faith Ndung'u — Admin",
    'James Otieno — ICT',
    'Brian Muriuki — Logistics'
  ];

  const locations = [
    'Finance Dept.',
    'ICT Dept.',
    'Admin Office',
    'HR Office',
    'Design Room',
    'CEO Office',
    'Field / Offsite'
  ];

  useEffect(() => {
    if (show && asset) {
      setFormData(prev => ({
        ...prev,
        issueDate: new Date().toISOString().split('T')[0]
      }));
    }
  }, [show, asset]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = () => {
    if (!formData.staff || formData.staff.includes('Select')) {
      alert('Please select a staff member');
      return;
    }

    if (!formData.confirmReceipt) {
      alert('Please confirm receipt acknowledgment');
      return;
    }

    const staffName = formData.staff.split(' — ')[0];
    const staffDept = formData.staff.split(' — ')[1] || '';
    const initials = staffName.split(' ').map(n => n[0]).join('').toUpperCase();

    onConfirm({
      staffName,
      staff: formData.staff,
      dept: staffDept,
      initials,
      issueDate: formData.issueDate,
      expectedReturn: formData.expectedReturn,
      location: formData.location || staffDept
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
    receiptCheckbox: {
      background: '#162234',
      borderRadius: '9px',
      padding: '11px',
      fontSize: '12.5px',
      color: '#6B8FAE',
      display: 'flex',
      gap: '8px',
      border: '1px solid #1C2E44',
      marginTop: '14px'
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
    },
    checkboxCustom: {
      accentColor: '#00E5A8',
      marginTop: '3px',
      flexShrink: 0
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
      className="assign-modal"
    >
      <Modal.Header style={styles.modalHead}>
        <Modal.Title style={styles.modalTitle}>
          <FiUserPlus style={{ color: '#4F9EF8' }} /> Assign Asset to Staff
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
            <Form.Label style={styles.formLabel}>Assign To *</Form.Label>
            <Form.Select
              name="staff"
              value={formData.staff}
              onChange={handleChange}
              className="form-ctrl"
              style={styles.formCtrl}
            >
              <option value="">-- Select Staff --</option>
              {staffList.map((staff, idx) => (
                <option key={idx} value={staff}>{staff}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="form-row" style={styles.formRow}>
            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>Issue Date</Form.Label>
              <Form.Control
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                className="form-ctrl"
                style={styles.formCtrl}
              />
            </Form.Group>

            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>Expected Return</Form.Label>
              <Form.Control
                type="date"
                name="expectedReturn"
                value={formData.expectedReturn}
                onChange={handleChange}
                className="form-ctrl"
                style={styles.formCtrl}
              />
            </Form.Group>
          </div>

          <Form.Group style={styles.formGroup}>
            <Form.Label style={styles.formLabel}>New Location</Form.Label>
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

          <div style={styles.receiptCheckbox}>
            <Form.Check
              type="checkbox"
              name="confirmReceipt"
              checked={formData.confirmReceipt}
              onChange={handleChange}
              style={styles.checkboxCustom}
            />
            <span>Recipient confirms receipt in stated condition and accepts responsibility for safekeeping.</span>
          </div>
        </Form>
      </Modal.Body>

      <Modal.Footer style={styles.modalFoot}>
        <Button variant="secondary" style={styles.btnSecondary} onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" className="btn-primary-custom" style={styles.btnPrimary} onClick={handleSubmit}>
          <FiPaperclip /> Confirm Assignment
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AssignModal;