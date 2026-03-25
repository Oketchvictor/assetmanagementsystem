import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FiSearch, FiMapPin, FiExternalLink, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const GlobalSearchModal = ({ show, onHide }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Sample asset index
  const assetIndex = [
    { tag: 'SV-T-001', name: 'iPad Pro 12.9" (6th Gen)', cat: 'Tablet', assignee: 'John Maina', location: 'ICT Dept.', status: 'active' },
    { tag: 'SV-T-002', name: 'iPad Air 5th Gen', cat: 'Tablet', assignee: 'Alice Njeri', location: 'Finance Dept.', status: 'active' },
    { tag: 'SV-T-003', name: 'Samsung Tab S9 256GB', cat: 'Tablet', assignee: 'Peter Kamau', location: 'Admin Office', status: 'active' },
    { tag: 'SV-T-004', name: 'iPad Air 5th Gen (64GB)', cat: 'Tablet', assignee: '—', location: 'Stores Room A', status: 'stock' },
    { tag: 'SV-L-001', name: 'Dell XPS 15 9530', cat: 'Laptop', assignee: 'Christine Kamau', location: 'Finance Dept.', status: 'active' },
    { tag: 'SV-L-002', name: 'HP EliteBook 840 G9', cat: 'Laptop', assignee: 'David Onyango', location: 'ICT Dept.', status: 'active' },
    { tag: 'SV-V-001', name: 'Toyota Hiace Van KEC 899T', cat: 'Vehicle', assignee: 'Transport Dept.', location: 'Parking Bay A', status: 'active' },
    { tag: 'SV-O-005', name: 'Epson EB-X51 Wireless Projector', cat: 'AV', assignee: '—', location: 'UNKNOWN', status: 'missing' },
    { tag: 'SV-F-001', name: 'Conference Table (Board Room A)', cat: 'Furniture', assignee: '—', location: 'Board Room A', status: 'active' },
    { tag: 'SV-AP-001', name: 'Samsung Side-by-Side Fridge', cat: 'Appliance', assignee: 'General Use', location: 'Staff Lounge', status: 'active' },
    { tag: 'SV-NET-001', name: 'Cisco Catalyst 2960 Switch', cat: 'Networking', assignee: 'ICT Dept.', location: 'Server Room', status: 'active' },
  ];

  const pageMap = {
    'Tablet': '/tablets',
    'Laptop': '/laptops',
    'Furniture': '/furniture',
    'Vehicle': '/other-assets',
    'AV': '/other-assets',
    'Appliance': '/other-assets',
    'Networking': '/other-assets'
  };

  useEffect(() => {
    if (show) {
      setSearchQuery('');
      setResults([]);
      setTimeout(() => {
        document.getElementById('gs-input')?.focus();
      }, 100);
    }
  }, [show]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    const ql = query.toLowerCase();
    
    setTimeout(() => {
      const hits = assetIndex.filter(a => 
        (a.tag || '').toLowerCase().includes(ql) ||
        (a.name || '').toLowerCase().includes(ql) ||
        (a.assignee || '').toLowerCase().includes(ql) ||
        (a.location || '').toLowerCase().includes(ql) ||
        (a.cat || '').toLowerCase().includes(ql)
      );
      setResults(hits);
      setLoading(false);
    }, 300);
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: { bg: 'rgba(0, 229, 168, 0.12)', color: '#00E5A8', text: 'Active' },
      stock: { bg: 'rgba(79, 158, 248, 0.12)', color: '#4F9EF8', text: 'In Stock' },
      repair: { bg: 'rgba(255, 197, 66, 0.12)', color: '#FFC542', text: 'Repair' },
      missing: { bg: 'rgba(255, 90, 101, 0.18)', color: '#FF5A65', text: 'Missing' }
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

  const getLocationBadge = (location) => {
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

  const handleViewMap = (tag, name) => {
    onHide();
    // Trigger map modal with asset
    console.log('View map for:', tag, name);
  };

  const handleNavigate = (cat) => {
    const path = pageMap[cat] || '/dashboard';
    onHide();
    navigate(path);
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
    searchHint: {
      fontSize: '10px',
      color: '#3D5A78',
      fontWeight: 400,
      marginLeft: '4px'
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
    searchInput: {
      width: '100%',
      background: '#162234',
      border: '1px solid #1C2E44',
      color: '#D8EAF8',
      borderRadius: '9px',
      padding: '12px 14px',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.15s',
      marginBottom: '14px'
    },
    searchResults: {
      marginTop: '14px',
      minHeight: '200px'
    },
    loadingState: {
      padding: '48px',
      textAlign: 'center',
      color: '#3D5A78'
    },
    spinner: {
      width: '34px',
      height: '34px',
      border: '3px solid #162234',
      borderTopColor: '#00E5A8',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 12px'
    },
    emptyState: {
      padding: '48px',
      textAlign: 'center',
      color: '#3D5A78'
    },
    emptyIcon: {
      fontSize: '34px',
      marginBottom: '12px',
      opacity: 0.3,
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    searchTable: {
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
    categoryBadge: {
      display: 'inline-block',
      padding: '3px 9px',
      borderRadius: '99px',
      fontSize: '10.5px',
      fontWeight: 700,
      background: 'rgba(167, 139, 250, 0.09)',
      color: '#A78BFA'
    },
    actionCell: {
      whiteSpace: 'nowrap'
    },
    btnIcon: {
      background: 'none',
      border: 'none',
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
    navBtn: {
      color: '#3D5A78'
    }
  };

  const globalStyle = document.createElement("style");
  globalStyle.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .modal-close:hover {
      background: rgba(255, 90, 101, 0.09);
      color: #FF5A65;
      border-color: rgba(255, 90, 101, 0.3);
    }
    .search-input:focus {
      border-color: #00E5A8;
      box-shadow: 0 0 0 3px rgba(0, 229, 168, 0.1);
    }
    .search-input::placeholder {
      color: #3D5A78;
    }
    .btn-icon:hover {
      background: #162234;
    }
    .map-btn:hover {
      color: #00E5A8;
    }
    .nav-btn:hover {
      color: #D8EAF8;
    }
    .search-table tbody tr:hover {
      background: rgba(255, 255, 255, 0.026);
    }
    @media (max-width: 768px) {
      .modal-body {
        padding: 16px;
      }
      .search-table {
        font-size: 12px;
      }
      .search-table tbody td {
        padding: 8px 10px;
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
      className="global-search-modal"
      dialogClassName="modal-wide"
    >
      <Modal.Header style={styles.modalHead}>
        <Modal.Title style={styles.modalTitle}>
          <FiSearch style={{ color: '#00E5A8' }} /> Search All Assets
          <span style={styles.searchHint}>Press / to open anytime</span>
        </Modal.Title>
        <Button variant="link" className="modal-close" style={styles.modalClose} onClick={onHide}>
          <FiX />
        </Button>
      </Modal.Header>

      <Modal.Body style={styles.modalBody}>
        <Form.Control
          type="text"
          id="gs-input"
          placeholder="Tag, serial, name, assignee, location, category…"
          className="search-input"
          style={styles.searchInput}
          value={searchQuery}
          onChange={handleSearch}
          autoFocus
        />

        <div style={styles.searchResults}>
          {loading && (
            <div style={styles.loadingState}>
              <div style={styles.spinner}></div>
              <p>Searching...</p>
            </div>
          )}

          {!loading && searchQuery.length < 2 && (
            <div style={styles.emptyState}>
              <FiSearch style={styles.emptyIcon} />
              <p>Type to search all {assetIndex.length} assets, 12 staff, 5 offices…</p>
            </div>
          )}

          {!loading && searchQuery.length >= 2 && results.length === 0 && (
            <div style={styles.emptyState}>
              <FiSearch style={styles.emptyIcon} />
              <p>No assets found for "{searchQuery}"</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="table-responsive" style={{ overflowX: 'auto' }}>
              <table className="search-table" style={styles.searchTable}>
                <thead>
                  <tr>
                    <th style={styles.theadTh}>Tag</th>
                    <th style={styles.theadTh}>Name</th>
                    <th style={styles.theadTh}>Category</th>
                    <th style={styles.theadTh}>Assignee</th>
                    <th style={styles.theadTh}>Location</th>
                    <th style={styles.theadTh}>Status</th>
                    <th style={styles.theadTh}></th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(asset => (
                    <tr key={asset.tag}>
                      <td style={styles.tbodyTd}>
                        <span style={styles.mono}>{asset.tag}</span>
                      </td>
                      <td style={styles.tbodyTd}>{asset.name}</td>
                      <td style={styles.tbodyTd}>
                        <span style={styles.categoryBadge}>{asset.cat}</span>
                      </td>
                      <td style={styles.tbodyTd}>{asset.assignee}</td>
                      <td style={styles.tbodyTd}>
                        {getLocationBadge(asset.location)}
                      </td>
                      <td style={styles.tbodyTd}>
                        {getStatusBadge(asset.status)}
                      </td>
                      <td style={styles.actionCell}>
                        <button 
                          className="btn-icon map-btn"
                          style={{ ...styles.btnIcon, ...styles.mapBtn }}
                          onClick={() => handleViewMap(asset.tag, asset.name)}
                          title="View on Map"
                        >
                          <FiMapPin />
                        </button>
                        <button 
                          className="btn-icon nav-btn"
                          style={{ ...styles.btnIcon, ...styles.navBtn }}
                          onClick={() => handleNavigate(asset.cat)}
                          title="Go to page"
                        >
                          <FiExternalLink />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default GlobalSearchModal;