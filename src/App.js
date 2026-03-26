import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Layout Components
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import Footer from './components/layout/Footer';

// Page Components
import Dashboard from './pages/Dashboard';
import Tablets from './pages/Tablets';
import Laptops from './pages/Laptops';
import Furniture from './pages/Furniture';
import OtherAssets from './pages/OtherAssets';
import Staff from './pages/Staff';
import Transfers from './pages/Transfers';
import Maintenance from './pages/Maintenance';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AddAsset from './pages/AddAsset';

// Modal Components
import GlobalSearchModal from './components/modals/GlobalSearchModal';
import AddAssetModal from './components/modals/AddAssetModal';

// Services
import authService from './services/authService';

// Styles
import './App.css';

// In your AppContent component, update the main-content div:

<div className={`main-content ${sidebarCollapsed ? 'expanded sidebar-collapsed' : 'sidebar-expanded'}`}>
  <Topbar 
    pageName={getPageName()} 
    onMenuClick={handleMenuClick}
    onSearchClick={() => setShowSearchModal(true)}
  />
  
  <div className="content">
    <Routes>
      {/* Your routes here */}
    </Routes>
  </div>
  
  <Footer />
</div>
function AppContent() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Set to true for demo
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check for user in localStorage
    const user = localStorage.getItem('user');
    if (!user) {
      // Set default user for demo
      const defaultUser = {
        username: 'admin',
        email: 'admin@seovo.com',
        first_name: 'Admin',
        last_name: 'Seovo',
        profile: {
          role: 'admin',
          phone: '+254748370734',
          department: 'Administration'
        }
      };
      localStorage.setItem('user', JSON.stringify(defaultUser));
      localStorage.setItem('token', 'demo-token-12345');
    }
  }, []);

  const getPageName = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/tablets') return 'Tablets & Accessories';
    if (path === '/laptops') return 'Laptops';
    if (path === '/furniture') return 'Furniture';
    if (path === '/other-assets') return 'Other Assets';
    if (path === '/staff') return 'Staff Directory';
    if (path === '/transfers') return 'Transfers';
    if (path === '/maintenance') return 'Maintenance';
    if (path === '/reports') return 'Reports';
    if (path === '/profile') return 'My Profile';
    if (path === '/settings') return 'Settings';
    if (path === '/add-asset') return 'Add Asset';
    return path.substring(1).charAt(0).toUpperCase() + path.slice(2);
  };

  const handleMenuClick = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleAddAssetClick = () => {
    setShowAddAssetModal(true);
  };

  const handleAddAssetSave = (asset) => {
    console.log('Asset saved:', asset);
    setShowAddAssetModal(false);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#07101F'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #162234',
          borderTopColor: '#00E5A8',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#07101F'
      }}>
        <div style={{
          background: '#0F1A2B',
          border: '1px solid #1C2E44',
          borderRadius: '14px',
          padding: '40px',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <h1 style={{ color: '#00E5A8', marginBottom: '20px' }}>Seovo AMS</h1>
          <p style={{ color: '#D8EAF8', marginBottom: '20px' }}>Please log in to access the asset management system.</p>
          <button
            onClick={() => {
              setIsAuthenticated(true);
              const defaultUser = {
                username: 'admin',
                email: 'admin@seovo.com',
                first_name: 'Admin',
                last_name: 'Seovo',
                profile: { role: 'admin', phone: '+254700000000', department: 'Administration' }
              };
              localStorage.setItem('user', JSON.stringify(defaultUser));
              localStorage.setItem('token', 'demo-token-12345');
            }}
            style={{
              background: 'linear-gradient(135deg, #00E5A8, #00C49A)',
              color: '#07101F',
              border: 'none',
              padding: '10px 30px',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Login as Admin Seovo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div className={`main-content ${sidebarCollapsed ? 'expanded sidebar-collapsed' : 'sidebar-expanded'}`}>
        <Topbar 
          pageName={getPageName()} 
          onMenuClick={handleMenuClick}
          onSearchClick={() => setShowSearchModal(true)}
        />
        
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tablets" element={<Tablets />} />
            <Route path="/laptops" element={<Laptops />} />
            <Route path="/furniture" element={<Furniture />} />
            <Route path="/other-assets" element={<OtherAssets />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/transfers" element={<Transfers />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/add-asset" element={<AddAsset />} />
          </Routes>
        </div>
        
        <Footer />
      </div>

      <GlobalSearchModal 
        show={showSearchModal}
        onHide={() => setShowSearchModal(false)}
      />

      <AddAssetModal
        show={showAddAssetModal}
        onHide={() => setShowAddAssetModal(false)}
        onSave={handleAddAssetSave}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;