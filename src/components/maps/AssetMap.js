import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './AssetMap.css';

// Fix for default marker icons in Leaflet with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AssetMap = ({ 
  assets = [], 
  center = [-1.2892, 36.8172], 
  zoom = 12,
  height = '400px',
  showLegend = true,
  onAssetClick,
  showHeadquarters = true,
  showAssetLabels = false
}) => {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markersRef = useRef([]);

  // Asset locations database (can be passed as props or use internal)
  const headquarters = {
    name: 'Seovo HQ',
    lat: -1.2892,
    lng: 36.8172,
    address: 'Upper Hill, Nairobi'
  };

  // Status colors for markers
  const statusColors = {
    active: '#00E5A8',
    stock: '#4F9EF8',
    repair: '#FFC542',
    missing: '#FF5A65',
    retired: '#3D5A78'
  };

  const statusLabels = {
    active: 'Active',
    stock: 'In Stock',
    repair: 'Under Repair',
    missing: 'Missing',
    retired: 'Retired'
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    // Create map instance
    leafletMap.current = L.map(mapRef.current).setView(center, zoom);

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 20,
      minZoom: 2
    }).addTo(leafletMap.current);

    // Add headquarters marker if enabled
    if (showHeadquarters) {
      addHeadquartersMarker();
    }

    // Cleanup on unmount
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [center, zoom, showHeadquarters]);

  // Update markers when assets change
  useEffect(() => {
    if (!leafletMap.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      if (leafletMap.current) {
        leafletMap.current.removeLayer(marker);
      }
    });
    markersRef.current = [];

    // Add new markers
    if (assets && assets.length > 0) {
      assets.forEach(asset => {
        if (asset.lat && asset.lng) {
          addAssetMarker(asset);
        }
      });

      // Fit bounds to show all markers
      if (assets.length > 0 && assets.some(a => a.lat && a.lng)) {
        const validMarkers = assets.filter(a => a.lat && a.lng);
        if (validMarkers.length > 0) {
          const bounds = L.latLngBounds(validMarkers.map(a => [a.lat, a.lng]));
          if (showHeadquarters) {
            bounds.extend([headquarters.lat, headquarters.lng]);
          }
          leafletMap.current.fitBounds(bounds, { padding: [50, 50] });
        }
      }
    }
  }, [assets, showHeadquarters]);

  // Add headquarters marker
  const addHeadquartersMarker = () => {
    if (!leafletMap.current) return;

    const hqIcon = L.divIcon({
      className: 'hq-marker',
      html: '<div class="hq-pin"><span class="hq-icon">🏢</span></div>',
      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -17]
    });

    const marker = L.marker([headquarters.lat, headquarters.lng], { 
      icon: hqIcon,
      zIndexOffset: 1000
    }).addTo(leafletMap.current);

    marker.bindPopup(`
      <div class="map-popup">
        <div class="popup-title">${headquarters.name}</div>
        <div class="popup-address">${headquarters.address}</div>
      </div>
    `);

    markersRef.current.push(marker);
  };

  // Add asset marker
  const addAssetMarker = (asset) => {
    if (!leafletMap.current || !asset.lat || !asset.lng) return;

    const color = statusColors[asset.status] || '#888';
    
    // Create custom icon based on status
    const assetIcon = L.divIcon({
      className: 'asset-marker',
      html: `<div class="asset-pin" style="background-color: ${color};"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      popupAnchor: [0, -12]
    });

    const marker = L.marker([asset.lat, asset.lng], { icon: assetIcon }).addTo(leafletMap.current);

    // Create popup content
    const popupContent = document.createElement('div');
    popupContent.className = 'map-popup';
    
    popupContent.innerHTML = `
      <div class="popup-header">
        <span class="popup-tag">${asset.tag || 'Unknown'}</span>
        <span class="popup-status" style="background-color: ${color};">${statusLabels[asset.status] || asset.status}</span>
      </div>
      <div class="popup-name">${asset.name || 'Unnamed Asset'}</div>
      <div class="popup-details">
        ${asset.assignee ? `<div class="popup-detail"><span class="detail-label">Assignee:</span> ${asset.assignee}</div>` : ''}
        ${asset.dept ? `<div class="popup-detail"><span class="detail-label">Dept:</span> ${asset.dept}</div>` : ''}
        ${asset.location ? `<div class="popup-detail"><span class="detail-label">Location:</span> ${asset.location}</div>` : ''}
        ${asset.serial ? `<div class="popup-detail"><span class="detail-label">Serial:</span> ${asset.serial}</div>` : ''}
      </div>
    `;

    // Add view button if onAssetClick provided
    if (onAssetClick) {
      const viewBtn = document.createElement('button');
      viewBtn.className = 'popup-view-btn';
      viewBtn.textContent = 'View Details';
      viewBtn.onclick = () => {
        onAssetClick(asset);
        if (leafletMap.current) {
          leafletMap.current.closePopup();
        }
      };
      popupContent.appendChild(viewBtn);
    }

    marker.bindPopup(popupContent, {
      maxWidth: 260,
      className: 'custom-popup'
    });

    // Add label if enabled
    if (showAssetLabels) {
      const labelIcon = L.divIcon({
        className: 'asset-label',
        html: `<div class="label-text">${asset.tag}</div>`,
        iconSize: [60, 20],
        iconAnchor: [30, 10]
      });
      
      L.marker([asset.lat, asset.lng], { 
        icon: labelIcon,
        zIndexOffset: -1000,
        interactive: false
      }).addTo(leafletMap.current);
    }

    markersRef.current.push(marker);
  };

  // Add a cluster of assets (for grouped view)
  const addAssetCluster = (clusterData) => {
    if (!leafletMap.current || !clusterData) return;

    const { lat, lng, count, color = '#00E5A8' } = clusterData;

    const clusterIcon = L.divIcon({
      className: 'asset-cluster',
      html: `<div class="cluster-pin" style="background-color: ${color};">${count}</div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    const marker = L.marker([lat, lng], { icon: clusterIcon }).addTo(leafletMap.current);

    if (clusterData.popupContent) {
      marker.bindPopup(clusterData.popupContent);
    }

    markersRef.current.push(marker);
  };

  // Draw a line between two points
  const drawLine = (point1, point2, options = {}) => {
    if (!leafletMap.current) return null;

    const defaultOptions = {
      color: '#4F9EF8',
      weight: 2,
      opacity: 0.6,
      dashArray: '5, 5'
    };

    const lineOptions = { ...defaultOptions, ...options };
    const line = L.polyline([point1, point2], lineOptions).addTo(leafletMap.current);
    
    return line;
  };

  // Draw a circle around a point
  const drawCircle = (center, radius = 50, options = {}) => {
    if (!leafletMap.current) return null;

    const defaultOptions = {
      color: '#00E5A8',
      fillColor: '#00E5A8',
      fillOpacity: 0.1,
      weight: 1,
      dashArray: '4 4'
    };

    const circleOptions = { ...defaultOptions, ...options };
    const circle = L.circle(center, radius, circleOptions).addTo(leafletMap.current);
    
    return circle;
  };

  // Fit map to show all markers
  const fitToMarkers = () => {
    if (!leafletMap.current || markersRef.current.length === 0) return;

    const bounds = L.latLngBounds(markersRef.current.map(m => m.getLatLng()));
    leafletMap.current.fitBounds(bounds, { padding: [50, 50] });
  };

  // Set view to specific coordinates
  const setView = (lat, lng, zoomLevel = 15) => {
    if (!leafletMap.current) return;
    leafletMap.current.setView([lat, lng], zoomLevel);
  };

  // Invalidate map size (useful when map is in a tab or modal)
  const invalidateSize = () => {
    if (!leafletMap.current) return;
    setTimeout(() => {
      if (leafletMap.current) {
        leafletMap.current.invalidateSize();
      }
    }, 100);
  };

  return (
    <div className="asset-map-container">
      <div 
        ref={mapRef} 
        className="asset-map"
        style={{ height, width: '100%' }}
      ></div>
      
      {showLegend && (
        <div className="map-legend">
          <div className="legend-title">Asset Status</div>
          <div className="legend-items">
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: statusColors.active }}></span>
              <span className="legend-label">Active</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: statusColors.stock }}></span>
              <span className="legend-label">In Stock</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: statusColors.repair }}></span>
              <span className="legend-label">Under Repair</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: statusColors.missing }}></span>
              <span className="legend-label">Missing</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: statusColors.retired }}></span>
              <span className="legend-label">Retired</span>
            </div>
          </div>
          {showHeadquarters && (
            <>
              <div className="legend-divider"></div>
              <div className="legend-item">
                <span className="hq-dot">🏢</span>
                <span className="legend-label">Headquarters</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Utility functions that can be used externally
AssetMap.drawLine = (mapInstance, point1, point2, options) => {
  if (!mapInstance) return null;
  return L.polyline([point1, point2], options).addTo(mapInstance);
};

AssetMap.drawCircle = (mapInstance, center, radius, options) => {
  if (!mapInstance) return null;
  return L.circle(center, radius, options).addTo(mapInstance);
};

AssetMap.fitBounds = (mapInstance, bounds, options) => {
  if (!mapInstance) return;
  mapInstance.fitBounds(bounds, options);
};

export default AssetMap;