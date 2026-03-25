import React from 'react';
import { Link } from 'react-router-dom';
import { FiGrid, FiMonitor, FiHome, FiPackage } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const styles = {
    footer: {
      background: '#0C1829',
      borderTop: '1px solid #1C2E44',
      padding: '18px 28px',
      marginTop: 'auto'
    },
    footerContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '10px'
    },
    footerBrand: {
      display: 'flex',
      alignItems: 'center',
      gap: '9px'
    },
    footerLogo: {
      width: '26px',
      height: '26px',
      borderRadius: '6px',
      background: 'linear-gradient(135deg, #00E5A8, #00C49A)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Syne, sans-serif',
      fontWeight: 800,
      fontSize: '12px',
      color: '#07101F'
    },
    footerText: {
      fontSize: '11.5px',
      color: '#6B8FAE'
    },
    footerTextStrong: {
      color: '#D8EAF8'
    },
    footerStatus: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '11.5px',
      color: '#6B8FAE'
    },
    statusDot: {
      width: '7px',
      height: '7px',
      borderRadius: '50%',
      background: '#00E5A8',
      animation: 'pulseGreen 2.5s infinite'
    },
    footerLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      flexWrap: 'wrap'
    },
    footerLink: {
      fontSize: '11.5px',
      color: '#3D5A78',
      transition: 'color 0.13s',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center'
    },
    footerMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px'
    },
    footerVersion: {
      fontFamily: 'DM Mono, monospace',
      fontSize: '10px',
      color: '#3D5A78',
      background: '#162234',
      padding: '2px 8px',
      borderRadius: '4px',
      border: '1px solid #1C2E44'
    },
    footerCopyright: {
      fontSize: '11px',
      color: '#3D5A78'
    }
  };

  const animationStyle = document.createElement("style");
  animationStyle.textContent = `
    @keyframes pulseGreen {
      0%, 100% { box-shadow: none; }
      50% { box-shadow: 0 0 0 5px rgba(0, 229, 168, 0.18); }
    }
    .footer-link:hover {
      color: #00E5A8;
    }
    @media (max-width: 768px) {
      .footer-content {
        flex-direction: column;
        text-align: center;
      }
      .footer-links {
        justify-content: center;
      }
      .footer-meta {
        justify-content: center;
      }
    }
  `;
  document.head.appendChild(animationStyle);

  return (
    <footer style={styles.footer}>
      <div className="footer-content" style={styles.footerContent}>
        <div style={styles.footerBrand}>
          <div style={styles.footerLogo}>S</div>
          <div style={styles.footerText}>
            <strong style={styles.footerTextStrong}>Seovo Solutions</strong> · Asset Management System
          </div>
        </div>

        <div style={styles.footerStatus}>
          <span style={styles.statusDot}></span>
          <span>All systems operational</span>
        </div>

        <div className="footer-links" style={styles.footerLinks}>
          <Link to="/" className="footer-link" style={styles.footerLink}>
            <FiGrid style={{ marginRight: '4px' }} /> Dashboard
          </Link>
          <Link to="/tablets" className="footer-link" style={styles.footerLink}>
            <FiMonitor style={{ marginRight: '4px' }} /> Tablets
          </Link>
          <Link to="/laptops" className="footer-link" style={styles.footerLink}>
            <FiMonitor style={{ marginRight: '4px' }} /> Laptops
          </Link>
          <Link to="/furniture" className="footer-link" style={styles.footerLink}>
            <FiHome style={{ marginRight: '4px' }} /> Furniture
          </Link>
          <Link to="/other-assets" className="footer-link" style={styles.footerLink}>
            <FiPackage style={{ marginRight: '4px' }} /> Other
          </Link>
        </div>

        <div className="footer-meta" style={styles.footerMeta}>
          <span style={styles.footerVersion}>v2.1.0</span>
          <span style={styles.footerCopyright}>
            &copy; {currentYear} Seovo Solutions
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;