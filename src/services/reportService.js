import { saveAs } from 'file-saver';
import api from './api';

export const reportService = {
  // Generate and download reports
  generateReport: async (reportType, format, filters = {}) => {
    try {
      let data;
      
      // Fetch data based on report type
      switch (reportType) {
        case 'asset-inventory':
          data = await fetchAssetInventory(filters);
          break;
        case 'asset-assignment':
          data = await fetchAssetAssignments(filters);
          break;
        case 'maintenance':
          data = await fetchMaintenanceHistory(filters);
          break;
        case 'transfer-history':
          data = await fetchTransferHistory(filters);
          break;
        case 'category-summary':
          data = await fetchCategorySummary(filters);
          break;
        case 'location-inventory':
          data = await fetchLocationInventory(filters);
          break;
        default:
          data = [];
          break;
      }

      // Generate report based on format
      switch (format) {
        case 'html':
          return generateHTMLReport(reportType, data, filters);
        case 'txt':
          return generateTextReport(reportType, data, filters);
        case 'doc':
          return generateWordReport(reportType, data, filters);
        default:
          return generateHTMLReport(reportType, data, filters);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  },

  // Send report via email
  sendReportByEmail: async (reportType, format, email, filters = {}) => {
    try {
      let data;
      
      // Fetch data based on report type
      switch (reportType) {
        case 'asset-inventory':
          data = await fetchAssetInventory(filters);
          break;
        case 'asset-assignment':
          data = await fetchAssetAssignments(filters);
          break;
        case 'maintenance':
          data = await fetchMaintenanceHistory(filters);
          break;
        case 'transfer-history':
          data = await fetchTransferHistory(filters);
          break;
        case 'category-summary':
          data = await fetchCategorySummary(filters);
          break;
        case 'location-inventory':
          data = await fetchLocationInventory(filters);
          break;
        default:
          data = [];
          break;
      }

      // Generate report content based on format
      let reportContent;
      let fileName;
      
      switch (format) {
        case 'html':
          reportContent = generateHTMLReportContent(reportType, data, filters);
          fileName = `${getReportTitle(reportType).replace(/\s/g, '_')}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.html`;
          break;
        case 'txt':
          reportContent = generateTextReportContent(reportType, data, filters);
          fileName = `${getReportTitle(reportType).replace(/\s/g, '_')}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
          break;
        case 'doc':
          reportContent = generateWordReportContent(reportType, data, filters);
          fileName = `${getReportTitle(reportType).replace(/\s/g, '_')}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.doc`;
          break;
        default:
          reportContent = generateHTMLReportContent(reportType, data, filters);
          fileName = `${getReportTitle(reportType).replace(/\s/g, '_')}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.html`;
          break;
      }

      // Send email via backend API (or mock for demo)
      const response = await api.post('/reports/send-email/', {
        email,
        subject: `${getReportTitle(reportType)} - ${new Date().toLocaleDateString()}`,
        content: reportContent,
        fileName: fileName,
        format: format
      });

      return response.data;
    } catch (error) {
      console.error('Error sending report email:', error);
      throw error;
    }
  },

  // Get all scheduled reports
  getScheduledReports: () => {
    const schedules = localStorage.getItem('reportSchedules');
    return schedules ? JSON.parse(schedules) : [];
  },

  // Save scheduled report
  saveScheduledReport: (schedule) => {
    const schedules = reportService.getScheduledReports();
    const newSchedule = {
      id: Date.now(),
      ...schedule,
      createdAt: new Date().toISOString(),
      lastSent: null,
      nextRun: calculateNextRun(schedule)
    };
    schedules.push(newSchedule);
    localStorage.setItem('reportSchedules', JSON.stringify(schedules));
    return newSchedule;
  },

  // Update scheduled report
  updateScheduledReport: (id, updates) => {
    const schedules = reportService.getScheduledReports();
    const index = schedules.findIndex(s => s.id === id);
    if (index !== -1) {
      schedules[index] = { ...schedules[index], ...updates, nextRun: calculateNextRun({ ...schedules[index], ...updates }) };
      localStorage.setItem('reportSchedules', JSON.stringify(schedules));
      return schedules[index];
    }
    return null;
  },

  // Delete scheduled report
  deleteScheduledReport: (id) => {
    const schedules = reportService.getScheduledReports();
    const filtered = schedules.filter(s => s.id !== id);
    localStorage.setItem('reportSchedules', JSON.stringify(filtered));
    return filtered;
  },

  // Process scheduled reports (should be called periodically)
  processScheduledReports: async () => {
    const schedules = reportService.getScheduledReports();
    const now = new Date();
    let processed = false;

    for (const schedule of schedules) {
      if (schedule.active && schedule.nextRun && new Date(schedule.nextRun) <= now) {
        try {
          // Generate and send the report
          await reportService.sendReportByEmail(
            schedule.reportType,
            schedule.format,
            schedule.email,
            {
              start_date: schedule.startDate || '',
              end_date: schedule.endDate || ''
            }
          );
          
          // Update last sent and next run
          const newNextRun = calculateNextRun(schedule, true);
          reportService.updateScheduledReport(schedule.id, {
            lastSent: now.toISOString(),
            nextRun: newNextRun
          });
          
          processed = true;
        } catch (error) {
          console.error(`Failed to send scheduled report ${schedule.id}:`, error);
        }
      }
    }
    
    return processed;
  }
};

// Helper function to calculate next run time
const calculateNextRun = (schedule, fromLastRun = false) => {
  const now = new Date();
  const [hours, minutes] = schedule.time.split(':').map(Number);
  
  let nextRun = new Date();
  nextRun.setHours(hours, minutes, 0, 0);
  
  if (schedule.frequency === 'daily') {
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }
  } else if (schedule.frequency === 'weekly') {
    const targetDay = getDayNumber(schedule.dayOfWeek);
    const currentDay = nextRun.getDay();
    let daysToAdd = targetDay - currentDay;
    if (daysToAdd <= 0) daysToAdd += 7;
    nextRun.setDate(nextRun.getDate() + daysToAdd);
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 7);
    }
  } else if (schedule.frequency === 'monthly') {
    const targetDay = parseInt(schedule.dayOfWeek);
    nextRun.setDate(targetDay);
    if (nextRun <= now) {
      nextRun.setMonth(nextRun.getMonth() + 1);
    }
  }
  
  return nextRun.toISOString();
};

const getDayNumber = (day) => {
  const days = {
    'Sunday': 0,
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6
  };
  return days[day];
};

// Fetch functions with comprehensive mock data
const fetchAssetInventory = async (filters) => {
  return [
    { tag: 'SV-T-001', name: 'iPad Pro 12.9"', category_name: 'Tablet', serial: 'DMPT7F4R2Q', location: 'ICT Dept.', status: 'active', value: 145000 },
    { tag: 'SV-T-002', name: 'iPad Air 5th Gen', category_name: 'Tablet', serial: 'F9VKL23RMX', location: 'Finance Dept.', status: 'active', value: 95000 },
    { tag: 'SV-T-003', name: 'Samsung Tab S9', category_name: 'Tablet', serial: 'R9GMN42LXP', location: 'Admin Office', status: 'active', value: 88000 },
    { tag: 'SV-T-004', name: 'iPad Air 5th Gen (64GB)', category_name: 'Tablet', serial: 'GXRN112WEV', location: 'Stores Room A', status: 'stock', value: 82000 },
    { tag: 'SV-L-001', name: 'Dell XPS 15', category_name: 'Laptop', serial: '5CD22301GHX', location: 'Finance Dept.', status: 'active', value: 185000 },
    { tag: 'SV-L-002', name: 'HP EliteBook 840 G9', category_name: 'Laptop', serial: '5CD14X8K9P', location: 'ICT Dept.', status: 'active', value: 120000 },
    { tag: 'SV-L-003', name: 'Lenovo ThinkPad X1', category_name: 'Laptop', serial: 'PF4X92VKL1', location: 'Admin Office', status: 'active', value: 210000 },
    { tag: 'SV-L-005', name: 'Dell Latitude 5530', category_name: 'Laptop', serial: 'BIOS-7R2K9XA', location: 'Stores Room A', status: 'stock', value: 85000 },
    { tag: 'SV-V-001', name: 'Toyota Hiace Van', category_name: 'Vehicle', serial: 'KEC 899T', location: 'Parking Bay A', status: 'active', value: 3200000 },
    { tag: 'SV-V-002', name: 'Land Cruiser Prado', category_name: 'Vehicle', serial: 'KDG 221Z', location: 'Parking Bay B', status: 'active', value: 8500000 },
    { tag: 'SV-F-001', name: 'Conference Table', category_name: 'Furniture', serial: 'FURN-001', location: 'Board Room A', status: 'active', value: 85000 },
    { tag: 'SV-AV-001', name: 'Epson Projector', category_name: 'AV', serial: 'X9TR221LMN', location: 'Board Room A', status: 'active', value: 95000 },
  ];
};

const fetchAssetAssignments = async (filters) => {
  return [
    { asset_tag: 'SV-T-001', asset_name: 'iPad Pro 12.9"', employee_name: 'John Maina', department: 'ICT', assigned_date: '2025-01-12', expected_return: '2026-12-31' },
    { asset_tag: 'SV-T-002', asset_name: 'iPad Air 5th Gen', employee_name: 'Alice Njeri', department: 'Finance', assigned_date: '2025-02-03', expected_return: '2026-12-31' },
    { asset_tag: 'SV-T-003', asset_name: 'Samsung Tab S9', employee_name: 'Peter Kamau', department: 'Admin', assigned_date: '2025-02-15', expected_return: '2026-12-31' },
    { asset_tag: 'SV-L-001', asset_name: 'Dell XPS 15', employee_name: 'Christine Kamau', department: 'Finance', assigned_date: '2025-01-05', expected_return: '2026-12-31' },
    { asset_tag: 'SV-L-002', asset_name: 'HP EliteBook 840 G9', employee_name: 'David Onyango', department: 'ICT', assigned_date: '2025-01-12', expected_return: '2026-12-31' },
  ];
};

const fetchMaintenanceHistory = async (filters) => {
  return [
    { asset_tag: 'SV-T-005', asset_name: 'iPad Mini 6th Gen', issue_type: 'Screen Damage', severity: 'High', status: 'in_progress', created_at: '2026-03-10', description: 'Cracked screen after accidental drop' },
    { asset_tag: 'SV-L-006', asset_name: 'HP EliteBook 650 G9', issue_type: 'Hardware Fault', severity: 'Critical', status: 'pending', created_at: '2026-03-12', description: 'Motherboard failure, system won\'t boot' },
    { asset_tag: 'SV-AP-004', asset_name: 'Water Dispenser', issue_type: 'Routine Maintenance', severity: 'Low', status: 'completed', created_at: '2026-03-08', description: 'Filter replacement and cleaning' },
  ];
};

const fetchTransferHistory = async (filters) => {
  return [
    { asset_tag: 'SV-T-001', asset_name: 'iPad Pro 12.9"', from_location: 'ICT Dept.', to_location: 'Finance Dept.', transferred_by_name: 'Admin Kuria', transferred_date: '2026-03-15', reason: 'Department reassignment' },
    { asset_tag: 'SV-L-002', asset_name: 'HP EliteBook 840 G9', from_location: 'Stores Room A', to_location: 'ICT Dept.', transferred_by_name: 'Admin Kuria', transferred_date: '2026-03-14', reason: 'New staff allocation' },
    { asset_tag: 'SV-F-004', asset_name: 'Staff Desks × 6', from_location: 'Stores Room A', to_location: 'Finance Dept.', transferred_by_name: 'Admin Kuria', transferred_date: '2026-03-12', reason: 'Office renovation' },
  ];
};

const fetchCategorySummary = async (filters) => {
  return [
    { category: 'Tablets', total: 12, active: 9, in_stock: 2, under_repair: 1, missing: 0 },
    { category: 'Laptops', total: 8, active: 6, in_stock: 1, under_repair: 1, missing: 0 },
    { category: 'Furniture', total: 15, active: 14, in_stock: 1, under_repair: 0, missing: 0 },
    { category: 'Vehicles', total: 3, active: 3, in_stock: 0, under_repair: 0, missing: 0 },
    { category: 'AV Equipment', total: 5, active: 4, in_stock: 1, under_repair: 0, missing: 0 },
    { category: 'Appliances', total: 6, active: 5, in_stock: 0, under_repair: 1, missing: 0 },
  ];
};

const fetchLocationInventory = async (filters) => {
  return [
    { location: 'Nairobi HQ', total: 42, categories: 'All types', value: 12500000 },
    { location: 'Kisumu Branch', total: 8, categories: 'Laptops, Tablets', value: 850000 },
    { location: 'Accra Branch', total: 5, categories: 'Laptops, Tablets', value: 600000 },
    { location: 'Stores Room A', total: 12, categories: 'Various', value: 450000 },
    { location: 'Board Room A', total: 8, categories: 'Furniture, AV', value: 280000 },
  ];
};

// HTML Report Generation (for email)
const generateHTMLReportContent = (reportType, data, filters) => {
  if (!data || data.length === 0) {
    throw new Error('No data available for this report');
  }
  
  const title = getReportTitle(reportType);
  const date = new Date().toLocaleString();
  const userName = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).first_name : 'Admin Seovo';
  
  let tableHtml = generateTableHTML(reportType, data);
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', 'Calibri', Arial, sans-serif;
      background: #07101F;
      color: #D8EAF8;
      padding: 40px;
      position: relative;
      min-height: 100vh;
    }
    body::before {
      content: "SeovoSolutions 2026";
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 80px;
      font-weight: bold;
      color: rgba(255, 255, 255, 0.05);
      white-space: nowrap;
      pointer-events: none;
      z-index: 999;
      font-family: Arial, sans-serif;
    }
    .report-container {
      max-width: 1200px;
      margin: 0 auto;
      background: #0F1A2B;
      border-radius: 14px;
      padding: 30px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      position: relative;
      z-index: 1;
    }
    h1 {
      font-size: 28px;
      background: linear-gradient(90deg, #D8EAF8 50%, #00E5A8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 10px;
    }
    .header-info {
      color: #6B8FAE;
      font-size: 12px;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #1C2E44;
    }
    .report-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      font-size: 12px;
    }
    .report-table th {
      background: #00E5A8;
      color: #07101F;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }
    .report-table td {
      padding: 10px 12px;
      border-bottom: 1px solid #1C2E44;
    }
    .report-table tr:hover { background: rgba(255,255,255,0.03); }
    .mono { font-family: 'Courier New', monospace; color: #4F9EF8; font-size: 11px; }
    .number { text-align: right; font-weight: 600; }
    .value { text-align: right; color: #00E5A8; font-weight: 600; }
    .status-active, .status-stock, .status-repair, .status-missing,
    .severity-low, .severity-medium, .severity-high, .severity-critical {
      display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;
    }
    .status-active { background: rgba(0,229,168,0.12); color: #00E5A8; }
    .status-stock { background: rgba(79,158,248,0.12); color: #4F9EF8; }
    .status-repair { background: rgba(255,197,66,0.12); color: #FFC542; }
    .status-missing { background: rgba(255,90,101,0.12); color: #FF5A65; }
    .severity-low { background: rgba(0,229,168,0.12); color: #00E5A8; }
    .severity-medium { background: rgba(79,158,248,0.12); color: #4F9EF8; }
    .severity-high { background: rgba(255,197,66,0.12); color: #FFC542; }
    .severity-critical { background: rgba(255,90,101,0.12); color: #FF5A65; }
    .footer {
      margin-top: 30px; padding-top: 20px; border-top: 1px solid #1C2E44;
      text-align: center; font-size: 10px; color: #3D5A78;
    }
  </style>
</head>
<body>
  <div class="report-container">
    <h1>${title}</h1>
    <div class="header-info">
      <strong>Seovo Solutions Asset Management System</strong><br>
      Generated: ${date} | Generated by: ${userName}
      ${filters.start_date || filters.end_date ? `<br>Date Range: ${filters.start_date || 'All'} to ${filters.end_date || 'All'}` : ''}
    </div>
    ${tableHtml}
    <div class="footer">
      <p>This report was generated automatically by Seovo Solutions AMS.</p>
      <p>© ${new Date().getFullYear()} Seovo Solutions. All rights reserved.</p>
      <p style="margin-top: 5px;">SeovoSolutions 2026</p>
    </div>
  </div>
</body>
</html>`;
};

// HTML Report Generation (for download)
const generateHTMLReport = (reportType, data, filters) => {
  const content = generateHTMLReportContent(reportType, data, filters);
  const title = getReportTitle(reportType);
  const blob = new Blob([content], { type: 'text/html' });
  const fileName = `${title.replace(/\s/g, '_')}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.html`;
  saveAs(blob, fileName);
  return { success: true, fileName };
};

// Text Report Generation (for email)
const generateTextReportContent = (reportType, data, filters) => {
  const title = getReportTitle(reportType);
  const date = new Date().toLocaleString();
  const userName = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).first_name : 'Admin Seovo';
  
  let text = `╔════════════════════════════════════════════════════════════════════╗
║                      SEOVO SOLUTIONS AMS                         ║
║                        ${title.padEnd(45)}                        ║
╚════════════════════════════════════════════════════════════════════╝

Generated: ${date}
Generated by: ${userName}
${filters.start_date || filters.end_date ? `Date Range: ${filters.start_date || 'All'} to ${filters.end_date || 'All'}\n` : ''}
${'='.repeat(80)}

`;
  
  switch (reportType) {
    case 'asset-inventory':
      text += `ASSET INVENTORY REPORT\n${'='.repeat(60)}\n\n`;
      text += `| ${'Tag'.padEnd(12)} | ${'Name'.padEnd(30)} | ${'Category'.padEnd(12)} | ${'Location'.padEnd(20)} | ${'Status'.padEnd(10)} |\n`;
      text += `${'-'.repeat(95)}\n`;
      data.forEach(item => {
        text += `| ${(item.tag || '').padEnd(12)} | ${(item.name || '').substring(0, 28).padEnd(28)} | ${(item.category_name || '').padEnd(12)} | ${(item.location || '').padEnd(20)} | ${(item.status || '').padEnd(10)} |\n`;
      });
      break;
    default:
      text += `Data available for this report.\n`;
      break;
  }
  
  text += `
${'='.repeat(80)}

╔════════════════════════════════════════════════════════════════════╗
║                    SeovoSolutions 2026                              ║
║              End of Report - Seovo Solutions AMS                    ║
╚════════════════════════════════════════════════════════════════════╝`;
  
  return text;
};

// Text Report Generation (for download)
const generateTextReport = (reportType, data, filters) => {
  const content = generateTextReportContent(reportType, data, filters);
  const title = getReportTitle(reportType);
  const blob = new Blob([content], { type: 'text/plain' });
  const fileName = `${title.replace(/\s/g, '_')}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
  saveAs(blob, fileName);
  return { success: true, fileName };
};

// Word Report Generation (for email)
const generateWordReportContent = (reportType, data, filters) => {
  const title = getReportTitle(reportType);
  const date = new Date().toLocaleString();
  const userName = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).first_name : 'Admin Seovo';
  
  let tableHtml = generateWordTableHTML(reportType, data);
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body {
      font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
      margin: 40px;
      position: relative;
    }
    body::before {
      content: "SeovoSolutions 2026";
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 100px;
      color: rgba(0,0,0,0.05);
      white-space: nowrap;
      pointer-events: none;
      z-index: 1000;
      font-family: Arial, sans-serif;
    }
    h1 { color: #00E5A8; font-size: 28px; margin-bottom: 20px; }
    .report-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .report-table th { background: #00E5A8; color: #07101F; padding: 10px; border: 1px solid #ccc; }
    .report-table td { padding: 8px; border: 1px solid #ccc; }
    .footer { margin-top: 40px; text-align: center; font-size: 10px; color: #666; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p><strong>Generated:</strong> ${date}</p>
  <p><strong>Generated by:</strong> ${userName}</p>
  ${tableHtml}
  <div class="footer">
    <p>© ${new Date().getFullYear()} Seovo Solutions. All rights reserved.</p>
    <p>SeovoSolutions 2026</p>
  </div>
</body>
</html>`;
};

// Word Report Generation (for download)
const generateWordReport = (reportType, data, filters) => {
  const content = generateWordReportContent(reportType, data, filters);
  const title = getReportTitle(reportType);
  const blob = new Blob([content], { type: 'application/msword' });
  const fileName = `${title.replace(/\s/g, '_')}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.doc`;
  saveAs(blob, fileName);
  return { success: true, fileName };
};

// Helper function to generate table HTML for different report types
const generateTableHTML = (reportType, data) => {
  switch (reportType) {
    case 'asset-inventory':
      return `
        <table class="report-table">
          <thead>
            <tr>
              <th>Tag</th><th>Name</th><th>Category</th><th>Serial</th><th>Location</th><th>Status</th><th>Value (KES)</th>
            </thead>
          <tbody>
            ${data.map(item => `
              <tr>
                <td class="mono">${item.tag}</td>
                <td>${item.name}</td>
                <td><span class="category-badge">${item.category_name}</span></td>
                <td class="mono">${item.serial || '-'}</td>
                <td>${item.location}</td>
                <td><span class="status-${item.status}">${item.status}</span></td>
                <td class="value">${item.value ? `KES ${item.value.toLocaleString()}` : '-'}</td>
               </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    case 'asset-assignment':
      return `
        <table class="report-table">
          <thead>
            <tr>
              <th>Asset Tag</th><th>Asset Name</th><th>Assigned To</th><th>Department</th><th>Assigned Date</th><th>Expected Return</th>
            </thead>
          <tbody>
            ${data.map(item => `
              <tr>
                <td class="mono">${item.asset_tag}</td>
                <td>${item.asset_name}</td>
                <td>${item.employee_name}</td>
                <td>${item.department}</td>
                <td>${new Date(item.assigned_date).toLocaleDateString()}</td>
                <td>${item.expected_return ? new Date(item.expected_return).toLocaleDateString() : '-'}</td>
               </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    default:
      return '<p>Report data available</p>';
  }
};

// Helper function to generate Word table HTML
const generateWordTableHTML = (reportType, data) => {
  switch (reportType) {
    case 'asset-inventory':
      return `
        <table class="report-table" border="1" cellpadding="8" cellspacing="0">
          <thead>
            <tr style="background: #00E5A8;">
              <th>Tag</th><th>Name</th><th>Category</th><th>Serial</th><th>Location</th><th>Status</th><th>Value (KES)</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(item => `
              <tr>
                <td>${item.tag}</td>
                <td>${item.name}</td>
                <td>${item.category_name}</td>
                <td>${item.serial || '-'}</td>
                <td>${item.location}</td>
                <td>${item.status}</td>
                <td>${item.value ? `KES ${item.value.toLocaleString()}` : '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    default:
      return `<p>Report data available with ${data.length} records</p>`;
  }
};

// Helper function to get report title
const getReportTitle = (reportType) => {
  const titles = {
    'asset-inventory': 'Asset Inventory Report',
    'asset-assignment': 'Asset Assignment Report',
    'maintenance': 'Maintenance History Report',
    'transfer-history': 'Transfer History Report',
    'category-summary': 'Category Summary Report',
    'location-inventory': 'Location Inventory Report'
  };
  return titles[reportType] || 'Asset Management Report';
};

export default reportService;