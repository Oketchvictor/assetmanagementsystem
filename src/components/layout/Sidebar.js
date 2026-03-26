import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FiGrid, FiMonitor, FiHome, FiPackage, 
  FiUsers, FiRepeat, FiTool, FiFileText, FiSettings,
  FiChevronRight, FiMenu, FiX
} from 'react-icons/fi';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 992;
      setIsMobile(mobile);
      if (!mobile && mobileOpen) {
        setMobileOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileOpen]);

  // Close mobile sidebar when navigating
  useEffect(() => {
    if (isMobile && mobileOpen) {
      setMobileOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Toggle sidebar for mobile
  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobile && mobileOpen) {
        const sidebar = document.querySelector('.sidebar-container');
        const toggleBtn = document.querySelector('.mobile-toggle-btn');
        if (sidebar && !sidebar.contains(e.target) && toggleBtn && !toggleBtn.contains(e.target)) {
          setMobileOpen(false);
        }
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobile, mobileOpen]);

  const navItems = [
    {
      section: 'Overview',
      items: [
        { path: '/', icon: <FiGrid />, text: 'Dashboard', badge: null },
        { path: '/tablets', icon: <FiMonitor />, text: 'Tablets & Accessories', badge: 48 },
        { path: '/laptops', icon: <FiMonitor />, text: 'Laptops', badge: 32 },
        { path: '/furniture', icon: <FiHome />, text: 'Furniture', badge: null },
        { path: '/other-assets', icon: <FiPackage />, text: 'Other Assets', badge: { count: 1, type: 'danger' } }
      ]
    },
    {
      section: 'Administration',
      items: [
        { path: '/staff', icon: <FiUsers />, text: 'Staff Directory', badge: null },
        { path: '/transfers', icon: <FiRepeat />, text: 'Transfers', badge: { count: 3, type: 'warn' } },
        { path: '/maintenance', icon: <FiTool />, text: 'Maintenance', badge: { count: 4, type: 'danger' } },
        { path: '/reports', icon: <FiFileText />, text: 'Reports', badge: null },
        { path: '/settings', icon: <FiSettings />, text: 'Settings', badge: null }
      ]
    }
  ];

  const getBadgeStyle = (badge) => {
    if (!badge) return {};
    if (typeof badge === 'object') {
      return {
        background: badge.type === 'warn' ? 'rgba(255, 197, 66, 0.14)' : 
                    badge.type === 'danger' ? 'rgba(255, 90, 101, 0.14)' :
                    'rgba(0, 229, 168, 0.14)',
        color: badge.type === 'warn' ? '#FFC542' : 
               badge.type === 'danger' ? '#FF5A65' :
               '#00E5A8'
      };
    }
    return {
      background: 'rgba(0, 229, 168, 0.14)',
      color: '#00E5A8'
    };
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      zIndex: 399,
      display: isMobile && mobileOpen ? 'block' : 'none',
      backdropFilter: 'blur(2px)'
    },
    sidebarContainer: {
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      zIndex: 400,
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    sidebar: {
      width: collapsed && !isMobile ? '70px' : '260px',
      minHeight: '100vh',
      background: '#0C1829',
      borderRight: '1px solid #1C2E44',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '4px 0 24px rgba(0, 0, 0, 0.2)',
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    brand: {
      padding: '18px 16px 15px',
      borderBottom: '1px solid #1C2E44',
      display: 'flex',
      alignItems: 'center',
      gap: '11px'
    },
    brandIcon: {
      width: '38px',
      height: '38px',
      borderRadius: '10px',
      flexShrink: 0,
      background: 'linear-gradient(135deg, #00E5A8, #00C49A)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 0 24px rgba(0, 229, 168, 0.18)'
    },
    brandIconSpan: {
      fontFamily: 'Syne, sans-serif',
      fontWeight: 800,
      fontSize: '18px',
      color: '#07101F'
    },
    brandName: {
      fontFamily: 'Syne, sans-serif',
      fontSize: '13px',
      fontWeight: 700,
      color: '#D8EAF8',
      lineHeight: 1.2
    },
    brandSub: {
      fontSize: '9px',
      color: '#3D5A78',
      letterSpacing: '0.13em',
      textTransform: 'uppercase',
      marginTop: '1px'
    },
    mobileCloseBtn: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      background: '#162234',
      border: '1px solid #1C2E44',
      color: '#D8EAF8',
      display: isMobile && !collapsed ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.15s',
      zIndex: 10
    },
    nav: {
      flex: 1,
      padding: '6px 0',
      overflowY: 'auto',
      overflowX: 'hidden'
    },
    navSection: {
      padding: '14px 16px 4px',
      fontSize: '9px',
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      color: '#3D5A78',
      fontWeight: 700,
      display: collapsed && !isMobile ? 'none' : 'block'
    },
    navLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '9px 16px',
      color: '#6B8FAE',
      fontSize: '13px',
      fontWeight: 500,
      borderLeft: '3px solid transparent',
      transition: 'all 0.16s',
      position: 'relative',
      textDecoration: 'none',
      cursor: 'pointer'
    },
    navIcon: {
      width: '17px',
      textAlign: 'center',
      fontSize: '13px',
      flexShrink: 0,
      opacity: 0.9
    },
    navText: {
      flex: 1,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      display: collapsed && !isMobile ? 'none' : 'block'
    },
    sidebarFooter: {
      padding: '11px 13px',
      borderTop: '1px solid #1C2E44'
    },
    userChip: {
      display: 'flex',
      alignItems: 'center',
      gap: '9px',
      padding: '8px 9px',
      borderRadius: '9px',
      cursor: 'pointer',
      transition: 'background 0.15s',
      justifyContent: collapsed && !isMobile ? 'center' : 'flex-start'
    },
    avatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      flexShrink: 0,
      background: 'linear-gradient(135deg, #00E5A8, #4F9EF8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 800,
      fontSize: '11px',
      color: '#07101F'
    },
    userName: {
      fontSize: '12.5px',
      fontWeight: 600,
      lineHeight: 1.2,
      color: '#D8EAF8',
      display: collapsed && !isMobile ? 'none' : 'block'
    },
    userRole: {
      fontSize: '10.5px',
      color: '#3D5A78',
      display: collapsed && !isMobile ? 'none' : 'block'
    },
    userArrow: {
      color: '#3D5A78',
      fontSize: '9px',
      marginLeft: 'auto',
      display: collapsed && !isMobile ? 'none' : 'block'
    },
    mobileToggleBtn: {
      position: 'fixed',
      top: '12px',
      left: '16px',
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      background: '#0C1829',
      border: '1px solid #1C2E44',
      color: '#00E5A8',
      display: isMobile ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      zIndex: 450,
      transition: 'all 0.15s',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
    },
    desktopToggleBtn: {
      position: 'absolute',
      bottom: '90px',
      right: '-12px',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      background: '#162234',
      border: '1px solid #243B54',
      color: '#D8EAF8',
      display: isMobile ? 'none' : 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s',
      zIndex: 10
    }
  };

  // Determine if sidebar should be visible
  const getSidebarTransform = () => {
    if (!isMobile) return 'translateX(0)';
    return mobileOpen ? 'translateX(0)' : 'translateX(-100%)';
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div style={styles.overlay} onClick={() => setMobileOpen(false)}></div>
      
      {/* Mobile Toggle Button */}
      <button 
        className="mobile-toggle-btn"
        style={styles.mobileToggleBtn}
        onClick={toggleMobileSidebar}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#162234';
          e.currentTarget.style.borderColor = '#243B54';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#0C1829';
          e.currentTarget.style.borderColor = '#1C2E44';
        }}
      >
        <FiMenu size={20} />
      </button>
      
      {/* Sidebar Container */}
      <div 
        className="sidebar-container"
        style={{
          ...styles.sidebarContainer,
          transform: getSidebarTransform()
        }}
      >
        <div style={styles.sidebar}>
          {/* Mobile Close Button */}
          <button 
            style={styles.mobileCloseBtn}
            onClick={() => setMobileOpen(false)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1C2E44';
              e.currentTarget.style.color = '#FF5A65';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#162234';
              e.currentTarget.style.color = '#D8EAF8';
            }}
          >
            <FiX size={18} />
          </button>
          
          <div style={styles.brand}>
            <div style={styles.brandIcon}>
              <span style={styles.brandIconSpan}>S</span>
            </div>
            {(!collapsed || isMobile) && (
              <div>
                <div style={styles.brandName}>Seovo Solutions</div>
                <div style={styles.brandSub}>Asset Management</div>
              </div>
            )}
          </div>

          <nav style={styles.nav}>
            {navItems.map((section, idx) => (
              <React.Fragment key={idx}>
                <div style={styles.navSection}>{section.section}</div>
                {section.items.map((item, itemIdx) => {
                  const badgeStyle = getBadgeStyle(item.badge);
                  return (
                    <NavLink
                      key={itemIdx}
                      to={item.path}
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      style={({ isActive }) => ({
                        ...styles.navLink,
                        background: isActive ? 'rgba(0, 229, 168, 0.08)' : 'transparent',
                        color: isActive ? '#00E5A8' : '#6B8FAE',
                        borderLeftColor: isActive ? '#00E5A8' : 'transparent',
                        fontWeight: isActive ? 600 : 500
                      })}
                    >
                      <span style={styles.navIcon}>{item.icon}</span>
                      {((!collapsed || isMobile) || (!isMobile && !collapsed)) && (
                        <>
                          <span style={styles.navText}>{item.text}</span>
                          {item.badge && (
                            <span style={{
                              marginLeft: 'auto',
                              fontSize: '10px',
                              fontWeight: 700,
                              padding: '2px 7px',
                              borderRadius: '99px',
                              ...badgeStyle
                            }}>
                              {typeof item.badge === 'object' ? item.badge.count : item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </React.Fragment>
            ))}
          </nav>

          <div style={styles.sidebarFooter}>
            <div style={styles.userChip}>
              <div style={styles.avatar}>AS</div>
              {((!collapsed || isMobile) || (!isMobile && !collapsed)) && (
                <>
                  <div>
                    <div style={styles.userName}>Admin Seovo</div>
                    <div style={styles.userRole}>Store Manager</div>
                  </div>
                  <FiChevronRight style={styles.userArrow} />
                </>
              )}
            </div>
          </div>
          
          {/* Desktop Toggle Button */}
          <button 
            style={styles.desktopToggleBtn}
            onClick={() => setCollapsed(!collapsed)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1C2E44';
              e.currentTarget.style.color = '#00E5A8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#162234';
              e.currentTarget.style.color = '#D8EAF8';
            }}
          >
            <FiMenu size={12} />
          </button>
        </div>
      </div>

      {/* Add responsive styles */}
      <style>{`
        @media (max-width: 992px) {
          .main-content {
            margin-left: 0 !important;
            width: 100%;
          }
          
          .mobile-toggle-btn:hover {
            background: #162234 !important;
            border-color: #243B54 !important;
          }
          
          .mobile-toggle-btn:active {
            transform: scale(0.95);
          }
        }
        
        @media (max-width: 768px) {
          .mobile-toggle-btn {
            width: 36px !important;
            height: 36px !important;
            top: 10px !important;
            left: 12px !important;
          }
        }
        
        @media (max-width: 480px) {
          .mobile-toggle-btn {
            width: 32px !important;
            height: 32px !important;
            top: 8px !important;
            left: 8px !important;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;