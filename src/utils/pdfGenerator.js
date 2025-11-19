export const generateRequestPDF = (request) => {
  try {
    // Create HTML content for PDF using print window
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      throw new Error('Please allow popups to generate the PDF report');
    }
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Request Report - ${request._id?.slice(-6) || 'N/A'}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #2563eb;
            margin: 0;
            font-size: 32px;
          }
          .header p {
            color: #666;
            margin: 5px 0;
          }
          .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: bold;
            margin: 10px 0;
          }
          .status-pending {
            background-color: #fef3c7;
            color: #92400e;
          }
          .status-in-progress {
            background-color: #dbeafe;
            color: #1e40af;
          }
          .status-completed {
            background-color: #d1fae5;
            color: #065f46;
          }
          .status-cancelled {
            background-color: #fee2e2;
            color: #991b1b;
          }
          .section {
            margin: 30px 0;
            page-break-inside: avoid;
          }
          .section h2 {
            color: #2563eb;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
            margin-bottom: 15px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 180px 1fr;
            gap: 12px;
            margin: 15px 0;
          }
          .info-label {
            font-weight: bold;
            color: #4b5563;
          }
          .info-value {
            color: #1f2937;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
          }
          th {
            background-color: #f3f4f6;
            font-weight: bold;
            color: #2563eb;
          }
          tr:hover {
            background-color: #f9fafb;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
          @media print {
            body {
              padding: 20px;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>PJ INFRA</h1>
          <p>Professional Manpower Solutions</p>
          <p style="font-size: 14px; margin-top: 10px;">Service Request Report</p>
        </div>

        <div class="section">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <p style="margin: 0; font-size: 18px;"><strong>Request #${request._id?.slice(-6) || 'N/A'}</strong></p>
            </div>
            <div>
              <span class="status-badge status-${request.status?.replace(' ', '-') || 'pending'}">
                ${request.status?.toUpperCase() || 'PENDING'}
              </span>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Basic Information</h2>
          <div class="info-grid">
            <div class="info-label">Service Type:</div>
            <div class="info-value">${request.serviceType || 'N/A'} - ${request.category || 'N/A'}</div>
            
            <div class="info-label">Created Date:</div>
            <div class="info-value">${request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A'}</div>
            
            <div class="info-label">Start Date:</div>
            <div class="info-value">${request.startDate ? new Date(request.startDate).toLocaleDateString() : 'Not specified'}</div>
            
            <div class="info-label">Location:</div>
            <div class="info-value">${request.location || 'Not specified'}</div>
          </div>
        </div>

        <div class="section">
          <h2>Request Details</h2>
          <div class="info-grid">
            <div class="info-label">Number of Personnel:</div>
            <div class="info-value">${request.numberOfPersonnel || 0} persons</div>
            
            <div class="info-label">Duration:</div>
            <div class="info-value">${request.duration || 'N/A'}</div>
            
            <div class="info-label">Shift Type:</div>
            <div class="info-value">${request.shiftType ? request.shiftType.charAt(0).toUpperCase() + request.shiftType.slice(1) : 'N/A'}</div>
            
            ${request.budget ? `
            <div class="info-label">Budget:</div>
            <div class="info-value">Rs. ${request.budget.toLocaleString()}</div>
            ` : ''}
          </div>
        </div>

        ${request.description ? `
        <div class="section">
          <h2>Description</h2>
          <p style="line-height: 1.6;">${request.description}</p>
        </div>
        ` : ''}

        ${request.requirements ? `
        <div class="section">
          <h2>Requirements</h2>
          <p style="line-height: 1.6;">${request.requirements}</p>
        </div>
        ` : ''}

        ${request.assignedTo ? `
        <div class="section">
          <h2>Assigned Staff</h2>
          <div class="info-grid">
            <div class="info-label">Name:</div>
            <div class="info-value">${request.assignedTo.name || 'N/A'}</div>
            
            <div class="info-label">Email:</div>
            <div class="info-value">${request.assignedTo.email || 'N/A'}</div>
            
            ${request.assignedTo.phone ? `
            <div class="info-label">Phone:</div>
            <div class="info-value">${request.assignedTo.phone}</div>
            ` : ''}
          </div>
        </div>
        ` : ''}

        ${request.timeline && request.timeline.length > 0 ? `
        <div class="section">
          <h2>Request Timeline</h2>
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Comment</th>
                <th>Date/Time</th>
              </tr>
            </thead>
            <tbody>
              ${request.timeline.map(item => `
                <tr>
                  <td><strong>${item.status?.charAt(0).toUpperCase() + item.status?.slice(1) || 'N/A'}</strong></td>
                  <td>${item.comment || 'No comment'}</td>
                  <td>${new Date(item.updatedAt).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}

        <div class="footer">
          <p>This is a computer-generated report. No signature is required.</p>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <p style="margin-top: 10px;">
            <button class="no-print" onclick="window.print()" style="padding: 10px 20px; background-color: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
              Print / Save as PDF
            </button>
            <button class="no-print" onclick="window.close()" style="padding: 10px 20px; background-color: #6b7280; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; margin-left: 10px;">
              Close
            </button>
          </p>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Auto-trigger print dialog after a short delay
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 250);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
