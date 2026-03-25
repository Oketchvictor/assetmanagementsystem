import api from './api';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Install required packages if not already installed:
// npm install file-saver jspdf jspdf-autotable

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

// Fetch functions with mock data for demo
const fetchAssetInventory = async (filters) => {
  // Mock data for demonstration
  return [
    { tag: 'SV-T-001', name: 'iPad Pro 12.9"', category_name: 'Tablet', serial: 'DMPT7F4R2Q', location: 'ICT Dept.', status: 'active', value: 145000 },
    { tag: 'SV-T-002', name: 'iPad Air 5th Gen', category_name: 'Tablet', serial: 'F9VKL23RMX', location: 'Finance Dept.', status: 'active', value: 95000 },
    { tag: 'SV-L-001', name: 'Dell XPS 15', category_name: 'Laptop', serial: '5CD22301GHX', location: 'Finance Dept.', status: 'active', value: 185000 },
    { tag: 'SV-L-005', name: 'Dell Latitude 5530', category_name: 'Laptop', serial: 'BIOS-7R2K9XA', location: 'Stores Room A', status: 'stock', value: 85000 },
    { tag: 'SV-V-001', name: 'Toyota Hiace Van', category_name: 'Vehicle', serial: 'KEC 899T', location: 'Parking Bay A', status: 'active', value: 3200000 },
  ];
};

const fetchAssetAssignments = async (filters) => {
  return [
    { asset_tag: 'SV-T-001', asset_name: 'iPad Pro 12.9"', employee_name: 'John Maina', department: 'ICT', assigned_date: '2025-01-12', expected_return: '2026-12-31' },
    { asset_tag: 'SV-T-002', asset_name: 'iPad Air 5th Gen', employee_name: 'Alice Njeri', department: 'Finance', assigned_date: '2025-02-03', expected_return: '2026-12-31' },
    { asset_tag: 'SV-L-001', asset_name: 'Dell XPS 15', employee_name: 'Christine Kamau', department: 'Finance', assigned_date: '2025-01-05', expected_return: '2026-12-31' },
  ];
};

const fetchMaintenanceHistory = async (filters) => {
  return [
    { asset_tag: 'SV-T-005', asset_name: 'iPad Mini 6th Gen', issue_type: 'Screen Damage', severity: 'High', status: 'in_progress', created_at: '2026-03-10', description: 'Cracked screen after accidental drop' },
    { asset_tag: 'SV-L-006', asset_name: 'HP EliteBook 650 G9', issue_type: 'Hardware Fault', severity: 'Critical', status: 'pending', created_at: '2026-03-12', description: 'Motherboard failure, won\'t boot' },
  ];
};

const fetchTransferHistory = async (filters) => {
  return [
    { asset_tag: 'SV-T-001', asset_name: 'iPad Pro 12.9"', from_location: 'ICT Dept.', to_location: 'Finance Dept.', transferred_by_name: 'Admin Kuria', transferred_date: '2026-03-15', reason: 'Department reassignment' },
    { asset_tag: 'SV-L-002', asset_name: 'HP EliteBook 840 G9', from_location: 'Stores Room A', to_location: 'ICT Dept.', transferred_by_name: 'Admin Kuria', transferred_date: '2026-03-14', reason: 'New staff allocation' },
  ];
};

const fetchCategorySummary = async (filters) => {
  return [
    { category: 'Tablets', total: 48, active: 39, in_stock: 7, under_repair: 2, missing: 0 },
    { category: 'Laptops', total: 32, active: 26, in_stock: 4, under_repair: 2, missing: 0 },
    { category: 'Furniture', total: 29, active: 25, in_stock: 3, under_repair: 1, missing: 0 },
    { category: 'Vehicles', total: 3, active: 3, in_stock: 0, under_repair: 0, missing: 0 },
  ];
};

const fetchLocationInventory = async (filters) => {
  return [
    { location: 'Nairobi HQ', total: 85, categories: 'All types', value: 4500000 },
    { location: 'Kisumu Branch', total: 12, categories: 'Laptops, Tablets', value: 850000 },
    { location: 'Accra Branch', total: 8, categories: 'Laptops, Tablets', value: 600000 },
  ];
};

// Helper function to add watermark to PDF
const addWatermark = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(40);
    doc.setTextColor(200, 200, 200);
    doc.setFont('helvetica', 'bold');
    doc.text(
      'SeovoSolutions 2026',
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height / 2,
      { align: 'center', angle: 45 }
    );
  }
};

// PDF Report Generation
const generatePDFReport = async (reportType, data, filters) => {
  const doc = new jsPDF('landscape');
  const title = getReportTitle(reportType);
  const date = new Date().toLocaleString();
  const userName = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).first_name : 'Admin';
  
  // Add title
  doc.setFontSize(24);
  doc.setTextColor(0, 229, 168);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 20);
  
  // Add subtitle
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${date}`, 14, 30);
  doc.text(`Generated by: ${userName}`, 14, 35);
  doc.text(`Seovo Solutions Asset Management System`, 14, 40);
  
  // Add date range filter info if provided
  let yPos = 45;
  if (filters.start_date || filters.end_date) {
    doc.setFontSize(9);
    doc.setTextColor(61, 90, 120);
    const rangeText = `Date Range: ${filters.start_date || 'All'} to ${filters.end_date || 'All'}`;
    doc.text(rangeText, 14, yPos);
    yPos = 50;
  }
  
  // Add horizontal line
  doc.setDrawColor(28, 46, 68);
  doc.line(14, yPos, 280, yPos);
  yPos += 5;
  
  // Prepare table data based on report type
  let tableData = [];
  let headers = [];
  
  switch (reportType) {
    case 'asset-inventory':
      headers = ['Tag', 'Name', 'Category', 'Serial', 'Location', 'Status', 'Value (KES)'];
      tableData = data.map(item => [
        item.tag, item.name, item.category_name, item.serial || '-', 
        item.location, item.status, item.value ? item.value.toLocaleString() : '-'
      ]);
      break;
    case 'asset-assignment':
      headers = ['Asset Tag', 'Asset Name', 'Assigned To', 'Department', 'Assigned Date', 'Expected Return'];
      tableData = data.map(item => [
        item.asset_tag, item.asset_name, item.employee_name, item.department,
        new Date(item.assigned_date).toLocaleDateString(),
        item.expected_return ? new Date(item.expected_return).toLocaleDateString() : '-'
      ]);
      break;
    case 'maintenance':
      headers = ['Asset Tag', 'Asset Name', 'Issue Type', 'Severity', 'Status', 'Reported Date', 'Description'];
      tableData = data.map(item => [
        item.asset_tag, item.asset_name, item.issue_type, item.severity.toUpperCase(),
        item.status.replace('_', ' ').toUpperCase(), 
        new Date(item.created_at).toLocaleDateString(),
        item.description.substring(0, 50)
      ]);
      break;
    case 'transfer-history':
      headers = ['Asset Tag', 'Asset Name', 'From', 'To', 'Transferred By', 'Date', 'Reason'];
      tableData = data.map(item => [
        item.asset_tag, item.asset_name, item.from_location, item.to_location,
        item.transferred_by_name, item.transferred_date, item.reason
      ]);
      break;
    case 'category-summary':
      headers = ['Category', 'Total Assets', 'Active', 'In Stock', 'Under Repair', 'Missing'];
      tableData = data.map(item => [
        item.category, item.total, item.active, item.in_stock, item.under_repair, item.missing
      ]);
      break;
    case 'location-inventory':
      headers = ['Location', 'Total Assets', 'Categories', 'Value (KES)'];
      tableData = data.map(item => [
        item.location, item.total, item.categories, item.value.toLocaleString()
      ]);
      break;
  }
  
  // Add table to PDF
  doc.autoTable({
    head: [headers],
    body: tableData,
    startY: yPos,
    theme: 'striped',
    styles: {
      fontSize: 9,
      cellPadding: 4,
      textColor: [216, 234, 248],
      lineColor: [28, 46, 68],
      lineWidth: 0.1
    },
    headStyles: {
      fillColor: [0, 229, 168],
      textColor: [7, 16, 31],
      fontStyle: 'bold',
      fontSize: 10
    },
    alternateRowStyles: {
      fillColor: [15, 26, 43]
    },
    margin: { top: 55, bottom: 30 }
  });
  
  // Add watermark
  addWatermark(doc);
  
  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(61, 90, 120);
    doc.text(
      `Seovo Solutions AMS - Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  // Save PDF
  const fileName = `${title.replace(/\s/g, '_')}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.pdf`;
  doc.save(fileName);
  return { success: true, fileName };
};

// HTML Report Generation with Watermark
const generateHTMLReport = (reportType, data, filters) => {
  const title = getReportTitle(reportType);
  const date = new Date().toLocaleString();
  const userName = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).first_name : 'Admin';
  
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
                <td>${item.tag}</td>
                <td>${item.name}</td>
                <td>${item.category_name}</td>
                <td>${item.serial || '-'}</td>
                <td>${item.location}</td>
                <td><span class="status-${item.status}">${item.status}</span></td>
                <td>${item.value ? `KES ${item.value.toLocaleString()}` : '-'}</td>
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
                <td>${item.asset_tag}</td>
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
                <td>${item.asset_tag}</td>
                <td>${item.asset_name}</td>
                <td>${item.issue_type}</td>
                <td><span class="severity-${item.severity}">${item.severity}</span></td>
                <td><span class="status-${item.status}">${item.status.replace('_', ' ')}</span></td>
                <td>${new Date(item.created_at).toLocaleDateString()}</td>
                <td>${item.description.substring(0, 60)}</td>
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
                <td>${item.asset_tag}</td>
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
                <td>${item.category}</td>
                <td>${item.total}</td>
                <td>${item.active}</td>
                <td>${item.in_stock}</td>
                <td>${item.under_repair}</td>
                <td>${item.missing}</td>
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
                <td>${item.location}</td>
                <td>${item.total}</td>
                <td>${item.categories}</td>
                <td>KES ${item.value.toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      break;
  }
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #07101F;
          color: #D8EAF8;
          padding: 40px;
          margin: 0;
          position: relative;
        }
        
        /* Watermark */
        body::before {
          content: "SeovoSolutions 2026";
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 60px;
          font-weight: bold;
          color: rgba(255, 255, 255, 0.08);
          white-space: nowrap;
          pointer-events: none;
          z-index: 1000;
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
          font-family: 'Syne', sans-serif;
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
        }
        
        .report-table th {
          background: #00E5A8;
          color: #07101F;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          font-size: 12px;
        }
        
        .report-table td {
          padding: 10px 12px;
          border-bottom: 1px solid #1C2E44;
          font-size: 11px;
        }
        
        .report-table tr:hover {
          background: rgba(255,255,255,0.05);
        }
        
        .status-active, .status-stock, .status-repair, .status-missing,
        .severity-low, .severity-medium, .severity-high, .severity-critical {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
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
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #1C2E44;
          text-align: center;
          font-size: 10px;
          color: #3D5A78;
        }
        
        @media print {
          body { background: white; padding: 20px; }
          .report-container { background: white; box-shadow: none; }
          h1 { color: #000; background: none; -webkit-text-fill-color: #000; }
          .report-table th { background: #f0f0f0; color: #000; }
          .report-table td { color: #000; }
          .header-info, .footer { color: #666; }
          body::before {
            color: rgba(0,0,0,0.05);
            font-size: 50px;
          }
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
        </div>
      </div>
    </body>
    </html>
  `;
  
  const blob = new Blob([html], { type: 'text/html' });
  const fileName = `${title.replace(/\s/g, '_')}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.html`;
  saveAs(blob, fileName);
  return { success: true, fileName };
};

// Text Report Generation with Watermark
const generateTextReport = (reportType, data, filters) => {
  const title = getReportTitle(reportType);
  const date = new Date().toLocaleString();
  const userName = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).first_name : 'Admin';
  
  let text = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                         SEOVO SOLUTIONS AMS                                  ║
║                           ${title}                                           ║
╚══════════════════════════════════════════════════════════════════════════════╝

Generated: ${date}
Generated by: ${userName}
${filters.start_date || filters.end_date ? `Date Range: ${filters.start_date || 'All'} to ${filters.end_date || 'All'}\n` : ''}
${'='.repeat(80)}

`;
  
  switch (reportType) {
    case 'asset-inventory':
      text += `ASSET INVENTORY REPORT\n${'='.repeat(50)}\n\n`;
      text += `| ${'Tag'.padEnd(12)} | ${'Name'.padEnd(25)} | ${'Category'.padEnd(12)} | ${'Location'.padEnd(18)} | ${'Status'.padEnd(10)} |\n`;
      text += `${'-'.repeat(95)}\n`;
      data.forEach(item => {
        text += `| ${(item.tag || '').padEnd(12)} | ${(item.name || '').substring(0, 23).padEnd(23)} | ${(item.category_name || '').padEnd(12)} | ${(item.location || '').padEnd(18)} | ${(item.status || '').padEnd(10)} |\n`;
      });
      break;
    case 'asset-assignment':
      text += `ASSET ASSIGNMENT REPORT\n${'='.repeat(50)}\n\n`;
      text += `| ${'Asset Tag'.padEnd(12)} | ${'Asset Name'.padEnd(25)} | ${'Assigned To'.padEnd(20)} | ${'Department'.padEnd(12)} |\n`;
      text += `${'-'.repeat(85)}\n`;
      data.forEach(item => {
        text += `| ${(item.asset_tag || '').padEnd(12)} | ${(item.asset_name || '').substring(0, 23).padEnd(23)} | ${(item.employee_name || '').padEnd(20)} | ${(item.department || '').padEnd(12)} |\n`;
      });
      break;
    default:
      text += `No data available\n`;
  }
  
  text += `
${'='.repeat(80)}
End of Report - Seovo Solutions Asset Management System
SeovoSolutions 2026
`;
  
  const blob = new Blob([text], { type: 'text/plain' });
  const fileName = `${title.replace(/\s/g, '_')}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
  saveAs(blob, fileName);
  return { success: true, fileName };
};

// Word Document Generation (HTML with .doc extension)
const generateWordReport = async (reportType, data, filters) => {
  const title = getReportTitle(reportType);
  const date = new Date().toLocaleString();
  const userName = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).first_name : 'Admin';
  
  const html = `
    <!DOCTYPE html>
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
        
        /* Watermark for Word */
        body::before {
          content: "SeovoSolutions 2026";
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 80px;
          color: rgba(0,0,0,0.05);
          white-space: nowrap;
          pointer-events: none;
          z-index: 1000;
          font-family: Arial, sans-serif;
        }
        
        h1 {
          color: #00E5A8;
          font-size: 28px;
          margin-bottom: 20px;
        }
        
        .report-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        
        .report-table th {
          background: #00E5A8;
          color: #07101F;
          padding: 10px;
          border: 1px solid #ccc;
        }
        
        .report-table td {
          padding: 8px;
          border: 1px solid #ccc;
        }
        
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 10px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p><strong>Generated:</strong> ${date}</p>
      <p><strong>Generated by:</strong> ${userName}</p>
      ${generateTableHTML(reportType, data)}
      <div class="footer">
        <p>© ${new Date().getFullYear()} Seovo Solutions. All rights reserved.</p>
        <p>SeovoSolutions 2026</p>
      </div>
    </body>
    </html>
  `;
  
  const blob = new Blob([html], { type: 'application/msword' });
  const fileName = `${title.replace(/\s/g, '_')}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.doc`;
  saveAs(blob, fileName);
  return { success: true, fileName };
};

// Helper function to generate table HTML for Word
const generateTableHTML = (reportType, data) => {
  switch (reportType) {
    case 'asset-inventory':
      return `
        <table class="report-table">
          <thead>
            <tr><th>Tag</th><th>Name</th><th>Category</th><th>Serial</th><th>Location</th><th>Status</th><th>Value</th></tr>
          </thead>
          <tbody>
            ${data.map(item => `
              <tr><td>${item.tag}</td><td>${item.name}</td><td>${item.category_name}</td><td>${item.serial || '-'}</td><td>${item.location}</td><td>${item.status}</td><td>${item.value ? `KES ${item.value.toLocaleString()}` : '-'}</td></tr>
            `).join('')}
          </tbody>
        </table>
      `;
    default:
      return `<p>Report data available</p>`;
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