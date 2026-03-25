import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiGrid, FiMonitor, FiHome, FiPackage, 
  FiUsers, FiRepeat, FiTool, FiFileText, FiSettings,
  FiChevronRight, FiMenu
} from 'react-icons/fi';

const Sidebar = ({ collapsed, setCollapsed }) => {
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


  const getBadgeClass = (badge) => {
    if (!badge) return '';
    if (typeof badge === 'object') {
      return `nav-badge ${badge.type}`;
    }
    return 'nav-badge';
  };

  const styles = {
    sidebar: {
      width: collapsed ? '70px' : '260px',
      minHeight: '100vh',
      background: '#0C1829',
      borderRight: '1px solid #1C2E44',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 400,
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '4px 0 24px rgba(0, 0, 0, 0.2)'
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
      display: collapsed ? 'none' : 'block'
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
      textDecoration: 'none'
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
      display: collapsed ? 'none' : 'block'
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
      justifyContent: collapsed ? 'center' : 'flex-start'
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
      display: collapsed ? 'none' : 'block'
    },
    userRole: {
      fontSize: '10.5px',
      color: '#3D5A78',
      display: collapsed ? 'none' : 'block'
    },
    userArrow: {
      color: '#3D5A78',
      fontSize: '9px',
      marginLeft: 'auto',
      display: collapsed ? 'none' : 'block'
    }
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.brand}>
        <div style={styles.brandIcon}>
          <span style={styles.brandIconSpan}>S</span>
        </div>
        {!collapsed && (
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
            {section.items.map((item, itemIdx) => (
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
                {!collapsed && (
                  <>
                    <span style={styles.navText}>{item.text}</span>
                    {item.badge && (
                      <span className={getBadgeClass(item.badge)} style={{
                        marginLeft: 'auto',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: '99px',
                        background: typeof item.badge === 'object' && item.badge.type === 'warn' ? 'rgba(255, 197, 66, 0.14)' : 
                                    typeof item.badge === 'object' && item.badge.type === 'danger' ? 'rgba(255, 90, 101, 0.14)' :
                                    'rgba(0, 229, 168, 0.14)',
                        color: typeof item.badge === 'object' && item.badge.type === 'warn' ? '#FFC542' : 
                               typeof item.badge === 'object' && item.badge.type === 'danger' ? '#FF5A65' :
                               '#00E5A8'
                      }}>
                        {typeof item.badge === 'object' ? item.badge.count : item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </React.Fragment>
        ))}
      </nav>

      <div style={styles.sidebarFooter}>
        <div style={styles.userChip}>
          <div style={styles.avatar}>AS</div>
          {!collapsed && (
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
    </div>
  );
};

// Add global CSS for active state
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .nav-link {
    text-decoration: none;
  }
  .nav-link:hover {
    background: rgba(255, 255, 255, 0.04);
    color: #D8EAF8 !important;
    border-left-color: #243B54 !important;
  }
  .nav-link.active {
    background: rgba(0, 229, 168, 0.08) !important;
    color: #00E5A8 !important;
    border-left-color: #00E5A8 !important;
    font-weight: 600 !important;
  }
  .nav-link.active::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 18px;
    background: #00E5A8;
    border-radius: 3px 0 0 3px;
  }
`;
document.head.appendChild(styleSheet);

export default Sidebar;