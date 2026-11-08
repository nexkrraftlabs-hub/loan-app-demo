/**
 * FINBRIDGE — CUSTOMER DASHBOARD CONTROLLER
 * Manages User Applications, Bookmarked Products, Documents & Profile Data
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomerDashboard();
});

function initCustomerDashboard() {
  ensureDefaultCustomerData();
  renderDashboardStats();
  renderRecentApplications();
  renderSavedProducts();
  renderDocumentsList();
  initProfileForm();
}

function ensureDefaultCustomerData() {
  if (!localStorage.getItem('finbridge_user')) {
    const defaultUser = {
      name: 'Aditya Sharma',
      email: 'aditya.sharma@example.com',
      phone: '+91 98765 43210',
      pan: 'ABCPS1234F',
      cibil: 785,
      city: 'New Delhi',
      employment: 'Salaried',
      company: 'Infosys Limited',
      income: 120000
    };
    localStorage.setItem('finbridge_user', JSON.stringify(defaultUser));
  }

  if (!localStorage.getItem('finbridge_applications')) {
    const defaultApps = [
      {
        id: 'FB-982142',
        applicant: 'Aditya Sharma',
        lender: 'FinTrust Bank',
        product: 'Personal Loan',
        amount: 500000,
        status: 'Approved',
        submittedAt: '02 Mar 2026'
      },
      {
        id: 'FB-774109',
        applicant: 'Aditya Sharma',
        lender: 'HDFC Bank',
        product: 'Millennia Credit Card',
        amount: 150000,
        status: 'Under Review',
        submittedAt: '15 Feb 2026'
      },
      {
        id: 'FB-651238',
        applicant: 'Aditya Sharma',
        lender: 'Unity Finance',
        product: 'Instant Cash Loan',
        amount: 100000,
        status: 'Disbursed',
        submittedAt: '10 Jan 2026'
      }
    ];
    localStorage.setItem('finbridge_applications', JSON.stringify(defaultApps));
  }

  if (!localStorage.getItem('finbridge_saved_products')) {
    const saved = [
      { id: 'cc-1', name: 'Regalia Gold Credit Card', lender: 'HDFC Bank', type: 'Credit Card', benefit: '4X Reward Points & Airport Lounge' },
      { id: 'ln-1', name: 'Super Prime Home Loan', lender: 'SBI', type: 'Home Loan', benefit: '8.50% p.a. Zero Processing Fee' }
    ];
    localStorage.setItem('finbridge_saved_products', JSON.stringify(saved));
  }
}

function renderDashboardStats() {
  const apps = JSON.parse(localStorage.getItem('finbridge_applications') || '[]');
  const saved = JSON.parse(localStorage.getItem('finbridge_saved_products') || '[]');
  const user = JSON.parse(localStorage.getItem('finbridge_user') || '{}');

  const appCountEl = document.getElementById('dashAppCount');
  const savedCountEl = document.getElementById('dashSavedCount');
  const cibilEl = document.getElementById('dashCibilScore');
  const userNameEl = document.getElementById('dashWelcomeName');

  if (appCountEl) appCountEl.textContent = apps.length;
  if (savedCountEl) savedCountEl.textContent = saved.length;
  if (cibilEl) cibilEl.textContent = user.cibil || 785;
  if (userNameEl) userNameEl.textContent = user.name ? user.name.split(' ')[0] : 'User';
}

function renderRecentApplications() {
  const container = document.getElementById('dashApplicationsTableBody');
  if (!container) return;

  const apps = JSON.parse(localStorage.getItem('finbridge_applications') || '[]');

  if (!apps.length) {
    container.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">No applications submitted yet.</td></tr>`;
    return;
  }

  container.innerHTML = apps.map(app => {
    let badgeClass = 'badge-pending';
    if (app.status === 'Approved' || app.status === 'Disbursed') badgeClass = 'badge-approved';
    else if (app.status === 'Under Review') badgeClass = 'badge-review';
    else if (app.status === 'Rejected') badgeClass = 'badge-rejected';

    return `
      <tr>
        <td class="fw-bold text-navy">#${app.id}</td>
        <td>
          <div class="fw-semibold text-navy">${app.product}</div>
          <div class="small text-muted">${app.lender}</div>
        </td>
        <td class="fw-bold">₹ ${app.amount ? app.amount.toLocaleString('en-IN') : '5,00,000'}</td>
        <td class="small text-muted">${app.submittedAt}</td>
        <td><span class="badge-status ${badgeClass}">${app.status}</span></td>
        <td>
          <button class="btn btn-sm btn-outline-primary" onclick="viewApplicationDetail('${app.id}')">
            <i class="bi bi-eye"></i> Details
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

window.viewApplicationDetail = function(appId) {
  const apps = JSON.parse(localStorage.getItem('finbridge_applications') || '[]');
  const app = apps.find(a => a.id === appId);
  if (!app) return;

  showModal('appDetailModal', {
    title: `Application #${app.id}`,
    body: `
      <div class="p-3 bg-light rounded-3 border mb-3">
        <div class="row g-3">
          <div class="col-6"><small class="text-muted d-block">Product</small><strong>${app.product}</strong></div>
          <div class="col-6"><small class="text-muted d-block">Lender</small><strong>${app.lender}</strong></div>
          <div class="col-6"><small class="text-muted d-block">Loan Amount</small><strong class="text-success">₹ ${app.amount.toLocaleString('en-IN')}</strong></div>
          <div class="col-6"><small class="text-muted d-block">Status</small><span class="badge bg-success">${app.status}</span></div>
          <div class="col-6"><small class="text-muted d-block">Submitted On</small><strong>${app.submittedAt}</strong></div>
          <div class="col-6"><small class="text-muted d-block">Applicant Name</small><strong>${app.applicant}</strong></div>
        </div>
      </div>
      <div class="alert alert-secondary py-2 small mb-0">
        <i class="bi bi-shield-lock me-1"></i> Digitally signed & encrypted. Disbursal verification handled by partner bank.
      </div>
    `
  });
};

function renderSavedProducts() {
  const container = document.getElementById('dashSavedProductsList');
  if (!container) return;

  const saved = JSON.parse(localStorage.getItem('finbridge_saved_products') || '[]');
  if (!saved.length) {
    container.innerHTML = `<div class="p-4 text-center text-muted">No saved products yet.</div>`;
    return;
  }

  container.innerHTML = saved.map(p => `
    <div class="p-3 border rounded-3 bg-white mb-3 d-flex justify-content-between align-items-center">
      <div>
        <span class="badge bg-light text-dark border mb-1">${p.type}</span>
        <h6 class="fw-bold mb-1 text-navy">${p.name}</h6>
        <p class="text-muted small mb-0">${p.lender} • ${p.benefit}</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-sm btn-outline-danger" onclick="removeSavedProduct('${p.id}')"><i class="bi bi-trash"></i></button>
        <button class="btn btn-sm fb-btn-primary" onclick="openApplyModal('${p.lender}', '${p.name}', 500000)">Apply</button>
      </div>
    </div>
  `).join('');
}

window.removeSavedProduct = function(id) {
  let saved = JSON.parse(localStorage.getItem('finbridge_saved_products') || '[]');
  saved = saved.filter(p => p.id !== id);
  localStorage.setItem('finbridge_saved_products', JSON.stringify(saved));
  renderSavedProducts();
  showToast('Removed from saved items', 'info');
};

function renderDocumentsList() {
  const list = document.getElementById('dashDocList');
  if (!list) return;

  const docs = [
    { name: 'PAN Card (ABCPS****F)', date: 'Uploaded on 12 Jan 2026', status: 'Verified', icon: 'bi-file-earmark-person' },
    { name: 'Aadhaar Card (XXXX-XXXX-8921)', date: 'Uploaded on 12 Jan 2026', status: 'Verified', icon: 'bi-shield-check' },
    { name: 'Salary Slips (Last 3 Months)', date: 'Uploaded on 02 Mar 2026', status: 'Verified', icon: 'bi-file-earmark-text' },
    { name: 'Bank Statement (HDFC Q1)', date: 'Uploaded on 02 Mar 2026', status: 'Verified', icon: 'bi-file-earmark-spreadsheet' }
  ];

  list.innerHTML = docs.map(d => `
    <div class="p-3 bg-white border rounded-3 mb-2 d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center gap-3">
        <span class="badge bg-light text-primary fs-4 p-2 rounded-3"><i class="bi ${d.icon}"></i></span>
        <div>
          <strong class="text-navy d-block">${d.name}</strong>
          <small class="text-muted">${d.date}</small>
        </div>
      </div>
      <span class="badge bg-success-subtle text-success border border-success-subtle"><i class="bi bi-check2-circle me-1"></i>${d.status}</span>
    </div>
  `).join('');
}

function initProfileForm() {
  const form = document.getElementById('customerProfileForm');
  if (!form) return;

  const user = JSON.parse(localStorage.getItem('finbridge_user') || '{}');
  if (document.getElementById('profName')) document.getElementById('profName').value = user.name || '';
  if (document.getElementById('profEmail')) document.getElementById('profEmail').value = user.email || '';
  if (document.getElementById('profPhone')) document.getElementById('profPhone').value = user.phone || '';
  if (document.getElementById('profCity')) document.getElementById('profCity').value = user.city || '';
  if (document.getElementById('profIncome')) document.getElementById('profIncome').value = user.income || '';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    user.name = document.getElementById('profName').value;
    user.email = document.getElementById('profEmail').value;
    user.phone = document.getElementById('profPhone').value;
    user.city = document.getElementById('profCity').value;
    user.income = parseInt(document.getElementById('profIncome').value, 10);

    localStorage.setItem('finbridge_user', JSON.stringify(user));
    showToast('Profile updated successfully!', 'success');
  });
}

