import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Initialize autoTable
if (typeof jsPDF !== 'undefined') {
  autoTable(jsPDF);
}

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
        case 'pdf':
          return generatePDFReport(reportType, data, filters);
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
  }
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

// PDF Report Generation
const generatePDFReport = (reportType, data, filters) => {
  if (!data || data.length === 0) {
    throw new Error('No data available for this report');
  }

  // Create new PDF document in landscape
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });
  
  const title = getReportTitle(reportType);
  const date = new Date().toLocaleString();
  const userName = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).first_name : 'Admin Seovo';
  
  // Set document properties
  doc.setProperties({
    title: title,
    subject: 'Asset Management Report',
    author: 'Seovo Solutions',
    creator: 'Seovo AMS'
  });
  
  // Add header
  doc.setFontSize(20);
  doc.setTextColor(0, 229, 168);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 20);
  
  // Add metadata
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${date}`, 14, 30);
  doc.text(`Generated by: ${userName}`, 14, 35);
  doc.text(`Seovo Solutions Asset Management System`, 14, 40);
  
  // Add date filter if provided
  let yPos = 45;
  if (filters.start_date || filters.end_date) {
    doc.setFontSize(8);
    doc.setTextColor(61, 90, 120);
    const rangeText = `Date Range: ${filters.start_date || 'All'} to ${filters.end_date || 'All'}`;
    doc.text(rangeText, 14, yPos);
    yPos = 50;
  }
  
  // Add separator line
  doc.setDrawColor(28, 46, 68);
  doc.line(14, yPos, 280, yPos);
  
  // Prepare table data
  let headers = [];
  let tableData = [];
  
  switch (reportType) {
    case 'asset-inventory':
      headers = ['Tag', 'Name', 'Category', 'Serial', 'Location', 'Status', 'Value (KES)'];
      tableData = data.map(item => [
        item.tag,
        item.name,
        item.category_name,
        item.serial || '-',
        item.location,
        item.status,
        item.value ? `KES ${item.value.toLocaleString()}` : '-'
      ]);
      break;
    case 'asset-assignment':
      headers = ['Asset Tag', 'Asset Name', 'Assigned To', 'Department', 'Assigned Date', 'Expected Return'];
      tableData = data.map(item => [
        item.asset_tag,
        item.asset_name,
        item.employee_name,
        item.department,
        new Date(item.assigned_date).toLocaleDateString(),
        item.expected_return ? new Date(item.expected_return).toLocaleDateString() : '-'
      ]);
      break;
    case 'maintenance':
      headers = ['Asset Tag', 'Asset Name', 'Issue Type', 'Severity', 'Status', 'Reported Date', 'Description'];
      tableData = data.map(item => [
        item.asset_tag,
        item.asset_name,
        item.issue_type,
        item.severity,
        item.status.replace('_', ' '),
        new Date(item.created_at).toLocaleDateString(),
        item.description.substring(0, 60)
      ]);
      break;
    case 'transfer-history':
      headers = ['Asset Tag', 'Asset Name', 'From', 'To', 'Transferred By', 'Date', 'Reason'];
      tableData = data.map(item => [
        item.asset_tag,
        item.asset_name,
        item.from_location,
        item.to_location,
        item.transferred_by_name,
        item.transferred_date,
        item.reason
      ]);
      break;
    case 'category-summary':
      headers = ['Category', 'Total Assets', 'Active', 'In Stock', 'Under Repair', 'Missing'];
      tableData = data.map(item => [
        item.category,
        item.total,
        item.active,
        item.in_stock,
        item.under_repair,
        item.missing
      ]);
      break;
    case 'location-inventory':
      headers = ['Location', 'Total Assets', 'Categories', 'Value (KES)'];
      tableData = data.map(item => [
        item.location,
        item.total,
        item.categories,
        `KES ${item.value.toLocaleString()}`
      ]);
      break;
    default:
      headers = ['Error'];
      tableData = [['Invalid report type']];
      break;
  }
  
  // Add table to PDF
  if (tableData.length > 0) {
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: yPos + 5,
      theme: 'striped',
      styles: {
        fontSize: 8,
        cellPadding: 3,
        textColor: [216, 234, 248],
        lineColor: [28, 46, 68],
        lineWidth: 0.1,
        font: 'helvetica'
      },
      headStyles: {
        fillColor: [0, 229, 168],
        textColor: [7, 16, 31],
        fontStyle: 'bold',
        fontSize: 9,
        halign: 'left'
      },
      alternateRowStyles: {
        fillColor: [15, 26, 43]
      },
      margin: { top: 55, bottom: 30, left: 14, right: 14 }
    });
  }
  
  // Add watermark to all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Add watermark text
    doc.setFontSize(50);
    doc.setTextColor(200, 200, 200);
    doc.setFont('helvetica', 'bold');
    doc.setGState(new doc.GState({ opacity: 0.1 }));
    
    const watermarkText = 'SeovoSolutions 2026';
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const textWidth = doc.getTextWidth(watermarkText);
    
    // Center watermark
    doc.saveGraphicsState();
    doc.translate(pageWidth / 2, pageHeight / 2);
    doc.rotate(-45);
    doc.text(watermarkText, -textWidth / 2, 0);
    doc.restoreGraphicsState();
    
    // Add footer
    doc.setFontSize(8);
    doc.setTextColor(61, 90, 120);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Seovo Solutions AMS - Page ${i} of ${pageCount} | Generated: ${date}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }
  
  // Save PDF
  const fileName = `${title.replace(/\s/g, '_')}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.pdf`;
  doc.save(fileName);
  return { success: true, fileName };
};

// HTML Report Generation
const generateHTMLReport = (reportType, data, filters) => {
  if (!data || data.length === 0) {
    throw new Error('No data available for this report');
  }
  
  const title = getReportTitle(reportType);
  const date = new Date().toLocaleString();
  const userName = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).first_name : 'Admin Seovo';
  
  let tableHtml = '';
  
  switch (reportType) {
    case 'asset-inventory':
      tableHtml = `
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
      break;
    case 'asset-assignment':
      tableHtml = `
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
      break;
    case 'maintenance':
      tableHtml = `
        <table class="report-table">
          <thead>
            <tr>
              <th>Asset Tag</th><th>Asset Name</th><th>Issue Type</th><th>Severity</th><th>Status</th><th>Reported Date</th><th>Description</th>
            </thead>
          <tbody>
            ${data.map(item => `
              <tr>
                <td class="mono">${item.asset_tag}</td>
                <td>${item.asset_name}</td>
                <td>${item.issue_type}</td>
                <td><span class="severity-${item.severity.toLowerCase()}">${item.severity}</span></td>
                <td><span class="status-${item.status}">${item.status.replace('_', ' ')}</span></td>
                <td>${new Date(item.created_at).toLocaleDateString()}</td>
                <td class="description">${item.description}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      break;
    case 'transfer-history':
      tableHtml = `
        <table class="report-table">
          <thead>
            <tr>
              <th>Asset Tag</th><th>Asset Name</th><th>From</th><th>To</th><th>Transferred By</th><th>Date</th><th>Reason</th>
            </thead>
          <tbody>
            ${data.map(item => `
              <tr>
                <td class="mono">${item.asset_tag}</td>
                <td>${item.asset_name}</td>
                <td>${item.from_location}</td>
                <td>${item.to_location}</td>
                <td>${item.transferred_by_name}</td>
                <td>${item.transferred_date}</td>
                <td>${item.reason}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      break;
    case 'category-summary':
      tableHtml = `
        <table class="report-table">
          <thead>
            <tr>
              <th>Category</th><th>Total Assets</th><th>Active</th><th>In Stock</th><th>Under Repair</th><th>Missing</th>
            </thead>
          <tbody>
            ${data.map(item => `
              <tr>
                <td><strong>${item.category}</strong></td>
                <td class="number">${item.total}</td>
                <td class="number">${item.active}</td>
                <td class="number">${item.in_stock}</td>
                <td class="number">${item.under_repair}</td>
                <td class="number">${item.missing}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      break;
    case 'location-inventory':
      tableHtml = `
        <table class="report-table">
          <thead>
            <tr>
              <th>Location</th><th>Total Assets</th><th>Categories</th><th>Value (KES)</th>
            </thead>
          <tbody>
            ${data.map(item => `
              <tr>
                <td><strong>${item.location}</strong></td>
                <td class="number">${item.total}</td>
                <td>${item.categories}</td>
                <td class="value">KES ${item.value.toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      break;
    default:
      tableHtml = '<p>No data available for this report type</p>';
      break;
  }
  
  const html = `<!DOCTYPE html>
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
    @media print {
      body { background: white; padding: 20px; }
      .report-container { background: white; box-shadow: none; }
      h1 { color: #000; background: none; -webkit-text-fill-color: #000; }
      .report-table th { background: #f0f0f0; color: #000; }
      .report-table td { color: #000; }
      body::before { color: rgba(0,0,0,0.08); font-size: 100px; }
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
  
  const blob = new Blob([html], { type: 'text/html' });
  const fileName = `${title.replace(/\s/g, '_')}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.html`;
  saveAs(blob, fileName);
  return { success: true, fileName };
};

// Text Report Generation
const generateTextReport = (reportType, data, filters) => {
  if (!data || data.length === 0) {
    throw new Error('No data available for this report');
  }
  
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
      text += `ASSET INVENTORY REPORT\n${'='.repeat(50)}\n\n`;
      text += `| ${'Tag'.padEnd(12)} | ${'Name'.padEnd(30)} | ${'Category'.padEnd(12)} | ${'Location'.padEnd(20)} | ${'Status'.padEnd(10)} |\n`;
      text += `${'-'.repeat(95)}\n`;
      data.forEach(item => {
        text += `| ${(item.tag || '').padEnd(12)} | ${(item.name || '').substring(0, 28).padEnd(28)} | ${(item.category_name || '').padEnd(12)} | ${(item.location || '').padEnd(20)} | ${(item.status || '').padEnd(10)} |\n`;
      });
      break;
    case 'asset-assignment':
      text += `ASSET ASSIGNMENT REPORT\n${'='.repeat(50)}\n\n`;
      text += `| ${'Asset Tag'.padEnd(12)} | ${'Asset Name'.padEnd(30)} | ${'Assigned To'.padEnd(20)} | ${'Department'.padEnd(15)} |\n`;
      text += `${'-'.repeat(85)}\n`;
      data.forEach(item => {
        text += `| ${(item.asset_tag || '').padEnd(12)} | ${(item.asset_name || '').substring(0, 28).padEnd(28)} | ${(item.employee_name || '').padEnd(20)} | ${(item.department || '').padEnd(15)} |\n`;
      });
      break;
    default:
      text += `${JSON.stringify(data, null, 2)}\n`;
      break;
  }
  
  text += `
${'='.repeat(80)}

╔════════════════════════════════════════════════════════════════════╗
║                    SeovoSolutions 2026                              ║
║              End of Report - Seovo Solutions AMS                    ║
╚════════════════════════════════════════════════════════════════════╝`;
  
  const blob = new Blob([text], { type: 'text/plain' });
  const fileName = `${title.replace(/\s/g, '_')}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
  saveAs(blob, fileName);
  return { success: true, fileName };
};

// Word Document Generation
const generateWordReport = (reportType, data, filters) => {
  if (!data || data.length === 0) {
    throw new Error('No data available for this report');
  }
  
  const title = getReportTitle(reportType);
  const date = new Date().toLocaleString();
  const userName = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).first_name : 'Admin Seovo';
  
  let tableHtml = '';
  
  switch (reportType) {
    case 'asset-inventory':
      tableHtml = `
        <table class="report-table" border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
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
      break;
    default:
      tableHtml = `<p>Report data available with ${data.length} records</p>`;
      break;
  }
  
  const wordHtml = `<!DOCTYPE html>
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
  
  const blob = new Blob([wordHtml], { type: 'application/msword' });
  const fileName = `${title.replace(/\s/g, '_')}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.doc`;
  saveAs(blob, fileName);
  return { success: true, fileName };
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