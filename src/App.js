import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

  // Check screen size for sidebar margin
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set default user for demo
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
    const path = window.location.pathname;
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <Sidebar />
      
      <div 
        className="main-content"
        style={{
          flex: 1,
          marginLeft: !isMobile ? '260px' : '0',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          transition: 'margin-left 0.3s ease',
          width: '100%'
        }}
      >
        <Topbar 
          pageName={getPageName()} 
          onSearchClick={() => setShowSearchModal(true)}
          onAddAssetClick={handleAddAssetClick}
        />
        
        <div style={{
          flex: 1,
          padding: '24px 28px',
          overflowX: 'hidden',
          width: '100%'
        }}>
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

      <style dangerouslySetInnerHTML={{
        __html: `
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
        `
      }} />
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