import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Badge, Tabs, Tab } from 'react-bootstrap';
import { 
  FiTablet, FiUserCheck, FiBox, FiTool, FiDownload, FiPlus, 
  FiEye, FiMapPin, FiMove, FiTool as FiWrench, FiUserPlus,
  FiSearch, FiChevronRight, FiAlertCircle, FiPackage
} from 'react-icons/fi';
import { toast } from 'react-toastify';

// Import modals (reuse from dashboard)
import AddAssetModal from '../components/modals/AddAssetModal';
import AssignModal from '../components/modals/AssignModal';
import TransferModal from '../components/modals/TransferModal';
import MaintenanceModal from '../components/modals/MaintenanceModal';
import AssetMapModal from '../components/modals/AssetMapModal';
import GlobalSearchModal from '../components/modals/GlobalSearchModal';
import DeviceDetailModal from '../components/modals/DeviceDetailModal';

const Tablets = () => {
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

  // Statistics
  const stats = {
    total: 48,
    assigned: 39,
    inStock: 7,
    underRepair: 2
  };

  // Tablets data
  const [tablets, setTablets] = useState([
    {
      tag: 'SV-T-001',
      name: 'iPad Pro 12.9" (6th Gen)',
      serial: 'DMPT7F4R2Q',
      assignee: 'John Maina',
      assigneeInitials: 'JM',
      dept: 'ICT',
      location: 'ICT Dept.',
      locationType: 'floor',
      issued: '12 Jan 2025',
      accessories: ['Pencil', 'Case', 'Charger'],
      status: 'active',
      condition: 'Excellent',
      value: 'KES 145,000',
      history: [
        { where: 'ICT Dept.', when: '12 Jan 2025', by: 'Admin Kuria' },
        { where: 'Stores Room A', when: '10 Jan 2025', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-T-002',
      name: 'iPad Air 5th Gen',
      serial: 'F9VKL23RMX',
      assignee: 'Alice Njeri',
      assigneeInitials: 'AN',
      dept: 'Finance',
      location: 'Finance Dept.',
      locationType: 'floor',
      issued: '03 Feb 2025',
      accessories: ['Case', 'Charger'],
      status: 'active',
      condition: 'Good',
      value: 'KES 95,000',
      history: [
        { where: 'Finance Dept.', when: '03 Feb 2025', by: 'Admin Kuria' },
        { where: 'Stores Room A', when: '01 Feb 2025', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-T-003',
      name: 'Samsung Tab S9 256GB',
      serial: 'R9GMN42LXP',
      assignee: 'Peter Kamau',
      assigneeInitials: 'PK',
      dept: 'Admin',
      location: 'Admin Office',
      locationType: 'floor',
      issued: '15 Feb 2025',
      accessories: ['Keyboard', 'Charger'],
      status: 'active',
      condition: 'Good',
      value: 'KES 88,000',
      history: [
        { where: 'Admin Office', when: '15 Feb 2025', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-T-004',
      name: 'iPad Air 5th Gen (64GB)',
      serial: 'GXRN112WEV',
      assignee: null,
      dept: null,
      location: 'Stores Room A',
      locationType: 'stores',
      issued: null,
      accessories: ['Case', 'Charger'],
      status: 'stock',
      condition: 'New',
      value: 'KES 82,000',
      history: [
        { where: 'Stores Room A', when: '10 Jan 2026', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-T-005',
      name: 'iPad Mini 6th Gen',
      serial: 'HKXQT22NJ9',
      assignee: 'Mary Wanjiku',
      assigneeInitials: 'MW',
      dept: 'HR',
      location: 'ICT Workshop',
      locationType: 'offsite',
      issued: '20 Mar 2025',
      accessories: ['Case'],
      status: 'repair',
      condition: 'Fair — Cracked Screen',
      value: 'KES 75,000',
      history: [
        { where: 'ICT Workshop', when: '08 Mar 2026', by: 'Admin Kuria' },
        { where: 'HR Office', when: '20 Mar 2025', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-T-006',
      name: 'Samsung Tab A9+ 128GB',
      serial: 'TXP88LP0MZ',
      assignee: 'Samuel Odhiambo',
      assigneeInitials: 'SO',
      dept: 'Logistics',
      location: 'Field / Kisumu',
      locationType: 'offsite',
      issued: '01 Apr 2025',
      accessories: ['Charger'],
      status: 'active',
      condition: 'Good',
      value: 'KES 62,000',
      history: [
        { where: 'Field / Kisumu', when: '01 Apr 2025', by: 'Admin Kuria' },
        { where: 'Stores Room A', when: '30 Mar 2025', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-T-007',
      name: 'iPad Pro 11" M2',
      serial: 'QX3YK91RLV',
      assignee: 'Faith Ndung\'u',
      assigneeInitials: 'FN',
      dept: 'Admin',
      location: 'Admin Office',
      locationType: 'floor',
      issued: '10 Apr 2025',
      accessories: ['Pencil', 'Keyboard', 'Case'],
      status: 'active',
      condition: 'Excellent',
      value: 'KES 128,000',
      history: [
        { where: 'Admin Office', when: '10 Apr 2025', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-T-008',
      name: 'Samsung Tab A7',
      serial: 'TXPKX29BN4',
      assignee: null,
      dept: null,
      location: 'Stores Room A',
      locationType: 'stores',
      issued: null,
      accessories: ['Charger'],
      status: 'stock',
      condition: 'Good',
      value: 'KES 45,000',
      history: [
        { where: 'Stores Room A', when: '15 Jan 2026', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-T-009',
      name: 'iPad Mini 6th Gen',
      serial: 'MKXX9021VQ',
      assignee: null,
      dept: null,
      location: 'Stores Room B',
      locationType: 'stores',
      issued: null,
      accessories: ['Case', 'Charger'],
      status: 'stock',
      condition: 'New',
      value: 'KES 71,000',
      history: [
        { where: 'Stores Room B', when: '20 Jan 2026', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-T-010',
      name: 'iPad Air 5th Gen (Ghana)',
      serial: 'IPAIR5GH-01',
      assignee: 'Kwame Asante',
      assigneeInitials: 'KA',
      dept: 'Country Rep.',
      location: 'Accra, Ghana',
      locationType: 'offsite',
      issued: '05 Mar 2025',
      accessories: ['Charger'],
      status: 'active',
      condition: 'Good',
      value: 'KES 89,000',
      history: [
        { where: 'Accra, Ghana', when: '05 Mar 2025', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-T-011',
      name: 'Samsung Tab S8 (Zimbabwe)',
      serial: 'SAMTS8-ZW-01',
      assignee: 'Tendai Moyo',
      assigneeInitials: 'TM',
      dept: 'Country Rep.',
      location: 'Harare, Zimbabwe',
      locationType: 'offsite',
      issued: '20 Feb 2025',
      accessories: ['Charger'],
      status: 'active',
      condition: 'Good',
      value: 'KES 92,000',
      history: [
        { where: 'Harare, Zimbabwe', when: '20 Feb 2025', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-T-012',
      name: 'iPad Pro 11" (USA)',
      serial: 'IPPR11-USA-01',
      assignee: 'Robert Parks',
      assigneeInitials: 'RP',
      dept: 'Director',
      location: 'Washington DC, USA',
      locationType: 'offsite',
      issued: '10 Jan 2026',
      accessories: ['Case', 'Charger'],
      status: 'active',
      condition: 'Excellent',
      value: 'KES 135,000',
      history: [
        { where: 'Washington DC, USA', when: '10 Jan 2026', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-T-019',
      name: 'iPad Air 5th Gen',
      serial: 'F9PQT11LMN',
      assignee: null,
      dept: null,
      location: 'ICT Workshop',
      locationType: 'offsite',
      issued: null,
      accessories: ['Case'],
      status: 'repair',
      condition: 'Battery fault',
      value: 'KES 86,000',
      history: [
        { where: 'ICT Workshop', when: '10 Mar 2026', by: 'Admin Kuria' }
      ]
    }
  ]);

  // Accessories data
  const [accessories, setAccessories] = useState([
    { code: 'SV-A-001', name: 'Apple Pencil 2nd Gen', total: 12, issued: 9, inStock: 3, location: 'Stores Room A', locationType: 'stores', linkedTo: 'iPad Pro units' },
    { code: 'SV-A-002', name: 'USB-C Charging Cable', total: 40, issued: 35, inStock: 5, location: 'Stores Room A', locationType: 'stores', linkedTo: 'Various' },
    { code: 'SV-A-003', name: 'Tablet Keyboard Case', total: 8, issued: 6, inStock: 2, location: 'Stores Room B', locationType: 'stores', linkedTo: 'iPad Pro / Tab S9' },
    { code: 'SV-A-004', name: '65W USB-C Charger', total: 20, issued: 16, inStock: 2, repair: 2, location: 'ICT Workshop', locationType: 'offsite', linkedTo: 'Various' },
    { code: 'SV-A-005', name: 'Laptop Bags', total: 15, issued: 13, inStock: 2, location: 'Stores Room A', locationType: 'stores', linkedTo: 'Laptop users' },
    { code: 'SV-A-006', name: 'HDMI Cables (2m)', total: 10, issued: 8, inStock: 2, location: 'Stores Room A', locationType: 'stores', linkedTo: 'Board rooms / laptops' }
  ]);

  // Filter tablets based on active tab and search
  const filteredTablets = useMemo(() => {
    let filtered = tablets;
    
    // Filter by tab
    if (activeTab === 'stock') {
      filtered = filtered.filter(t => t.status === 'stock');
    } else if (activeTab === 'repair') {
      filtered = filtered.filter(t => t.status === 'repair');
    } else if (activeTab === 'accessories') {
      return []; // Handled separately
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.tag.toLowerCase().includes(query) ||
        t.name.toLowerCase().includes(query) ||
        t.serial.toLowerCase().includes(query) ||
        (t.assignee && t.assignee.toLowerCase().includes(query)) ||
        t.location.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [tablets, activeTab, searchQuery]);

  // Filter accessories
  const filteredAccessories = useMemo(() => {
    if (!searchQuery) return accessories;
    
    const query = searchQuery.toLowerCase();
    return accessories.filter(a =>
      a.code.toLowerCase().includes(query) ||
      a.name.toLowerCase().includes(query) ||
      a.location.toLowerCase().includes(query)
    );
  }, [accessories, searchQuery]);

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      active: { className: 'badge-active', text: 'Active' },
      stock: { className: 'badge-stock', text: 'In Stock' },
      repair: { className: 'badge-repair', text: 'Repair' },
      missing: { className: 'badge-missing', text: 'Missing' }
    };
    return badges[status] || badges.active;
  };

  // Get location badge
  const getLocationBadge = (location, type) => {
    const classes = {
      floor: 'loc-badge floor',
      stores: 'loc-badge stores',
      offsite: 'loc-badge offsite',
      missing: 'loc-badge missing'
    };
    return <span className={classes[type] || 'loc-badge floor'}>{location}</span>;
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
    toast.info('Exporting tablets register...');
  };

  // Stat Card Component
  const StatCard = ({ icon: Icon, value, label, color }) => (
    <Card className="stat-card">
      <Card.Body>
        <div className={`stat-icon si-${color}`}>
          <Icon />
        </div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </Card.Body>
    </Card>
  );

  // Render all devices table
  const renderAllDevices = () => (
    <div className="table-responsive">
      <Table className="custom-table" id="tbl-tall">
        <thead>
          <tr>
            <th>Asset Tag</th>
            <th>Device</th>
            <th>Serial No.</th>
            <th>Assigned To</th>
            <th>Dept.</th>
            <th>Location</th>
            <th>Issued</th>
            <th>Accessories</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTablets.map(tablet => (
            <tr key={tablet.tag}>
              <td className="mono">{tablet.tag}</td>
              <td>{tablet.name}</td>
              <td className="mono">{tablet.serial}</td>
              <td>
                {tablet.assignee ? (
                  <div className="assignee">
                    <div className="av-sm">{tablet.assigneeInitials}</div>
                    <span>{tablet.assignee}</span>
                  </div>
                ) : '—'}
              </td>
              <td>{tablet.dept || '—'}</td>
              <td>{getLocationBadge(tablet.location, tablet.locationType)}</td>
              <td>{tablet.issued || '—'}</td>
              <td>
                <div className="accessory-badges">
                  {tablet.accessories.map((acc, idx) => (
                    <Badge key={idx} bg="secondary" className="badge-accessory">{acc}</Badge>
                  ))}
                </div>
              </td>
              <td>
                <span className={`badge ${getStatusBadge(tablet.status).className}`}>
                  {getStatusBadge(tablet.status).text}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <Button 
                    variant="link" 
                    className="act-btn" 
                    onClick={() => handleViewDetail(tablet)}
                    title="Details"
                  >
                    <FiEye />
                  </Button>
                  <Button 
                    variant="link" 
                    className="act-btn map-btn" 
                    onClick={() => handleViewOnMap(tablet)}
                    title="View on Map"
                  >
                    <FiMapPin />
                  </Button>
                  <Button 
                    variant="link" 
                    className="act-btn" 
                    onClick={() => handleTransfer(tablet)}
                    title="Move"
                  >
                    <FiMove />
                  </Button>
                  <Button 
                    variant="link" 
                    className="act-btn" 
                    onClick={() => handleMaintenance(tablet)}
                    title="Report Issue"
                  >
                    <FiWrench />
                  </Button>
                  {tablet.status === 'stock' && (
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="btn-assign"
                      onClick={() => handleAssign(tablet)}
                    >
                      <FiUserPlus /> Assign
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

  // Render stock devices
  const renderStock = () => (
    <div className="table-responsive">
      <Table className="custom-table">
        <thead>
          <tr>
            <th>Tag</th>
            <th>Device</th>
            <th>Serial</th>
            <th>Location</th>
            <th>Condition</th>
            <th>Received</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredTablets.filter(t => t.status === 'stock').map(tablet => (
            <tr key={tablet.tag}>
              <td className="mono">{tablet.tag}</td>
              <td>{tablet.name}</td>
              <td className="mono">{tablet.serial}</td>
              <td>{getLocationBadge(tablet.location, tablet.locationType)}</td>
              <td><span className="badge badge-new">{tablet.condition}</span></td>
              <td>{tablet.history[0]?.when || '—'}</td>
              <td>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="btn-assign"
                  onClick={() => handleAssign(tablet)}
                >
                  <FiUserPlus /> Assign
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );

  // Render repair devices
  const renderRepair = () => (
    <>
      <div className="alert-bar warn">
        <FiAlertCircle />
        <div>2 devices under repair at ICT Workshop — expected return 22 Mar 2026</div>
      </div>
      <div className="table-responsive">
        <Table className="custom-table">
          <thead>
            <tr>
              <th>Tag</th>
              <th>Device</th>
              <th>Serial</th>
              <th>Issue</th>
              <th>Repair Location</th>
              <th>Sent</th>
              <th>Est. Return</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTablets.filter(t => t.status === 'repair').map(tablet => (
              <tr key={tablet.tag}>
                <td className="mono">{tablet.tag}</td>
                <td>{tablet.name}</td>
                <td className="mono">{tablet.serial}</td>
                <td>{tablet.condition}</td>
                <td>{getLocationBadge(tablet.location, tablet.locationType)}</td>
                <td>{tablet.history[0]?.when || '—'}</td>
                <td>22 Mar 2026</td>
                <td>
                  <Button 
                    variant="link" 
                    className="act-btn" 
                    onClick={() => handleMaintenance(tablet)}
                  >
                    <FiWrench />
                  </Button>
                  <Button 
                    variant="link" 
                    className="act-btn" 
                    onClick={() => handleViewDetail(tablet)}
                  >
                    <FiEye />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );

  // Render accessories
  const renderAccessories = () => (
    <div className="table-responsive">
      <Table className="custom-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Accessory</th>
            <th>Total</th>
            <th>Issued</th>
            <th>In Stock</th>
            <th>Location</th>
            <th>Linked To</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredAccessories.map(acc => (
            <tr key={acc.code}>
              <td className="mono">{acc.code}</td>
              <td>{acc.name}</td>
              <td>{acc.total}</td>
              <td>{acc.issued}</td>
              <td>
                {acc.repair ? (
                  <span className="badge badge-repair">{acc.repair} repair</span>
                ) : (
                  <span className="badge badge-stock">{acc.inStock}</span>
                )}
              </td>
              <td>{getLocationBadge(acc.location, acc.locationType)}</td>
              <td>{acc.linkedTo}</td>
              <td>
                {acc.repair ? (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="btn-outline-sm"
                    onClick={() => handleMaintenance({ tag: acc.code, name: acc.name })}
                  >
                    <FiWrench /> Report
                  </Button>
                ) : (
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="btn-assign"
                    onClick={() => handleAssign({ tag: acc.code, name: acc.name })}
                  >
                    <FiUserPlus /> Issue
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );

  return (
    <div className="tablets-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Tablets & Accessories</h1>
          <p>Serial register — 48 devices, 12 staff, 5 worldwide offices</p>
        </div>
        <div className="page-actions">
          <Button variant="secondary" className="btn-outline" onClick={handleExport}>
            <FiDownload /> Export
          </Button>
          <Button variant="primary" className="btn-primary-custom" onClick={handleAddAsset}>
            <FiPlus /> Add Device
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="g-3 mb-4">
        <Col xs={6} xl={3}>
          <StatCard icon={FiTablet} value={stats.total} label="Total Tablets" color="g" />
        </Col>
        <Col xs={6} xl={3}>
          <StatCard icon={FiUserCheck} value={stats.assigned} label="Assigned" color="b" />
        </Col>
        <Col xs={6} xl={3}>
          <StatCard icon={FiBox} value={stats.inStock} label="In Stock" color="a" />
        </Col>
        <Col xs={6} xl={3}>
          <StatCard icon={FiTool} value={stats.underRepair} label="Under Repair" color="r" />
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
              All Devices (48)
            </Button>
            <Button 
              variant="link" 
              className={`tab-btn ${activeTab === 'stock' ? 'active' : ''}`}
              onClick={() => setActiveTab('stock')}
            >
              In Stock (7)
            </Button>
            <Button 
              variant="link" 
              className={`tab-btn ${activeTab === 'repair' ? 'active' : ''}`}
              onClick={() => setActiveTab('repair')}
            >
              Under Repair (2)
            </Button>
            <Button 
              variant="link" 
              className={`tab-btn ${activeTab === 'accessories' ? 'active' : ''}`}
              onClick={() => setActiveTab('accessories')}
            >
              Accessories
            </Button>
          </div>
          <div className="dc-actions">
            <Form.Control
              type="text"
              placeholder="Search serial, name, user…"
              className="table-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          {activeTab === 'all' && renderAllDevices()}
          {activeTab === 'stock' && renderStock()}
          {activeTab === 'repair' && renderRepair()}
          {activeTab === 'accessories' && renderAccessories()}
        </Card.Body>
      </Card>

      {/* Modals */}
      <AddAssetModal 
        show={showAddModal} 
        onHide={() => setShowAddModal(false)}
        category="T"
        onSave={(asset) => {
          setTablets([...tablets, asset]);
          toast.success('Device added successfully');
          setShowAddModal(false);
        }}
      />

      <AssignModal
        show={showAssignModal}
        onHide={() => setShowAssignModal(false)}
        asset={selectedAsset}
        onConfirm={(data) => {
          // Update asset in state
          setTablets(tablets.map(t => 
            t.tag === selectedAsset.tag 
              ? { ...t, status: 'active', assignee: data.staff, dept: data.dept, location: data.location }
              : t
          ));
          toast.success(`Device assigned to ${data.staffName}`);
          setShowAssignModal(false);
        }}
      />

      <TransferModal
        show={showTransferModal}
        onHide={() => setShowTransferModal(false)}
        asset={selectedAsset}
        onConfirm={(data) => {
          // Update asset location
          setTablets(tablets.map(t => 
            t.tag === selectedAsset.tag 
              ? { 
                  ...t, 
                  location: data.destination,
                  locationType: data.locationType,
                  history: [
                    { where: data.destination, when: 'Today', by: 'Admin Kuria' },
                    ...t.history
                  ]
                }
              : t
          ));
          toast.success(`Device moved to ${data.destination}`);
          setShowTransferModal(false);
        }}
      />

      <MaintenanceModal
        show={showMaintenanceModal}
        onHide={() => setShowMaintenanceModal(false)}
        asset={selectedAsset}
        onConfirm={(data) => {
          if (selectedAsset?.tag?.startsWith('SV-A')) {
            // Update accessory
            setAccessories(accessories.map(a => 
              a.code === selectedAsset.tag 
                ? { ...a, repair: (a.repair || 0) + 1, inStock: a.inStock - 1 }
                : a
            ));
          } else {
            // Update tablet
            setTablets(tablets.map(t => 
              t.tag === selectedAsset.tag 
                ? { ...t, status: 'repair', condition: data.issue }
                : t
            ));
          }
          toast.info('Maintenance report submitted');
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

      <DeviceDetailModal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        asset={selectedAsset}
        onViewMap={handleViewOnMap}
        onAssign={handleAssign}
        onTransfer={handleTransfer}
      />

      <GlobalSearchModal
        show={showSearchModal}
        onHide={() => setShowSearchModal(false)}
      />
    </div>
  );
};

export default Tablets;