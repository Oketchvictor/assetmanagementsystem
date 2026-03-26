import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiMenu, FiBell, FiSearch, FiUser, FiHome, 
  FiChevronRight, FiLogOut, FiUserCheck, FiSettings
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const Topbar = ({ pageName, onSearchClick, onAddAssetClick }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'danger', message: 'SV-O-005 MISSING — Epson Projector', link: '/other-assets' },
    { id: 2, type: 'warn', message: 'KEC 899T — insurance expired', link: '/other-assets' },
    { id: 3, type: 'warn', message: '4 assets due for maintenance', link: '/maintenance' }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 992);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && !e.target.matches('input, textarea, select')) {
        e.preventDefault();
        if (onSearchClick) onSearchClick();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onSearchClick]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getUserInitials = () => 'AS';
  const getUserName = () => 'Admin Seovo';
  const getUserRole = () => 'Administrator';
  const getUserEmail = () => 'admin@seovo.com';

  const styles = {
    topbar: {
      height: '56px',
      background: 'rgba(12, 24, 41, 0.94)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid #1C2E44',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: isMobile ? '0 16px' : '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 300
    },
    topbarLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    pageTitle: {
      fontFamily: 'Syne, sans-serif',
      fontSize: isMobile ? '14px' : '15px',
      fontWeight: 700,
      color: '#D8EAF8'
    },
    breadcrumb: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '11px',
      color: '#3D5A78',
      marginTop: '1px'
    },
    breadcrumbLink: {
      color: '#3D5A78',
      transition: 'color 0.15s',
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none'
    },
    separator: {
      color: '#243B54',
      fontSize: '10px'
    },
    topbarRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    iconBtn: {
      width: isMobile ? '32px' : '34px',
      height: isMobile ? '32px' : '34px',
      borderRadius: '9px',
      background: 'transparent',
      border: '1px solid #1C2E44',
      color: '#6B8FAE',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '13px',
      transition: 'all 0.15s',
      position: 'relative',
      cursor: 'pointer'
    },
    notificationDot: {
      position: 'absolute',
      top: '6px',
      right: '6px',
      width: '6px',
      height: '6px',
      background: '#FFC542',
      borderRadius: '50%',
      border: '2px solid #0C1829'
    },
    shortcutHint: {
      position: 'absolute',
      bottom: '-4px',
      right: '-4px',
      fontSize: '8px',
      background: '#162234',
      border: '1px solid #243B54',
      borderRadius: '4px',
      padding: '1px 3px',
      color: '#3D5A78'
    },
    userBtn: {
      width: isMobile ? '32px' : '34px',
      height: isMobile ? '32px' : '34px',
      borderRadius: '9px',
      background: 'transparent',
      border: '1px solid #1C2E44',
      color: '#6B8FAE',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '13px',
      transition: 'all 0.15s',
      cursor: 'pointer',
      position: 'relative'
    },
    userAvatar: {
      position: 'absolute',
      top: '-4px',
      right: '-4px',
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #00E5A8, #4F9EF8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '8px',
      fontWeight: 800,
      color: '#07101F'
    },
    btnPrimaryCustom: {
      background: 'linear-gradient(135deg, #00E5A8, #00C49A)',
      color: '#07101F',
      border: 'none',
      padding: isMobile ? '6px 12px' : '8px 18px',
      borderRadius: '9px',
      fontWeight: 700,
      fontSize: isMobile ? '11px' : '12.5px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '7px',
      transition: 'all 0.18s',
      boxShadow: '0 4px 14px rgba(0, 229, 168, 0.22)',
      cursor: 'pointer'
    }
  };

  return (
    <header style={styles.topbar}>
      <div style={styles.topbarLeft}>
        <div>
          <div style={styles.pageTitle}>{pageName}</div>
          <div style={styles.breadcrumb}>
            <Link to="/" style={styles.breadcrumbLink}>
              <FiHome />
            </Link>
            <FiChevronRight style={styles.separator} />
            <span>{pageName}</span>
          </div>
        </div>
      </div>

      <div style={styles.topbarRight}>
        <button 
          className="icon-btn" 
          style={styles.iconBtn} 
          onClick={onSearchClick} 
          title="Search (/)"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#162234';
            e.currentTarget.style.color = '#D8EAF8';
            e.currentTarget.style.borderColor = '#243B54';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#6B8FAE';
            e.currentTarget.style.borderColor = '#1C2E44';
          }}
        >
          <FiSearch />
          <span style={styles.shortcutHint}>/</span>
        </button>

        <div style={{ position: 'relative' }}>
          <button 
            className="icon-btn" 
            style={styles.iconBtn} 
            onClick={() => setShowNotifications(!showNotifications)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#162234';
              e.currentTarget.style.color = '#D8EAF8';
              e.currentTarget.style.borderColor = '#243B54';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#6B8FAE';
              e.currentTarget.style.borderColor = '#1C2E44';
            }}
          >
            <FiBell />
            {notifications.length > 0 && <span style={styles.notificationDot}></span>}
          </button>
          
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '45px',
              right: '0',
              width: '320px',
              background: '#0C1829',
              border: '1px solid #243B54',
              borderRadius: '14px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
              zIndex: 1000,
              animation: 'dropdownIn 0.2s ease'
            }}>
              <div style={{
                padding: '14px 16px',
                borderBottom: '1px solid #1C2E44',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontWeight: 600,
                fontSize: '13px',
                color: '#D8EAF8'
              }}>
                <span>Notifications</span>
                <span style={{
                  background: '#162234',
                  color: '#6B8FAE',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px'
                }}>{notifications.length}</span>
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.map(notif => (
                  <div 
                    key={notif.id} 
                    className={`notification-item ${notif.type}`}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #1C2E44',
                      cursor: 'pointer',
                      transition: 'background 0.15s'
                    }}
                    onClick={() => {
                      navigate(notif.link);
                      setShowNotifications(false);
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#162234'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ fontSize: '12px', color: '#D8EAF8' }}>{notif.message}</div>
                  </div>
                ))}
              </div>
              <div style={{
                padding: '10px 16px',
                borderTop: '1px solid #1C2E44',
                textAlign: 'center'
              }}>
                <button 
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#00E5A8',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setNotifications([]);
                    setShowNotifications(false);
                    toast.info('All notifications marked as read');
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <button 
            className="user-btn" 
            style={styles.userBtn} 
            onClick={() => setShowUserMenu(!showUserMenu)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#162234';
              e.currentTarget.style.color = '#D8EAF8';
              e.currentTarget.style.borderColor = '#243B54';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#6B8FAE';
              e.currentTarget.style.borderColor = '#1C2E44';
            }}
          >
            <FiUser />
            <div style={styles.userAvatar}>{getUserInitials()}</div>
          </button>

          {showUserMenu && (
            <div style={{
              position: 'absolute',
              top: '45px',
              right: '0',
              width: '240px',
              background: '#0C1829',
              border: '1px solid #243B54',
              borderRadius: '14px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
              zIndex: 1000,
              animation: 'dropdownIn 0.2s ease'
            }}>
              <div style={{
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontWeight: 600,
                  fontSize: '14px',
                  color: '#D8EAF8',
                  marginBottom: '4px'
                }}>{getUserName()}</div>
                <div style={{
                  fontSize: '11px',
                  color: '#6B8FAE',
                  marginBottom: '4px'
                }}>{getUserEmail()}</div>
                <div style={{
                  fontSize: '10px',
                  color: '#00E5A8',
                  background: 'rgba(0, 229, 168, 0.12)',
                  display: 'inline-block',
                  padding: '2px 10px',
                  borderRadius: '20px'
                }}>{getUserRole()}</div>
              </div>
              <div style={{
                height: '1px',
                background: '#1C2E44',
                margin: '8px 0'
              }}></div>
              <button 
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '12px',
                  color: '#D8EAF8',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onClick={() => {
                  navigate('/profile');
                  setShowUserMenu(false);
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#162234'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <FiUserCheck size={14} /> My Profile
              </button>
              <button 
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '12px',
                  color: '#D8EAF8',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onClick={() => {
                  navigate('/settings');
                  setShowUserMenu(false);
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#162234'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <FiSettings size={14} /> Settings
              </button>
              <div style={{
                height: '1px',
                background: '#1C2E44',
                margin: '8px 0'
              }}></div>
              <button 
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '12px',
                  color: '#FF5A65',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onClick={() => {
                  handleLogout();
                  setShowUserMenu(false);
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 90, 101, 0.09)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <FiLogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>

        <button 
          className="btn-primary-custom" 
          style={styles.btnPrimaryCustom} 
          onClick={onAddAssetClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 229, 168, 0.36)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 229, 168, 0.22)';
          }}
        >
          <FiSearch /> Add Asset
        </button>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes dropdownIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .notification-item.danger {
            border-left: 3px solid #FF5A65;
          }
          .notification-item.warn {
            border-left: 3px solid #FFC542;
          }
          .notification-item.info {
            border-left: 3px solid #4F9EF8;
          }
          
          .breadcrumb a:hover {
            color: #00E5A8;
          }
          
          @media (max-width: 768px) {
            .btn-primary-custom span {
              display: none;
            }
            .btn-primary-custom {
              padding: 8px !important;
            }
          }
        `
      }} />
    </header>
  );
};

export default Topbar;