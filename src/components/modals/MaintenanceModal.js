import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FiTool, FiPaperclip, FiX, FiFlag } from 'react-icons/fi';

const MaintenanceModal = ({ show, onHide, asset, onConfirm }) => {
  const [formData, setFormData] = useState({
    issueType: 'Hardware Fault',
    description: '',
    reportedBy: 'Admin Kuria',
    reportDate: new Date().toISOString().split('T')[0],
    severity: 'Low'
  });

  const issueTypes = [
    'Hardware Fault',
    'Screen Damage',
    'Battery Problem',
    'Software Issue',
    'Missing / Stolen',
    'Routine Maintenance',
    'Other'
  ];

  const severityLevels = ['Low', 'Medium', 'High', 'Critical'];

  useEffect(() => {
    if (show && asset) {
      setFormData(prev => ({
        ...prev,
        reportDate: new Date().toISOString().split('T')[0]
      }));
    }
  }, [show, asset]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSeverityClick = (severity) => {
    setFormData(prev => ({ ...prev, severity }));
  };

  const handleSubmit = () => {
    if (!formData.description.trim()) {
      alert('Please provide a description');
      return;
    }

    onConfirm({
      issueType: formData.issueType,
      description: formData.description,
      severity: formData.severity,
      reportDate: formData.reportDate
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
    severityChips: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px',
      marginBottom: '0'
    },
    chip: {
      padding: '5px 13px',
      borderRadius: '99px',
      border: '1px solid #1C2E44',
      color: '#6B8FAE',
      background: 'transparent',
      fontSize: '11.5px',
      fontWeight: 600,
      transition: 'all 0.15s',
      cursor: 'pointer'
    },
    chipActive: {
      background: '#00E5A8',
      borderColor: '#00E5A8',
      color: '#07101F'
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
    alertBar: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '11px 15px',
      borderRadius: '9px',
      fontSize: '12.5px',
      marginBottom: '14px',
      background: 'rgba(255, 90, 101, 0.07)',
      border: '1px solid rgba(255, 90, 101, 0.22)',
      color: '#FF5A65'
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
    .chip:hover:not(.active) {
      border-color: #00E5A8;
      color: #00E5A8;
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

  const isMissing = asset.status === 'missing' || asset.name?.toLowerCase().includes('missing');

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      className="maintenance-modal"
    >
      <Modal.Header style={styles.modalHead}>
        <Modal.Title style={styles.modalTitle}>
          <FiTool style={{ color: '#FFC542' }} /> 
          {isMissing ? 'Report Missing Asset' : 'Log Maintenance / Issue'}
        </Modal.Title>
        <Button variant="link" className="modal-close" style={styles.modalClose} onClick={onHide}>
          <FiX />
        </Button>
      </Modal.Header>

      <Modal.Body style={styles.modalBody}>
        {isMissing && (
          <div style={styles.alertBar}>
            <FiFlag /> <strong>Missing Asset Report</strong> — Please provide details about when and where it was last seen.
          </div>
        )}

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

          {!isMissing && (
            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>Issue Type</Form.Label>
              <Form.Select
                name="issueType"
                value={formData.issueType}
                onChange={handleChange}
                className="form-ctrl"
                style={styles.formCtrl}
              >
                {issueTypes.map((type, idx) => (
                  <option key={idx} value={type}>{type}</option>
                ))}
              </Form.Select>
            </Form.Group>
          )}

          <Form.Group style={styles.formGroup}>
            <Form.Label style={styles.formLabel}>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={isMissing ? "Describe when and where it was last seen…" : "Describe the issue…"}
              className="form-ctrl"
              style={styles.formCtrl}
            />
          </Form.Group>

          <div className="form-row" style={styles.formRow}>
            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>Reported By</Form.Label>
              <Form.Control
                type="text"
                name="reportedBy"
                value={formData.reportedBy}
                readOnly
                className="form-ctrl"
                style={styles.formCtrl}
              />
            </Form.Group>

            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>Date Reported</Form.Label>
              <Form.Control
                type="date"
                name="reportDate"
                value={formData.reportDate}
                onChange={handleChange}
                className="form-ctrl"
                style={styles.formCtrl}
              />
            </Form.Group>
          </div>

          {!isMissing && (
            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>Severity</Form.Label>
              <div style={styles.severityChips}>
                {severityLevels.map(level => (
                  <button
                    key={level}
                    type="button"
                    className="chip"
                    style={{
                      ...styles.chip,
                      ...(formData.severity === level ? styles.chipActive : {})
                    }}
                    onClick={() => handleSeverityClick(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </Form.Group>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer style={styles.modalFoot}>
        <Button variant="secondary" style={styles.btnSecondary} onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" className="btn-primary-custom" style={styles.btnPrimary} onClick={handleSubmit}>
          <FiPaperclip /> {isMissing ? 'Report Missing' : 'Submit Report'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MaintenanceModal;