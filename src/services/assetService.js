import api from './api';

export const assetService = {
  // Dashboard
  getDashboardStats: () => api.get('/assets/dashboard/stats/'),
  getRecentActivity: () => api.get('/assets/recent-activity/'),
  getAlerts: () => api.get('/assets/alerts/'),

  // Assets
  getAllAssets: (params) => api.get('/assets/', { params }),
  getAsset: (id) => api.get(`/assets/${id}/`),
  createAsset: (data) => api.post('/assets/', data),
  updateAsset: (id, data) => api.put(`/assets/${id}/`, data),
  deleteAsset: (id) => api.delete(`/assets/${id}/`),

  // Asset actions
  assignAsset: (id, data) => api.post(`/assets/${id}/assign/`, data),
  transferAsset: (id, data) => api.post(`/assets/${id}/transfer/`, data),
  reportMaintenance: (id, data) => api.post(`/assets/${id}/maintenance/`, data),

  // Category specific
  getTablets: (params) => api.get('/assets/tablets/', { params }),
  getLaptops: (params) => api.get('/assets/laptops/', { params }),
  getFurniture: (params) => api.get('/assets/furniture/', { params }),
  getOtherAssets: (params) => api.get('/assets/other/', { params }),

  // Vehicles
  getVehicles: () => api.get('/assets/vehicles/'),
  updateVehicleInsurance: (id, data) => api.patch(`/assets/vehicles/${id}/insurance/`, data),

  // Locations
  getLocations: () => api.get('/locations/'),
  getLocationHistory: (assetId) => api.get(`/assets/${assetId}/history/`),

  // Search
  globalSearch: (query) => api.get('/assets/search/', { params: { q: query } }),

  // Employees
  getEmployees: () => api.get('/employees/'),
  getEmployee: (id) => api.get(`/employees/${id}/`),

  // Maintenance
  getMaintenanceReports: () => api.get('/maintenance/'),
  getMaintenanceReport: (id) => api.get(`/maintenance/${id}/`),
  updateMaintenanceStatus: (id, status) => api.patch(`/maintenance/${id}/`, { status }),

  // Reports
  generateReport: (type, params) => api.get(`/reports/${type}/`, { params }),
  exportData: (format, filters) => api.get(`/export/${format}/`, { params: filters }),

  // Map data
  getMapData: () => api.get('/map/assets/'),
  getAssetLocation: (id) => api.get(`/assets/${id}/location/`),
};

export default assetService;