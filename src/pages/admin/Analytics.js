import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Clock, CheckCircle, Download, FileText } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

import API_URL from '../../config/api';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalRequests: 0,
    completionRate: 0,
    avgResponseTime: 0,
    totalRevenue: 0,
    activeClients: 0,
    growthRate: 0,
  });

  const [serviceBreakdown, setServiceBreakdown] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [topClients, setTopClients] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view analytics');
        return;
      }

      // Fetch all requests
      const requestsResponse = await axios.get(`${API_URL}/requests`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Fetch all users
      const usersResponse = await axios.get(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (requestsResponse.data.success && usersResponse.data.success) {
        const requests = requestsResponse.data.data;
        const users = usersResponse.data.data;

        // Store for export
        setAllRequests(requests);
        setAllUsers(users);

        // Calculate analytics
        calculateAnalytics(requests, users);
      }
    } catch (error) {
      console.error('Fetch analytics error:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (requests, users) => {
    // Filter by time range
    const now = new Date();
    const daysMap = {
      '7days': 7,
      '30days': 30,
      '90days': 90,
      '1year': 365
    };
    const days = daysMap[timeRange] || 30;
    const cutoffDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
    
    const filteredRequests = requests.filter(req => 
      new Date(req.createdAt) >= cutoffDate
    );

    // Total requests
    const totalRequests = filteredRequests.length;

    // Completion rate
    const completedRequests = filteredRequests.filter(req => req.status === 'completed').length;
    const completionRate = totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 0;

    // Total revenue from budget
    const totalRevenue = filteredRequests.reduce((sum, req) => sum + (req.budget || 0), 0);

    // Active clients (clients with role='client')
    const activeClients = users.filter(u => u.role === 'client').length;

    // Average response time (mock for now, can be calculated from timeline)
    const avgResponseTime = 18; // hours

    // Growth rate (compare with previous period)
    const previousCutoffDate = new Date(cutoffDate.getTime() - (days * 24 * 60 * 60 * 1000));
    const previousRequests = requests.filter(req => {
      const createdDate = new Date(req.createdAt);
      return createdDate >= previousCutoffDate && createdDate < cutoffDate;
    });
    const growthRate = previousRequests.length > 0 
      ? Math.round(((totalRequests - previousRequests.length) / previousRequests.length) * 1000) / 10
      : 0;

    setAnalytics({
      totalRequests,
      completionRate,
      avgResponseTime,
      totalRevenue,
      activeClients,
      growthRate
    });

    // Service breakdown
    const serviceTypes = ['security', 'labor', 'technical', 'medical'];
    const breakdown = serviceTypes.map(type => {
      const typeRequests = filteredRequests.filter(req => req.serviceType === type);
      const count = typeRequests.length;
      const revenue = typeRequests.reduce((sum, req) => sum + (req.budget || 0), 0);
      const percentage = totalRequests > 0 ? Math.round((count / totalRequests) * 1000) / 10 : 0;
      
      return {
        name: type.charAt(0).toUpperCase() + type.slice(1),
        requests: count,
        percentage,
        revenue
      };
    }).filter(s => s.requests > 0); // Only show services with requests

    setServiceBreakdown(breakdown);

    // Monthly trend (last 6 months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const last6Months = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthRequests = requests.filter(req => {
        const createdDate = new Date(req.createdAt);
        return createdDate >= monthStart && createdDate <= monthEnd;
      });
      
      const monthCompleted = monthRequests.filter(req => req.status === 'completed');
      
      last6Months.push({
        month: monthNames[date.getMonth()],
        requests: monthRequests.length,
        completed: monthCompleted.length
      });
    }
    
    setMonthlyTrend(last6Months);

    // Top clients by request count
    const clientMap = {};
    filteredRequests.forEach(req => {
      if (req.client) {
        const clientId = req.client._id || req.client;
        const clientName = req.client.name || req.client.company || 'Unknown Client';
        const clientBudget = req.budget || 0;
        
        if (!clientMap[clientId]) {
          clientMap[clientId] = {
            name: clientName,
            requests: 0,
            revenue: 0
          };
        }
        clientMap[clientId].requests++;
        clientMap[clientId].revenue += clientBudget;
      }
    });
    
    const topClientsList = Object.values(clientMap)
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 5);
    
    setTopClients(topClientsList);
  };

  // Export to CSV
  const exportToCSV = () => {
    try {
      // Prepare CSV data
      const csvRows = [];
      
      // Header
      csvRows.push('P&J INFRA - Analytics Report');
      csvRows.push(`Generated: ${new Date().toLocaleString()}`);
      csvRows.push(`Time Range: ${timeRange}`);
      csvRows.push('');
      
      // Key Metrics
      csvRows.push('KEY METRICS');
      csvRows.push('Metric,Value');
      csvRows.push(`Total Requests,${analytics.totalRequests}`);
      csvRows.push(`Completion Rate,${analytics.completionRate}%`);
      csvRows.push(`Average Response Time,${analytics.avgResponseTime}h`);
      csvRows.push(`Total Revenue,₹${analytics.totalRevenue}`);
      csvRows.push(`Active Clients,${analytics.activeClients}`);
      csvRows.push(`Growth Rate,${analytics.growthRate}%`);
      csvRows.push('');
      
      // Service Breakdown
      csvRows.push('SERVICE BREAKDOWN');
      csvRows.push('Service,Requests,Percentage,Revenue');
      serviceBreakdown.forEach(service => {
        csvRows.push(`${service.name},${service.requests},${service.percentage}%,₹${service.revenue}`);
      });
      csvRows.push('');
      
      // Top Clients
      csvRows.push('TOP CLIENTS');
      csvRows.push('Rank,Client Name,Requests,Revenue');
      topClients.forEach((client, index) => {
        csvRows.push(`${index + 1},${client.name},${client.requests},₹${client.revenue}`);
      });
      csvRows.push('');
      
      // Monthly Trend
      csvRows.push('MONTHLY TREND');
      csvRows.push('Month,Total Requests,Completed Requests');
      monthlyTrend.forEach(month => {
        csvRows.push(`${month.month},${month.requests},${month.completed}`);
      });
      
      // Create CSV string
      const csvContent = csvRows.join('\n');
      
      // Download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `PJInfra_Analytics_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('CSV exported successfully!');
    } catch (error) {
      console.error('Export CSV error:', error);
      toast.error('Failed to export CSV');
    }
  };

  // Export to PDF
  const exportToPDF = () => {
    try {
      // Create HTML content for PDF
      const printWindow = window.open('', '_blank');
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>P&J INFRA Analytics Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              color: #333;
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
            .metrics-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
              margin: 20px 0;
            }
            .metric-card {
              border: 1px solid #e5e7eb;
              padding: 15px;
              border-radius: 8px;
              background: #f9fafb;
            }
            .metric-card .label {
              font-size: 12px;
              color: #666;
              margin-bottom: 5px;
            }
            .metric-card .value {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
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
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>P&J INFRA</h1>
            <p>Analytics & Performance Report</p>
            <p>Generated: ${new Date().toLocaleString()} | Time Range: ${timeRange}</p>
          </div>

          <div class="section">
            <h2>Key Performance Metrics</h2>
            <div class="metrics-grid">
              <div class="metric-card">
                <div class="label">Total Requests</div>
                <div class="value">${analytics.totalRequests}</div>
              </div>
              <div class="metric-card">
                <div class="label">Completion Rate</div>
                <div class="value">${analytics.completionRate}%</div>
              </div>
              <div class="metric-card">
                <div class="label">Avg Response Time</div>
                <div class="value">${analytics.avgResponseTime}h</div>
              </div>
              <div class="metric-card">
                <div class="label">Total Revenue</div>
                <div class="value">₹${analytics.totalRevenue.toLocaleString()}</div>
              </div>
              <div class="metric-card">
                <div class="label">Active Clients</div>
                <div class="value">${analytics.activeClients}</div>
              </div>
              <div class="metric-card">
                <div class="label">Growth Rate</div>
                <div class="value">${analytics.growthRate}%</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Service Breakdown</h2>
            <table>
              <thead>
                <tr>
                  <th>Service Type</th>
                  <th>Requests</th>
                  <th>Percentage</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                ${serviceBreakdown.map(service => `
                  <tr>
                    <td>${service.name}</td>
                    <td>${service.requests}</td>
                    <td>${service.percentage}%</td>
                    <td>₹${service.revenue.toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2>Top Clients</h2>
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Client Name</th>
                  <th>Requests</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                ${topClients.map((client, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${client.name}</td>
                    <td>${client.requests}</td>
                    <td>₹${client.revenue.toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2>Monthly Trends</h2>
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Total Requests</th>
                  <th>Completed</th>
                  <th>Completion Rate</th>
                </tr>
              </thead>
              <tbody>
                ${monthlyTrend.map(month => `
                  <tr>
                    <td>${month.month}</td>
                    <td>${month.requests}</td>
                    <td>${month.completed}</td>
                    <td>${month.requests > 0 ? Math.round((month.completed / month.requests) * 100) : 0}%</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="footer">
            <p><strong>P&J INFRA</strong> - Manpower Services Provider</p>
            <p>This report is confidential and intended for internal use only.</p>
          </div>

          <div class="no-print" style="margin-top: 30px; text-align: center;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
              Print / Save as PDF
            </button>
            <button onclick="window.close()" style="padding: 10px 20px; background: #6b7280; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-left: 10px;">
              Close
            </button>
          </div>
        </body>
        </html>
      `;
      
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      toast.success('PDF report opened in new window. Use browser Print to save as PDF.');
    } catch (error) {
      console.error('Export PDF error:', error);
      toast.error('Failed to generate PDF');
    }
  };

  // Generate Full Report (Detailed)
  const generateFullReport = async () => {
    try {
      const printWindow = window.open('', '_blank');
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>P&J INFRA - Comprehensive Analytics Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              color: #333;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 3px solid #2563eb;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #2563eb;
              margin: 0;
              font-size: 36px;
            }
            .header .subtitle {
              color: #666;
              font-size: 18px;
              margin: 10px 0;
            }
            .section {
              margin: 40px 0;
              page-break-inside: avoid;
            }
            .section h2 {
              color: #2563eb;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 10px;
              margin-bottom: 20px;
              font-size: 24px;
            }
            .section h3 {
              color: #374151;
              margin: 20px 0 10px 0;
              font-size: 18px;
            }
            .metrics-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
              margin: 20px 0;
            }
            .metric-card {
              border: 1px solid #e5e7eb;
              padding: 20px;
              border-radius: 8px;
              background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .metric-card .label {
              font-size: 14px;
              color: #666;
              margin-bottom: 8px;
            }
            .metric-card .value {
              font-size: 28px;
              font-weight: bold;
              color: #2563eb;
            }
            .metric-card .change {
              font-size: 12px;
              color: #059669;
              margin-top: 5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            th, td {
              padding: 15px;
              text-align: left;
              border-bottom: 1px solid #e5e7eb;
            }
            th {
              background-color: #2563eb;
              color: white;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f9fafb;
            }
            tr:hover {
              background-color: #f3f4f6;
            }
            .summary-box {
              background: #eff6ff;
              border-left: 4px solid #2563eb;
              padding: 20px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer {
              margin-top: 60px;
              text-align: center;
              color: #666;
              font-size: 12px;
              border-top: 2px solid #e5e7eb;
              padding-top: 20px;
            }
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
              .section { page-break-after: always; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>P&J INFRA</h1>
            <div class="subtitle">Comprehensive Analytics & Performance Report</div>
            <p style="color: #666; margin: 10px 0;">
              Report Generated: ${new Date().toLocaleString()}<br>
              Analysis Period: ${timeRange}<br>
              Total Data Points: ${allRequests.length} requests, ${allUsers.length} users
            </p>
          </div>

          <div class="section">
            <h2>Executive Summary</h2>
            <div class="summary-box">
              <h3>Overall Performance</h3>
              <p>During the selected period of <strong>${timeRange}</strong>, P&J INFRA processed a total of <strong>${analytics.totalRequests} service requests</strong> 
              with an impressive completion rate of <strong>${analytics.completionRate}%</strong>. The organization generated a total revenue of 
              <strong>₹${analytics.totalRevenue.toLocaleString()}</strong> while maintaining an average response time of <strong>${analytics.avgResponseTime} hours</strong>.</p>
              
              <p>Our active client base stands at <strong>${analytics.activeClients} clients</strong>, with a growth rate of 
              <strong>${analytics.growthRate}%</strong> compared to the previous period, demonstrating ${analytics.growthRate > 0 ? 'positive momentum' : 'stable operations'} 
              in market expansion.</p>
            </div>
          </div>

          <div class="section">
            <h2>Key Performance Indicators</h2>
            <div class="metrics-grid">
              <div class="metric-card">
                <div class="label">Total Service Requests</div>
                <div class="value">${analytics.totalRequests}</div>
                <div class="change">Growth: ${analytics.growthRate}%</div>
              </div>
              <div class="metric-card">
                <div class="label">Request Completion Rate</div>
                <div class="value">${analytics.completionRate}%</div>
                <div class="change">${analytics.completionRate >= 80 ? 'Excellent Performance' : 'Room for Improvement'}</div>
              </div>
              <div class="metric-card">
                <div class="label">Average Response Time</div>
                <div class="value">${analytics.avgResponseTime}h</div>
                <div class="change">Industry Standard</div>
              </div>
              <div class="metric-card">
                <div class="label">Total Revenue Generated</div>
                <div class="value">₹${analytics.totalRevenue.toLocaleString()}</div>
                <div class="change">From ${analytics.totalRequests} requests</div>
              </div>
              <div class="metric-card">
                <div class="label">Active Client Base</div>
                <div class="value">${analytics.activeClients}</div>
                <div class="change">Registered Clients</div>
              </div>
              <div class="metric-card">
                <div class="label">Business Growth Rate</div>
                <div class="value">${analytics.growthRate}%</div>
                <div class="change">Period-over-Period</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Service Portfolio Analysis</h2>
            <p>Breakdown of services provided during the analysis period:</p>
            <table>
              <thead>
                <tr>
                  <th>Service Type</th>
                  <th>Total Requests</th>
                  <th>Market Share</th>
                  <th>Revenue Generated</th>
                  <th>Avg. Revenue/Request</th>
                </tr>
              </thead>
              <tbody>
                ${serviceBreakdown.map(service => `
                  <tr>
                    <td><strong>${service.name}</strong></td>
                    <td>${service.requests}</td>
                    <td>${service.percentage}%</td>
                    <td>₹${service.revenue.toLocaleString()}</td>
                    <td>₹${service.requests > 0 ? Math.round(service.revenue / service.requests).toLocaleString() : 0}</td>
                  </tr>
                `).join('')}
                <tr style="background: #eff6ff; font-weight: bold;">
                  <td>TOTAL</td>
                  <td>${serviceBreakdown.reduce((sum, s) => sum + s.requests, 0)}</td>
                  <td>100%</td>
                  <td>₹${serviceBreakdown.reduce((sum, s) => sum + s.revenue, 0).toLocaleString()}</td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2>Client Performance Analysis</h2>
            <h3>Top Performing Clients</h3>
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Client Name</th>
                  <th>Total Requests</th>
                  <th>Total Revenue</th>
                  <th>Average per Request</th>
                  <th>Performance Rating</th>
                </tr>
              </thead>
              <tbody>
                ${topClients.map((client, index) => `
                  <tr>
                    <td><strong>#${index + 1}</strong></td>
                    <td>${client.name}</td>
                    <td>${client.requests}</td>
                    <td>₹${client.revenue.toLocaleString()}</td>
                    <td>₹${Math.round(client.revenue / client.requests).toLocaleString()}</td>
                    <td>${index < 2 ? '⭐⭐⭐⭐⭐' : index < 4 ? '⭐⭐⭐⭐' : '⭐⭐⭐'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2>Historical Trends & Patterns</h2>
            <h3>6-Month Request Analysis</h3>
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Total Requests</th>
                  <th>Completed Requests</th>
                  <th>Pending/In-Progress</th>
                  <th>Completion Rate</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                ${monthlyTrend.map((month, index) => {
                  const completionRate = month.requests > 0 ? Math.round((month.completed / month.requests) * 100) : 0;
                  const prevMonth = index > 0 ? monthlyTrend[index - 1] : null;
                  const trend = prevMonth ? (month.requests > prevMonth.requests ? '📈 Up' : month.requests < prevMonth.requests ? '📉 Down' : '➡️ Stable') : '-';
                  return `
                    <tr>
                      <td><strong>${month.month}</strong></td>
                      <td>${month.requests}</td>
                      <td>${month.completed}</td>
                      <td>${month.requests - month.completed}</td>
                      <td>${completionRate}%</td>
                      <td>${trend}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2>Recommendations & Insights</h2>
            <div class="summary-box">
              <h3>Key Findings:</h3>
              <ul>
                <li><strong>Service Diversity:</strong> ${serviceBreakdown.length} active service categories demonstrate portfolio strength</li>
                <li><strong>Client Engagement:</strong> Top 5 clients contribute ${topClients.reduce((sum, c) => sum + c.requests, 0)} requests (${analytics.totalRequests > 0 ? Math.round((topClients.reduce((sum, c) => sum + c.requests, 0) / analytics.totalRequests) * 100) : 0}% of total)</li>
                <li><strong>Completion Efficiency:</strong> ${analytics.completionRate}% completion rate ${analytics.completionRate >= 85 ? 'exceeds' : analytics.completionRate >= 75 ? 'meets' : 'requires attention to meet'} industry standards</li>
                <li><strong>Growth Trajectory:</strong> ${analytics.growthRate > 0 ? `Positive ${analytics.growthRate}% growth indicates strong market position` : 'Opportunity for market expansion strategies'}</li>
              </ul>
            </div>
          </div>

          <div class="footer">
            <p><strong>P&J INFRA - Manpower Services Provider</strong></p>
            <p>Comprehensive Analytics Report | Generated: ${new Date().toLocaleString()}</p>
            <p style="margin-top: 10px; font-size: 10px;">
              This report contains confidential business information and is intended for internal management use only.<br>
              Unauthorized distribution or reproduction is strictly prohibited.
            </p>
          </div>

          <div class="no-print" style="margin-top: 30px; text-align: center;">
            <button onclick="window.print()" style="padding: 12px 30px; background: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; font-weight: bold;">
              📄 Print / Save as PDF
            </button>
            <button onclick="window.close()" style="padding: 12px 30px; background: #6b7280; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-left: 15px;">
              ✖ Close Window
            </button>
          </div>
        </body>
        </html>
      `;
      
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      toast.success('Full report generated! Use browser Print to save as PDF.');
    } catch (error) {
      console.error('Generate report error:', error);
      toast.error('Failed to generate full report');
    }
  };

  const stats = [
    {
      label: 'Total Requests',
      value: analytics.totalRequests,
      change: analytics.growthRate > 0 ? `+${analytics.growthRate}%` : `${analytics.growthRate}%`,
      icon: BarChart3,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Completion Rate',
      value: `${analytics.completionRate}%`,
      change: analytics.completionRate >= 80 ? 'Good' : 'Needs Work',
      icon: CheckCircle,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Avg Response Time',
      value: `${analytics.avgResponseTime}h`,
      change: 'Standard',
      icon: Clock,
      color: 'bg-yellow-50 text-yellow-600',
    },
    {
      label: 'Total Revenue',
      value: `₹${(analytics.totalRevenue / 1000).toFixed(0)}K`,
      change: analytics.totalRevenue > 0 ? 'Active' : 'No data',
      icon: DollarSign,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Active Clients',
      value: analytics.activeClients,
      change: `${analytics.activeClients} registered`,
      icon: Users,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Growth Rate',
      value: `${analytics.growthRate}%`,
      change: timeRange,
      icon: TrendingUp,
      color: 'bg-green-50 text-green-600',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Analytics & Reports</h1>
            <p className="text-gray-600 dark:text-gray-400">Comprehensive insights into your manpower services</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input-field w-48"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon size={24} />
                </div>
                <span className={`text-sm font-medium ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Service Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Service Breakdown</h2>
            {serviceBreakdown.length > 0 ? (
              <div className="space-y-4">
                {serviceBreakdown.map((service, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100">{service.name}</span>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {service.requests} requests
                        </span>
                        <span className="text-xs text-gray-600 ml-2">
                          (₹{(service.revenue / 1000).toFixed(1)}K)
                        </span>
                      </div>
                    </div>
                    <div className="relative w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="absolute top-0 left-0 h-3 bg-primary-600 rounded-full"
                        style={{ width: `${service.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{service.percentage}% of total</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No service data available for the selected time range</p>
              </div>
            )}
          </div>

          {/* Top Clients */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Top Clients</h2>
            {topClients.length > 0 ? (
              <div className="space-y-4">
                {topClients.map((client, index) => (
                  <div key={index} className="flex items-center justify-between pb-4 border-b last:border-b-0">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{client.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{client.requests} requests</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">₹{(client.revenue / 1000).toFixed(1)}K</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No client data available for the selected time range</p>
              </div>
            )}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Request Trends (Last 6 Months)</h2>
          {monthlyTrend.length > 0 && monthlyTrend.some(m => m.requests > 0) ? (
            <div className="overflow-x-auto">
              <div className="flex items-end space-x-6 min-w-max pb-4" style={{ height: '300px' }}>
                {monthlyTrend.map((month, index) => {
                  const maxRequests = Math.max(...monthlyTrend.map(m => m.requests), 1);
                  return (
                    <div key={index} className="flex flex-col items-center justify-end flex-1">
                      <div className="w-full max-w-[80px] space-y-2">
                        <div className="flex flex-col items-center space-y-1">
                          <div
                            className="w-full bg-primary-600 rounded-t-lg transition-all hover:bg-primary-700"
                            style={{ height: `${Math.max((month.requests / maxRequests) * 250, month.requests > 0 ? 20 : 0)}px` }}
                            title={`${month.requests} requests`}
                          ></div>
                          <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{month.requests}</span>
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                          <div
                            className="w-full bg-green-500 rounded-t-lg transition-all hover:bg-green-600"
                            style={{ height: `${Math.max((month.completed / maxRequests) * 250, month.completed > 0 ? 20 : 0)}px` }}
                            title={`${month.completed} completed`}
                          ></div>
                          <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{month.completed}</span>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">{month.month}</p>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-center space-x-6 mt-6">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-primary-600 rounded mr-2"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Total Requests</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Completed</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400">
              <p>No request trend data available</p>
              <p className="text-sm mt-2">Create some requests to see trends over time</p>
            </div>
          )}
        </div>

        {/* Export Options */}
        <div className="mt-8 flex justify-end space-x-4">
          <button 
            onClick={exportToPDF}
            className="btn-outline flex items-center"
            disabled={loading || analytics.totalRequests === 0}
          >
            <FileText size={18} className="mr-2" />
            Export PDF
          </button>
          <button 
            onClick={exportToCSV}
            className="btn-outline flex items-center"
            disabled={loading || analytics.totalRequests === 0}
          >
            <Download size={18} className="mr-2" />
            Export CSV
          </button>
          <button 
            onClick={generateFullReport}
            className="btn-primary flex items-center"
            disabled={loading || analytics.totalRequests === 0}
          >
            <BarChart3 size={18} className="mr-2" />
            Generate Full Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;










