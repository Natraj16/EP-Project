import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateRequestPDF = (request) => {
  const doc = new jsPDF();
  
  // Colors
  const primaryColor = [37, 99, 235]; // blue-600
  const secondaryColor = [55, 65, 81]; // gray-700
  const lightGray = [243, 244, 246]; // gray-100
  
  // Page dimensions
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  
  // Helper function to add page numbers
  const addPageNumber = () => {
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(9);
    doc.setTextColor(150);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth - margin - 20,
        pageHeight - 10
      );
    }
  };
  
  // Header with company name
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('PJ INFRA', margin, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Professional Manpower Solutions', margin, 28);
  
  // Title
  let yPosition = 55;
  doc.setTextColor(...secondaryColor);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Service Request Report', margin, yPosition);
  
  // Request ID and Status
  yPosition += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text(`Request ID: #${request._id?.slice(-6) || 'N/A'}`, margin, yPosition);
  
  // Status badge
  const statusX = pageWidth - margin - 40;
  const statusColors = {
    'pending': [251, 191, 36],
    'in-progress': [59, 130, 246],
    'completed': [34, 197, 94],
    'cancelled': [239, 68, 68],
  };
  const statusColor = statusColors[request.status] || [156, 163, 175];
  
  doc.setFillColor(...statusColor);
  doc.roundedRect(statusX - 5, yPosition - 6, 45, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(request.status.toUpperCase(), statusX, yPosition);
  
  // Basic Information Section
  yPosition += 20;
  doc.setFillColor(...lightGray);
  doc.rect(margin, yPosition - 7, pageWidth - 2 * margin, 8, 'F');
  doc.setTextColor(...primaryColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Basic Information', margin + 2, yPosition - 1);
  
  yPosition += 8;
  
  const basicInfo = [
    ['Service Type', `${request.serviceType || 'N/A'} - ${request.category || 'N/A'}`],
    ['Created Date', request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A'],
    ['Start Date', request.startDate ? new Date(request.startDate).toLocaleDateString() : 'Not specified'],
    ['Location', request.location || 'Not specified'],
  ];
  
  doc.autoTable({
    startY: yPosition,
    head: [],
    body: basicInfo,
    theme: 'plain',
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: secondaryColor, cellWidth: 50 },
      1: { textColor: [75, 85, 99] },
    },
    margin: { left: margin, right: margin },
  });
  
  // Request Details Section
  yPosition = doc.lastAutoTable.finalY + 15;
  doc.setFillColor(...lightGray);
  doc.rect(margin, yPosition - 7, pageWidth - 2 * margin, 8, 'F');
  doc.setTextColor(...primaryColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Request Details', margin + 2, yPosition - 1);
  
  yPosition += 8;
  
  const requestDetails = [
    ['Number of Personnel', `${request.numberOfPersonnel || 0} persons`],
    ['Duration', request.duration || 'N/A'],
    ['Shift Type', request.shiftType ? request.shiftType.charAt(0).toUpperCase() + request.shiftType.slice(1) : 'N/A'],
  ];
  
  if (request.budget) {
    requestDetails.push(['Budget', `Rs. ${request.budget.toLocaleString()}`]);
  }
  
  doc.autoTable({
    startY: yPosition,
    head: [],
    body: requestDetails,
    theme: 'plain',
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: secondaryColor, cellWidth: 50 },
      1: { textColor: [75, 85, 99] },
    },
    margin: { left: margin, right: margin },
  });
  
  // Description Section
  if (request.description) {
    yPosition = doc.lastAutoTable.finalY + 15;
    
    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 30;
    }
    
    doc.setFillColor(...lightGray);
    doc.rect(margin, yPosition - 7, pageWidth - 2 * margin, 8, 'F');
    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Description', margin + 2, yPosition - 1);
    
    yPosition += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    
    const descriptionLines = doc.splitTextToSize(request.description, pageWidth - 2 * margin);
    doc.text(descriptionLines, margin, yPosition);
    yPosition += descriptionLines.length * 5 + 10;
  }
  
  // Requirements Section
  if (request.requirements) {
    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 30;
    }
    
    doc.setFillColor(...lightGray);
    doc.rect(margin, yPosition - 7, pageWidth - 2 * margin, 8, 'F');
    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Requirements', margin + 2, yPosition - 1);
    
    yPosition += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    
    const requirementsLines = doc.splitTextToSize(request.requirements, pageWidth - 2 * margin);
    doc.text(requirementsLines, margin, yPosition);
    yPosition += requirementsLines.length * 5 + 10;
  }
  
  // Assigned Staff Section
  if (request.assignedTo) {
    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 30;
    }
    
    doc.setFillColor(...lightGray);
    doc.rect(margin, yPosition - 7, pageWidth - 2 * margin, 8, 'F');
    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Assigned Staff', margin + 2, yPosition - 1);
    
    yPosition += 8;
    
    const staffInfo = [
      ['Name', request.assignedTo.name || 'N/A'],
      ['Email', request.assignedTo.email || 'N/A'],
    ];
    
    if (request.assignedTo.phone) {
      staffInfo.push(['Phone', request.assignedTo.phone]);
    }
    
    doc.autoTable({
      startY: yPosition,
      head: [],
      body: staffInfo,
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: 4,
      },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: secondaryColor, cellWidth: 50 },
        1: { textColor: [75, 85, 99] },
      },
      margin: { left: margin, right: margin },
    });
    
    yPosition = doc.lastAutoTable.finalY + 15;
  }
  
  // Timeline Section
  if (request.timeline && request.timeline.length > 0) {
    // Check if we need a new page
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = 30;
    }
    
    doc.setFillColor(...lightGray);
    doc.rect(margin, yPosition - 7, pageWidth - 2 * margin, 8, 'F');
    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Request Timeline', margin + 2, yPosition - 1);
    
    yPosition += 8;
    
    const timelineData = request.timeline.map(item => [
      item.status?.charAt(0).toUpperCase() + item.status?.slice(1) || 'N/A',
      item.comment || 'No comment',
      new Date(item.updatedAt).toLocaleString(),
    ]);
    
    doc.autoTable({
      startY: yPosition,
      head: [['Status', 'Comment', 'Date/Time']],
      body: timelineData,
      theme: 'striped',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 35, fontStyle: 'bold' },
        1: { cellWidth: 75 },
        2: { cellWidth: 50 },
      },
      margin: { left: margin, right: margin },
    });
  }
  
  // Footer
  const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : yPosition;
  if (finalY < pageHeight - 50) {
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.setFont('helvetica', 'italic');
    doc.text(
      'This is a computer-generated report. No signature is required.',
      margin,
      pageHeight - 25
    );
    doc.text(
      `Generated on: ${new Date().toLocaleString()}`,
      margin,
      pageHeight - 20
    );
  }
  
  // Add page numbers
  addPageNumber();
  
  // Generate filename
  const filename = `request-${request._id?.slice(-6) || 'report'}-${new Date().getTime()}.pdf`;
  
  // Save the PDF
  doc.save(filename);
};
