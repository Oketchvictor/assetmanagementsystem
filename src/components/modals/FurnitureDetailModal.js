import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FiGrid, FiMapPin, FiMove, FiTool, FiX } from 'react-icons/fi';

const FurnitureDetailModal = ({ show, onHide, asset, onViewMap, onTransfer, onReport }) => {
  if (!asset) return null;

  const getLocationBadge = (location, type) => {
    let cls = 'room';
    if (location.includes('Stores')) cls = 'stores';
    else if (location.includes('Field') || location.includes('Ghana') || 
             location.includes('Zimbabwe') || location.includes('USA')) cls = 'offsite';
    
    const colors = {
      room: { bg: 'rgba(167, 139, 250, 0.09)', color: '#A78BFA' },
      stores: { bg: 'rgba(255, 197, 66, 0.09)', color: '#FFC542' },
      offsite: { bg: 'rgba(255, 90, 101, 0.09)', color: '#FF5A65' }
    };
    const style = colors[cls] || colors.room;
    
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 9px',
        borderRadius: '99px',
        fontSize: '11px',
        fontWeight: 600,
        background: style.bg,
        color: style.color
      }}>
        <span style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: style.color,
          display: 'inline-block'
        }}></span>
        {location}
      </span>
    );
  };

  const getConditionBadge = (condition) => {
    let style = { background: 'rgba(0, 229, 168, 0.12)', color: '#00E5A8' };
    if (condition === 'New') style = { background: 'rgba(0, 229, 168, 0.15)', color: '#00E5A8' };
    if (condition === 'Fair') style = { background: 'rgba(255, 197, 66, 0.12)', color: '#FFC542' };
    if (condition === 'Needs Repair') style = { background: 'rgba(255, 197, 66, 0.12)', color: '#FFC542' };
    
    return (
      <span style={{
        display: 'inline-block',
        padding: '3px 9px',
        borderRadius: '99px',
        fontSize: '10.5px',
        fontWeight: 700,
        ...style
      }}>
        {condition}
      </span>
    );
  };

  const renderHistory = (history) => {
    if (!history || !history.length) {
      return <p style={{ color: '#3D5A78', fontSize: '12px' }}>No history available</p>;
    }

    return history.map((item, index) => (
      <div key={index} style={{ position: 'relative', marginBottom: '16px' }}>
        <div style={{
          position: 'absolute',
          left: '-17px',
          top: '4px',
          width: '9px',
          height: '9px',
          borderRadius: '50%',
          border: `2px solid ${index > 0 ? '#3D5A78' : '#00E5A8'}`,
          background: '#0C1829'
        }}></div>
        <div>
          <div style={{ color: '#D8EAF8', fontWeight: 600, fontSize: '12.5px' }}>{item.where}</div>
          <div style={{ color: '#3D5A78', fontSize: '10.5px' }}>{item.when} · {item.by}</div>
        </div>
      </div>
    ));
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
    detailGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '9px',
      marginBottom: '14px'
    },
    detailCell: {
      background: '#162234',
      borderRadius: '9px',
      padding: '11px 13px',
      border: '1px solid #1C2E44'
    },
    detailKey: {
      fontSize: '9.5px',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: '#3D5A78',
      marginBottom: '4px',
      fontWeight: 700
    },
    detailValue: {
      fontSize: '13px',
      color: '#D8EAF8',
      fontWeight: 600
    },
    historySection: {
      background: '#162234',
      borderRadius: '14px',
      padding: '14px',
      border: '1px solid #1C2E44'
    },
    sectionLabel: {
      fontSize: '9.5px',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: '#3D5A78',
      fontWeight: 700,
      marginBottom: '11px',
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    historyTimeline: {
      position: 'relative',
      paddingLeft: '20px'
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
      padding: '6px 13px',
      borderRadius: '7px',
      fontSize: '11.5px',
      fontWeight: 600,
      transition: 'all 0.15s'
    },
    btnInfo: {
      background: 'rgba(79, 158, 248, 0.09)',
      color: '#4F9EF8',
      border: '1px solid rgba(79, 158, 248, 0.22)',
      padding: '6px 13px',
      borderRadius: '7px',
      fontSize: '11.5px',
      fontWeight: 600,
      transition: 'all 0.15s'
    },
    btnPrimary: {
      background: 'linear-gradient(135deg, #00E5A8, #00C49A)',
      color: '#07101F',
      border: 'none',
      padding: '6px 13px',
      borderRadius: '7px',
      fontSize: '11.5px',
      fontWeight: 700,
      transition: 'all 0.18s',
      boxShadow: '0 4px 14px rgba(0, 229, 168, 0.22)'
    },
    btnWarn: {
      background: 'rgba(255, 197, 66, 0.09)',
      color: '#FFC542',
      border: '1px solid rgba(255, 197, 66, 0.22)',
      padding: '6px 13px',
      borderRadius: '7px',
      fontSize: '11.5px',
      fontWeight: 600,
      transition: 'all 0.15s'
    },
    mono: {
      fontFamily: 'DM Mono, monospace',
      fontSize: '11.5px',
      color: '#4F9EF8',
      letterSpacing: '0.04em'
    }
  };

  const globalStyle = document.createElement("style");
  globalStyle.textContent = `
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
    .btn-info:hover {
      background: rgba(79, 158, 248, 0.15);
    }
    .btn-primary-custom:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(0, 229, 168, 0.36);
    }
    .btn-warn:hover {
      background: rgba(255, 197, 66, 0.15);
    }
    .history-timeline::before {
      content: '';
      position: absolute;
      left: 5px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: linear-gradient(180deg, #00E5A8, #1C2E44);
    }
    @media (max-width: 768px) {
      .detail-grid {
        grid-template-columns: 1fr;
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
      className="furniture-detail-modal"
      dialogClassName="modal-wide"
    >
      <Modal.Header style={styles.modalHead}>
        <Modal.Title style={styles.modalTitle}>
          <FiGrid style={{ color: '#A78BFA' }} /> {asset.name} — <span style={styles.mono}>{asset.tag}</span>
        </Modal.Title>
        <Button variant="link" className="modal-close" style={styles.modalClose} onClick={onHide}>
          <FiX />
        </Button>
      </Modal.Header>

      <Modal.Body style={styles.modalBody}>
        <div style={styles.detailGrid}>
          <div style={styles.detailCell}>
            <div style={styles.detailKey}>Asset Tag</div>
            <div style={{ ...styles.detailValue, ...styles.mono }}>{asset.tag}</div>
          </div>
          <div style={styles.detailCell}>
            <div style={styles.detailKey}>Quantity</div>
            <div style={styles.detailValue}>{asset.qty}</div>
          </div>
          <div style={styles.detailCell}>
            <div style={styles.detailKey}>Location</div>
            <div style={styles.detailValue}>
              {getLocationBadge(asset.location, asset.locationType)}
            </div>
          </div>
          <div style={styles.detailCell}>
            <div style={styles.detailKey}>Condition</div>
            <div style={styles.detailValue}>
              {getConditionBadge(asset.condition)}
            </div>
          </div>
          <div style={styles.detailCell}>
            <div style={styles.detailKey}>Date Acquired</div>
            <div style={styles.detailValue}>{asset.acquired}</div>
          </div>
          <div style={styles.detailCell}>
            <div style={styles.detailKey}>Value</div>
            <div style={styles.detailValue}>{asset.value}</div>
          </div>
        </div>

        <div style={styles.historySection}>
          <div style={styles.sectionLabel}>
            <FiMapPin /> Location History
          </div>
          <div className="history-timeline" style={styles.historyTimeline}>
            {renderHistory(asset.history)}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer style={styles.modalFoot}>
        <Button variant="secondary" style={styles.btnSecondary} onClick={onHide}>
          Close
        </Button>
        <Button 
          variant="info" 
          style={styles.btnInfo}
          onClick={() => {
            onHide();
            onViewMap(asset);
          }}
        >
          <FiMapPin /> View on Map
        </Button>
        <Button 
          variant="primary" 
          className="btn-primary-custom" 
          style={styles.btnPrimary}
          onClick={() => {
            onHide();
            onTransfer(asset);
          }}
        >
          <FiMove /> Move
        </Button>
        {asset.condition === 'Fair' && (
          <Button 
            variant="warn" 
            style={styles.btnWarn}
            onClick={() => {
              onHide();
              onReport(asset);
            }}
          >
            <FiTool /> Report Issue
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default FurnitureDetailModal;