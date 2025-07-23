// Dashboard data from provided JSON
const dashboardData = {
  "rawData": [
    {"Employee": "Sachin", "Project": "Project_A", "ExpenseType": "Accommodation", "OriginalAmount": 247.50, "Currency": "EUR", "AmountINR": 22151.25, "Status": "Approved", "Date": "2025-03-05"},
    {"Employee": "Sachin", "Project": "Project_B", "ExpenseType": "Miscellaneous", "OriginalAmount": 72.35, "Currency": "USD", "AmountINR": 5954.40, "Status": "Approved", "Date": "2025-02-18"},
    {"Employee": "Siva", "Project": "Project_B", "ExpenseType": "Food", "OriginalAmount": 537.41, "Currency": "USD", "AmountINR": 44228.84, "Status": "Approved", "Date": "2025-03-30"},
    {"Employee": "Arjun", "Project": "Project_C", "ExpenseType": "Transportation", "OriginalAmount": 736.89, "Currency": "EUR", "AmountINR": 65951.66, "Status": "Approved", "Date": "2025-05-12"},
    {"Employee": "Urmila", "Project": "Project_B", "ExpenseType": "Transportation", "OriginalAmount": 119.56, "Currency": "USD", "AmountINR": 9839.79, "Status": "Approved", "Date": "2025-04-25"},
    {"Employee": "Arjun", "Project": "Project_C", "ExpenseType": "Transportation", "OriginalAmount": 394.57, "Currency": "USD", "AmountINR": 32473.11, "Status": "Pending", "Date": "2025-03-03"},
    {"Employee": "Dhoni", "Project": "Project_C", "ExpenseType": "Transportation", "OriginalAmount": 546.12, "Currency": "USD", "AmountINR": 44945.68, "Status": "Approved", "Date": "2025-05-25"},
    {"Employee": "Dhoni", "Project": "Project_A", "ExpenseType": "Food", "OriginalAmount": 144.84, "Currency": "EUR", "AmountINR": 12963.18, "Status": "Approved", "Date": "2025-04-20"},
    {"Employee": "Urmila", "Project": "Project_C", "ExpenseType": "Transportation", "OriginalAmount": 622.95, "Currency": "EUR", "AmountINR": 55754.02, "Status": "Pending", "Date": "2025-02-17"},
    {"Employee": "Urmila", "Project": "Project_B", "ExpenseType": "Food", "OriginalAmount": 448.30, "Currency": "EUR", "AmountINR": 40122.85, "Status": "Pending", "Date": "2025-03-02"},
    {"Employee": "Priya", "Project": "Project_A", "ExpenseType": "Accommodation", "OriginalAmount": 1250.00, "Currency": "INR", "AmountINR": 1250.00, "Status": "Approved", "Date": "2025-01-15"},
    {"Employee": "Priya", "Project": "Project_B", "ExpenseType": "Transportation", "OriginalAmount": 850.00, "Currency": "USD", "AmountINR": 69955.00, "Status": "Approved", "Date": "2025-02-10"},
    {"Employee": "Priya", "Project": "Project_C", "ExpenseType": "Food", "OriginalAmount": 1500.00, "Currency": "INR", "AmountINR": 1500.00, "Status": "Approved", "Date": "2025-03-20"},
    {"Employee": "Amit", "Project": "Project_A", "ExpenseType": "Miscellaneous", "OriginalAmount": 400.00, "Currency": "USD", "AmountINR": 32920.00, "Status": "Approved", "Date": "2025-04-05"},
    {"Employee": "Amit", "Project": "Project_B", "ExpenseType": "Transportation", "OriginalAmount": 650.00, "Currency": "EUR", "AmountINR": 58175.00, "Status": "Approved", "Date": "2025-01-28"},
    {"Employee": "Sneha", "Project": "Project_C", "ExpenseType": "Accommodation", "OriginalAmount": 320.00, "Currency": "USD", "AmountINR": 26336.00, "Status": "Approved", "Date": "2025-05-15"},
    {"Employee": "Rahul", "Project": "Project_A", "ExpenseType": "Food", "OriginalAmount": 780.00, "Currency": "EUR", "AmountINR": 69810.00, "Status": "Approved", "Date": "2025-02-25"},
    {"Employee": "Rahul", "Project": "Project_B", "ExpenseType": "Transportation", "OriginalAmount": 1200.00, "Currency": "INR", "AmountINR": 1200.00, "Status": "Approved", "Date": "2025-03-15"},
    {"Employee": "Park", "Project": "Project_C", "ExpenseType": "Miscellaneous", "OriginalAmount": 280.00, "Currency": "USD", "AmountINR": 23044.00, "Status": "Approved", "Date": "2025-04-10"}
  ]
};

// Chart instances
let charts = {};

// Current filters
let currentFilters = {
  project: '',
  employee: '',
  status: ''
};

// Store filtered data for search functionality
let currentTableData = {
  recent: [],
  top: []
};

// Utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount).replace('₹', '₹');
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function getStatusClass(status) {
  return `status--${status.toLowerCase()}`;
}

// Filter functions
function applyFilters(data) {
  return data.filter(item => {
    const projectMatch = !currentFilters.project || item.Project === currentFilters.project;
    const employeeMatch = !currentFilters.employee || item.Employee === currentFilters.employee;
    const statusMatch = !currentFilters.status || item.Status === currentFilters.status;
    return projectMatch && employeeMatch && statusMatch;
  });
}

function getFilteredData() {
  return applyFilters(dashboardData.rawData);
}

function calculateFilteredMetrics(filteredData) {
  const totalReimbursed = filteredData.reduce((sum, item) => sum + item.AmountINR, 0);
  const totalRequests = filteredData.length;
  const approvedRequests = filteredData.filter(item => item.Status === 'Approved').length;
  const pendingRequests = filteredData.filter(item => item.Status === 'Pending').length;
  const declinedRequests = filteredData.filter(item => item.Status === 'Declined').length;
  const projectBTotal = filteredData.filter(item => item.Project === 'Project_B').reduce((sum, item) => sum + item.AmountINR, 0);

  return {
    totalReimbursed,
    totalRequests,
    approvedRequests,
    pendingRequests,
    declinedRequests,
    projectBTotal
  };
}

function updateMetrics() {
  const filteredData = getFilteredData();
  const metrics = calculateFilteredMetrics(filteredData);

  document.getElementById('totalReimbursed').textContent = formatCurrency(metrics.totalReimbursed);
  document.getElementById('totalRequests').textContent = metrics.totalRequests;
  document.getElementById('approvedRequests').textContent = metrics.approvedRequests;
  document.getElementById('pendingRequests').textContent = metrics.pendingRequests;
  document.getElementById('declinedRequests').textContent = metrics.declinedRequests;
  document.getElementById('projectBTotal').textContent = formatCurrency(metrics.projectBTotal);
}

function updateAllVisualizations() {
  updateMetrics();
  updateCharts();
  updateTables();
}

// Chart creation functions
function createEmployeeChart() {
  const ctx = document.getElementById('employeeChart').getContext('2d');
  const filteredData = getFilteredData();
  
  // Group by employee and sum amounts
  const employeeAmounts = {};
  filteredData.forEach(item => {
    employeeAmounts[item.Employee] = (employeeAmounts[item.Employee] || 0) + item.AmountINR;
  });

  const sortedEmployees = Object.entries(employeeAmounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  const employees = sortedEmployees.map(([name]) => name);
  const amounts = sortedEmployees.map(([,amount]) => amount);

  if (charts.employee) {
    charts.employee.destroy();
  }

  charts.employee = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: employees,
      datasets: [{
        label: 'Total Amount (₹)',
        data: amounts,
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'],
        borderColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Amount: ${formatCurrency(context.parsed.x)}`;
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return formatCurrency(value);
            }
          }
        }
      }
    }
  });
}

function createProjectChart() {
  const ctx = document.getElementById('projectChart').getContext('2d');
  const filteredData = getFilteredData();
  
  // Group by project and sum amounts
  const projectAmounts = {};
  filteredData.forEach(item => {
    projectAmounts[item.Project] = (projectAmounts[item.Project] || 0) + item.AmountINR;
  });

  const projects = Object.keys(projectAmounts);
  const amounts = Object.values(projectAmounts);

  if (charts.project) {
    charts.project.destroy();
  }

  charts.project = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: projects,
      datasets: [{
        data: amounts,
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C'],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
              return `${context.label}: ${formatCurrency(context.parsed)} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

function createExpenseChart() {
  const ctx = document.getElementById('expenseChart').getContext('2d');
  const filteredData = getFilteredData();
  
  // Group by expense type and sum amounts
  const expenseAmounts = {};
  filteredData.forEach(item => {
    expenseAmounts[item.ExpenseType] = (expenseAmounts[item.ExpenseType] || 0) + item.AmountINR;
  });

  const expenses = Object.keys(expenseAmounts);
  const amounts = Object.values(expenseAmounts);

  if (charts.expense) {
    charts.expense.destroy();
  }

  charts.expense = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: expenses,
      datasets: [{
        label: 'Total Amount (₹)',
        data: amounts,
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5'],
        borderColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Amount: ${formatCurrency(context.parsed.y)}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return formatCurrency(value);
            }
          }
        }
      }
    }
  });
}

function createStatusChart() {
  const ctx = document.getElementById('statusChart').getContext('2d');
  const filteredData = getFilteredData();
  
  // Group by status and count
  const statusCounts = {};
  filteredData.forEach(item => {
    statusCounts[item.Status] = (statusCounts[item.Status] || 0) + 1;
  });

  const statuses = Object.keys(statusCounts);
  const counts = Object.values(statusCounts);

  if (charts.status) {
    charts.status.destroy();
  }

  charts.status = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: statuses,
      datasets: [{
        data: counts,
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C'],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
              return `${context.label}: ${context.parsed} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

function updateCharts() {
  createEmployeeChart();
  createProjectChart();
  createExpenseChart();
  createStatusChart();
}

// Table functions
function createTableRow(item, includeStatus = true) {
  const statusCell = includeStatus ? 
    `<td><span class="status ${getStatusClass(item.Status)}">${item.Status}</span></td>` : '';
  
  return `
    <tr>
      <td>${formatDate(item.Date)}</td>
      <td>${item.Employee}</td>
      <td>${item.Project}</td>
      <td>${item.ExpenseType}</td>
      <td>${formatCurrency(item.AmountINR)}</td>
      ${statusCell}
    </tr>
  `;
}

function updateTables() {
  const filteredData = getFilteredData();
  
  // Recent requests (sorted by date, descending)
  currentTableData.recent = [...filteredData]
    .sort((a, b) => new Date(b.Date) - new Date(a.Date))
    .slice(0, 10);
  
  const recentTableBody = document.getElementById('recentTableBody');
  if (currentTableData.recent.length > 0) {
    recentTableBody.innerHTML = currentTableData.recent.map(item => createTableRow(item, true)).join('');
  } else {
    recentTableBody.innerHTML = '<tr><td colspan="6" class="table-empty">No data found</td></tr>';
  }

  // Top expenses (sorted by amount, descending)
  currentTableData.top = [...filteredData]
    .sort((a, b) => b.AmountINR - a.AmountINR)
    .slice(0, 10);
  
  const topTableBody = document.getElementById('topTableBody');
  if (currentTableData.top.length > 0) {
    topTableBody.innerHTML = currentTableData.top.map(item => createTableRow(item, true)).join('');
  } else {
    topTableBody.innerHTML = '<tr><td colspan="6" class="table-empty">No data found</td></tr>';
  }
  
  // Clear search boxes when data updates
  document.getElementById('recentSearch').value = '';
  document.getElementById('topSearch').value = '';
}

function sortTable(tableId, column, order) {
  const tbody = document.getElementById(tableId + 'Body');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  
  if (rows.length === 0 || rows[0].cells.length === 1) return; // Skip if no data
  
  rows.sort((a, b) => {
    const aValue = a.cells[getColumnIndex(column)].textContent.trim();
    const bValue = b.cells[getColumnIndex(column)].textContent.trim();
    
    if (column === 'AmountINR') {
      const aNum = parseFloat(aValue.replace(/[₹,]/g, ''));
      const bNum = parseFloat(bValue.replace(/[₹,]/g, ''));
      return order === 'asc' ? aNum - bNum : bNum - aNum;
    } else if (column === 'Date') {
      const aDate = new Date(aValue);
      const bDate = new Date(bValue);
      return order === 'asc' ? aDate - bDate : bDate - aDate;
    } else {
      return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
  });
  
  tbody.innerHTML = '';
  rows.forEach(row => tbody.appendChild(row));
}

function getColumnIndex(column) {
  const columnMap = {
    'Date': 0,
    'Employee': 1,
    'Project': 2,
    'ExpenseType': 3,
    'AmountINR': 4,
    'Status': 5
  };
  return columnMap[column] || 0;
}

function searchTable(tableId, searchTerm) {
  const tbody = document.getElementById(tableId + 'Body');
  const rows = tbody.querySelectorAll('tr');
  let visibleCount = 0;
  
  rows.forEach(row => {
    if (row.cells.length === 1) return; // Skip empty state row
    
    const text = row.textContent.toLowerCase();
    const match = text.includes(searchTerm.toLowerCase());
    row.style.display = match ? '' : 'none';
    if (match) visibleCount++;
  });
  
  console.log(`Search "${searchTerm}" in ${tableId}: ${visibleCount} visible rows`);
}

// Export function
function exportToCSV(data, filename) {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }
  
  const headers = ['Date', 'Employee', 'Project', 'ExpenseType', 'AmountINR', 'Status'];
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  return true; // Indicate success
}

// Initialize employee filter options
function populateEmployeeFilter() {
  const employeeSelect = document.getElementById('employeeFilter');
  const uniqueEmployees = [...new Set(dashboardData.rawData.map(item => item.Employee))].sort();
  
  // Clear existing options except the first one
  while (employeeSelect.children.length > 1) {
    employeeSelect.removeChild(employeeSelect.lastChild);
  }
  
  uniqueEmployees.forEach(employee => {
    const option = document.createElement('option');
    option.value = employee;
    option.textContent = employee;
    employeeSelect.appendChild(option);
  });
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  console.log('Dashboard initializing...');
  
  // Set current date
  document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Initialize employee filter
  populateEmployeeFilter();

  // Initialize visualizations
  setTimeout(() => {
    updateAllVisualizations();
  }, 100);

  // Filter event listeners
  const projectFilter = document.getElementById('projectFilter');
  const employeeFilter = document.getElementById('employeeFilter');
  const statusFilter = document.getElementById('statusFilter');
  const clearFiltersBtn = document.getElementById('clearFilters');

  projectFilter.addEventListener('change', function(e) {
    currentFilters.project = e.target.value;
    console.log('Project filter changed to:', e.target.value);
    updateAllVisualizations();
  });

  employeeFilter.addEventListener('change', function(e) {
    currentFilters.employee = e.target.value;
    console.log('Employee filter changed to:', e.target.value);
    updateAllVisualizations();
  });

  statusFilter.addEventListener('change', function(e) {
    currentFilters.status = e.target.value;
    console.log('Status filter changed to:', e.target.value);
    updateAllVisualizations();
  });

  clearFiltersBtn.addEventListener('click', function(e) {
    e.preventDefault();
    currentFilters = { project: '', employee: '', status: '' };
    projectFilter.value = '';
    employeeFilter.value = '';
    statusFilter.value = '';
    console.log('Filters cleared');
    updateAllVisualizations();
  });

  // Table sorting
  document.querySelectorAll('.data-table th[data-sort]').forEach(header => {
    header.addEventListener('click', function(e) {
      e.preventDefault();
      const column = this.dataset.sort;
      const tableId = this.closest('table').id;
      const currentOrder = this.classList.contains('sort-asc') ? 'desc' : 'asc';
      
      // Remove sort classes from all headers in this table
      this.closest('table').querySelectorAll('th').forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
      
      // Add sort class to clicked header
      this.classList.add(currentOrder === 'asc' ? 'sort-asc' : 'sort-desc');
      
      sortTable(tableId, column, currentOrder);
      console.log(`Sorted ${tableId} by ${column} ${currentOrder}`);
    });
  });

  // Table search
  const recentSearch = document.getElementById('recentSearch');
  const topSearch = document.getElementById('topSearch');

  recentSearch.addEventListener('input', function(e) {
    searchTable('recentTable', e.target.value);
  });

  topSearch.addEventListener('input', function(e) {
    searchTable('topTable', e.target.value);
  });

  // Export functionality
  const exportRecentBtn = document.getElementById('exportRecent');
  const exportTopBtn = document.getElementById('exportTop');

  exportRecentBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const success = exportToCSV(currentTableData.recent, 'recent_requests.csv');
    
    if (success) {
      const originalText = this.textContent;
      this.textContent = 'Downloaded!';
      this.classList.add('btn--success');
      setTimeout(() => {
        this.textContent = originalText;
        this.classList.remove('btn--success');
      }, 2000);
    }
  });

  exportTopBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const success = exportToCSV(currentTableData.top, 'top_expenses.csv');
    
    if (success) {
      const originalText = this.textContent;
      this.textContent = 'Downloaded!';
      this.classList.add('btn--success');
      setTimeout(() => {
        this.textContent = originalText;
        this.classList.remove('btn--success');
      }, 2000);
    }
  });
  
  console.log('Dashboard initialized successfully');
});