import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Badge, Tabs, Tab } from 'react-bootstrap';
import { 
  FiMonitor, FiUserCheck, FiBox, FiTool, FiDownload, FiPlus,
  FiEye, FiMapPin, FiMove, FiUserPlus, FiCircle,
  FiAlertCircle, FiHardDrive, FiCpu
} from 'react-icons/fi';
import { toast } from 'react-toastify';

// Import modals
import AddAssetModal from '../components/modals/AddAssetModal';
import AssignModal from '../components/modals/AssignModal';
import TransferModal from '../components/modals/TransferModal';
import MaintenanceModal from '../components/modals/MaintenanceModal';
import AssetMapModal from '../components/modals/AssetMapModal';
import GlobalSearchModal from '../components/modals/GlobalSearchModal';
import LaptopDetailModal from '../components/modals/LaptopDetailModal';

const Laptops = () => {
  // State management
  const [activeTab, setActiveTab] = useState('all');
  const [activeBrand, setActiveBrand] = useState('all');
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
    total: 32,
    assigned: 26,
    inStock: 4,
    underRepair: 2
  };

  // Laptops data
  const [laptops, setLaptops] = useState([
    {
      tag: 'SV-L-001',
      serial: '5CD22301GHX',
      brand: 'dell',
      model: 'Dell XPS 15 9530',
      specs: 'i7-13700H · 16GB · 512GB',
      assignee: 'Christine Kamau',
      assigneeInitials: 'CK',
      dept: 'Finance',
      location: 'Finance Dept.',
      locationType: 'floor',
      issued: '05 Jan 2025',
      status: 'active',
      condition: 'Excellent',
      warranty: 'Jan 2028',
      value: 185000,
      history: [
        { where: 'Finance Dept.', when: '05 Jan 2025', by: 'Admin Kuria' },
        { where: 'Stores Room A', when: '03 Jan 2025', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-L-002',
      serial: '5CD14X8K9P',
      brand: 'hp',
      model: 'HP EliteBook 840 G9',
      specs: 'i5-1235U · 8GB · 256GB',
      assignee: 'David Onyango',
      assigneeInitials: 'DO',
      dept: 'ICT',
      location: 'ICT Dept.',
      locationType: 'floor',
      issued: '12 Jan 2025',
      status: 'active',
      condition: 'Good',
      warranty: 'Jan 2027',
      value: 120000,
      history: [
        { where: 'ICT Dept.', when: '12 Jan 2025', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-L-003',
      serial: 'PF4X92VKL1',
      brand: 'lenovo',
      model: 'Lenovo ThinkPad X1 Carbon',
      specs: 'i7-1260P · 16GB · 1TB',
      assignee: 'Grace Nyambura',
      assigneeInitials: 'GN',
      dept: 'Admin',
      location: 'Admin Office',
      locationType: 'floor',
      issued: '20 Jan 2025',
      status: 'active',
      condition: 'Excellent',
      warranty: 'Jan 2028',
      value: 210000,
      history: [
        { where: 'Admin Office', when: '20 Jan 2025', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-L-004',
      serial: 'C02X9ABCDE12',
      brand: 'macbook',
      model: 'Apple MacBook Pro 14"',
      specs: 'Apple M3 · 16GB · 512GB',
      assignee: 'Ruth Kiplagat',
      assigneeInitials: 'RK',
      dept: 'Design',
      location: 'Design Room',
      locationType: 'floor',
      issued: '01 Feb 2025',
      status: 'active',
      condition: 'Excellent',
      warranty: 'Feb 2028',
      value: 250000,
      history: [
        { where: 'Design Room', when: '01 Feb 2025', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-L-005',
      serial: 'BIOS-7R2K9XA',
      brand: 'dell',
      model: 'Dell Latitude 5530',
      specs: 'i5-1235U · 8GB · 256GB',
      assignee: null,
      dept: null,
      location: 'Stores Room A',
      locationType: 'stores',
      issued: null,
      status: 'stock',
      condition: 'New',
      warranty: 'Jan 2027',
      value: 85000,
      history: [
        { where: 'Stores Room A', when: '15 Jan 2026', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-L-006',
      serial: '5CD23X71MN',
      brand: 'hp',
      model: 'HP EliteBook 650 G9',
      specs: 'i5-1235U · 8GB · 512GB',
      assignee: 'James Otieno',
      assigneeInitials: 'JO',
      dept: 'ICT',
      location: 'ICT Workshop',
      locationType: 'offsite',
      issued: '15 Feb 2025',
      status: 'repair',
      condition: 'Fair — Motherboard Fault',
      warranty: 'Feb 2027',
      value: 105000,
      history: [
        { where: 'ICT Workshop', when: '08 Mar 2026', by: 'Admin Kuria' },
        { where: 'ICT Dept.', when: '15 Feb 2025', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-L-007',
      serial: 'PF4K02RYL9',
      brand: 'lenovo',
      model: 'Lenovo IdeaPad 5 Pro',
      specs: 'Ryzen 5 6600H · 8GB · 512GB',
      assignee: 'Brian Muriuki',
      assigneeInitials: 'BM',
      dept: 'Logistics',
      location: 'Field / Kisumu',
      locationType: 'offsite',
      issued: '01 Mar 2025',
      status: 'active',
      condition: 'Good',
      warranty: 'Mar 2027',
      value: 95000,
      history: [
        { where: 'Field / Kisumu', when: '01 Mar 2025', by: 'Admin Kuria' },
        { where: 'Stores Room A', when: '28 Feb 2025', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-L-008',
      serial: '5CD25X09QM',
      brand: 'hp',
      model: 'HP ProBook 450 G9',
      specs: 'i5-1235U · 8GB · 256GB',
      assignee: null,
      dept: null,
      location: 'Stores Room B',
      locationType: 'stores',
      issued: null,
      status: 'stock',
      condition: 'New',
      warranty: 'Jan 2027',
      value: 78000,
      history: [
        { where: 'Stores Room B', when: '20 Jan 2026', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-L-010',
      serial: 'HPE840-GH-01',
      brand: 'dell',
      model: 'Dell Latitude 5540 (Ghana)',
      specs: 'i5-1235U · 8GB · 256GB',
      assignee: 'Kwame Asante',
      assigneeInitials: 'KA',
      dept: 'Country Rep.',
      location: 'Accra, Ghana',
      locationType: 'offsite',
      issued: '05 Mar 2025',
      status: 'active',
      condition: 'Good',
      warranty: 'Mar 2027',
      value: 110000,
      history: [
        { where: 'Accra, Ghana', when: '05 Mar 2025', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-L-012',
      serial: 'DXPS13-ZW-01',
      brand: 'dell',
      model: 'Dell XPS 13 (Zimbabwe)',
      specs: 'i5-1235U · 16GB · 512GB',
      assignee: 'Tendai Moyo',
      assigneeInitials: 'TM',
      dept: 'Country Rep.',
      location: 'Harare, Zimbabwe',
      locationType: 'offsite',
      issued: '20 Feb 2025',
      status: 'active',
      condition: 'Good',
      warranty: 'Feb 2027',
      value: 145000,
      history: [
        { where: 'Harare, Zimbabwe', when: '20 Feb 2025', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-L-014',
      serial: 'DXPS16-USA-01',
      brand: 'dell',
      model: 'Dell XPS 15 (USA)',
      specs: 'i7-13700H · 32GB · 1TB',
      assignee: 'Sarah Adams',
      assigneeInitials: 'SA',
      dept: 'Partnerships',
      location: 'Washington DC, USA',
      locationType: 'offsite',
      issued: '15 Jan 2026',
      status: 'active',
      condition: 'Excellent',
      warranty: 'Jan 2029',
      value: 210000,
      history: [
        { where: 'Washington DC, USA', when: '15 Jan 2026', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-L-015',
      serial: 'C02MBPUSA2026',
      brand: 'macbook',
      model: 'MacBook Pro 16" (USA)',
      specs: 'Apple M3 Pro · 36GB · 1TB',
      assignee: 'Robert Parks',
      assigneeInitials: 'RP',
      dept: 'Director',
      location: 'Washington DC, USA',
      locationType: 'offsite',
      issued: '10 Jan 2026',
      status: 'active',
      condition: 'Excellent',
      warranty: 'Jan 2029',
      value: 320000,
      history: [
        { where: 'Washington DC, USA', when: '10 Jan 2026', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-L-021',
      serial: 'BIOS-2X7K9NM',
      brand: 'dell',
      model: 'Dell Inspiron 15',
      specs: 'i5-1135G7 · 8GB · 256GB',
      assignee: null,
      dept: null,
      location: 'External Vendor',
      locationType: 'offsite',
      issued: null,
      status: 'repair',
      condition: 'Screen replacement',
      warranty: 'Expired',
      value: 65000,
      history: [
        { where: 'External Vendor', when: '10 Mar 2026', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-L-000',
      serial: 'CNX123456',
      brand: 'hp',
      model: 'HP Compaq 6200 Pro',
      specs: 'i3-2100 · 4GB · 250GB',
      assignee: null,
      dept: null,
      location: 'Disposed',
      locationType: 'offsite',
      issued: null,
      status: 'retired',
      condition: 'End of life',
      warranty: 'Expired',
      value: 0,
      history: [
        { where: 'Disposed', when: 'Jan 2024', by: 'Admin Kuria' }
      ]
    }
  ]);

  // Brand filter options
  const brandOptions = [
    { id: 'all', label: 'All', count: 32 },
    { id: 'dell', label: 'Dell', count: 14, color: '#007DB8' },
    { id: 'hp', label: 'HP', count: 10, color: '#0096D6' },
    { id: 'lenovo', label: 'Lenovo', count: 5, color: '#E2231A' },
    { id: 'macbook', label: 'MacBook', count: 3, color: '#555555' }
  ];

  // Filter laptops based on active tab, brand, and search
  const filteredLaptops = useMemo(() => {
    let filtered = laptops;

    // Filter by tab
    if (activeTab === 'stock') {
      filtered = filtered.filter(l => l.status === 'stock');
    } else if (activeTab === 'repair') {
      filtered = filtered.filter(l => l.status === 'repair');
    } else if (activeTab === 'retired') {
      filtered = filtered.filter(l => l.status === 'retired');
    }

    // Filter by brand
    if (activeBrand !== 'all') {
      filtered = filtered.filter(l => l.brand === activeBrand);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(l =>
        l.tag.toLowerCase().includes(query) ||
        l.serial.toLowerCase().includes(query) ||
        l.model.toLowerCase().includes(query) ||
        l.specs.toLowerCase().includes(query) ||
        (l.assignee && l.assignee.toLowerCase().includes(query)) ||
        l.location.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [laptops, activeTab, activeBrand, searchQuery]);

  // Get stock laptops
  const stockLaptops = useMemo(() => {
    return laptops.filter(l => l.status === 'stock');
  }, [laptops]);

  // Get repair laptops
  const repairLaptops = useMemo(() => {
    return laptops.filter(l => l.status === 'repair');
  }, [laptops]);

  // Get retired laptops
  const retiredLaptops = useMemo(() => {
    return laptops.filter(l => l.status === 'retired');
  }, [laptops]);

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      active: { className: 'badge-active', text: 'Active' },
      stock: { className: 'badge-stock', text: 'In Stock' },
      repair: { className: 'badge-repair', text: 'Repair' },
      retired: { className: 'badge-retired', text: 'Retired' },
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

  // Get brand color
  const getBrandColor = (brand) => {
    const colors = {
      dell: '#007DB8',
      hp: '#0096D6',
      lenovo: '#E2231A',
      macbook: '#555555'
    };
    return colors[brand] || '#6B8FAE';
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
    toast.info('Exporting laptops register...');
  };

  const handleBrandFilter = (brandId) => {
    setActiveBrand(brandId);
    // Update chip active state
    document.querySelectorAll('.brand-chip').forEach(chip => {
      chip.classList.remove('on');
    });
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

  // Brand Chip Component
  const BrandChip = ({ brand, active, onClick }) => (
    <Button
      variant="link"
      className={`chip brand-chip ${active ? 'on' : ''}`}
      onClick={() => onClick(brand.id)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
    >
      {brand.id !== 'all' && (
        <FiCircle style={{ color: brand.color, fontSize: '8px' }} />
      )}
      {brand.label} ({brand.count})
    </Button>
  );

  // Render all laptops table
  const renderAllLaptops = () => (
    <div className="table-responsive">
      <Table className="custom-table" id="tbl-lall">
        <thead>
          <tr>
            <th>Asset Tag</th>
            <th>Mfr. Serial</th>
            <th>Make / Model</th>
            <th>Specs</th>
            <th>Assigned To</th>
            <th>Dept.</th>
            <th>Location</th>
            <th>Issued</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredLaptops.map(laptop => (
            <tr key={laptop.tag} data-brand={laptop.brand}>
              <td className="mono">{laptop.tag}</td>
              <td className="mono">{laptop.serial}</td>
              <td>{laptop.model}</td>
              <td className="specs-cell">{laptop.specs}</td>
              <td>
                {laptop.assignee ? (
                  <div className="assignee">
                    <div className="av-sm">{laptop.assigneeInitials}</div>
                    <span>{laptop.assignee}</span>
                  </div>
                ) : '—'}
              </td>
              <td>{laptop.dept || '—'}</td>
              <td>{getLocationBadge(laptop.location, laptop.locationType)}</td>
              <td>{laptop.issued || '—'}</td>
              <td>
                <span className={`badge ${getStatusBadge(laptop.status).className}`}>
                  {getStatusBadge(laptop.status).text}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <Button 
                    variant="link" 
                    className="act-btn" 
                    onClick={() => handleViewDetail(laptop)}
                    title="Details"
                  >
                    <FiEye />
                  </Button>
                  <Button 
                    variant="link" 
                    className="act-btn map-btn" 
                    onClick={() => handleViewOnMap(laptop)}
                    title="View on Map"
                  >
                    <FiMapPin />
                  </Button>
                  <Button 
                    variant="link" 
                    className="act-btn" 
                    onClick={() => handleTransfer(laptop)}
                    title="Move"
                  >
                    <FiMove />
                  </Button>
                  {laptop.status === 'repair' && (
                    <Button 
                      variant="link" 
                      className="act-btn" 
                      onClick={() => handleMaintenance(laptop)}
                      title="Report Issue"
                    >
                      <FiTool />
                    </Button>
                  )}
                  {laptop.status === 'stock' && (
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="btn-assign"
                      onClick={() => handleAssign(laptop)}
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

  // Render stock laptops
  const renderStock = () => (
    <div className="table-responsive">
      <Table className="custom-table">
        <thead>
          <tr>
            <th>Tag</th>
            <th>Model</th>
            <th>Specs</th>
            <th>Location</th>
            <th>Condition</th>
            <th>Received</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {stockLaptops.map(laptop => (
            <tr key={laptop.tag}>
              <td className="mono">{laptop.tag}</td>
              <td>{laptop.model}</td>
              <td className="specs-cell">{laptop.specs}</td>
              <td>{getLocationBadge(laptop.location, laptop.locationType)}</td>
              <td><span className="badge badge-new">{laptop.condition}</span></td>
              <td>{laptop.history[0]?.when || '—'}</td>
              <td>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="btn-assign"
                  onClick={() => handleAssign(laptop)}
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

  // Render repair laptops
  const renderRepair = () => (
    <>
      <div className="alert-bar warn">
        <FiAlertCircle />
        <div>{repairLaptops.length} laptops under repair — expected back by 25 Mar 2026</div>
      </div>
      <div className="table-responsive">
        <Table className="custom-table">
          <thead>
            <tr>
              <th>Tag</th>
              <th>Model</th>
              <th>Serial</th>
              <th>Issue</th>
              <th>Repair Location</th>
              <th>Sent</th>
              <th>Est. Return</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {repairLaptops.map(laptop => (
              <tr key={laptop.tag}>
                <td className="mono">{laptop.tag}</td>
                <td>{laptop.model}</td>
                <td className="mono">{laptop.serial}</td>
                <td>{laptop.condition}</td>
                <td>{getLocationBadge(laptop.location, laptop.locationType)}</td>
                <td>{laptop.history[0]?.when || '—'}</td>
                <td>25 Mar 2026</td>
                <td>
                  <Button 
                    variant="link" 
                    className="act-btn" 
                    onClick={() => handleMaintenance(laptop)}
                  >
                    <FiTool />
                  </Button>
                  <Button 
                    variant="link" 
                    className="act-btn" 
                    onClick={() => handleViewDetail(laptop)}
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

  // Render retired laptops
  const renderRetired = () => (
    <div className="table-responsive">
      <Table className="custom-table">
        <thead>
          <tr>
            <th>Tag</th>
            <th>Model</th>
            <th>Serial</th>
            <th>Reason</th>
            <th>Date Retired</th>
            <th>Authorized By</th>
            <th>Disposal</th>
          </tr>
        </thead>
        <tbody>
          {retiredLaptops.map(laptop => (
            <tr key={laptop.tag}>
              <td className="mono">{laptop.tag}</td>
              <td>{laptop.model}</td>
              <td className="mono">{laptop.serial}</td>
              <td>{laptop.condition}</td>
              <td>{laptop.history[0]?.when || '—'}</td>
              <td>IT Manager</td>
              <td><span className="badge badge-retired">Written Off</span></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );

  return (
    <div className="laptops-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Laptops</h1>
          <p>Serial number index — 32 laptops tracked across Nairobi, Kisumu, Accra, Harare, Washington DC</p>
        </div>
        <div className="page-actions">
          <Button variant="secondary" className="btn-outline" onClick={handleExport}>
            <FiDownload /> Export
          </Button>
          <Button variant="primary" className="btn-primary-custom" onClick={handleAddAsset}>
            <FiPlus /> Add Laptop
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="g-3 mb-4">
        <Col xs={6} xl={3}>
          <StatCard icon={FiMonitor} value={stats.total} label="Total Laptops" color="g" />
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

      {/* Brand Filter Chips */}
      <div className="chip-row mb-3">
        {brandOptions.map(brand => (
          <BrandChip
            key={brand.id}
            brand={brand}
            active={activeBrand === brand.id}
            onClick={handleBrandFilter}
          />
        ))}
      </div>

      {/* Main Card with Tabs */}
      <Card className="data-card">
        <Card.Header className="dc-header">
          <div className="tab-bar">
            <Button 
              variant="link" 
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              Full Registry (32)
            </Button>
            <Button 
              variant="link" 
              className={`tab-btn ${activeTab === 'stock' ? 'active' : ''}`}
              onClick={() => setActiveTab('stock')}
            >
              In Stock ({stockLaptops.length})
            </Button>
            <Button 
              variant="link" 
              className={`tab-btn ${activeTab === 'repair' ? 'active' : ''}`}
              onClick={() => setActiveTab('repair')}
            >
              Under Repair ({repairLaptops.length})
            </Button>
            <Button 
              variant="link" 
              className={`tab-btn ${activeTab === 'retired' ? 'active' : ''}`}
              onClick={() => setActiveTab('retired')}
            >
              Retired ({retiredLaptops.length})
            </Button>
          </div>
          <div className="dc-actions">
            <Form.Control
              type="text"
              placeholder="Search serial, model, user…"
              className="table-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          {activeTab === 'all' && renderAllLaptops()}
          {activeTab === 'stock' && renderStock()}
          {activeTab === 'repair' && renderRepair()}
          {activeTab === 'retired' && renderRetired()}
        </Card.Body>
      </Card>

      {/* Modals */}
      <AddAssetModal 
        show={showAddModal} 
        onHide={() => setShowAddModal(false)}
        category="L"
        onSave={(asset) => {
          setLaptops([...laptops, asset]);
          toast.success('Laptop added successfully');
          setShowAddModal(false);
        }}
      />

      <AssignModal
        show={showAssignModal}
        onHide={() => setShowAssignModal(false)}
        asset={selectedAsset}
        onConfirm={(data) => {
          setLaptops(laptops.map(l => 
            l.tag === selectedAsset.tag 
              ? { 
                  ...l, 
                  status: 'active', 
                  assignee: data.staff,
                  assigneeInitials: data.initials,
                  dept: data.dept, 
                  location: data.location,
                  issued: data.issueDate
                }
              : l
          ));
          toast.success(`Laptop assigned to ${data.staffName}`);
          setShowAssignModal(false);
        }}
      />

      <TransferModal
        show={showTransferModal}
        onHide={() => setShowTransferModal(false)}
        asset={selectedAsset}
        onConfirm={(data) => {
          setLaptops(laptops.map(l => 
            l.tag === selectedAsset.tag 
              ? { 
                  ...l, 
                  location: data.destination,
                  locationType: data.locationType,
                  history: [
                    { where: data.destination, when: 'Today', by: 'Admin Kuria' },
                    ...l.history
                  ]
                }
              : l
          ));
          toast.success(`Laptop moved to ${data.destination}`);
          setShowTransferModal(false);
        }}
      />

      <MaintenanceModal
        show={showMaintenanceModal}
        onHide={() => setShowMaintenanceModal(false)}
        asset={selectedAsset}
        onConfirm={(data) => {
          setLaptops(laptops.map(l => 
            l.tag === selectedAsset.tag 
              ? { ...l, status: 'repair', condition: data.issue }
              : l
          ));
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

      <LaptopDetailModal
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

export default Laptops;