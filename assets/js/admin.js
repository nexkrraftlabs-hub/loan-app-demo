/**
 * FINBRIDGE — ADMIN DASHBOARD CONTROLLER & CRUD ENGINE
 * Handles Loan Management, Cards, Leads, Applications, Users & Analytics
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdminData();
  renderAdminOverview();
  renderAdminLoansTable();
  renderAdminCardsTable();
  renderAdminApplicationsTable();
  renderAdminLeadsTable();
  renderAdminUsersTable();
  initAdminAnalyticsCharts();
});

function initAdminData() {
  if (!localStorage.getItem('finbridge_admin_loans')) {
    const defaultLoans = [
      { id: 'LN-101', name: 'Prime Personal Loan', bank: 'FinTrust Bank', rate: '10.49% - 16.99%', minAmount: 50000, maxAmount: 4000000, tenure: '12 - 60 Months', fee: 'Up to 2.5%', status: 'Published' },
      { id: 'LN-102', name: 'FastTrack Cash Loan', bank: 'Unity Finance', rate: '10.75% - 17.50%', minAmount: 50000, maxAmount: 4000000, tenure: '12 - 60 Months', fee: 'Up to 2.0%', status: 'Published' },
      { id: 'LN-103', name: 'Flexi Growth Loan', bank: 'Capital Plus', rate: '11.00% - 18.00%', minAmount: 50000, maxAmount: 4000000, tenure: '12 - 60 Months', fee: 'Up to 2.5%', status: 'Published' },
      { id: 'LN-104', name: 'Express Personal Loan', bank: 'QuickLoan', rate: '10.99% - 17.25%', minAmount: 50000, maxAmount: 4000000, tenure: '12 - 60 Months', fee: 'Up to 2.25%', status: 'Published' },
      { id: 'LN-105', name: 'Dream Home Loan', bank: 'HDFC Bank', rate: '8.50% - 9.40%', minAmount: 500000, maxAmount: 50000000, tenure: '60 - 360 Months', fee: '0.5%', status: 'Published' }
    ];
    localStorage.setItem('finbridge_admin_loans', JSON.stringify(defaultLoans));
  }

  if (!localStorage.getItem('finbridge_admin_cards')) {
    const defaultCards = [
      { id: 'CC-201', name: 'Regalia Gold Credit Card', bank: 'HDFC Bank', annualFee: '₹ 2,500', rewardRate: '4X Points', lounge: '12 Domestic/yr', status: 'Published' },
      { id: 'CC-202', name: 'Cashback Credit Card', bank: 'SBI Card', annualFee: '₹ 999', rewardRate: '5% Cashback on Online Spends', lounge: 'None', status: 'Published' },
      { id: 'CC-203', name: 'Coral RuPay Credit Card', bank: 'ICICI Bank', annualFee: 'Lifetime Free', rewardRate: '2 Reward Points/₹100', lounge: '1/Quarter', status: 'Published' },
      { id: 'CC-204', name: 'Axis Bank Magnus', bank: 'Axis Bank', annualFee: '₹ 12,500', rewardRate: '12 Points/₹200', lounge: 'Unlimited International', status: 'Published' }
    ];
    localStorage.setItem('finbridge_admin_cards', JSON.stringify(defaultCards));
  }

  if (!localStorage.getItem('finbridge_admin_leads')) {
    const defaultLeads = [
      { id: 'LD-401', name: 'Pooja Verma', phone: '+91 98111 22334', product: 'Personal Loan', amount: 450000, executive: 'Rajesh Mehra', status: 'New', date: '08 Mar 2026' },
      { id: 'LD-402', name: 'Kunal Singhal', phone: '+91 97222 33445', product: 'Home Loan', amount: 3500000, executive: 'Sneha Patel', status: 'In Progress', date: '07 Mar 2026' },
      { id: 'LD-403', name: 'Vikram Joshi', phone: '+91 96333 44556', product: 'Credit Card', amount: 0, executive: 'Amit Roy', status: 'Contacted', date: '06 Mar 2026' },
      { id: 'LD-404', name: 'Ritu Deshmukh', phone: '+91 95444 55667', product: 'Business Loan', amount: 1500000, executive: 'Sneha Patel', status: 'Approved', date: '05 Mar 2026' }
    ];
    localStorage.setItem('finbridge_admin_leads', JSON.stringify(defaultLeads));
  }
}

/* ==========================================================================
   ADMIN OVERVIEW METRICS
   ========================================================================== */
function renderAdminOverview() {
  const loans = JSON.parse(localStorage.getItem('finbridge_admin_loans') || '[]');
  const cards = JSON.parse(localStorage.getItem('finbridge_admin_cards') || '[]');
  const apps = JSON.parse(localStorage.getItem('finbridge_applications') || '[]');
  const leads = JSON.parse(localStorage.getItem('finbridge_admin_leads') || '[]');

  const metricLoans = document.getElementById('admTotalLoans');
  const metricCards = document.getElementById('admTotalCards');
  const metricApps = document.getElementById('admTotalApps');
  const metricLeads = document.getElementById('admTotalLeads');

  if (metricLoans) metricLoans.textContent = loans.length;
  if (metricCards) metricCards.textContent = cards.length;
  if (metricApps) metricApps.textContent = apps.length;
  if (metricLeads) metricLeads.textContent = leads.length;
}

/* ==========================================================================
   LOAN PRODUCTS CRUD
   ========================================================================== */
function renderAdminLoansTable() {
  const tbody = document.getElementById('adminLoansTableBody');
  if (!tbody) return;

  const loans = JSON.parse(localStorage.getItem('finbridge_admin_loans') || '[]');
  tbody.innerHTML = loans.map(l => `
    <tr>
      <td class="fw-bold text-navy">${l.id}</td>
      <td class="fw-semibold">${l.name}</td>
      <td><span class="badge bg-light text-primary border">${l.bank}</span></td>
      <td class="fw-bold text-success">${l.rate}</td>
      <td>₹ ${(l.minAmount/1000).toFixed(0)}k - ₹ ${(l.maxAmount/100000).toFixed(0)}L</td>
      <td>${l.fee}</td>
      <td><span class="badge bg-success-subtle text-success border">${l.status}</span></td>
      <td>
        <div class="d-flex gap-1">
          <button class="btn btn-sm btn-outline-primary" onclick="openEditLoanModal('${l.id}')"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteAdminLoan('${l.id}')"><i class="bi bi-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

window.openAddLoanModal = function() {
  showModal('adminAddLoanModal', {
    title: 'Add New Loan Product',
    body: `
      <form id="addLoanForm" onsubmit="handleSaveLoan(event)">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="fb-form-label">Product Name</label>
            <input type="text" class="fb-form-control" id="admLoanName" placeholder="e.g. Flexi Gold Loan" required>
          </div>
          <div class="col-md-6">
            <label class="fb-form-label">Lender / Bank</label>
            <input type="text" class="fb-form-control" id="admLoanBank" placeholder="e.g. Axis Bank" required>
          </div>
          <div class="col-md-6">
            <label class="fb-form-label">Interest Rate</label>
            <input type="text" class="fb-form-control" id="admLoanRate" placeholder="e.g. 10.25% - 14.50%" required>
          </div>
          <div class="col-md-6">
            <label class="fb-form-label">Processing Fee</label>
            <input type="text" class="fb-form-control" id="admLoanFee" placeholder="e.g. 1.5% + GST" required>
          </div>
        </div>
        <div class="mt-4 d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
          <button type="submit" class="fb-btn-primary">Save Product</button>
        </div>
      </form>
    `
  });
};

window.handleSaveLoan = function(e) {
  e.preventDefault();
  const name = document.getElementById('admLoanName').value;
  const bank = document.getElementById('admLoanBank').value;
  const rate = document.getElementById('admLoanRate').value;
  const fee = document.getElementById('admLoanFee').value;

  const loans = JSON.parse(localStorage.getItem('finbridge_admin_loans') || '[]');
  loans.push({
    id: 'LN-' + (100 + loans.length + 1),
    name,
    bank,
    rate,
    minAmount: 50000,
    maxAmount: 5000000,
    tenure: '12 - 60 Months',
    fee,
    status: 'Published'
  });

  localStorage.setItem('finbridge_admin_loans', JSON.stringify(loans));

  const modalEl = document.getElementById('fbDynamicModal');
  bootstrap.Modal.getInstance(modalEl).hide();

  renderAdminLoansTable();
  renderAdminOverview();
  showToast('Loan product added successfully!', 'success');
};

window.deleteAdminLoan = function(id) {
  if (!confirm('Are you sure you want to delete this loan product?')) return;
  let loans = JSON.parse(localStorage.getItem('finbridge_admin_loans') || '[]');
  loans = loans.filter(l => l.id !== id);
  localStorage.setItem('finbridge_admin_loans', JSON.stringify(loans));
  renderAdminLoansTable();
  renderAdminOverview();
  showToast('Loan product deleted.', 'info');
};

/* ==========================================================================
   CREDIT CARD CRUD
   ========================================================================== */
function renderAdminCardsTable() {
  const tbody = document.getElementById('adminCardsTableBody');
  if (!tbody) return;

  const cards = JSON.parse(localStorage.getItem('finbridge_admin_cards') || '[]');
  tbody.innerHTML = cards.map(c => `
    <tr>
      <td class="fw-bold text-navy">${c.id}</td>
      <td class="fw-semibold">${c.name}</td>
      <td><span class="badge bg-light text-primary border">${c.bank}</span></td>
      <td class="fw-bold">${c.annualFee}</td>
      <td>${c.rewardRate}</td>
      <td>${c.lounge}</td>
      <td><span class="badge bg-success-subtle text-success border">${c.status}</span></td>
      <td>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteAdminCard('${c.id}')"><i class="bi bi-trash"></i></button>
      </td>
    </tr>
  `).join('');
}

window.deleteAdminCard = function(id) {
  if (!confirm('Are you sure you want to delete this credit card?')) return;
  let cards = JSON.parse(localStorage.getItem('finbridge_admin_cards') || '[]');
  cards = cards.filter(c => c.id !== id);
  localStorage.setItem('finbridge_admin_cards', JSON.stringify(cards));
  renderAdminCardsTable();
  renderAdminOverview();
  showToast('Credit card deleted.', 'info');
};

/* ==========================================================================
   APPLICATIONS & LEADS MANAGEMENT
   ========================================================================== */
function renderAdminApplicationsTable() {
  const tbody = document.getElementById('adminApplicationsTableBody');
  if (!tbody) return;

  const apps = JSON.parse(localStorage.getItem('finbridge_applications') || '[]');
  tbody.innerHTML = apps.map(app => `
    <tr>
      <td class="fw-bold text-navy">#${app.id}</td>
      <td class="fw-semibold">${app.applicant}</td>
      <td>${app.product}</td>
      <td><span class="badge bg-light text-dark border">${app.lender}</span></td>
      <td class="fw-bold">₹ ${app.amount ? app.amount.toLocaleString('en-IN') : '5,00,000'}</td>
      <td>
        <select class="form-select form-select-sm" onchange="updateApplicationStatus('${app.id}', this.value)">
          <option ${app.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
          <option ${app.status === 'Approved' ? 'selected' : ''}>Approved</option>
          <option ${app.status === 'Disbursed' ? 'selected' : ''}>Disbursed</option>
          <option ${app.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
        </select>
      </td>
      <td class="small text-muted">${app.submittedAt}</td>
    </tr>
  `).join('');
}

window.updateApplicationStatus = function(id, newStatus) {
  const apps = JSON.parse(localStorage.getItem('finbridge_applications') || '[]');
  const app = apps.find(a => a.id === id);
  if (app) {
    app.status = newStatus;
    localStorage.setItem('finbridge_applications', JSON.stringify(apps));
    showToast(`Application #${id} updated to ${newStatus}`, 'success');
  }
};

function renderAdminLeadsTable() {
  const tbody = document.getElementById('adminLeadsTableBody');
  if (!tbody) return;

  const leads = JSON.parse(localStorage.getItem('finbridge_admin_leads') || '[]');
  tbody.innerHTML = leads.map(ld => `
    <tr>
      <td class="fw-bold text-navy">${ld.id}</td>
      <td class="fw-semibold">${ld.name}</td>
      <td class="small text-muted">${ld.phone}</td>
      <td><span class="badge bg-light text-dark border">${ld.product}</span></td>
      <td class="fw-bold">${ld.amount ? '₹ ' + ld.amount.toLocaleString('en-IN') : 'N/A'}</td>
      <td>${ld.executive}</td>
      <td><span class="badge bg-primary-subtle text-primary border">${ld.status}</span></td>
      <td class="small text-muted">${ld.date}</td>
    </tr>
  `).join('');
}

function renderAdminUsersTable() {
  const tbody = document.getElementById('adminUsersTableBody');
  if (!tbody) return;

  const users = [
    { name: 'Aditya Sharma', email: 'aditya.sharma@example.com', phone: '+91 98765 43210', city: 'New Delhi', score: 785, status: 'Active' },
    { name: 'Pooja Verma', email: 'pooja.verma@example.com', phone: '+91 98111 22334', city: 'Mumbai', score: 760, status: 'Active' },
    { name: 'Kunal Singhal', email: 'kunal.singhal@example.com', phone: '+91 97222 33445', city: 'Bengaluru', score: 720, status: 'Active' },
    { name: 'Vikram Joshi', email: 'vikram.joshi@example.com', phone: '+91 96333 44556', city: 'Pune', score: 810, status: 'Active' }
  ];

  tbody.innerHTML = users.map(u => `
    <tr>
      <td class="fw-bold text-navy">${u.name}</td>
      <td class="small text-muted">${u.email}</td>
      <td class="small">${u.phone}</td>
      <td>${u.city}</td>
      <td class="fw-bold text-success">${u.score}</td>
      <td><span class="badge bg-success-subtle text-success border">${u.status}</span></td>
    </tr>
  `).join('');
}

/* ==========================================================================
   ADMIN ANALYTICS CHARTS
   ========================================================================== */
function initAdminAnalyticsCharts() {
  const leadCtx = document.getElementById('adminLeadsChartCanvas')?.getContext('2d');
  if (leadCtx) {
    new Chart(leadCtx, {
      type: 'line',
      data: {
        labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
        datasets: [{
          label: 'Customer Inquiries & Leads',
          data: [1420, 1850, 2300, 2900, 3400, 4120],
          borderColor: '#00A878',
          backgroundColor: 'rgba(0, 168, 120, 0.1)',
          fill: true,
          tension: 0.35,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: '#F1F5F9' } }
        }
      }
    });
  }

  const prodCtx = document.getElementById('adminProductDistributionChart')?.getContext('2d');
  if (prodCtx) {
    new Chart(prodCtx, {
      type: 'doughnut',
      data: {
        labels: ['Personal Loan', 'Home Loan', 'Credit Cards', 'Business Loan', 'Insurance'],
        datasets: [{
          data: [42, 24, 18, 10, 6],
          backgroundColor: ['#00A878', '#142B4A', '#38BDF8', '#F59E0B', '#8B5CF6']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 10, font: { family: 'Inter', size: 11 } } }
        }
      }
    });
  }
}

