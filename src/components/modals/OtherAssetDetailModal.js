import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { 
  FiPackage, FiMapPin, FiMove, FiUserPlus, FiFlag, FiX,
  FiTruck, FiTv, FiBluetooth, FiWifi, FiCoffee, FiCamera, FiPrinter
} from 'react-icons/fi';

const OtherAssetDetailModal = ({ show, onHide, asset, onViewMap, onAssign, onTransfer, onReport }) => {
  if (!asset) return null;

  const getIcon = () => {
    switch(asset.category) {
      case 'Vehicle': return <FiTruck style={{ color: '#4F9EF8' }} />;
      case 'AV': return <FiTv style={{ color: '#A78BFA' }} />;
      case 'Appliance': 
        if (asset.name?.includes('Coffee')) return <FiCoffee style={{ color: '#00E5A8' }} />;
        if (asset.name?.includes('Camera')) return <FiCamera style={{ color: '#00E5A8' }} />;
        if (asset.name?.includes('Printer') || asset.name?.includes('Copier')) return <FiPrinter style={{ color: '#00E5A8' }} />;
        return <FiBluetooth style={{ color: '#00E5A8' }} />;
      case 'Networking': return <FiWifi style={{ color: '#FFC542' }} />;
      default: return <FiPackage style={{ color: '#00E5A8' }} />;
    }
  };

  const getLocationBadge = (location, type) => {
    let cls = 'floor';
    if (!location || location === 'UNKNOWN') cls = 'missing';
    else if (location.includes('Stores')) cls = 'stores';
    else if (location.includes('Field') || location.includes('Ghana') || 
             location.includes('Zimbabwe') || location.includes('USA') || 
             location.includes('Kisumu') || location.includes('Workshop')) cls = 'offsite';
    
    const colors = {
      floor: { bg: 'rgba(167, 139, 250, 0.09)', color: '#A78BFA' },
      stores: { bg: 'rgba(255, 197, 66, 0.09)', color: '#FFC542' },
      offsite: { bg: 'rgba(255, 90, 101, 0.09)', color: '#FF5A65' },
      missing: { bg: 'rgba(255, 90, 101, 0.18)', color: '#FF5A65' }
    };
    const style = colors[cls] || colors.floor;
    
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

  const getStatusBadge = (status) => {
    const colors = {
      active: { bg: 'rgba(0, 229, 168, 0.12)', color: '#00E5A8', text: 'Active' },
      stock: { bg: 'rgba(79, 158, 248, 0.12)', color: '#4F9EF8', text: 'In Stock' },
      repair: { bg: 'rgba(255, 197, 66, 0.12)', color: '#FFC542', text: 'Repair' },
      missing: { bg: 'rgba(255, 90, 101, 0.18)', color: '#FF5A65', text: 'Missing' },
      retired: { bg: 'rgba(255, 90, 101, 0.09)', color: '#FF5A65', text: 'Retired' }
    };
    const style = colors[status] || colors.active;
    
    return (
      <span style={{
        display: 'inline-block',
        padding: '3px 9px',
        borderRadius: '99px',
        fontSize: '10.5px',
        fontWeight: 700,
        background: style.bg,
        color: style.color
      }}>
        {style.text}
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
    btnViolet: {
      background: 'rgba(167, 139, 250, 0.09)',
      color: '#A78BFA',
      border: '1px solid rgba(167, 139, 250, 0.22)',
      padding: '6px 13px',
      borderRadius: '7px',
      fontSize: '11.5px',
      fontWeight: 600,
      transition: 'all 0.15s'
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
    .btn-violet:hover {
      background: rgba(167, 139, 250, 0.15);
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
      className="other-asset-detail-modal"
      dialogClassName="modal-wide"
    >
      <Modal.Header style={styles.modalHead}>
        <Modal.Title style={styles.modalTitle}>
          {getIcon()} {asset.name} — <span style={styles.mono}>{asset.tag}</span>
        </Modal.Title>
        <Button variant="link" className="modal-close" style={styles.modalClose} onClick={onHide}>
          <FiX />
        </Button>
      </Modal.Header>

      <Modal.Body style={styles.modalBody}>
        {asset.status === 'missing' && (
          <div style={styles.alertBar}>
            <FiFlag /> <strong>MISSING</strong> — Investigation ongoing. No GPS coordinates.
          </div>
        )}

        <div style={styles.detailGrid}>
          <div style={styles.detailCell}>
            <div style={styles.detailKey}>Asset Tag</div>
            <div style={{ ...styles.detailValue, ...styles.mono }}>{asset.tag}</div>
          </div>
          <div style={styles.detailCell}>
            <div style={styles.detailKey}>Serial / Ref</div>
            <div style={{ ...styles.detailValue, ...styles.mono }}>{asset.serial}</div>
          </div>
          <div style={styles.detailCell}>
            <div style={styles.detailKey}>Location</div>
            <div style={styles.detailValue}>
              {getLocationBadge(asset.location, asset.locationType)}
            </div>
          </div>
          <div style={styles.detailCell}>
            <div style={styles.detailKey}>Status</div>
            <div style={styles.detailValue}>{getStatusBadge(asset.status)}</div>
          </div>
          <div style={styles.detailCell}>
            <div style={styles.detailKey}>Custodian</div>
            <div style={styles.detailValue}>{asset.custodian || '—'}</div>
          </div>
          <div style={styles.detailCell}>
            <div style={styles.detailKey}>Date Acquired</div>
            <div style={styles.detailValue}>{asset.acquired}</div>
          </div>
          <div style={styles.detailCell}>
            <div style={styles.detailKey}>Purchase Value</div>
            <div style={styles.detailValue}>{asset.value}</div>
          </div>
          
          {asset.category === 'Vehicle' && asset.insuranceExpiry && (
            <>
              <div style={styles.detailCell}>
                <div style={styles.detailKey}>Insurance Expiry</div>
                <div style={{ ...styles.detailValue, ...(asset.insuranceStatus === 'expired' ? { color: '#FF5A65', fontWeight: 700 } : {}) }}>
                  {asset.insuranceExpiry}
                  {asset.insuranceStatus === 'expired' && ' ⚠ EXPIRED'}
                  {asset.insuranceStatus === 'expiring' && ' ⚠ EXPIRING'}
                </div>
              </div>
              <div style={styles.detailCell}>
                <div style={styles.detailKey}>Inspection Due</div>
                <div style={styles.detailValue}>{asset.inspectionDue}</div>
              </div>
            </>
          )}

          {asset.extra && asset.extra.map((item, idx) => (
            <div style={styles.detailCell} key={idx}>
              <div style={styles.detailKey}>{item.key}</div>
              <div style={{ ...styles.detailValue, ...(item.highlight ? { color: '#FF5A65', fontWeight: 600 } : {}) }}>
                {item.value}
              </div>
            </div>
          ))}
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
        {asset.status !== 'missing' && (
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
        )}
        {asset.status === 'stock' && (
          <Button 
            variant="primary" 
            className="btn-primary-custom" 
            style={styles.btnPrimary}
            onClick={() => {
              onHide();
              onAssign(asset);
            }}
          >
            <FiUserPlus /> Assign
          </Button>
        )}
        {asset.status !== 'missing' && (
          <Button 
            variant="violet" 
            style={styles.btnViolet}
            onClick={() => {
              onHide();
              onTransfer(asset);
            }}
          >
            <FiMove /> Move
          </Button>
        )}
        {(asset.status === 'repair' || asset.status === 'missing') && (
          <Button 
            variant="warn" 
            style={styles.btnWarn}
            onClick={() => {
              onHide();
              onReport(asset);
            }}
          >
            <FiFlag /> {asset.status === 'missing' ? 'Report Missing' : 'Report Issue'}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default OtherAssetDetailModal;