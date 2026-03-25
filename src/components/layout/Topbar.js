import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiMenu, 
  FiBell, 
  FiSearch, 
  FiUser, 
  FiHome, 
  FiChevronRight,
  FiLogOut,
  FiUserCheck,
  FiSettings,
  FiTool,
  FiRepeat,
  FiUsers
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const Topbar = ({ pageName, onMenuClick, onSearchClick }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'danger', message: 'SV-O-005 MISSING — Epson Projector', link: '/other-assets' },
    { id: 2, type: 'warn', message: 'KEC 899T — insurance expired', link: '/other-assets' },
    { id: 3, type: 'warn', message: '4 assets due for maintenance', link: '/maintenance' }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    } else {
      // Set default user as Admin Seovo
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
      setUser(defaultUser);
      localStorage.setItem('user', JSON.stringify(defaultUser));
    }
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

  const getUserInitials = () => {
    // Always return "AS" for Admin Seovo
    return 'AS';
  };

  const getUserName = () => {
    // Always return "Admin Seovo"
    return 'Admin Seovo';
  };

  const getUserRole = () => {
    return 'Administrator';
  };

  const getUserEmail = () => {
    return 'admin@seovo.com';
  };

  const styles = {
    topbar: {
      height: '56px',
      background: 'rgba(12, 24, 41, 0.94)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid #1C2E44',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 300
    },
    topbarLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    menuToggle: {
      width: '34px',
      height: '34px',
      borderRadius: '9px',
      background: 'transparent',
      border: '1px solid #1C2E44',
      color: '#6B8FAE',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '13px',
      cursor: 'pointer',
      transition: 'all 0.15s'
    },
    pageTitle: {
      fontFamily: 'Syne, sans-serif',
      fontSize: '15px',
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
      width: '34px',
      height: '34px',
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
    notificationDropdown: {
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
    },
    notificationHeader: {
      padding: '14px 16px',
      borderBottom: '1px solid #1C2E44',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontWeight: 600,
      fontSize: '13px',
      color: '#D8EAF8'
    },
    notificationCount: {
      background: '#162234',
      color: '#6B8FAE',
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '11px'
    },
    notificationList: {
      maxHeight: '300px',
      overflowY: 'auto'
    },
    notificationItem: {
      padding: '12px 16px',
      borderBottom: '1px solid #1C2E44',
      cursor: 'pointer',
      transition: 'background 0.15s'
    },
    notificationFooter: {
      padding: '10px 16px',
      borderTop: '1px solid #1C2E44',
      textAlign: 'center'
    },
    btnLink: {
      background: 'none',
      border: 'none',
      color: '#00E5A8',
      fontSize: '11px',
      fontWeight: 600,
      cursor: 'pointer'
    },
    userBtn: {
      width: '34px',
      height: '34px',
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
    userDropdown: {
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
    },
    userInfo: {
      padding: '16px',
      textAlign: 'center'
    },
    userInfoName: {
      fontWeight: 600,
      fontSize: '14px',
      color: '#D8EAF8',
      marginBottom: '4px'
    },
    userInfoEmail: {
      fontSize: '11px',
      color: '#6B8FAE',
      marginBottom: '4px',
      wordBreak: 'break-all'
    },
    userInfoRole: {
      fontSize: '10px',
      color: '#00E5A8',
      background: 'rgba(0, 229, 168, 0.12)',
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '20px'
    },
    dropdownDivider: {
      height: '1px',
      background: '#1C2E44',
      margin: '8px 0'
    },
    dropdownItem: {
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
    },
    btnPrimaryCustom: {
      background: 'linear-gradient(135deg, #00E5A8, #00C49A)',
      color: '#07101F',
      border: 'none',
      padding: '8px 18px',
      borderRadius: '9px',
      fontWeight: 700,
      fontSize: '12.5px',
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
        <button 
          className="menu-toggle" 
          style={styles.menuToggle} 
          onClick={onMenuClick}
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
          <FiMenu />
        </button>
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
            <div style={styles.notificationDropdown}>
              <div style={styles.notificationHeader}>
                <span>Notifications</span>
                <span style={styles.notificationCount}>{notifications.length}</span>
              </div>
              <div style={styles.notificationList}>
                {notifications.map(notif => (
                  <div 
                    key={notif.id} 
                    className={`notification-item ${notif.type}`}
                    style={styles.notificationItem}
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
              <div style={styles.notificationFooter}>
                <button 
                  className="btn-link" 
                  style={styles.btnLink}
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
            <div style={styles.userDropdown}>
              <div style={styles.userInfo}>
                <div style={styles.userInfoName}>{getUserName()}</div>
                <div style={styles.userInfoEmail}>{getUserEmail()}</div>
                <div style={styles.userInfoRole}>{getUserRole()}</div>
              </div>
              <div style={styles.dropdownDivider}></div>
              <button 
                className="dropdown-item" 
                style={styles.dropdownItem}
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
                className="dropdown-item" 
                style={styles.dropdownItem}
                onClick={() => {
                  navigate('/settings');
                  setShowUserMenu(false);
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#162234'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <FiSettings size={14} /> Settings
              </button>
              <button 
                className="dropdown-item" 
                style={styles.dropdownItem}
                onClick={() => {
                  navigate('/staff');
                  setShowUserMenu(false);
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#162234'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <FiUsers size={14} /> Staff Directory
              </button>
              <button 
                className="dropdown-item" 
                style={styles.dropdownItem}
                onClick={() => {
                  navigate('/transfers');
                  setShowUserMenu(false);
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#162234'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <FiRepeat size={14} /> Transfers
              </button>
              <button 
                className="dropdown-item" 
                style={styles.dropdownItem}
                onClick={() => {
                  navigate('/maintenance');
                  setShowUserMenu(false);
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#162234'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <FiTool size={14} /> Maintenance
              </button>
              <div style={styles.dropdownDivider}></div>
              <button 
                className="dropdown-item logout" 
                style={{ ...styles.dropdownItem, color: '#FF5A65' }}
                onClick={() => {
                  handleLogout();
                  setShowUserMenu(false);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 90, 101, 0.09)';
                  e.currentTarget.style.color = '#FF5A65';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#FF5A65';
                }}
              >
                <FiLogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>

        <button 
          className="btn-primary-custom" 
          style={styles.btnPrimaryCustom} 
          onClick={() => navigate('/add-asset')}
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

      <style>{`
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
            padding: 8px;
          }
        }
      `}</style>
    </header>
  );
};

export default Topbar;