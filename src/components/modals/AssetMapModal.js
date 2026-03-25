import React, { useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FiMapPin, FiMove, FiX, FiExternalLink } from 'react-icons/fi';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AssetMapModal = ({ show, onHide, asset, onMove }) => {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);

  // Asset locations database
  const assetLocations = {
    'SV-T-001': { lat: -1.289200, lng: 36.817200, floor: 'ICT Dept. — Floor 2', address: 'Seovo HQ, Upper Hill, Nairobi' },
    'SV-T-002': { lat: -1.289210, lng: 36.817180, floor: 'Finance Dept. — Floor 1', address: 'Seovo HQ, Upper Hill, Nairobi' },
    'SV-T-003': { lat: -1.289190, lng: 36.817230, floor: 'Admin Office — Floor 1', address: 'Seovo HQ, Upper Hill, Nairobi' },
    'SV-T-004': { lat: -1.289300, lng: 36.817100, floor: 'Stores Room A — Ground', address: 'Seovo HQ, Upper Hill, Nairobi' },
    'SV-T-005': { lat: -1.289220, lng: 36.817300, floor: 'ICT Workshop — Floor 2', address: 'Seovo HQ, Upper Hill, Nairobi' },
    'SV-T-006': { lat: -0.102200, lng: 34.761700, floor: 'Kisumu Branch Office', address: 'Kisumu Town Centre, Kisumu' },
    'SV-T-007': { lat: -1.289170, lng: 36.817240, floor: 'Admin Office — Floor 1', address: 'Seovo HQ, Upper Hill, Nairobi' },
    'SV-T-008': { lat: -1.289300, lng: 36.817110, floor: 'Stores Room A — Ground', address: 'Seovo HQ, Upper Hill, Nairobi' },
    'SV-T-010': { lat: 5.603600, lng: -0.186900, floor: 'Accra Branch — Floor 1', address: 'Accra Office, Ghana' },
    'SV-T-011': { lat: -17.828900, lng: 31.052800, floor: 'Harare Office — Floor 1', address: 'Harare Branch, Zimbabwe' },
    'SV-T-012': { lat: 38.895100, lng: -77.036400, floor: 'Washington DC — Floor 4', address: 'Washington DC Office, USA' },
    'SV-L-001': { lat: -1.289180, lng: 36.817210, floor: 'Finance Dept. — Floor 1', address: 'Seovo HQ, Upper Hill, Nairobi' },
    'SV-L-002': { lat: -1.289230, lng: 36.817190, floor: 'ICT Dept. — Floor 2', address: 'Seovo HQ, Upper Hill, Nairobi' },
    'SV-L-003': { lat: -1.289170, lng: 36.817240, floor: 'Admin Office — Floor 1', address: 'Seovo HQ, Upper Hill, Nairobi' },
    'SV-L-004': { lat: -1.289240, lng: 36.817160, floor: 'Design Room — Floor 2', address: 'Seovo HQ, Upper Hill, Nairobi' },
    'SV-L-005': { lat: -1.289310, lng: 36.817090, floor: 'Stores Room A — Ground', address: 'Seovo HQ, Upper Hill, Nairobi' },
    'SV-L-006': { lat: -1.289220, lng: 36.817300, floor: 'ICT Workshop — Floor 2', address: 'Seovo HQ, Upper Hill, Nairobi' },
    'SV-L-007': { lat: -0.102500, lng: 34.762000, floor: 'Kisumu Branch Office', address: 'Kisumu Town Centre, Kisumu' },
    'SV-L-008': { lat: -1.289310, lng: 36.817100, floor: 'Stores Room B — Ground', address: 'Seovo HQ, Upper Hill, Nairobi' },
    'SV-L-010': { lat: 5.604200, lng: -0.187200, floor: 'Accra Branch — Floor 1', address: 'Accra Office, Ghana' },
    'SV-L-012': { lat: -17.829500, lng: 31.053100, floor: 'Harare Office — Floor 1', address: 'Harare Branch, Zimbabwe' },
    'SV-L-014': { lat: 38.895100, lng: -77.036400, floor: 'Washington DC — Floor 4', address: 'Washington DC Office, USA' },
    'SV-L-015': { lat: 38.895600, lng: -77.036800, floor: 'Washington DC — Floor 4', address: 'Washington DC Office, USA' },
    'SV-V-001': { lat: -1.292100, lng: 36.821900, floor: 'Parking Bay A — Ground', address: 'Upper Hill Parking Yard, Nairobi' },
    'SV-V-002': { lat: -1.292500, lng: 36.822100, floor: 'Parking Bay B — Ground', address: 'Upper Hill Parking Yard, Nairobi' },
    'SV-V-003': { lat: -0.102200, lng: 34.761700, floor: 'Field — Kisumu Office', address: 'Kisumu Town Centre, Kisumu' },
    'SV-AV-001': { lat: -1.289150, lng: 36.817260, floor: 'Board Room A — Floor 3', address: 'Seovo HQ, Upper Hill, Nairobi' },
    'SV-AV-002': { lat: -1.289160, lng: 36.817270, floor: 'Board Room B — Floor 3', address: 'Seovo HQ, Upper Hill, Nairobi' },
    'SV-AV-004': { lat: -1.289300, lng: 36.817100, floor: 'Stores Room A — Ground', address: 'Seovo HQ, Upper Hill, Nairobi' },
    'SV-AP-001': { lat: -1.289130, lng: 36.817200, floor: 'Staff Lounge — Floor 1', address: 'Seovo HQ, Upper Hill, Nairobi' },
    'SV-AP-005': { lat: -1.289200, lng: 36.817200, floor: 'Admin Office — Floor 1', address: 'Seovo HQ, Upper Hill, Nairobi' },
    'SV-NET-001': { lat: -1.289200, lng: 36.817320, floor: 'Server Room — Ground', address: 'Seovo HQ, Upper Hill, Nairobi' },
    'SV-NET-002': { lat: -1.289200, lng: 36.817320, floor: 'Server Room — Ground', address: 'Seovo HQ, Upper Hill, Nairobi' },
    'SV-NET-003': { lat: -1.289200, lng: 36.817320, floor: 'Server Room — Ground', address: 'Seovo HQ, Upper Hill, Nairobi' },
    'SV-F-001': { lat: -1.289150, lng: 36.817260, floor: 'Board Room A — Floor 3', address: 'Seovo HQ, Upper Hill, Nairobi' },
    'SV-F-002': { lat: -1.289150, lng: 36.817260, floor: 'Board Room A — Floor 3', address: 'Seovo HQ, Upper Hill, Nairobi' },
    'SV-F-003': { lat: -1.289200, lng: 36.817200, floor: 'CEO Office — Floor 3', address: 'Seovo HQ, Upper Hill, Nairobi' },
    'SV-F-004': { lat: -1.289200, lng: 36.817200, floor: 'Finance Dept. — Floor 1', address: 'Seovo HQ, Upper Hill, Nairobi' },
    'SV-O-005': { lat: null, lng: null, floor: 'UNKNOWN — Asset Flagged Missing', address: 'Last seen: Board Room B — 10 Mar 2026' }
  };

  useEffect(() => {
    if (show && asset && mapRef.current) {
      setTimeout(() => {
        initMap();
      }, 100);
    }
  }, [show, asset]);

  useEffect(() => {
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  const initMap = () => {
    if (!mapRef.current) return;

    if (leafletMap.current) {
      leafletMap.current.remove();
    }

    const loc = assetLocations[asset.tag];
    const isMissing = !loc || loc.lat === null;
    
    const defaultLat = -1.2892;
    const defaultLng = 36.8172;
    const lat = (loc && loc.lat) ? loc.lat : defaultLat;
    const lng = (loc && loc.lng) ? loc.lng : defaultLng;
    const zoom = isMissing ? 12 : 17;

    leafletMap.current = L.map(mapRef.current).setView([lat, lng], zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 20
    }).addTo(leafletMap.current);

    if (!isMissing && loc) {
      // Custom pin for asset
      const pinIcon = L.divIcon({
        className: 'asset-pin',
        html: '<div style="width:32px;height:32px;border-radius:50% 50% 50% 0;background:#00E5A8;border:3px solid #fff;transform:rotate(-45deg);box-shadow:0 3px 12px rgba(0,0,0,0.5)"></div>',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -34]
      });

      const marker = L.marker([lat, lng], { icon: pinIcon }).addTo(leafletMap.current);
      
      marker.bindPopup(`
        <div style="background:#0C1829;color:#D8EAF8;padding:4px;min-width:160px">
          <div style="font-weight:700;font-size:13px;margin-bottom:2px">${asset.tag}</div>
          <div style="font-size:11px;color:#6B8FAE;margin-bottom:5px">${asset.name || ''}</div>
          <div style="font-size:11.5px"><b>Room:</b> ${loc.floor}</div>
          <div style="font-size:11.5px;margin-top:2px"><b>Address:</b> ${loc.address}</div>
        </div>
      `, { maxWidth: 240 }).openPopup();

      // Add a circle around the asset
      L.circle([lat, lng], {
        radius: 15,
        color: '#00E5A8',
        fillColor: '#00E5A8',
        fillOpacity: 0.1,
        weight: 1,
        dashArray: '4 4'
      }).addTo(leafletMap.current);

      // Add HQ marker if asset is offsite
      const isOffsite = Math.abs(lat - defaultLat) > 0.0008 || Math.abs(lng - defaultLng) > 0.0008;
      if (isOffsite) {
        const hqIcon = L.divIcon({
          className: 'hq-pin',
          html: '<div style="width:24px;height:24px;border-radius:50%;background:#4F9EF8;border:2px solid #fff;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.4)"><span style="color:#fff;font-size:10px">🏢</span></div>',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        L.marker([defaultLat, defaultLng], { icon: hqIcon })
          .addTo(leafletMap.current)
          .bindPopup(`
            <div style="background:#0C1829;color:#D8EAF8;padding:4px">
              <div style="font-weight:700;font-size:12px">Seovo HQ</div>
              <div style="font-size:10.5px;color:#6B8FAE">Upper Hill, Nairobi</div>
            </div>
          `);

        // Draw line from HQ to asset
        L.polyline([[defaultLat, defaultLng], [lat, lng]], {
          color: '#4F9EF8',
          weight: 1.5,
          dashArray: '6 4',
          opacity: 0.5
        }).addTo(leafletMap.current);

        // Fit bounds to show both markers
        leafletMap.current.fitBounds([[defaultLat, defaultLng], [lat, lng]], { padding: [50, 50] });
      }
    }

    setTimeout(() => {
      if (leafletMap.current) {
        leafletMap.current.invalidateSize();
      }
    }, 150);
  };

  const styles = {
    modalWide: { maxWidth: '760px' },
    modalHead: {
      padding: '20px 22px 16px',
      borderBottom: '1px solid #1C2E44',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: '#0C1829'
    },
    modalTitle: {
      fontFamily: 'Syne, sans-serif',
      fontSize: '14px',
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#D8EAF8'
    },
    modalClose: {
      background: '#162234',
      border: '1px solid #1C2E44',
      color: '#3D5A78',
      width: '28px',
      height: '28px',
      borderRadius: '7px',
      fontSize: '17px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.13s',
      padding: 0
    },
    locationInfo: {
      padding: '11px 18px',
      background: '#162234',
      borderBottom: '1px solid #1C2E44',
      display: 'flex',
      alignItems: 'center',
      gap: '18px',
      flexWrap: 'wrap'
    },
    infoItem: {
      minWidth: '120px'
    },
    infoKey: {
      fontSize: '9.5px',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: '#3D5A78',
      fontWeight: 700
    },
    infoValue: {
      fontSize: '13px',
      fontWeight: 600,
      color: '#D8EAF8',
      marginTop: '2px'
    },
    infoDivider: {
      width: '1px',
      height: '28px',
      background: '#1C2E44'
    },
    googleMapsLink: {
      marginLeft: 'auto',
      background: '#00E5A8',
      color: '#07101F',
      border: 'none',
      padding: '6px 13px',
      borderRadius: '6px',
      fontSize: '11.5px',
      fontWeight: 700,
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      transition: 'all 0.15s'
    },
    mapContainer: {
      position: 'relative',
      height: '380px'
    },
    missingOverlay: {
      position: 'absolute',
      inset: 0,
      zIndex: 500,
      background: 'rgba(7, 16, 31, 0.93)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      textAlign: 'center',
      padding: '24px'
    },
    missingIcon: {
      fontSize: '40px',
      color: '#FF5A65'
    },
    missingTitle: {
      fontFamily: 'Syne, sans-serif',
      fontSize: '17px',
      fontWeight: 800,
      color: '#FF5A65'
    },
    missingText: {
      fontSize: '12.5px',
      color: '#6B8FAE',
      maxWidth: '280px'
    },
    modalFoot: {
      padding: '14px 22px',
      borderTop: '1px solid #1C2E44',
      display: 'flex',
      gap: '8px',
      justifyContent: 'flex-end',
      background: 'rgba(255, 255, 255, 0.011)'
    },
    btnSecondary: {
      background: '#162234',
      color: '#D8EAF8',
      border: '1px solid #243B54',
      padding: '8px 18px',
      borderRadius: '9px',
      fontSize: '12.5px',
      fontWeight: 500,
      transition: 'all 0.15s'
    },
    btnPrimary: {
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
      boxShadow: '0 4px 14px rgba(0, 229, 168, 0.22)'
    },
    leafletMap: {
      height: '100%',
      width: '100%'
    }
  };

  const globalStyle = document.createElement("style");
  globalStyle.textContent = `
    .modal-close:hover {
      background: rgba(255, 90, 101, 0.09);
      color: #FF5A65;
      border-color: rgba(255, 90, 101, 0.3);
    }
    .btn-secondary:hover {
      background: #1C2E44;
      border-color: #243B54;
      color: #D8EAF8;
    }
    .btn-primary-custom:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(0, 229, 168, 0.36);
    }
    .google-maps-link:hover {
      background: #00C49A;
      color: #07101F;
    }
    .leaflet-container {
      background: #0C1829;
    }
    .leaflet-popup-content-wrapper {
      background: #0C1829;
      border: 1px solid #1C2E44;
      color: #D8EAF8;
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    }
    .leaflet-popup-tip {
      background: #0C1829;
    }
    .leaflet-popup-close-button {
      color: #3D5A78 !important;
    }
    @media (max-width: 768px) {
      .location-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }
      .info-divider {
        display: none;
      }
      .google-maps-link {
        margin-left: 0;
      }
    }
  `;
  document.head.appendChild(globalStyle);

  if (!asset) return null;

  const loc = assetLocations[asset.tag];
  const isMissing = !loc || loc.lat === null;

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      className="asset-map-modal"
      dialogClassName="modal-wide"
    >
      <Modal.Header style={styles.modalHead}>
        <Modal.Title style={styles.modalTitle}>
          <FiMapPin style={{ color: '#00E5A8' }} /> 
          Asset Location — <span className="mono" style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#4F9EF8' }}>{asset.tag}</span>
          {asset.name && ` — ${asset.name}`}
        </Modal.Title>
        <Button variant="link" className="modal-close" style={styles.modalClose} onClick={onHide}>
          <FiX />
        </Button>
      </Modal.Header>

      <Modal.Body style={{ padding: 0 }}>
        <div style={styles.locationInfo}>
          <div style={styles.infoItem}>
            <div style={styles.infoKey}>Floor / Room</div>
            <div style={styles.infoValue}>{loc ? loc.floor : 'Unknown'}</div>
          </div>
          <div style={styles.infoDivider}></div>
          <div style={styles.infoItem}>
            <div style={styles.infoKey}>Address</div>
            <div style={{ ...styles.infoValue, fontSize: '12px', color: '#6B8FAE' }}>{loc ? loc.address : 'Unknown'}</div>
          </div>
          <div style={styles.infoDivider}></div>
          <div style={styles.infoItem}>
            <div style={styles.infoKey}>GPS</div>
            <div style={{ ...styles.infoValue, fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#4F9EF8' }}>
              {loc && loc.lat ? `${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}` : 'Not available'}
            </div>
          </div>
          
          {loc && loc.lat ? (
            <a 
              href={`https://www.google.com/maps?q=${loc.lat},${loc.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="google-maps-link"
              style={styles.googleMapsLink}
            >
              <FiExternalLink /> Google Maps
            </a>
          ) : (
            <span style={{ ...styles.googleMapsLink, opacity: 0.4, pointerEvents: 'none', cursor: 'not-allowed' }}>
              <FiExternalLink /> Google Maps
            </span>
          )}
        </div>

        <div style={styles.mapContainer}>
          {isMissing && (
            <div style={styles.missingOverlay}>
              <FiMapPin style={styles.missingIcon} />
              <div style={styles.missingTitle}>Location Unknown</div>
              <div style={styles.missingText}>
                Asset flagged <strong style={{ color: '#FF5A65' }}>MISSING</strong>
                <br /><br />
                <strong style={{ color: '#D8EAF8' }}>Last seen: Board Room B · 10 Mar 2026</strong>
              </div>
            </div>
          )}
          <div ref={mapRef} style={styles.leafletMap}></div>
        </div>
      </Modal.Body>

      <Modal.Footer style={styles.modalFoot}>
        <Button variant="secondary" style={styles.btnSecondary} onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" className="btn-primary-custom" style={styles.btnPrimary} onClick={onMove}>
          <FiMove /> Move This Asset
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AssetMapModal;