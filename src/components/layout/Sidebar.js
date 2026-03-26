import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FiGrid, FiMonitor, FiHome, FiPackage, 
  FiUsers, FiRepeat, FiTool, FiFileText, FiSettings,
  FiChevronRight, FiMenu, FiX
} from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 992;
      setIsMobile(mobile);
      
      // Reset mobile open state when switching to desktop
      if (!mobile) {
        setIsMobileOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile sidebar when navigating
  useEffect(() => {
    if (isMobile && isMobileOpen) {
      setIsMobileOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isMobileOpen) {
        const sidebar = document.querySelector('.sidebar');
        const toggleBtn = document.querySelector('.mobile-toggle-btn');
        if (sidebar && !sidebar.contains(event.target) && toggleBtn && !toggleBtn.contains(event.target)) {
          setIsMobileOpen(false);
        }
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobile, isMobileOpen]);

  const navItems = [
    {
      section: 'Overview',
      items: [
        { path: '/', icon: <FiGrid size={18} />, text: 'Dashboard', badge: null },
        { path: '/tablets', icon: <FiMonitor size={18} />, text: 'Tablets & Accessories', badge: 48 },
        { path: '/laptops', icon: <FiMonitor size={18} />, text: 'Laptops', badge: 32 },
        { path: '/furniture', icon: <FiHome size={18} />, text: 'Furniture', badge: null },
        { path: '/other-assets', icon: <FiPackage size={18} />, text: 'Other Assets', badge: { count: 1, type: 'danger' } }
      ]
    },
    {
      section: 'Administration',
      items: [
        { path: '/staff', icon: <FiUsers size={18} />, text: 'Staff Directory', badge: null },
        { path: '/transfers', icon: <FiRepeat size={18} />, text: 'Transfers', badge: { count: 3, type: 'warn' } },
        { path: '/maintenance', icon: <FiTool size={18} />, text: 'Maintenance', badge: { count: 4, type: 'danger' } },
        { path: '/reports', icon: <FiFileText size={18} />, text: 'Reports', badge: null },
        { path: '/settings', icon: <FiSettings size={18} />, text: 'Settings', badge: null }
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

  // Toggle desktop sidebar collapse
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Toggle mobile sidebar open/close
  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Get sidebar width based on state
  const getSidebarWidth = () => {
    if (isMobile) return '280px';
    return isCollapsed ? '70px' : '260px';
  };

  // Get sidebar transform for mobile
  const getMobileTransform = () => {
    if (!isMobile) return 'translateX(0)';
    return isMobileOpen ? 'translateX(0)' : 'translateX(-100%)';
  };

  // Check if text should be visible
  const showText = () => {
    if (isMobile) return true;
    return !isCollapsed;
  };

  return (
    <>
      {/* Mobile Toggle Button - Only visible on mobile */}
      {isMobile && (
        <button
          className="mobile-toggle-btn"
          onClick={toggleMobile}
          style={{
            position: 'fixed',
            top: '12px',
            left: '16px',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: '#0C1829',
            border: '1px solid #1C2E44',
            color: '#00E5A8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 1000,
            transition: 'all 0.2s',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
          }}
        >
          <FiMenu size={20} />
        </button>
      )}

      {/* Mobile Overlay - Only visible when mobile sidebar is open */}
      {isMobile && isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998,
            backdropFilter: 'blur(2px)'
          }}
        />
      )}

      {/* Sidebar */}
      <div
        className="sidebar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: getSidebarWidth(),
          height: '100vh',
          background: '#0C1829',
          borderRight: '1px solid #1C2E44',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.2)',
          transition: 'width 0.3s ease, transform 0.3s ease',
          transform: getMobileTransform(),
          zIndex: 999,
          overflow: 'hidden'
        }}
      >
        {/* Mobile Close Button */}
        {isMobile && isMobileOpen && (
          <button
            onClick={() => setIsMobileOpen(false)}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#162234',
              border: '1px solid #1C2E44',
              color: '#D8EAF8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            <FiX size={18} />
          </button>
        )}

        {/* Brand Section */}
        <div
          style={{
            padding: '20px 16px',
            borderBottom: '1px solid #1C2E44',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              flexShrink: 0,
              background: 'linear-gradient(135deg, #00E5A8, #00C49A)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 24px rgba(0, 229, 168, 0.18)'
            }}
          >
            <span style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: '18px',
              color: '#07101F'
            }}>S</span>
          </div>
          {showText() && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: '13px',
                fontWeight: 700,
                color: '#D8EAF8',
                whiteSpace: 'nowrap'
              }}>Seovo Solutions</div>
              <div style={{
                fontSize: '9px',
                color: '#3D5A78',
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap'
              }}>Asset Management</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '8px 0'
          }}
        >
          {navItems.map((section, idx) => (
            <div key={idx}>
              {showText() && (
                <div
                  style={{
                    padding: '12px 16px 6px',
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#3D5A78',
                    fontWeight: 600
                  }}
                >
                  {section.section}
                </div>
              )}
              {section.items.map((item, itemIdx) => {
                const badgeStyle = getBadgeStyle(item.badge);
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={itemIdx}
                    to={item.path}
                    onClick={() => {
                      if (isMobile) {
                        setIsMobileOpen(false);
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: showText() ? 'flex-start' : 'center',
                      gap: showText() ? '12px' : '0',
                      padding: showText() ? '10px 16px' : '12px 0',
                      margin: showText() ? '0' : '4px 0',
                      color: isActive ? '#00E5A8' : '#6B8FAE',
                      fontSize: '13px',
                      fontWeight: isActive ? 600 : 500,
                      borderLeft: isActive ? '3px solid #00E5A8' : '3px solid transparent',
                      transition: 'all 0.2s',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      background: isActive ? 'rgba(0, 229, 168, 0.08)' : 'transparent',
                      width: '100%'
                    }}
                  >
                    <span style={{
                      width: showText() ? '20px' : 'auto',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {item.icon}
                    </span>
                    {showText() && (
                      <>
                        <span style={{ flex: 1, whiteSpace: 'nowrap' }}>{item.text}</span>
                        {item.badge && (
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              padding: '2px 7px',
                              borderRadius: '99px',
                              ...badgeStyle
                            }}
                          >
                            {typeof item.badge === 'object' ? item.badge.count : item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Section - Always visible at bottom */}
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid #1C2E44',
            background: '#0C1829',
            marginTop: 'auto'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: showText() ? 'flex-start' : 'center',
              gap: showText() ? '12px' : '0',
              padding: '8px 0',
              borderRadius: '9px'
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                flexShrink: 0,
                background: 'linear-gradient(135deg, #00E5A8, #4F9EF8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '12px',
                color: '#07101F'
              }}
            >
              AS
            </div>
            {showText() && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#D8EAF8',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  Admin Seovo
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: '#3D5A78',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  Store Manager
                </div>
              </div>
            )}
            {showText() && (
              <FiChevronRight
                style={{
                  color: '#3D5A78',
                  fontSize: '12px',
                  flexShrink: 0
                }}
              />
            )}
          </div>
        </div>

        {/* Desktop Toggle Button - Only visible on desktop */}
        {!isMobile && (
          <button
            onClick={toggleCollapse}
            style={{
              position: 'absolute',
              bottom: '100px',
              right: '-12px',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: '#162234',
              border: '1px solid #243B54',
              color: '#D8EAF8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              zIndex: 10
            }}
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
        )}
      </div>

      {/* Global Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Nav Link Hover Effect */
          .sidebar a:not(.active):hover {
            background: rgba(255, 255, 255, 0.04) !important;
            color: #D8EAF8 !important;
            border-left-color: #243B54 !important;
          }
          
          /* Main Content Margin */
          .main-content {
            transition: margin-left 0.3s ease;
          }
          
          /* Desktop Styles */
          @media (min-width: 993px) {
            .main-content {
              margin-left: 260px;
            }
            .main-content.sidebar-collapsed {
              margin-left: 70px;
            }
          }
          
          /* Mobile Styles - No margin */
          @media (max-width: 992px) {
            .main-content {
              margin-left: 0 !important;
            }
          }
          
          /* Mobile Toggle Button Hover */
          .mobile-toggle-btn:hover {
            background: #162234 !important;
            border-color: #243B54 !important;
          }
          
          .mobile-toggle-btn:active {
            transform: scale(0.95);
          }
          
          /* Scrollbar */
          ::-webkit-scrollbar {
            width: 4px;
          }
          
          ::-webkit-scrollbar-track {
            background: #162234;
          }
          
          ::-webkit-scrollbar-thumb {
            background: #243B54;
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: #00E5A8;
          }
        `
      }} />
    </>
  );
};

export default Sidebar;