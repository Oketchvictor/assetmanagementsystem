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

function AppContent() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const location = useLocation();

  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 992);
      // Auto collapse sidebar on mobile
      if (window.innerWidth <= 992) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Set default user if not logged in (for demo)
  useEffect(() => {
    if (!localStorage.getItem('user')) {
      const defaultUser = {
        username: 'admin',
        email: 'admin@seovo.com',
        first_name: 'Admin',
        last_name: 'Seovo',
        profile: {
          role: 'admin',
          phone: '+254700000000',
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

  const handleAddAssetClick = () => {
    setShowAddAssetModal(true);
  };

  const handleAddAssetSave = (asset) => {
    console.log('Asset saved:', asset);
    setShowAddAssetModal(false);
  };

  // Get the appropriate margin based on sidebar state
  const getMainContentMargin = () => {
    if (isMobile) return '0';
    return sidebarCollapsed ? '70px' : '260px';
  };

  const styles = {
    app: {
      display: 'flex',
      minHeight: '100vh',
      position: 'relative',
      zIndex: 1
    },
    mainContent: {
      flex: 1,
      marginLeft: getMainContentMargin(),
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      width: '100%'
    },
    content: {
      flex: 1,
      padding: '24px 28px',
      overflowX: 'hidden',
      width: '100%'
    }
  };

  // Add global styles
  const globalStyles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    html, body {
      height: 100%;
      background: #07101F;
      color: #D8EAF8;
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      line-height: 1.6;
      scroll-behavior: smooth;
    }
    
    /* Responsive adjustments */
    @media (max-width: 992px) {
      .main-content {
        margin-left: 0 !important;
      }
      
      .content {
        padding: 16px !important;
      }
    }
    
    @media (max-width: 768px) {
      .content {
        padding: 12px !important;
      }
    }
    
    @media (max-width: 480px) {
      .content {
        padding: 8px !important;
      }
    }
    
    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
    
    ::-webkit-scrollbar-track {
      background: #0C1829;
    }
    
    ::-webkit-scrollbar-thumb {
      background: #243B54;
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: #00E5A8;
    }
    
    /* Animation keyframes */
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(14px);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(40px);
        opacity: 0;
      }
      to {
        transform: none;
        opacity: 1;
      }
    }
    
    .fade-in {
      animation: fadeIn 0.38s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    
    .slide-in {
      animation: slideIn 0.25s ease both;
    }
  `;

  return (
    <div style={styles.app}>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      
      <Sidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed}
        isMobile={isMobile}
      />
      
      <div className="main-content" style={styles.mainContent}>
        <Topbar 
          pageName={getPageName()} 
          onSearchClick={() => setShowSearchModal(true)}
          onAddAssetClick={handleAddAssetClick}
        />
        
        <div className="content" style={styles.content}>
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