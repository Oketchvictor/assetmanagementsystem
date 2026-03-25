import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { FiHome, FiMove, FiMapPin, FiX } from 'react-icons/fi';

const RoomDetailModal = ({ show, onHide, room, onMoveItem, onViewMap }) => {
  if (!room) return null;

  const getConditionBadge = (condition) => {
    const badges = {
      'Good': { bg: 'rgba(0, 229, 168, 0.12)', color: '#00E5A8', text: 'Good' },
      'Excellent': { bg: 'rgba(0, 229, 168, 0.15)', color: '#00E5A8', text: 'Excellent' },
      'Fair': { bg: 'rgba(255, 197, 66, 0.12)', color: '#FFC542', text: 'Fair' },
      'Needs Repair': { bg: 'rgba(255, 197, 66, 0.12)', color: '#FFC542', text: 'Needs Repair' }
    };
    return badges[condition] || badges['Good'];
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
    roomStats: {
      marginBottom: '13px'
    },
    badge: {
      display: 'inline-block',
      padding: '3px 9px',
      borderRadius: '99px',
      fontSize: '10.5px',
      fontWeight: 700,
      background: 'rgba(79, 158, 248, 0.12)',
      color: '#4F9EF8'
    },
    customTable: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    theadTh: {
      padding: '10px 14px',
      textAlign: 'left',
      fontSize: '10px',
      letterSpacing: '0.09em',
      textTransform: 'uppercase',
      color: '#3D5A78',
      fontWeight: 700,
      whiteSpace: 'nowrap',
      background: 'rgba(255, 255, 255, 0.014)',
      borderBottom: '1px solid #1C2E44'
    },
    tbodyTd: {
      padding: '11px 14px',
      fontSize: '13px',
      verticalAlign: 'middle',
      borderBottom: '1px solid rgba(28, 46, 68, 0.6)'
    },
    mono: {
      fontFamily: 'DM Mono, monospace',
      fontSize: '11.5px',
      color: '#4F9EF8',
      letterSpacing: '0.04em'
    },
    actBtn: {
      background: 'none',
      border: 'none',
      color: '#3D5A78',
      padding: '4px 7px',
      borderRadius: '6px',
      fontSize: '13px',
      transition: 'all 0.11s',
      cursor: 'pointer',
      marginRight: '4px'
    },
    mapBtn: {
      color: '#00E5A8'
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
    .act-btn:hover {
      background: #162234;
      color: #D8EAF8;
    }
    .map-btn:hover {
      color: #00E5A8;
    }
    .custom-table tbody tr:hover {
      background: rgba(255, 255, 255, 0.026);
    }
    @media (max-width: 768px) {
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
      className="room-detail-modal"
      dialogClassName="modal-wide"
    >
      <Modal.Header style={styles.modalHead}>
        <Modal.Title style={styles.modalTitle}>
          <FiHome style={{ color: room.color === 'accent' ? '#00E5A8' : 
                                 room.color === 'blue' ? '#4F9EF8' : 
                                 room.color === 'amber' ? '#FFC542' : '#A78BFA' }} />
          {room.name}
        </Modal.Title>
        <Button variant="link" className="modal-close" style={styles.modalClose} onClick={onHide}>
          <FiX />
        </Button>
      </Modal.Header>

      <Modal.Body style={styles.modalBody}>
        <div style={styles.roomStats}>
          <span style={styles.badge}>{room.count} items tracked</span>
        </div>

        <div className="table-responsive" style={{ overflowX: 'auto' }}>
          <table style={styles.customTable}>
            <thead>
              <tr>
                <th style={styles.theadTh}>Asset Tag</th>
                <th style={styles.theadTh}>Item</th>
                <th style={styles.theadTh}>Qty</th>
                <th style={styles.theadTh}>Condition</th>
                <th style={styles.theadTh}>Action</th>
              </tr>
            </thead>
            <tbody>
              {room.items.map((item, idx) => {
                const badgeStyle = getConditionBadge(item.condition);
                return (
                  <tr key={idx}>
                    <td style={styles.tbodyTd}>
                      <span style={styles.mono}>{item.tag}</span>
                    </td>
                    <td style={styles.tbodyTd}>{item.name}</td>
                    <td style={styles.tbodyTd}>{item.qty}</td>
                    <td style={styles.tbodyTd}>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 9px',
                        borderRadius: '99px',
                        fontSize: '10.5px',
                        fontWeight: 700,
                        background: badgeStyle.bg,
                        color: badgeStyle.color
                      }}>
                        {badgeStyle.text}
                      </span>
                    </td>
                    <td style={styles.tbodyTd}>
                      <button 
                        className="act-btn"
                        style={styles.actBtn}
                        onClick={() => {
                          onMoveItem(item.tag, item.name);
                          onHide();
                        }}
                        title="Move"
                      >
                        <FiMove />
                      </button>
                      <button 
                        className="act-btn map-btn"
                        style={{ ...styles.actBtn, ...styles.mapBtn }}
                        onClick={() => {
                          onViewMap({ tag: item.tag, name: item.name });
                          onHide();
                        }}
                        title="View on Map"
                      >
                        <FiMapPin />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Modal.Body>

      <Modal.Footer style={styles.modalFoot}>
        <Button variant="secondary" style={styles.btnSecondary} onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" className="btn-primary-custom" style={styles.btnPrimary} onClick={() => {
          onHide();
        }}>
          <FiMove /> Move Item
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RoomDetailModal;