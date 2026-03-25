import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Table, Badge } from 'react-bootstrap';
import { 
  FiBox, FiCheckCircle, FiAlertCircle, FiTool, FiDownload, 
  FiPlus, FiMapPin, FiChevronUp, FiChevronDown, FiSearch,
  FiBell, FiUser, FiHome, FiMonitor, FiGrid, FiPackage,
  FiArrowUp, FiArrowRight, FiMap, FiMove, FiUserPlus, FiAlertTriangle
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import modals
import AddAssetModal from '../components/modals/AddAssetModal';
import AssignModal from '../components/modals/AssignModal';
import TransferModal from '../components/modals/TransferModal';
import MaintenanceModal from '../components/modals/MaintenanceModal';
import AssetMapModal from '../components/modals/AssetMapModal';
import GlobalSearchModal from '../components/modals/GlobalSearchModal';

const Dashboard = () => {
  // State management
  const [stats, setStats] = useState({
    totalAssets: 127,
    assignedAssets: 109,
    inStock: 14,
    underRepair: 4,
    byCategory: {
      tablets: 48,
      laptops: 32,
      furniture: 29,
      other: 18
    }
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, time: 'Today, 10:42 AM', type: 'assign', asset: 'Dell XPS SV-L-001', assignee: 'Christine Kamau', dept: 'Finance', severity: 'info' },
    { id: 2, time: 'Today, 08:15 AM', type: 'repair', asset: 'iPad Air SV-T-005', issue: 'cracked screen', severity: 'warn' },
    { id: 3, time: 'Yesterday, 4:30 PM', type: 'transfer', asset: 'Office Chair × 4', from: 'Stores', to: 'Board Room B', severity: 'info' },
    { id: 4, time: 'Yesterday, 2:00 PM', type: 'return', asset: 'HP Laptop SV-L-006', to: 'ICT Workshop', severity: 'success' },
    { id: 5, time: 'Mon, 09:00 AM', type: 'missing', asset: 'Projector SV-O-005', severity: 'danger' }
  ]);

  const [stockItems, setStockItems] = useState([
    { tag: 'SV-T-004', name: 'iPad Air 5th Gen (64GB)', category: 'Tablet', location: 'Stores Room A', condition: 'New', received: '10 Jan 2026' },
    { tag: 'SV-L-005', name: 'Dell Latitude 5530', category: 'Laptop', location: 'Stores Room A', condition: 'New', received: '15 Jan 2026' },
    { tag: 'SV-L-008', name: 'HP ProBook 450 G9', category: 'Laptop', location: 'Stores Room B', condition: 'New', received: '20 Jan 2026' },
    { tag: 'SV-T-008', name: 'Samsung Tab A7', category: 'Tablet', location: 'Stores Room A', condition: 'Good', received: '15 Jan 2026' },
    { tag: 'SV-AV-004', name: 'Canon EOS R50 Camera Kit', category: 'AV', location: 'Stores Room A', condition: 'New', received: '05 Feb 2026' }
  ]);

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'danger', icon: 'exclamation-circle', message: 'MISSING — SV-O-005 Epson Wireless Projector last seen Board Room B · 10 Mar 2026', asset: 'SV-O-005', link: '/other-assets' },
    { id: 2, type: 'warn', icon: 'id-card', message: 'KEC 899T vehicle insurance expired 15 Mar 2026', asset: 'KEC 899T', link: '/other-assets' }
  ]);

  const [fleetAssets] = useState([
    { tag: 'SV-T-001', name: 'iPad Pro 12.9"', lat: -1.28920, lng: 36.81720, status: 'active', loc: 'ICT Dept., Nairobi HQ' },
    { tag: 'SV-T-002', name: 'iPad Air', lat: -1.28921, lng: 36.81718, status: 'active', loc: 'Finance, Nairobi HQ' },
    { tag: 'SV-T-003', name: 'Samsung Tab S9', lat: -1.28919, lng: 36.81723, status: 'active', loc: 'Admin, Nairobi HQ' },
    { tag: 'SV-T-004', name: 'iPad Air (Stock)', lat: -1.28930, lng: 36.81710, status: 'stock', loc: 'Stores A, Nairobi HQ' },
    { tag: 'SV-L-001', name: 'Dell XPS 15', lat: -1.28918, lng: 36.81721, status: 'active', loc: 'Finance, Nairobi HQ' },
    { tag: 'SV-V-001', name: 'Toyota Hiace KEC 899T', lat: -1.29210, lng: 36.82190, status: 'active', loc: 'Parking Bay A, Nairobi' },
    { tag: 'SV-T-010', name: 'iPad Air (Ghana)', lat: 5.60360, lng: -0.18690, status: 'active', loc: 'Accra Branch, Ghana' },
    { tag: 'SV-L-014', name: 'Dell XPS 15 (USA)', lat: 38.89510, lng: -77.03640, status: 'active', loc: 'Washington DC, USA' },
  ]);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  
  // Map state
  const [mapExpanded, setMapExpanded] = useState(true);
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Status badge colors
  const getStatusBadge = (status) => {
    const badges = {
      active: { bg: 'rgba(0,229,168,0.12)', color: '#00E5A8', text: 'Active' },
      stock: { bg: 'rgba(79,158,248,0.12)', color: '#4F9EF8', text: 'In Stock' },
      repair: { bg: 'rgba(255,197,66,0.12)', color: '#FFC542', text: 'Repair' },
      missing: { bg: 'rgba(255,90,101,0.12)', color: '#FF5A65', text: 'Missing' },
      new: { bg: 'rgba(0,229,168,0.15)', color: '#00E5A8', text: 'New' }
    };
    return badges[status] || badges.active;
  };

  const getLocationBadge = (location) => {
    let className = 'floor';
    if (!location || location.includes('UNKNOWN') || location.includes('Missing')) className = 'missing';
    else if (location.includes('Stores')) className = 'stores';
    else if (location.includes('Field') || location.includes('Ghana') || location.includes('Zimbabwe') || location.includes('USA')) className = 'offsite';
    return className;
  };

  // Initialize map
  const initMap = useCallback(() => {
    if (!mapRef.current || leafletMap.current) return;

    leafletMap.current = L.map(mapRef.current).setView([10, 25], 2);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 20
    }).addTo(leafletMap.current);

    // Add office markers
    const offices = [
      { name: 'HQ — Upper Hill, Nairobi', lat: -1.28920, lng: 36.81720, flag: '🇰🇪' },
      { name: 'Branch — Kisumu, Kenya', lat: -0.10220, lng: 34.76170, flag: '🇰🇪' },
      { name: 'Branch — Accra, Ghana', lat: 5.60360, lng: -0.18690, flag: '🇬🇭' },
      { name: 'Branch — Harare, Zimbabwe', lat: -17.82890, lng: 31.05280, flag: '🇿🇼' },
      { name: 'Office — Washington DC, USA', lat: 38.89510, lng: -77.03640, flag: '🇺🇸' }
    ];

    offices.forEach(office => {
      const officeIcon = L.divIcon({
        className: 'office-marker',
        html: `<div style="width:34px;height:34px;border-radius:50%;background:#111E30;border:2px solid #00E5A8;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 14px rgba(0,229,168,0.35);font-size:15px">${office.flag}</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });
      
      L.marker([office.lat, office.lng], { icon: officeIcon })
        .addTo(leafletMap.current)
        .bindPopup(`<div style="background:#0C1829;color:#D8EAF8;padding:8px;font-weight:700">${office.flag} ${office.name}</div>`);
    });

    // Add asset markers
    const statusColors = {
      active: '#00E5A8',
      stock: '#4F9EF8',
      repair: '#FFC542',
      missing: '#FF5A65'
    };

    fleetAssets.forEach(asset => {
      if (!asset.lat) return;
      
      const color = statusColors[asset.status] || '#888';
      const assetIcon = L.divIcon({
        className: 'asset-marker',
        html: `<div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.55);cursor:pointer"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });

      const popupContent = document.createElement('div');
      popupContent.className = 'map-popup';
      popupContent.innerHTML = `
        <div style="font-weight:700;font-size:13px;margin-bottom:2px">${asset.tag}</div>
        <div style="font-size:11px;color:#6B8FAE;margin-bottom:5px">${asset.name}</div>
        <div style="font-size:11px;margin-bottom:4px"><b>Location:</b> ${asset.loc}</div>
        <div style="margin-top:6px;display:flex;align-items:center;gap:5px">
          <span style="width:7px;height:7px;border-radius:50%;background:${color};display:inline-block"></span>
          <span style="font-size:11px;font-weight:600;color:${color}">${asset.status}</span>
        </div>
      `;

      const viewBtn = document.createElement('button');
      viewBtn.textContent = 'View on Map';
      viewBtn.style.cssText = 'margin-top:8px;width:100%;background:#00E5A8;color:#07101F;border:none;padding:5px;border-radius:5px;font-size:11px;font-weight:700;cursor:pointer';
      viewBtn.onclick = () => {
        leafletMap.current.closePopup();
        handleViewOnMap(asset);
      };
      popupContent.appendChild(viewBtn);

      L.marker([asset.lat, asset.lng], { icon: assetIcon })
        .addTo(leafletMap.current)
        .bindPopup(popupContent, { maxWidth: 230 });
    });
  }, [fleetAssets]);

  useEffect(() => {
    if (mapExpanded) {
      setTimeout(() => {
        initMap();
      }, 300);
    }
  }, [mapExpanded, initMap]);

  useEffect(() => {
    if (leafletMap.current) {
      setTimeout(() => {
        leafletMap.current.invalidateSize();
      }, 350);
    }
  }, [mapExpanded]);

  // Handlers
  const handleAddAsset = () => {
    setSelectedAsset(null);
    setShowAddModal(true);
  };

  const handleAssign = (asset) => {
    setSelectedAsset(asset);
    setShowAssignModal(true);
  };

  const handleTransfer = (asset) => {
    setSelectedAsset(asset);
    setShowTransferModal(true);
  };

  const handleMaintenance = (asset) => {
    setSelectedAsset(asset);
    setShowMaintenanceModal(true);
  };

  const handleViewOnMap = (asset) => {
    setSelectedAsset(asset);
    setShowMapModal(true);
  };

  const handleGlobalSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 1) {
      // Implement search logic
      console.log('Searching for:', query);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === '/' && !e.target.matches('input, textarea, select')) {
      e.preventDefault();
      setShowSearchModal(true);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleSearchKeyDown);
    return () => document.removeEventListener('keydown', handleSearchKeyDown);
  }, []);

  // Stock table search
  const handleStockSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#stock-table tbody tr');
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(query) ? '' : 'none';
    });
  };

  // Stat Card Component
  const StatCard = ({ icon: Icon, value, label, sub, color, trend, onClick }) => (
    <Card className="stat-card" onClick={onClick}>
      <Card.Body>
        <div className={`stat-icon si-${color}`}>
          <Icon />
        </div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {sub && (
          <div className="stat-sub">
            {trend && <span className={`stat-${trend.type}`}><FiArrowUp /> {trend.value}</span>}
            {' '}{sub}
          </div>
        )}
      </Card.Body>
    </Card>
  );

  // Alert Component
  const AlertBar = ({ type, icon, message, asset, link }) => (
    <div className={`alert-bar ${type}`}>
      <FiAlertCircle />
      <div>
        <strong>{message.split('—')[0]}</strong> — {message.split('—')[1] || message}
        {asset && (
          <Button 
            variant="link" 
            className="alert-link"
            onClick={() => handleViewOnMap({ tag: asset })}
          >
            Investigate map →
          </Button>
        )}
        {link && (
          <a href={link} className="alert-link" style={{ color: type === 'danger' ? '#FF5A65' : '#FFC542' }}>
            View in Other Assets →
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Asset Overview</h1>
          <p>Seovo Solutions · Admin & Stores · Last synced <span className="text-accent">Today, 11:04 AM</span></p>
        </div>
        <div className="page-actions">
          <Button variant="secondary" className="btn-outline" onClick={() => toast.info('Exporting...')}>
            <FiDownload /> Export
          </Button>
          <Button variant="primary" className="btn-primary-custom" onClick={handleAddAsset}>
            <FiPlus /> Add Asset
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {alerts.map(alert => (
        <AlertBar key={alert.id} {...alert} />
      ))}

      {/* Stats Cards */}
      <Row className="g-3 mb-4">
        <Col xs={6} xl={3}>
          <StatCard 
            icon={FiBox} 
            value={stats.totalAssets} 
            label="Total Assets" 
            sub="this month" 
            color="g"
            trend={{ type: 'up', value: '4 added' }}
            onClick={() => setShowSearchModal(true)}
          />
        </Col>
        <Col xs={6} xl={3}>
          <StatCard 
            icon={FiCheckCircle} 
            value={stats.assignedAssets} 
            label="Assigned / In Use" 
            sub="86% of total inventory" 
            color="b"
            onClick={() => setShowSearchModal(true)}
          />
        </Col>
        <Col xs={6} xl={3}>
          <StatCard 
            icon={FiHome} 
            value={stats.inStock} 
            label="In Stock" 
            sub="Available for assignment" 
            color="a"
          />
        </Col>
        <Col xs={6} xl={3}>
          <StatCard 
            icon={FiTool} 
            value={stats.underRepair} 
            label="Under Repair" 
            sub="2 overdue for return" 
            color="r"
          />
        </Col>
      </Row>

      {/* Charts and Activity */}
      <Row className="g-3 mb-4">
        <Col md={5}>
          <Card className="data-card h-100">
            <Card.Header className="dc-header">
              <div className="dc-title">
                <FiBox style={{ color: '#00E5A8' }} /> Inventory by Category
              </div>
            </Card.Header>
            <Card.Body>
              <div className="progress-list">
                <div className="progress-item">
                  <div className="progress-meta">
                    <a href="/tablets">Tablets & Accessories</a>
                    <span>{stats.byCategory.tablets}</span>
                  </div>
                  <div className="progress-bar-custom">
                    <div className="progress-fill fill-g" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div className="progress-item">
                  <div className="progress-meta">
                    <a href="/laptops">Laptops</a>
                    <span>{stats.byCategory.laptops}</span>
                  </div>
                  <div className="progress-bar-custom">
                    <div className="progress-fill fill-b" style={{ width: '52%' }}></div>
                  </div>
                </div>
                <div className="progress-item">
                  <div className="progress-meta">
                    <a href="/furniture">Furniture</a>
                    <span>{stats.byCategory.furniture}</span>
                  </div>
                  <div className="progress-bar-custom">
                    <div className="progress-fill fill-a" style={{ width: '47%' }}></div>
                  </div>
                </div>
                <div className="progress-item">
                  <div className="progress-meta">
                    <a href="/other-assets">Other Assets</a>
                    <span>{stats.byCategory.other}</span>
                  </div>
                  <div className="progress-bar-custom">
                    <div className="progress-fill fill-r" style={{ width: '29%' }}></div>
                  </div>
                </div>
              </div>

              <hr className="divider" />

              <div className="status-breakdown">
                <div className="progress-item">
                  <div className="progress-meta">
                    <span>Active / Assigned</span>
                    <span>{stats.assignedAssets}</span>
                  </div>
                  <div className="progress-bar-custom">
                    <div className="progress-fill fill-g" style={{ width: '86%' }}></div>
                  </div>
                </div>
                <div className="progress-item">
                  <div className="progress-meta">
                    <span>In Stock</span>
                    <span>{stats.inStock}</span>
                  </div>
                  <div className="progress-bar-custom">
                    <div className="progress-fill fill-b" style={{ width: '11%' }}></div>
                  </div>
                </div>
                <div className="progress-item">
                  <div className="progress-meta">
                    <span>Repair / Missing</span>
                    <span>{stats.underRepair}</span>
                  </div>
                  <div className="progress-bar-custom">
                    <div className="progress-fill fill-r" style={{ width: '3%' }}></div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={7}>
          <Card className="data-card h-100">
            <Card.Header className="dc-header">
              <div className="dc-title">
                <FiBox style={{ color: '#00E5A8' }} /> Recent Activity
              </div>
              <Button variant="link" className="btn-ghost btn-sm">
                View All <FiArrowRight />
              </Button>
            </Card.Header>
            <Card.Body>
              <div className="timeline">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="timeline-item">
                    <div className={`timeline-dot ${activity.severity}`}></div>
                    <div className="timeline-time">{activity.time}</div>
                    <div className="timeline-text">
                      {activity.type === 'assign' && (
                        <> <strong>{activity.asset}</strong> assigned to <strong>{activity.assignee}</strong> — {activity.dept}. <a href="/laptops">View →</a></>
                      )}
                      {activity.type === 'repair' && (
                        <> <strong>{activity.asset}</strong> sent for repair — {activity.issue}. <a href="/tablets">View →</a></>
                      )}
                      {activity.type === 'transfer' && (
                        <> <strong>{activity.asset}</strong> transferred {activity.from} → {activity.to}. <a href="/furniture">View →</a></>
                      )}
                      {activity.type === 'return' && (
                        <> <strong>{activity.asset}</strong> returned — now in {activity.to}.</>
                      )}
                      {activity.type === 'missing' && (
                        <> <strong>{activity.asset}</strong> flagged missing. <a href="/other-assets" style={{ color: '#FF5A65' }}>View investigation →</a></>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Fleet Map */}
      <Card className="data-card mb-4">
        <Card.Header className="dc-header">
          <div className="dc-title">
            <FiMap style={{ color: '#00E5A8' }} /> Live Asset Map — Worldwide Locations
          </div>
          <div className="dc-actions">
            <Badge bg="secondary" className="badge-active">5 offices tracked</Badge>
            <Button 
              variant="link" 
              className="btn-ghost btn-sm"
              onClick={() => setMapExpanded(!mapExpanded)}
            >
              {mapExpanded ? <FiChevronUp /> : <FiChevronDown />} {mapExpanded ? 'Hide' : 'Show'}
            </Button>
          </div>
        </Card.Header>
        {mapExpanded && (
          <div className="map-container" style={{ height: '420px', position: 'relative' }}>
            <div ref={mapRef} style={{ height: '100%', width: '100%' }}></div>
            <div className="map-legend">
              <div className="legend-title">Legend</div>
              <div className="legend-item">
                <span className="legend-dot active"></span> Active
              </div>
              <div className="legend-item">
                <span className="legend-dot stock"></span> In Stock
              </div>
              <div className="legend-item">
                <span className="legend-dot repair"></span> Repair
              </div>
              <div className="legend-item">
                <span className="legend-dot missing"></span> Missing
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Stock Table */}
      <Card className="data-card mb-4">
        <Card.Header className="dc-header">
          <div className="dc-title">
            <FiPackage style={{ color: '#4F9EF8' }} /> Available in Stock
          </div>
          <div className="dc-actions">
            <Badge bg="info" className="badge-stock">{stockItems.length} items</Badge>
            <Form.Control
              type="text"
              placeholder="Search stock…"
              className="table-search"
              onChange={handleStockSearch}
            />
          </div>
        </Card.Header>
        <div className="table-responsive">
          <Table id="stock-table" className="custom-table">
            <thead>
              <tr>
                <th>Asset Tag</th>
                <th>Item</th>
                <th>Category</th>
                <th>Location</th>
                <th>Condition</th>
                <th>Received</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stockItems.map(item => (
                <tr key={item.tag}>
                  <td className="mono">{item.tag}</td>
                  <td>{item.name}</td>
                  <td>
                    <Badge bg="secondary" className="category-badge">{item.category}</Badge>
                  </td>
                  <td>
                    <span className={`location-badge ${getLocationBadge(item.location)}`}>
                      {item.location}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${item.condition.toLowerCase()}`}>
                      {item.condition}
                    </span>
                  </td>
                  <td>{item.received}</td>
                  <td>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="btn-assign"
                      onClick={() => handleAssign(item)}
                    >
                      <FiUserPlus /> Assign
                    </Button>
                    <Button 
                      variant="link" 
                      className="btn-map-icon"
                      onClick={() => handleViewOnMap(item)}
                      title="View on Map"
                    >
                      <FiMapPin />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Category Quick Links */}
      <Row className="g-3">
        <Col md={4}>
          <Card className="stat-card clickable" onClick={() => window.location.href = '/tablets'}>
            <Card.Body>
              <div className="stat-icon si-g">
                <FiMonitor />
              </div>
              <div className="stat-value">{stats.byCategory.tablets}</div>
              <div className="stat-label">Tablets & Accessories</div>
              <div className="stat-sub">
                <a href="/tablets" className="text-accent">View register →</a>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stat-card clickable" onClick={() => window.location.href = '/laptops'}>
            <Card.Body>
              <div className="stat-icon si-b">
                <FiMonitor />
              </div>
              <div className="stat-value">{stats.byCategory.laptops}</div>
              <div className="stat-label">Laptops — 5 offices</div>
              <div className="stat-sub">
                <a href="/laptops" className="text-blue">View serial index →</a>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stat-card clickable" onClick={() => window.location.href = '/other-assets'}>
            <Card.Body>
              <div className="stat-icon si-r">
                <FiPackage />
              </div>
              <div className="stat-value">3</div>
              <div className="stat-label">Vehicles — 1 insurance expired</div>
              <div className="stat-sub">
                <a href="/other-assets" className="text-red">View fleet →</a>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modals */}
      <AddAssetModal 
        show={showAddModal} 
        onHide={() => setShowAddModal(false)}
        onSave={() => {
          toast.success('Asset added successfully');
          setShowAddModal(false);
        }}
      />

      <AssignModal
        show={showAssignModal}
        onHide={() => setShowAssignModal(false)}
        asset={selectedAsset}
        onConfirm={() => {
          toast.success('Asset assigned successfully');
          setShowAssignModal(false);
        }}
      />

      <TransferModal
        show={showTransferModal}
        onHide={() => setShowTransferModal(false)}
        asset={selectedAsset}
        onConfirm={() => {
          toast.success('Asset transferred successfully');
          setShowTransferModal(false);
        }}
      />

      <MaintenanceModal
        show={showMaintenanceModal}
        onHide={() => setShowMaintenanceModal(false)}
        asset={selectedAsset}
        onConfirm={() => {
          toast.success('Maintenance report submitted');
          setShowMaintenanceModal(false);
        }}
      />

      <AssetMapModal
        show={showMapModal}
        onHide={() => setShowMapModal(false)}
        asset={selectedAsset}
        onMove={() => {
          setShowMapModal(false);
          handleTransfer(selectedAsset);
        }}
      />

      <GlobalSearchModal
        show={showSearchModal}
        onHide={() => setShowSearchModal(false)}
        onSearch={handleGlobalSearch}
        onViewOnMap={handleViewOnMap}
      />
    </div>
  );
};

export default Dashboard;