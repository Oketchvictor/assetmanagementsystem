import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Badge } from 'react-bootstrap';
import { 
  FiGrid, FiHome, FiPackage, FiAlertCircle, FiDownload, FiPlus,
  FiEye, FiMapPin, FiMove, FiTool, FiPrinter, FiCoffee,
  FiUser, FiBarChart, FiMonitor, FiUsers, FiMap
} from 'react-icons/fi';
import { toast } from 'react-toastify';

// Import modals
import AddAssetModal from '../components/modals/AddAssetModal';
import TransferModal from '../components/modals/TransferModal';
import MaintenanceModal from '../components/modals/MaintenanceModal';
import AssetMapModal from '../components/modals/AssetMapModal';
import GlobalSearchModal from '../components/modals/GlobalSearchModal';
import RoomDetailModal from '../components/modals/RoomDetailModal';
import FurnitureDetailModal from '../components/modals/FurnitureDetailModal';

const Furniture = () => {
  // State management
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Statistics
  const stats = {
    totalItems: 29,
    roomsTracked: 8,
    inStorage: 3,
    needsRepair: 1
  };

  // Room data
  const rooms = [
    {
      id: 'board-a',
      name: 'Board Room A',
      icon: FiHome,
      color: 'accent',
      count: 16,
      items: [
        { tag: 'SV-F-001', name: 'Conference Table', qty: 1, condition: 'Good' },
        { tag: 'SV-F-002', name: 'Executive Chairs', qty: 12, condition: 'Good' },
        { tag: 'SV-F-013', name: 'Storage Cabinet', qty: 2, condition: 'Good' },
        { tag: 'SV-AV-001', name: 'Epson Projector', qty: 1, condition: 'Good' }
      ],
      details: [
        { label: 'Conference Table', value: '1' },
        { label: 'Executive Chairs', value: '12' },
        { label: 'AV & Storage', value: '3' }
      ]
    },
    {
      id: 'ceo',
      name: 'CEO Office',
      icon: FiUser,
      color: 'blue',
      count: 6,
      items: [
        { tag: 'SV-F-003', name: 'Executive Desk', qty: 1, condition: 'Excellent' },
        { tag: 'SV-F-015', name: 'High-back Chair', qty: 1, condition: 'Excellent' },
        { tag: 'SV-F-014', name: 'Visitor Chairs', qty: 2, condition: 'Good' },
        { tag: 'SV-F-016', name: 'Bookshelf', qty: 1, condition: 'Good' }
      ],
      details: [
        { label: 'Executive Desk', value: '1' },
        { label: 'Chairs', value: '3' },
        { label: 'Cabinet & Shelf', value: '2' }
      ]
    },
    {
      id: 'finance',
      name: 'Finance Dept.',
      icon: FiBarChart,
      color: 'amber',
      count: 16,
      items: [
        { tag: 'SV-F-004', name: 'Staff Desks', qty: 6, condition: 'Good' },
        { tag: 'SV-F-005', name: 'Office Chairs', qty: 6, condition: 'Good' },
        { tag: 'SV-F-006', name: 'Filing Cabinets', qty: 3, condition: 'Good' },
        { tag: 'SV-F-017', name: 'Bookshelf', qty: 1, condition: 'Good' }
      ],
      details: [
        { label: 'Staff Desks', value: '6' },
        { label: 'Office Chairs', value: '6' },
        { label: 'Filing & Shelves', value: '4' }
      ]
    },
    {
      id: 'ict',
      name: 'ICT / Stores',
      icon: FiMonitor,
      color: 'violet',
      count: 13,
      items: [
        { tag: 'SV-F-010', name: 'Workstation Desks', qty: 4, condition: 'Good' },
        { tag: 'SV-F-018', name: 'Office Chairs', qty: 4, condition: 'Good' },
        { tag: 'SV-F-011', name: 'Storage Shelves', qty: 4, condition: 'Good' },
        { tag: 'SV-NET-001', name: 'Server Rack Stand', qty: 1, condition: 'Good' }
      ],
      details: [
        { label: 'Workstation Desks', value: '4' },
        { label: 'Chairs', value: '4' },
        { label: 'Shelves & Racks', value: '5' }
      ]
    },
    {
      id: 'hr',
      name: 'HR & Admin Office',
      icon: FiUsers,
      color: 'accent',
      count: 12,
      items: [
        { tag: 'SV-F-007', name: 'Staff Desks', qty: 4, condition: 'Good' },
        { tag: 'SV-F-019', name: 'Office Chairs', qty: 4, condition: 'Good' },
        { tag: 'SV-F-008', name: 'Reception Desk', qty: 1, condition: 'Good' },
        { tag: 'SV-F-020', name: 'Reception Chairs', qty: 3, condition: 'Good' }
      ],
      details: [
        { label: 'Staff Desks', value: '4' },
        { label: 'Chairs', value: '4' },
        { label: 'Reception', value: '4' }
      ]
    },
    {
      id: 'lounge',
      name: 'Staff Lounge',
      icon: FiCoffee,
      color: 'amber',
      count: 8,
      items: [
        { tag: 'SV-F-009', name: '3-Seater Sofa', qty: 2, condition: 'Fair — Review needed' },
        { tag: 'SV-F-021', name: 'Coffee Table', qty: 1, condition: 'Good' },
        { tag: 'SV-F-022', name: 'Bar Stools', qty: 4, condition: 'Good' },
        { tag: 'SV-F-023', name: 'Counter Unit', qty: 1, condition: 'Good' }
      ],
      description: 'Sofas (Fair cond), Coffee table, Bar stools, Counter — review needed'
    }
  ];

  // Furniture data
  const [furniture, setFurniture] = useState([
    {
      tag: 'SV-F-001',
      name: 'Conference Table (12-seat)',
      category: 'Table',
      qty: 1,
      location: 'Board Room A',
      locationType: 'room',
      condition: 'Good',
      acquired: 'Mar 2023',
      value: 85000,
      history: [
        { where: 'Board Room A', when: 'Mar 2023', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-F-002',
      name: 'Executive Chairs (Board)',
      category: 'Chair',
      qty: 12,
      location: 'Board Room A',
      locationType: 'room',
      condition: 'Good',
      acquired: 'Mar 2023',
      value: 180000,
      history: [
        { where: 'Board Room A', when: 'Mar 2023', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-F-003',
      name: 'Executive Desk (CEO)',
      category: 'Desk',
      qty: 1,
      location: 'CEO Office',
      locationType: 'room',
      condition: 'Excellent',
      acquired: 'Jan 2024',
      value: 65000,
      history: [
        { where: 'CEO Office', when: 'Jan 2024', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-F-004',
      name: 'Staff Desks (Finance × 6)',
      category: 'Desk',
      qty: 6,
      location: 'Finance Dept.',
      locationType: 'room',
      condition: 'Good',
      acquired: 'Jan 2024',
      value: 120000,
      history: [
        { where: 'Finance Dept.', when: 'Jan 2024', by: 'Admin Kuria' },
        { where: 'Stores Room A', when: 'Dec 2023', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-F-005',
      name: 'Office Chairs (Finance × 6)',
      category: 'Chair',
      qty: 6,
      location: 'Finance Dept.',
      locationType: 'room',
      condition: 'Good',
      acquired: 'Jan 2024',
      value: 90000,
      history: [
        { where: 'Finance Dept.', when: 'Jan 2024', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-F-006',
      name: 'Filing Cabinets (4-drawer)',
      category: 'Cabinet',
      qty: 3,
      location: 'Finance Dept.',
      locationType: 'room',
      condition: 'Good',
      acquired: 'Jan 2024',
      value: 45000,
      history: [
        { where: 'Finance Dept.', when: 'Jan 2024', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-F-007',
      name: 'Staff Desks (HR × 4)',
      category: 'Desk',
      qty: 4,
      location: 'HR & Admin Office',
      locationType: 'room',
      condition: 'Good',
      acquired: 'Sep 2024',
      value: 80000,
      history: [
        { where: 'HR & Admin Office', when: 'Sep 2024', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-F-008',
      name: 'Reception Desk',
      category: 'Desk',
      qty: 1,
      location: 'HR & Admin Office',
      locationType: 'room',
      condition: 'Good',
      acquired: 'Sep 2024',
      value: 35000,
      history: [
        { where: 'HR & Admin Office', when: 'Sep 2024', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-F-009',
      name: '3-Seater Sofa',
      category: 'Sofa',
      qty: 2,
      location: 'Staff Lounge',
      locationType: 'room',
      condition: 'Fair',
      acquired: 'May 2022',
      value: 60000,
      history: [
        { where: 'Staff Lounge', when: 'May 2022', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-F-010',
      name: 'Workstation Desks (ICT × 4)',
      category: 'Desk',
      qty: 4,
      location: 'ICT / Stores',
      locationType: 'room',
      condition: 'Good',
      acquired: 'Sep 2024',
      value: 80000,
      history: [
        { where: 'ICT / Stores', when: 'Sep 2024', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-F-011',
      name: 'Storage Shelves',
      category: 'Shelving',
      qty: 4,
      location: 'ICT / Stores',
      locationType: 'room',
      condition: 'Good',
      acquired: 'Sep 2024',
      value: 40000,
      history: [
        { where: 'ICT / Stores', when: 'Sep 2024', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-F-012',
      name: 'Standard Desks (Unassigned)',
      category: 'Desk',
      qty: 2,
      location: 'Stores Room B',
      locationType: 'stores',
      condition: 'New',
      acquired: 'Jan 2026',
      value: 40000,
      history: [
        { where: 'Stores Room B', when: 'Jan 2026', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-F-013',
      name: 'Storage Cabinet',
      category: 'Cabinet',
      qty: 2,
      location: 'Board Room A',
      locationType: 'room',
      condition: 'Good',
      acquired: 'Mar 2023',
      value: 30000,
      history: [
        { where: 'Board Room A', when: 'Mar 2023', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-F-014',
      name: 'Visitor Chairs',
      category: 'Chair',
      qty: 2,
      location: 'CEO Office',
      locationType: 'room',
      condition: 'Good',
      acquired: 'Jan 2024',
      value: 20000,
      history: [
        { where: 'CEO Office', when: 'Jan 2024', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-F-015',
      name: 'High-back Chair',
      category: 'Chair',
      qty: 1,
      location: 'CEO Office',
      locationType: 'room',
      condition: 'Excellent',
      acquired: 'Jan 2024',
      value: 25000,
      history: [
        { where: 'CEO Office', when: 'Jan 2024', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-F-016',
      name: 'Bookshelf',
      category: 'Shelving',
      qty: 1,
      location: 'CEO Office',
      locationType: 'room',
      condition: 'Good',
      acquired: 'Jan 2024',
      value: 15000,
      history: [
        { where: 'CEO Office', when: 'Jan 2024', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-F-017',
      name: 'Bookshelf',
      category: 'Shelving',
      qty: 1,
      location: 'Finance Dept.',
      locationType: 'room',
      condition: 'Good',
      acquired: 'Jan 2024',
      value: 15000,
      history: [
        { where: 'Finance Dept.', when: 'Jan 2024', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-F-018',
      name: 'Office Chairs (ICT)',
      category: 'Chair',
      qty: 4,
      location: 'ICT / Stores',
      locationType: 'room',
      condition: 'Good',
      acquired: 'Sep 2024',
      value: 60000,
      history: [
        { where: 'ICT / Stores', when: 'Sep 2024', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-F-019',
      name: 'Office Chairs (HR)',
      category: 'Chair',
      qty: 4,
      location: 'HR & Admin Office',
      locationType: 'room',
      condition: 'Good',
      acquired: 'Sep 2024',
      value: 60000,
      history: [
        { where: 'HR & Admin Office', when: 'Sep 2024', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-F-020',
      name: 'Reception Chairs',
      category: 'Chair',
      qty: 3,
      location: 'HR & Admin Office',
      locationType: 'room',
      condition: 'Good',
      acquired: 'Sep 2024',
      value: 30000,
      history: [
        { where: 'HR & Admin Office', when: 'Sep 2024', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-F-021',
      name: 'Coffee Table',
      category: 'Table',
      qty: 1,
      location: 'Staff Lounge',
      locationType: 'room',
      condition: 'Good',
      acquired: 'May 2022',
      value: 15000,
      history: [
        { where: 'Staff Lounge', when: 'May 2022', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-F-022',
      name: 'Bar Stools',
      category: 'Chair',
      qty: 4,
      location: 'Staff Lounge',
      locationType: 'room',
      condition: 'Good',
      acquired: 'May 2022',
      value: 20000,
      history: [
        { where: 'Staff Lounge', when: 'May 2022', by: 'Admin Kuria' }
      ]
    },
    {
      tag: 'SV-F-023',
      name: 'Counter Unit',
      category: 'Counter',
      qty: 1,
      location: 'Staff Lounge',
      locationType: 'room',
      condition: 'Good',
      acquired: 'May 2022',
      value: 25000,
      history: [
        { where: 'Staff Lounge', when: 'May 2022', by: 'Admin Kuria' }
      ]
    }
  ]);

  // Filter options
  const filterOptions = [
    { id: 'all', label: 'All' },
    { id: 'Board', label: 'Board' },
    { id: 'CEO', label: 'CEO' },
    { id: 'Finance', label: 'Finance' },
    { id: 'Stores', label: 'Stores' },
    { id: 'HR', label: 'HR' },
    { id: 'Lounge', label: 'Lounge' }
  ];

  // Filtered furniture based on room filter and search
  const filteredFurniture = useMemo(() => {
    let filtered = furniture;

    // Filter by room
    if (activeFilter !== 'all') {
      filtered = filtered.filter(item => 
        item.location.toLowerCase().includes(activeFilter.toLowerCase())
      );
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.tag.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [furniture, activeFilter, searchQuery]);

  // Get condition badge
  const getConditionBadge = (condition) => {
    const badges = {
      'New': { className: 'badge-new', text: 'New' },
      'Excellent': { className: 'badge-active', text: 'Excellent' },
      'Good': { className: 'badge-active', text: 'Good' },
      'Fair': { className: 'badge-repair', text: 'Fair' },
      'Needs Repair': { className: 'badge-repair', text: 'Needs Repair' }
    };
    return badges[condition] || { className: 'badge-active', text: condition };
  };

  // Get location badge
  const getLocationBadge = (location, type) => {
    const classes = {
      room: 'loc-badge floor',
      stores: 'loc-badge stores',
      offsite: 'loc-badge offsite'
    };
    return <span className={classes[type] || 'loc-badge floor'}>{location}</span>;
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

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setShowRoomModal(true);
  };

  const handleMoveFromRoom = (assetTag, assetName) => {
    setShowRoomModal(false);
    setSelectedAsset({ tag: assetTag, name: assetName });
    setShowTransferModal(true);
  };

  const handleExport = () => {
    toast.info('Exporting furniture register...');
  };

  const handlePrint = () => {
    toast.info('Preparing print view...');
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

  // Room Card Component
  const RoomCard = ({ room }) => {
    const Icon = room.icon;
    const colorClass = {
      accent: 'accent',
      blue: 'blue',
      amber: 'amber',
      violet: 'violet'
    }[room.color];

    return (
      <Col md={4} sm={6}>
        <div 
          className={`office-card ${room.color === 'amber' ? 'border-amber' : ''}`}
          onClick={() => handleRoomClick(room)}
        >
          <div className="room-header">
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '13.5px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '7px' }}>
              <Icon style={{ color: `var(--${room.color})` }} /> {room.name}
            </div>
            <span className={`room-count count-${colorClass}`}>{room.count}</span>
          </div>
          
          {room.details ? (
            <div className="room-details">
              {room.details.map((detail, idx) => (
                <div key={idx} className="room-detail-item">
                  <span>{detail.label}</span>
                  <b>{detail.value}</b>
                </div>
              ))}
            </div>
          ) : (
            <div className="room-description">{room.description}</div>
          )}
        </div>
      </Col>
    );
  };

  return (
    <div className="furniture-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Furniture Assets</h1>
          <p>Room-by-room tracking across 8 rooms · Click any room card to see inventory</p>
        </div>
        <div className="page-actions">
          <Button variant="secondary" className="btn-outline" onClick={() => handleTransfer(null)}>
            <FiMove /> Move Item
          </Button>
          <Button variant="primary" className="btn-primary-custom" onClick={handleAddAsset}>
            <FiPlus /> Add Item
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="g-3 mb-4">
        <Col xs={6} xl={3}>
          <StatCard icon={FiGrid} value={stats.totalItems} label="Total Items" color="g" />
        </Col>
        <Col xs={6} xl={3}>
          <StatCard icon={FiGrid} value={stats.roomsTracked} label="Rooms Tracked" color="b" />
        </Col>
        <Col xs={6} xl={3}>
          <StatCard icon={FiPackage} value={stats.inStorage} label="In Storage" color="a" />
        </Col>
        <Col xs={6} xl={3}>
          <StatCard icon={FiAlertCircle} value={stats.needsRepair} label="Needs Repair" color="r" />
        </Col>
      </Row>

      {/* Room Map Card */}
      <Card className="data-card mb-4">
        <Card.Header className="dc-header">
          <div className="dc-title">
            <FiMap style={{ color: 'var(--accent)' }} /> Room-by-Room Inventory Map
          </div>
          <Button variant="link" className="btn-ghost btn-sm" onClick={handlePrint}>
            <FiPrinter /> Print
          </Button>
        </Card.Header>
        <Card.Body>
          <Row className="g-3">
            {rooms.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* Furniture Register Card */}
      <Card className="data-card">
        <Card.Header className="dc-header">
          <div className="dc-title">
            <FiGrid style={{ color: 'var(--blue)' }} /> Full Furniture Register
          </div>
          <div className="dc-actions">
            <div className="filter-chips">
              {filterOptions.map(option => (
                <Button
                  key={option.id}
                  variant="link"
                  className={`chip btn-sm ${activeFilter === option.id ? 'on' : ''}`}
                  onClick={() => setActiveFilter(option.id)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <Form.Control
              type="text"
              placeholder="Search…"
              className="table-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </Card.Header>

        <div className="table-responsive">
          <Table className="custom-table" id="tbl-fur">
            <thead>
              <tr>
                <th>Asset Tag</th>
                <th>Item</th>
                <th>Category</th>
                <th>Qty</th>
                <th>Location</th>
                <th>Condition</th>
                <th>Acquired</th>
                <th>Value (KES)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFurniture.map(item => (
                <tr key={item.tag} data-froom={item.location}>
                  <td className="mono">{item.tag}</td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.qty}</td>
                  <td>{getLocationBadge(item.location, item.locationType)}</td>
                  <td>
                    <span className={`badge ${getConditionBadge(item.condition).className}`}>
                      {item.condition}
                    </span>
                  </td>
                  <td>{item.acquired}</td>
                  <td>{formatCurrency(item.value)}</td>
                  <td>
                    <div className="action-buttons">
                      <Button 
                        variant="link" 
                        className="act-btn" 
                        onClick={() => handleViewDetail(item)}
                        title="Details"
                      >
                        <FiEye />
                      </Button>
                      <Button 
                        variant="link" 
                        className="act-btn map-btn" 
                        onClick={() => handleViewOnMap(item)}
                        title="View on Map"
                      >
                        <FiMapPin />
                      </Button>
                      <Button 
                        variant="link" 
                        className="act-btn" 
                        onClick={() => handleTransfer(item)}
                        title="Move"
                      >
                        <FiMove />
                      </Button>
                      {item.condition === 'Fair' && (
                        <Button 
                          variant="link" 
                          className="act-btn" 
                          onClick={() => handleMaintenance(item)}
                          title="Report Issue"
                        >
                          <FiTool />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Modals */}
      <AddAssetModal 
        show={showAddModal} 
        onHide={() => setShowAddModal(false)}
        category="F"
        onSave={(asset) => {
          setFurniture([...furniture, asset]);
          toast.success('Furniture item added successfully');
          setShowAddModal(false);
        }}
      />

      <TransferModal
        show={showTransferModal}
        onHide={() => setShowTransferModal(false)}
        asset={selectedAsset}
        onConfirm={(data) => {
          // Update furniture location
          setFurniture(furniture.map(item => 
            item.tag === selectedAsset.tag 
              ? { 
                  ...item, 
                  location: data.destination,
                  locationType: data.locationType,
                  history: [
                    { where: data.destination, when: 'Today', by: 'Admin Kuria' },
                    ...item.history
                  ]
                }
              : item
          ));
          toast.success(`Item moved to ${data.destination}`);
          setShowTransferModal(false);
        }}
      />

      <MaintenanceModal
        show={showMaintenanceModal}
        onHide={() => setShowMaintenanceModal(false)}
        asset={selectedAsset}
        onConfirm={(data) => {
          setFurniture(furniture.map(item => 
            item.tag === selectedAsset.tag 
              ? { ...item, condition: 'Needs Repair' }
              : item
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

      <RoomDetailModal
        show={showRoomModal}
        onHide={() => setShowRoomModal(false)}
        room={selectedRoom}
        onMoveItem={handleMoveFromRoom}
        onViewMap={handleViewOnMap}
      />

      <FurnitureDetailModal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        asset={selectedAsset}
        onViewMap={handleViewOnMap}
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

export default Furniture;