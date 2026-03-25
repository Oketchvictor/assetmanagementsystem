import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Badge } from 'react-bootstrap';
import { 
  FiPackage, FiTruck, FiTv, FiBluetooth, FiWifi, FiTool, FiDownload, FiPlus,
  FiEye, FiMapPin, FiMove, FiUserPlus, FiAlertCircle, FiCalendar,
  FiCamera, FiPrinter, FiCoffee, FiHardDrive, FiBattery,
  FiMap, FiFlag, FiInfo, FiAlertTriangle
} from 'react-icons/fi';
import { toast } from 'react-toastify';

// Import modals
import AddAssetModal from '../components/modals/AddAssetModal';
import AssignModal from '../components/modals/AssignModal';
import TransferModal from '../components/modals/TransferModal';
import MaintenanceModal from '../components/modals/MaintenanceModal';
import AssetMapModal from '../components/modals/AssetMapModal';
import GlobalSearchModal from '../components/modals/GlobalSearchModal';
import OtherAssetDetailModal from '../components/modals/OtherAssetDetailModal';

const OtherAssets = () => {
  // State management
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Category statistics
  const stats = {
    vehicles: 3,
    av: 7,
    appliances: 5,
    networking: 3,
    total: 18
  };

  // Other assets data
  const [assets, setAssets] = useState([
    // Vehicles
    {
      tag: 'SV-V-001',
      name: 'Toyota Hiace Van (14-seat)',
      category: 'Vehicle',
      categoryIcon: FiTruck,
      serial: 'KEC 899T',
      location: 'Parking Bay A',
      locationType: 'floor',
      custodian: 'Transport Dept.',
      status: 'active',
      condition: 'Good',
      insuranceExpiry: '15 Mar 2026',
      insuranceStatus: 'expired',
      inspectionDue: '01 Apr 2026',
      color: 'White',
      acquired: 'Mar 2019',
      value: 3200000,
      history: [
        { where: 'Nairobi CBD', when: 'Today 07:30 AM', by: 'Driver Kamau' },
        { where: 'Parking Bay A', when: 'Yesterday', by: 'Driver Kamau' }
      ],
      extra: [
        { key: 'Logbook No.', value: 'LB-2019-441' },
        { key: 'Chassis No.', value: 'JTFSX2A90D0001234' }
      ]
    },
    {
      tag: 'SV-V-002',
      name: 'Toyota Land Cruiser Prado',
      category: 'Vehicle',
      categoryIcon: FiTruck,
      serial: 'KDG 221Z',
      location: 'Parking Bay B',
      locationType: 'floor',
      custodian: 'Executive Office',
      status: 'active',
      condition: 'Excellent',
      insuranceExpiry: '10 Apr 2026',
      insuranceStatus: 'expiring',
      inspectionDue: '15 Jun 2026',
      color: 'Black',
      acquired: 'Jun 2021',
      value: 8500000,
      history: [
        { where: 'Parking Bay B', when: '12 Mar 2026', by: 'Driver Mwangi' }
      ],
      extra: [
        { key: 'Logbook No.', value: 'LB-2021-123' },
        { key: 'Chassis No.', value: 'LCRUISER-2021-001' }
      ]
    },
    {
      tag: 'SV-V-003',
      name: 'Isuzu NKR Pickup Truck',
      category: 'Vehicle',
      categoryIcon: FiTruck,
      serial: 'KDB 567A',
      location: 'Field / Kisumu',
      locationType: 'offsite',
      custodian: 'S. Odhiambo',
      status: 'active',
      condition: 'Good',
      insuranceExpiry: '12 Dec 2026',
      insuranceStatus: 'active',
      inspectionDue: '20 Sep 2026',
      color: 'White',
      acquired: 'Jan 2022',
      value: 2800000,
      history: [
        { where: 'Kisumu Field', when: '17 Mar 2026', by: 'S. Odhiambo' }
      ],
      extra: [
        { key: 'Logbook No.', value: 'LB-2022-789' },
        { key: 'Chassis No.', value: 'ISUZU-NKR-2022' }
      ]
    },

    // AV Equipment
    {
      tag: 'SV-AV-001',
      name: 'Epson EB-2250U Projector',
      category: 'AV',
      categoryIcon: FiTv,
      serial: 'X9TR221LMN',
      location: 'Board Room A',
      locationType: 'room',
      custodian: 'Board Room',
      status: 'active',
      condition: 'Good',
      acquired: 'Sep 2023',
      value: 95000,
      warranty: 'Sep 2026',
      history: [
        { where: 'Board Room A', when: 'Sep 2023', by: 'Admin Kuria' }
      ],
      extra: [
        { key: 'Lamp Hours', value: '420 hrs (max 4000)' }
      ]
    },
    {
      tag: 'SV-AV-002',
      name: 'Samsung 75" QLED Smart TV',
      category: 'AV',
      categoryIcon: FiTv,
      serial: '04VN3Q700',
      location: 'Board Room B',
      locationType: 'room',
      custodian: 'Board Room',
      status: 'active',
      condition: 'Excellent',
      acquired: 'Sep 2023',
      value: 180000,
      warranty: 'Sep 2026',
      history: [
        { where: 'Board Room B', when: 'Sep 2023', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-AV-004',
      name: 'Canon EOS R50 Camera Kit',
      category: 'AV',
      categoryIcon: FiCamera,
      serial: '062030001234',
      location: 'Stores Room A',
      locationType: 'stores',
      custodian: 'ICT / Comms',
      status: 'stock',
      condition: 'New',
      acquired: 'Feb 2026',
      value: 85000,
      warranty: 'Feb 2028',
      history: [
        { where: 'Stores Room A', when: 'Feb 2026', by: 'Admin Kuria' }
      ],
      extra: [
        { key: 'Includes', value: 'Body, 18-45mm lens, 2x batteries, bag' }
      ]
    },
    {
      tag: 'SV-AV-005',
      name: 'Jabra PanaCast 50 Video Bar',
      category: 'AV',
      categoryIcon: FiTv,
      serial: 'JAB-PC50-2024',
      location: 'Board Room B',
      locationType: 'room',
      custodian: 'Board Room',
      status: 'active',
      condition: 'Excellent',
      acquired: 'Mar 2024',
      value: 145000,
      warranty: 'Mar 2027',
      history: [
        { where: 'Board Room B', when: 'Mar 2024', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-O-005',
      name: 'Epson EB-X51 Wireless Projector',
      category: 'AV',
      categoryIcon: FiAlertTriangle,
      serial: 'X7KQ89LN01',
      location: 'UNKNOWN',
      locationType: 'missing',
      custodian: '—',
      status: 'missing',
      condition: 'Unknown',
      acquired: 'Mar 2024',
      value: 65000,
      lastSeen: 'Board Room B - 10 Mar 2026',
      history: [
        { where: '⚠ UNKNOWN — flagged MISSING', when: '10 Mar 2026', by: 'System Alert' },
        { where: 'Board Room B', when: '05 Mar 2026', by: 'Admin Kuria' }
      ],
      extra: [
        { key: 'Last Known Location', value: 'Board Room B', highlight: true },
        { key: 'Investigation', value: 'Ongoing', status: 'danger' }
      ]
    },

    // Appliances
    {
      tag: 'SV-AP-001',
      name: 'Samsung Side-by-Side Fridge',
      category: 'Appliance',
      categoryIcon: FiBluetooth,
      serial: 'SAM-RS65R',
      location: 'Staff Lounge',
      locationType: 'room',
      custodian: 'General Use',
      status: 'active',
      condition: 'Good',
      acquired: 'Jan 2024',
      value: 95000,
      warranty: 'Jan 2027',
      history: [
        { where: 'Staff Lounge', when: 'Jan 2024', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-AP-002',
      name: 'Nespresso Vertuo Coffee Machine',
      category: 'Appliance',
      categoryIcon: FiCoffee,
      serial: 'NES-VERTU-C',
      location: 'Staff Lounge',
      locationType: 'room',
      custodian: 'General Use',
      status: 'active',
      condition: 'Good',
      acquired: 'Mar 2024',
      value: 22000,
      warranty: 'Mar 2026 (expiring)',
      history: [
        { where: 'Staff Lounge', when: 'Mar 2024', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-AP-003',
      name: 'Samsung 32L Microwave',
      category: 'Appliance',
      categoryIcon: FiBluetooth,
      serial: 'SAM-MWO-32L',
      location: 'Staff Lounge',
      locationType: 'room',
      custodian: 'General Use',
      status: 'active',
      condition: 'Good',
      acquired: 'Jan 2024',
      value: 18000,
      warranty: 'Jan 2026 (expired)',
      history: [
        { where: 'Staff Lounge', when: 'Jan 2024', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-AP-004',
      name: 'Water Dispenser (Hot/Cold)',
      category: 'Appliance',
      categoryIcon: FiTool,
      serial: 'WD-HC-2023',
      location: 'Finance Dept.',
      locationType: 'floor',
      custodian: 'General Use',
      status: 'repair',
      condition: 'Needs Check',
      acquired: 'Jun 2023',
      value: 15000,
      warranty: 'Expired Jun 2025',
      history: [
        { where: 'Finance Dept.', when: 'Jun 2023', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-AP-005',
      name: 'Canon iR-ADV 4525 Photocopier',
      category: 'Appliance',
      categoryIcon: FiPrinter,
      serial: 'CAN-ADV4525',
      location: 'Admin Office',
      locationType: 'floor',
      custodian: 'Shared / Admin',
      status: 'active',
      condition: 'Good',
      acquired: 'Sep 2023',
      value: 185000,
      warranty: 'Sep 2026',
      history: [
        { where: 'Admin Office', when: 'Sep 2023', by: 'Admin Kuria' }
      ],
      extra: [
        { key: 'Toner Level', value: '68%' }
      ]
    },

    // Networking
    {
      tag: 'SV-NET-001',
      name: 'Cisco Catalyst 2960 Switch',
      category: 'Networking',
      categoryIcon: FiWifi,
      serial: 'FCQ1932V00A',
      location: 'Server Room',
      locationType: 'floor',
      custodian: 'ICT Dept.',
      status: 'active',
      condition: 'Good',
      acquired: 'Jan 2022',
      value: 220000,
      warranty: 'Jan 2027',
      history: [
        { where: 'Server Room', when: 'Jan 2022', by: 'ICT Dept.' }
      ],
      extra: [
        { key: 'IP Address', value: '192.168.1.1' },
        { key: 'Ports', value: '48 × 1GbE + 4 SFP' }
      ]
    },
    {
      tag: 'SV-NET-002',
      name: 'Ubiquiti UniFi Dream Machine Pro',
      category: 'Networking',
      categoryIcon: FiWifi,
      serial: 'F09FC2A1B3D0',
      location: 'Server Room',
      locationType: 'floor',
      custodian: 'ICT Dept.',
      status: 'active',
      condition: 'Good',
      acquired: 'Mar 2022',
      value: 85000,
      warranty: 'Mar 2025',
      history: [
        { where: 'Server Room', when: 'Mar 2022', by: 'ICT Dept.' }
      ],
      extra: [
        { key: 'IP Address', value: '192.168.1.2' },
        { key: 'Role', value: 'Router / Controller' }
      ]
    },
    {
      tag: 'SV-NET-003',
      name: 'APC Smart-UPS 2200VA',
      category: 'Networking',
      categoryIcon: FiBattery,
      serial: 'AS1916260401',
      location: 'Server Room',
      locationType: 'floor',
      custodian: 'ICT Dept.',
      status: 'repair',
      condition: 'Battery Check',
      acquired: 'Mar 2022',
      value: 95000,
      warranty: 'Mar 2026',
      history: [
        { where: 'Server Room', when: 'Mar 2022', by: 'ICT Dept.' }
      ],
      extra: [
        { key: 'Runtime', value: '~18 min at full load' },
        { key: 'Battery Status', value: 'Needs replacement' }
      ]
    }
  ]);

  // Filter assets based on active tab and search
  const filteredAssets = useMemo(() => {
    let filtered = assets;

    // Filter by tab
    if (activeTab === 'vehicles') {
      filtered = filtered.filter(a => a.category === 'Vehicle');
    } else if (activeTab === 'av') {
      filtered = filtered.filter(a => a.category === 'AV');
    } else if (activeTab === 'appliances') {
      filtered = filtered.filter(a => a.category === 'Appliance');
    } else if (activeTab === 'networking') {
      filtered = filtered.filter(a => a.category === 'Networking');
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.tag.toLowerCase().includes(query) ||
        a.name.toLowerCase().includes(query) ||
        a.serial.toLowerCase().includes(query) ||
        a.location.toLowerCase().includes(query) ||
        (a.custodian && a.custodian.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [assets, activeTab, searchQuery]);

  // Get vehicles
  const vehicles = useMemo(() => {
    return assets.filter(a => a.category === 'Vehicle');
  }, [assets]);

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      active: { className: 'badge-active', text: 'Active' },
      stock: { className: 'badge-stock', text: 'In Stock' },
      repair: { className: 'badge-repair', text: 'Repair' },
      missing: { className: 'badge-missing', text: 'Missing' },
      retired: { className: 'badge-retired', text: 'Retired' }
    };
    return badges[status] || badges.active;
  };

  // Get location badge
  const getLocationBadge = (location, type) => {
    const classes = {
      floor: 'loc-badge floor',
      room: 'loc-badge floor',
      stores: 'loc-badge stores',
      offsite: 'loc-badge offsite',
      missing: 'loc-badge missing'
    };
    return <span className={classes[type] || 'loc-badge floor'}>{location}</span>;
  };

  // Get insurance status style
  const getInsuranceStyle = (status) => {
    const styles = {
      expired: { color: '#FF5A65', fontWeight: '700' },
      expiring: { color: '#FFC542', fontWeight: '700' },
      active: { color: '#00E5A8' }
    };
    return styles[status] || {};
  };

  // Format currency
  const formatCurrency = (value) => {
    return `KES ${value.toLocaleString()}`;
  };

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

  const handleViewDetail = (asset) => {
    setSelectedAsset(asset);
    setShowDetailModal(true);
  };

  const handleExport = () => {
    toast.info('Exporting assets...');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Stat Card Component
  const StatCard = ({ icon: Icon, value, label, sub, color, onClick }) => (
    <Card className={`stat-card ${onClick ? 'clickable' : ''}`} onClick={onClick}>
      <Card.Body>
        <div className={`stat-icon si-${color}`}>
          <Icon />
        </div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {sub && <div className="stat-sub" style={sub.style}>{sub.text}</div>}
      </Card.Body>
    </Card>
  );

  // Render all assets table
  const renderAllAssets = () => (
    <div className="table-responsive">
      <Table className="custom-table" id="tbl-oall">
        <thead>
          <tr>
            <th>Asset Tag</th>
            <th>Item</th>
            <th>Category</th>
            <th>Serial / Plate</th>
            <th>Location</th>
            <th>Custodian</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssets.map(asset => (
            <tr key={asset.tag} className={asset.status === 'missing' ? 'missing-row' : ''}>
              <td className={`mono ${asset.status === 'missing' ? 'text-danger' : ''}`}>
                {asset.tag}
              </td>
              <td>
                {asset.name}
                {asset.status === 'missing' && (
                  <Badge bg="danger" className="badge-missing ms-2">MISSING</Badge>
                )}
              </td>
              <td>
                <span className={`category-badge badge-${asset.category.toLowerCase()}`}>
                  {asset.category}
                </span>
              </td>
              <td className="mono">{asset.serial}</td>
              <td>{getLocationBadge(asset.location, asset.locationType)}</td>
              <td>{asset.custodian}</td>
              <td>
                <span className={`badge ${getStatusBadge(asset.status).className}`}>
                  {getStatusBadge(asset.status).text}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <Button 
                    variant="link" 
                    className="act-btn" 
                    onClick={() => handleViewDetail(asset)}
                    title="Details"
                  >
                    <FiEye />
                  </Button>
                  {asset.status !== 'missing' && (
                    <Button 
                      variant="link" 
                      className="act-btn map-btn" 
                      onClick={() => handleViewOnMap(asset)}
                      title="View on Map"
                    >
                      <FiMapPin />
                    </Button>
                  )}
                  {asset.status !== 'missing' && (
                    <Button 
                      variant="link" 
                      className="act-btn" 
                      onClick={() => handleTransfer(asset)}
                      title="Move"
                    >
                      <FiMove />
                    </Button>
                  )}
                  {asset.status === 'stock' && (
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="btn-assign"
                      onClick={() => handleAssign(asset)}
                    >
                      <FiUserPlus /> Assign
                    </Button>
                  )}
                  {asset.status === 'missing' && (
                    <Button 
                      variant="danger" 
                      size="sm" 
                      className="btn-danger-sm"
                      onClick={() => handleMaintenance(asset)}
                    >
                      <FiFlag /> Report
                    </Button>
                  )}
                  {(asset.status === 'repair' || asset.status === 'active') && asset.status !== 'missing' && (
                    <Button 
                      variant="link" 
                      className="act-btn" 
                      onClick={() => handleMaintenance(asset)}
                      title="Report Issue"
                    >
                      <FiTool/>
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );

  // Render vehicles tab
  const renderVehicles = () => (
    <>
      <div className="alert-bar warn">
        <FiTruck />
        <div>
          <strong>KEC 899T</strong> insurance EXPIRED 15 Mar 2026. 
          <strong> KDG 221Z</strong> insurance expiring 10 Apr 2026. Renew urgently.
        </div>
      </div>
      <div className="dc-header">
        <div className="dc-title">Fleet Register — {vehicles.length} vehicles</div>
      </div>
      <div className="table-responsive">
        <Table className="custom-table">
          <thead>
            <tr>
              <th>Tag</th>
              <th>Vehicle</th>
              <th>Plate</th>
              <th>Color</th>
              <th>Location</th>
              <th>Custodian</th>
              <th>Insurance Expiry</th>
              <th>Inspection Due</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(vehicle => (
              <tr key={vehicle.tag}>
                <td className="mono">{vehicle.tag}</td>
                <td>{vehicle.name}</td>
                <td className="mono" style={{ fontWeight: 800 }}>{vehicle.serial}</td>
                <td>{vehicle.color}</td>
                <td>{getLocationBadge(vehicle.location, vehicle.locationType)}</td>
                <td>{vehicle.custodian}</td>
                <td style={getInsuranceStyle(vehicle.insuranceStatus)}>
                  {vehicle.insuranceExpiry}
                  {vehicle.insuranceStatus === 'expired' && ' ⚠ EXPIRED'}
                  {vehicle.insuranceStatus === 'expiring' && ' ⚠ EXPIRING'}
                </td>
                <td style={vehicle.inspectionDue.includes('Apr') ? { color: '#FFC542' } : {}}>
                  {vehicle.inspectionDue}
                </td>
                <td>
                  <span className={`badge ${getStatusBadge(vehicle.status).className}`}>
                    {getStatusBadge(vehicle.status).text}
                  </span>
                </td>
                <td>
                  <Button variant="link" className="act-btn" onClick={() => handleViewDetail(vehicle)}>
                    <FiEye />
                  </Button>
                  <Button variant="link" className="act-btn map-btn" onClick={() => handleViewOnMap(vehicle)}>
                    <FiMapPin />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Vehicle Movements */}
      <div className="movements-section">
        <div className="dc-title mb-3">
          <FiMap className="me-2" style={{ color: '#4F9EF8' }} />
          Recent Vehicle Movements
        </div>
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-time">Today, 07:30 AM</div>
            <div className="timeline-text">
              <strong>KEC 899T</strong> departed for Nairobi CBD — Driver Kamau J. Return: 12:00 PM.
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot info"></div>
            <div className="timeline-time">Yesterday, 02:15 PM</div>
            <div className="timeline-text">
              <strong>KDB 567A</strong> dispatched to Kisumu field — S. Odhiambo. Est. return: 20 Mar 2026.
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot warn"></div>
            <div className="timeline-time">15 Mar 2026</div>
            <div className="timeline-text">
              <strong>KEC 899T</strong> — insurance expired. Procurement team notified.
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Render AV tab
  const renderAV = () => (
    <>
      <div className="alert-bar danger">
        <FiAlertCircle />
        <div>
          <strong>SV-O-005</strong> Epson Wireless Projector is currently MISSING. 
          Last seen Board Room B — 10 Mar 2026.
        </div>
      </div>
      <div className="dc-header">
        <div className="dc-title">AV & Electronics</div>
        <div className="dc-actions">
          <Form.Control
            type="text"
            placeholder="Search…"
            className="table-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="table-responsive">
        <Table className="custom-table" id="tbl-av">
          <thead>
            <tr>
              <th>Tag</th>
              <th>Item</th>
              <th>Serial</th>
              <th>Location</th>
              <th>Custodian</th>
              <th>Condition</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.filter(a => a.category === 'AV').map(asset => (
              <tr key={asset.tag} className={asset.status === 'missing' ? 'missing-row' : ''}>
                <td className={`mono ${asset.status === 'missing' ? 'text-danger' : ''}`}>
                  {asset.tag}
                </td>
                <td>
                  {asset.name}
                  {asset.status === 'missing' && (
                    <Badge bg="danger" className="badge-missing ms-2">MISSING</Badge>
                  )}
                </td>
                <td className="mono">{asset.serial}</td>
                <td>{getLocationBadge(asset.location, asset.locationType)}</td>
                <td>{asset.custodian}</td>
                <td>
                  <span className={`badge ${asset.condition === 'New' ? 'badge-new' : 'badge-active'}`}>
                    {asset.condition}
                  </span>
                </td>
                <td>
                  <span className={`badge ${getStatusBadge(asset.status).className}`}>
                    {getStatusBadge(asset.status).text}
                  </span>
                </td>
                <td>
                  <Button variant="link" className="act-btn" onClick={() => handleViewDetail(asset)}>
                    <FiEye />
                  </Button>
                  {asset.status !== 'missing' && (
                    <Button variant="link" className="act-btn map-btn" onClick={() => handleViewOnMap(asset)}>
                      <FiMapPin />
                    </Button>
                  )}
                  {asset.status === 'stock' && (
                    <Button variant="primary" size="sm" className="btn-assign" onClick={() => handleAssign(asset)}>
                      <FiUserPlus /> Assign
                    </Button>
                  )}
                  {asset.status === 'missing' && (
                    <Button variant="danger" size="sm" className="btn-danger-sm" onClick={() => handleMaintenance(asset)}>
                      <FiFlag /> Report
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );

  // Render appliances tab
  const renderAppliances = () => (
    <div className="table-responsive">
      <Table className="custom-table">
        <thead>
          <tr>
            <th>Tag</th>
            <th>Item</th>
            <th>Serial</th>
            <th>Location</th>
            <th>Purchased</th>
            <th>Warranty Until</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.filter(a => a.category === 'Appliance').map(asset => (
            <tr key={asset.tag}>
              <td className="mono">{asset.tag}</td>
              <td>{asset.name}</td>
              <td className="mono">{asset.serial}</td>
              <td>{getLocationBadge(asset.location, asset.locationType)}</td>
              <td>{asset.acquired}</td>
              <td style={asset.warranty?.includes('expired') ? { color: '#FF5A65' } : 
                        asset.warranty?.includes('expiring') ? { color: '#FFC542' } : {}}>
                {asset.warranty || '—'}
              </td>
              <td>
                <span className={`badge ${getStatusBadge(asset.status).className}`}>
                  {getStatusBadge(asset.status).text}
                </span>
              </td>
              <td>
                <Button variant="link" className="act-btn" onClick={() => handleViewDetail(asset)}>
                  <FiEye />
                </Button>
                {asset.status !== 'repair' && (
                  <Button variant="link" className="act-btn map-btn" onClick={() => handleViewOnMap(asset)}>
                    <FiMapPin />
                  </Button>
                )}
                {asset.status === 'repair' && (
                  <Button variant="link" className="act-btn" onClick={() => handleMaintenance(asset)}>
                    <FiTool />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );

  // Render networking tab
  const renderNetworking = () => (
    <div className="dc-header">
      <div className="dc-title">
        <FiWifi className="me-2" style={{ color: '#4F9EF8' }} />
        Networking Equipment — Server Room
      </div>
    </div>
  );

  return (
    <div className="other-assets-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Other Assets</h1>
          <p>Vehicles, AV equipment, appliances, networking — worldwide fleet management</p>
        </div>
        <div className="page-actions">
          <Button variant="secondary" className="btn-outline" onClick={handleExport}>
            <FiDownload /> Export
          </Button>
          <Button variant="primary" className="btn-primary-custom" onClick={handleAddAsset}>
            <FiPlus /> Add Asset
          </Button>
        </div>
      </div>

      {/* Alerts */}
      <div className="alert-bar danger">
        <FiAlertCircle />
        <div>
          <strong>MISSING — SV-O-005</strong> Epson EB-X51 Wireless Projector | Last seen Board Room B · 10 Mar 2026 &nbsp;
          <Button 
            variant="link" 
            className="alert-link"
            onClick={() => handleViewDetail(assets.find(a => a.tag === 'SV-O-005'))}
          >
            View detail →
          </Button>
        </div>
      </div>
      <div className="alert-bar warn">
        <FiInfo />
        <div>
          Vehicle <strong>KEC 899T</strong> insurance expired 15 Mar 2026 — &nbsp;
          <Button 
            variant="link" 
            className="alert-link"
            onClick={() => handleViewDetail(assets.find(a => a.tag === 'SV-V-001'))}
          >
            View vehicle →
          </Button>
        </div>
      </div>

      {/* Category Stats */}
      <Row className="g-3 mb-4">
        <Col xs={6} xl={3}>
          <StatCard 
            icon={FiTruck} 
            value={stats.vehicles} 
            label="Vehicles" 
            color="b"
            sub={{ text: '1 insurance expired', style: { color: '#FF5A65' } }}
            onClick={() => handleTabChange('vehicles')}
          />
        </Col>
        <Col xs={6} xl={3}>
          <StatCard 
            icon={FiTv} 
            value={stats.av} 
            label="AV / Electronics" 
            color="v"
            sub={{ text: '1 missing', style: { color: '#FF5A65' } }}
            onClick={() => handleTabChange('av')}
          />
        </Col>
        <Col xs={6} xl={3}>
          <StatCard 
            icon={FiBluetooth} 
            value={stats.appliances} 
            label="Appliances" 
            color="g"
            sub={{ text: '1 needs check', style: { color: '#FFC542' } }}
            onClick={() => handleTabChange('appliances')}
          />
        </Col>
        <Col xs={6} xl={3}>
          <StatCard 
            icon={FiWifi} 
            value={stats.networking} 
            label="Networking" 
            color="a"
            sub={{ text: 'Server Room', style: {} }}
            onClick={() => handleTabChange('networking')}
          />
        </Col>
      </Row>

      {/* Main Card with Tabs */}
      <Card className="data-card">
        <Card.Header className="dc-header">
          <div className="tab-bar">
            <Button 
              variant="link" 
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All ({stats.total})
            </Button>
            <Button 
              variant="link" 
              className={`tab-btn ${activeTab === 'vehicles' ? 'active' : ''}`}
              onClick={() => setActiveTab('vehicles')}
            >
              <FiTruck className="me-1" /> Vehicles ({stats.vehicles})
            </Button>
            <Button 
              variant="link" 
              className={`tab-btn ${activeTab === 'av' ? 'active' : ''}`}
              onClick={() => setActiveTab('av')}
            >
              <FiTv className="me-1" /> AV & Electronics ({stats.av})
            </Button>
            <Button 
              variant="link" 
              className={`tab-btn ${activeTab === 'appliances' ? 'active' : ''}`}
              onClick={() => setActiveTab('appliances')}
            >
              <FiBluetooth className="me-1" /> Appliances ({stats.appliances})
            </Button>
            <Button 
              variant="link" 
              className={`tab-btn ${activeTab === 'networking' ? 'active' : ''}`}
              onClick={() => setActiveTab('networking')}
            >
              <FiWifi className="me-1" /> Networking ({stats.networking})
            </Button>
          </div>
          {activeTab === 'all' && (
            <div className="dc-actions">
              <Form.Control
                type="text"
                placeholder="Search tag, item, location…"
                className="table-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </Card.Header>

        <Card.Body className="p-0">
          {activeTab === 'all' && renderAllAssets()}
          {activeTab === 'vehicles' && renderVehicles()}
          {activeTab === 'av' && renderAV()}
          {activeTab === 'appliances' && renderAppliances()}
          {activeTab === 'networking' && renderNetworking()}
        </Card.Body>
      </Card>

      {/* Modals */}
      <AddAssetModal 
        show={showAddModal} 
        onHide={() => setShowAddModal(false)}
        category="O"
        onSave={(asset) => {
          setAssets([...assets, asset]);
          toast.success('Asset added successfully');
          setShowAddModal(false);
        }}
      />

      <AssignModal
        show={showAssignModal}
        onHide={() => setShowAssignModal(false)}
        asset={selectedAsset}
        onConfirm={(data) => {
          setAssets(assets.map(a => 
            a.tag === selectedAsset.tag 
              ? { 
                  ...a, 
                  status: 'active', 
                  custodian: data.staff,
                  location: data.location
                }
              : a
          ));
          toast.success(`Asset assigned to ${data.staffName}`);
          setShowAssignModal(false);
        }}
      />

      <TransferModal
        show={showTransferModal}
        onHide={() => setShowTransferModal(false)}
        asset={selectedAsset}
        onConfirm={(data) => {
          setAssets(assets.map(a => 
            a.tag === selectedAsset.tag 
              ? { 
                  ...a, 
                  location: data.destination,
                  locationType: data.locationType,
                  history: [
                    { where: data.destination, when: 'Today', by: 'Admin Kuria' },
                    ...a.history
                  ]
                }
              : a
          ));
          toast.success(`Asset moved to ${data.destination}`);
          setShowTransferModal(false);
        }}
      />

      <MaintenanceModal
        show={showMaintenanceModal}
        onHide={() => setShowMaintenanceModal(false)}
        asset={selectedAsset}
        onConfirm={(data) => {
          if (selectedAsset?.status === 'missing') {
            setAssets(assets.map(a => 
              a.tag === selectedAsset.tag 
                ? { ...a, status: 'missing' }
                : a
            ));
            toast.warning('Missing asset report submitted');
          } else {
            setAssets(assets.map(a => 
              a.tag === selectedAsset.tag 
                ? { ...a, status: 'repair' }
                : a
            ));
            toast.info('Maintenance report submitted');
          }
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

      <OtherAssetDetailModal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        asset={selectedAsset}
        onViewMap={handleViewOnMap}
        onAssign={handleAssign}
        onTransfer={handleTransfer}
        onReport={handleMaintenance}
      />

      <GlobalSearchModal
        show={showSearchModal}
        onHide={() => setShowSearchModal(false)}
      />
    </div>
  );
};

export default OtherAssets;