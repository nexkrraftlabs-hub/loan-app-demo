/**
 * FINBRIDGE — CORE CLIENT-SIDE JAVASCRIPT
 * Handles Navigation, Search, Comparison Tray, Quick Quotes, Toasts & Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSearch();
  initDiscoveryTabs();
  initComparisonTray();
  initAuthUI();
  initGlobalModals();
});

/* ==========================================================================
   NAVIGATION & MOBILE DRAWER
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.fb-navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        navbar.classList.add('shadow-sm');
      } else {
        navbar.classList.remove('shadow-sm');
      }
    });
  }

  // Handle active menu link highlights
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.fb-nav-link, .fb-dash-menu-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });
}

/* ==========================================================================
   AUTH STATE MANAGEMENT (DEMO)
   ========================================================================== */
function initAuthUI() {
  const user = JSON.parse(localStorage.getItem('finbridge_user') || 'null');
  const authContainer = document.getElementById('fb-auth-nav-container');
  const topAuthContainer = document.getElementById('fb-top-auth-container');

  if (authContainer) {
    if (user) {
      authContainer.innerHTML = `
        <div class="dropdown">
          <button class="btn btn-sm btn-outline-dark dropdown-toggle d-flex align-items-center gap-2" data-bs-toggle="dropdown">
            <span class="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center" style="width:24px;height:24px;font-size:0.75rem;">
              ${user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </span>
            <span class="d-none d-sm-inline fw-semibold">${user.name || 'My Account'}</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 py-2" style="border-radius:12px;">
            <li><h6 class="dropdown-header text-muted">Customer Portal</h6></li>
            <li><a class="dropdown-item" href="dashboard/index.html"><i class="bi bi-grid-fill me-2 text-primary"></i>My Dashboard</a></li>
            <li><a class="dropdown-item" href="dashboard/applications.html"><i class="bi bi-file-earmark-check-fill me-2 text-success"></i>My Applications</a></li>
            <li><a class="dropdown-item" href="dashboard/saved-products.html"><i class="bi bi-bookmark-heart-fill me-2 text-danger"></i>Saved Products</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-danger" href="javascript:void(0)" onclick="handleLogout()"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
          </ul>
        </div>
      `;
    }
  }

  if (topAuthContainer && user) {
    topAuthContainer.innerHTML = `
      <a href="dashboard/index.html"><i class="bi bi-person-check-fill"></i> Hi, ${user.name.split(' ')[0]}</a>
      <span class="divider"></span>
      <a href="javascript:void(0)" onclick="handleLogout()"><i class="bi bi-box-arrow-right"></i> Logout</a>
    `;
  }
}

window.handleLogout = function() {
  localStorage.removeItem('finbridge_user');
  showToast('Logged out successfully.', 'info');
  setTimeout(() => {
    window.location.href = window.location.pathname.includes('/dashboard/') || window.location.pathname.includes('/admin/') ? '../index.html' : 'index.html';
  }, 600);
};

/* ==========================================================================
   HOMEPAGE DISCOVERY TABS & QUICK OFFERS
   ========================================================================== */
function initDiscoveryTabs() {
  const tabs = document.querySelectorAll('.fb-discovery-tab');
  const forms = {
    loan: document.getElementById('discovery-form-loan'),
    card: document.getElementById('discovery-form-card'),
    score: document.getElementById('discovery-form-score')
  };

  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.dataset.tab;
      Object.keys(forms).forEach(key => {
        if (forms[key]) forms[key].classList.add('d-none');
      });

      if (forms[target]) {
        forms[target].classList.remove('d-none');
      }
    });
  });
}

// Check Offers Form Handler
window.handleHeroLoanSubmit = function(e) {
  if (e) e.preventDefault();
  const amount = document.getElementById('heroLoanAmount')?.value || '500000';
  const emp = document.getElementById('heroEmployment')?.value || 'Salaried';
  const income = document.getElementById('heroIncome')?.value || '75000';
  const city = document.getElementById('heroCity')?.value || 'New Delhi';

  // Estimate best rate and monthly EMI
  const numAmount = parseInt(amount, 10);
  const bestRate = 10.49;
  const tenureMonths = 60;
  const r = (bestRate / 12) / 100;
  const emi = Math.round((numAmount * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1));

  showModal('quickOfferModal', {
    title: 'Pre-Approved Personal Loan Offers Found!',
    body: `
      <div class="text-center mb-4">
        <span class="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-bold">
          <i class="bi bi-patch-check-fill me-1"></i> 4 Lenders Match Your Criteria
        </span>
        <h4 class="mt-3 fw-bold text-navy">Eligible up to ₹ ${(numAmount * 1.25).toLocaleString('en-IN')}</h4>
        <p class="text-muted small">Based on ₹ ${parseInt(income, 10).toLocaleString('en-IN')}/month in ${city}</p>
      </div>
      
      <div class="row g-3">
        <div class="col-12 p-3 bg-light rounded-3 border">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="fw-bold text-primary"><i class="bi bi-shield-check text-success me-1"></i> FinTrust Bank</span>
            <span class="badge bg-success">Lowest Rate</span>
          </div>
          <div class="row text-center">
            <div class="col-4">
              <small class="text-muted d-block">Interest</small>
              <strong class="text-navy">10.49% p.a.</strong>
            </div>
            <div class="col-4">
              <small class="text-muted d-block">Est. EMI</small>
              <strong class="text-success">₹ ${emi.toLocaleString('en-IN')}</strong>
            </div>
            <div class="col-4">
              <small class="text-muted d-block">Tenure</small>
              <strong class="text-navy">5 Years</strong>
            </div>
          </div>
          <button class="btn btn-sm fb-btn-primary w-100 mt-3" onclick="openApplyModal('FinTrust Bank', 'Personal Loan', ${numAmount})">
            Apply with 1-Click
          </button>
        </div>

        <div class="col-12 p-3 bg-light rounded-3 border">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="fw-bold text-primary"><i class="bi bi-gem text-purple me-1"></i> Unity Finance</span>
            <span class="badge bg-primary">Instant Disbursal</span>
          </div>
          <div class="row text-center">
            <div class="col-4">
              <small class="text-muted d-block">Interest</small>
              <strong class="text-navy">10.75% p.a.</strong>
            </div>
            <div class="col-4">
              <small class="text-muted d-block">Est. EMI</small>
              <strong class="text-navy">₹ ${(emi + 65).toLocaleString('en-IN')}</strong>
            </div>
            <div class="col-4">
              <small class="text-muted d-block">Tenure</small>
              <strong class="text-navy">5 Years</strong>
            </div>
          </div>
          <button class="btn btn-sm fb-btn-primary w-100 mt-3" onclick="openApplyModal('Unity Finance', 'Personal Loan', ${numAmount})">
            Apply with 1-Click
          </button>
        </div>
      </div>
    `
  });
};

/* ==========================================================================
   GLOBAL COMPARISON TRAY
   ========================================================================== */
let comparedProducts = [];

function initComparisonTray() {
  const stored = localStorage.getItem('finbridge_compared');
  if (stored) {
    try { comparedProducts = JSON.parse(stored); } catch (e) { comparedProducts = []; }
  }
  updateComparisonTrayUI();
}

window.toggleCompare = function(id, name, type, lender, rate, fee) {
  const index = comparedProducts.findIndex(p => p.id === id);
  if (index > -1) {
    comparedProducts.splice(index, 1);
    showToast(`Removed ${name} from comparison`, 'info');
  } else {
    if (comparedProducts.length >= 4) {
      showToast('You can compare a maximum of 4 products at once.', 'error');
      return;
    }
    comparedProducts.push({ id, name, type, lender, rate, fee });
    showToast(`Added ${name} to comparison!`, 'success');
  }

  localStorage.setItem('finbridge_compared', JSON.stringify(comparedProducts));
  updateComparisonTrayUI();
};

function updateComparisonTrayUI() {
  let tray = document.getElementById('fb-comparison-tray');
  if (!tray) {
    tray = document.createElement('div');
    tray.id = 'fb-comparison-tray';
    tray.className = 'fb-comparison-tray';
    document.body.appendChild(tray);
  }

  if (comparedProducts.length === 0) {
    tray.classList.remove('show');
    return;
  }

  tray.classList.add('show');
  tray.innerHTML = `
    <div class="container d-flex align-items-center justify-content-between flex-wrap gap-3">
      <div class="d-flex align-items-center gap-2">
        <span class="badge bg-success rounded-pill px-3 py-2 fw-bold">${comparedProducts.length} Selected</span>
        <span class="fw-bold text-navy small d-none d-sm-inline">Compare Products Side-by-Side</span>
      </div>
      <div class="d-flex align-items-center gap-2 flex-wrap">
        ${comparedProducts.map(p => `
          <span class="badge bg-light text-dark border px-2 py-2 d-flex align-items-center gap-1">
            <span class="text-truncate" style="max-width:110px;">${p.name}</span>
            <i class="bi bi-x-circle-fill text-muted ms-1 cursor-pointer" onclick="toggleCompare('${p.id}', '', '', '', '', '')"></i>
          </span>
        `).join('')}
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-sm btn-outline-danger" onclick="clearComparison()">Clear</button>
        <button class="btn btn-sm fb-btn-primary" onclick="openComparisonModal()">Compare Now</button>
      </div>
    </div>
  `;
}

window.clearComparison = function() {
  comparedProducts = [];
  localStorage.removeItem('finbridge_compared');
  updateComparisonTrayUI();
  showToast('Comparison cleared', 'info');
};

window.openComparisonModal = function() {
  if (comparedProducts.length < 2) {
    showToast('Select at least 2 products to compare.', 'info');
    return;
  }

  let tableHeader = `<th>Feature</th>`;
  let rowLender = `<td>Lender / Bank</td>`;
  let rowType = `<td>Product Category</td>`;
  let rowRate = `<td>Interest / Fees</td>`;
  let rowAction = `<td>Action</td>`;

  comparedProducts.forEach(p => {
    tableHeader += `<th class="text-center">${p.name}</th>`;
    rowLender += `<td class="text-center fw-semibold text-primary">${p.lender || 'FinBridge Partner'}</td>`;
    rowType += `<td class="text-center"><span class="badge bg-light text-dark border">${p.type}</span></td>`;
    rowRate += `<td class="text-center fw-bold text-success">${p.rate}</td>`;
    rowAction += `<td class="text-center">
      <button class="btn btn-sm fb-btn-primary" onclick="openApplyModal('${p.lender}', '${p.name}', 500000)">Apply</button>
    </td>`;
  });

  showModal('comparisonModal', {
    title: 'Side-by-Side Product Comparison',
    body: `
      <div class="table-responsive">
        <table class="table table-bordered align-middle">
          <thead class="table-light"><tr>${tableHeader}</tr></thead>
          <tbody>
            <tr>${rowLender}</tr>
            <tr>${rowType}</tr>
            <tr>${rowRate}</tr>
            <tr>${rowAction}</tr>
          </tbody>
        </table>
      </div>
    `
  });
};

/* ==========================================================================
   GLOBAL APPLICATION & ELIGIBILITY MODALS
   ========================================================================== */
function initGlobalModals() {
  // Setup modal container if missing
  if (!document.getElementById('fb-global-modal-wrap')) {
    const wrap = document.createElement('div');
    wrap.id = 'fb-global-modal-wrap';
    wrap.innerHTML = `
      <div class="modal fade" id="fbDynamicModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content" style="border-radius:16px; overflow:hidden;">
            <div class="modal-header border-bottom px-4 py-3 bg-light">
              <h5 class="modal-title fw-bold text-navy" id="fbDynamicModalTitle">FinBridge</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-4" id="fbDynamicModalBody"></div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);
  }
}

function showModal(id, options) {
  const modalEl = document.getElementById('fbDynamicModal');
  if (!modalEl) return;
  document.getElementById('fbDynamicModalTitle').innerHTML = options.title || 'Notification';
  document.getElementById('fbDynamicModalBody').innerHTML = options.body || '';
  const bsModal = new bootstrap.Modal(modalEl);
  bsModal.show();
}

window.openApplyModal = function(lender, product, amount = 500000) {
  const user = JSON.parse(localStorage.getItem('finbridge_user') || '{}');
  showModal('applyModal', {
    title: `<i class="bi bi-file-earmark-plus text-success me-2"></i>Apply for ${product}`,
    body: `
      <form id="instantApplyForm" onsubmit="handleApplySubmit(event, '${lender}', '${product}')">
        <div class="alert alert-info py-2 px-3 small border-0 mb-3">
          <i class="bi bi-info-circle-fill me-1"></i> Instant 100% Paperless Digital Application (Demo)
        </div>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="fb-form-label">Full Name</label>
            <input type="text" class="fb-form-control" id="appFullName" value="${user.name || 'Aditya Sharma'}" required>
          </div>
          <div class="col-md-6">
            <label class="fb-form-label">Mobile Number</label>
            <input type="tel" class="fb-form-control" id="appPhone" value="${user.phone || '+91 98765 43210'}" required>
          </div>
          <div class="col-md-6">
            <label class="fb-form-label">Email Address</label>
            <input type="email" class="fb-form-control" id="appEmail" value="${user.email || 'aditya.sharma@example.com'}" required>
          </div>
          <div class="col-md-6">
            <label class="fb-form-label">Requested Loan Amount (₹)</label>
            <input type="number" class="fb-form-control" id="appAmount" value="${amount}" min="10000" required>
          </div>
          <div class="col-md-6">
            <label class="fb-form-label">Employment Status</label>
            <select class="fb-form-select" id="appEmp">
              <option selected>Salaried (Private Ltd / MNC)</option>
              <option>Salaried (Government / PSU)</option>
              <option>Self-Employed Professional</option>
              <option>Business Owner / Entrepreneur</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="fb-form-label">Current City</label>
            <input type="text" class="fb-form-control" id="appCity" value="New Delhi" required>
          </div>
        </div>
        <div class="form-check mt-3">
          <input class="form-check-input" type="checkbox" id="appConsent" checked required>
          <label class="form-check-label small text-muted" for="appConsent">
            I agree to FinBridge Terms & Privacy Policy and authorize soft pre-qualification check.
          </label>
        </div>
        <div class="mt-4 d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
          <button type="submit" class="fb-btn-primary">Submit Application</button>
        </div>
      </form>
    `
  });
};

window.handleApplySubmit = function(e, lender, product) {
  e.preventDefault();
  const appId = 'FB-' + Math.floor(100000 + Math.random() * 900000);
  const name = document.getElementById('appFullName').value;
  const phone = document.getElementById('appPhone').value;
  const email = document.getElementById('appEmail').value;
  const amount = document.getElementById('appAmount').value;

  const newApp = {
    id: appId,
    applicant: name,
    email: email,
    phone: phone,
    lender: lender,
    product: product,
    amount: parseInt(amount, 10),
    status: 'Under Review',
    submittedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  };

  const apps = JSON.parse(localStorage.getItem('finbridge_applications') || '[]');
  apps.unshift(newApp);
  localStorage.setItem('finbridge_applications', JSON.stringify(apps));

  // Dismiss modal
  const modalEl = document.getElementById('fbDynamicModal');
  const bsModal = bootstrap.Modal.getInstance(modalEl);
  if (bsModal) bsModal.hide();

  showToast(`Application #${appId} submitted successfully!`, 'success');

  setTimeout(() => {
    showModal('appSuccessModal', {
      title: '<i class="bi bi-check-circle-fill text-success me-2"></i>Application Successful',
      body: `
        <div class="text-center py-3">
          <div class="display-6 text-success mb-2"><i class="bi bi-shield-fill-check"></i></div>
          <h4 class="fw-bold">Your Application ID is ${appId}</h4>
          <p class="text-muted">Lender: <strong>${lender}</strong> | Product: <strong>${product}</strong></p>
          <p class="small text-muted mb-4">Our lending specialist will reach out within 2 business hours for digital verification.</p>
          <div class="d-flex justify-content-center gap-2">
            <a href="dashboard/applications.html" class="fb-btn-primary">Track in Dashboard</a>
            <button class="btn btn-light" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      `
    });
  }, 400);
};

/* ==========================================================================
   GLOBAL SEARCH MODAL
   ========================================================================== */
function initSearch() {
  const searchBtn = document.getElementById('fb-nav-search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      showModal('searchModal', {
        title: '<i class="bi bi-search me-2"></i>Search FinBridge Marketplace',
        body: `
          <div class="input-group mb-3">
            <span class="input-group-text bg-white border-end-0"><i class="bi bi-search text-muted"></i></span>
            <input type="text" class="form-control border-start-0 ps-0" id="globalSearchInput" placeholder="Search loans, credit cards, calculators, articles..." autofocus onkeyup="filterSearchResults(this.value)">
          </div>
          <div id="searchResultsList" class="list-group list-group-flush small">
            <a href="personal-loans.html" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2">
              <span><i class="bi bi-cash-stack text-success me-2"></i>Personal Loans (from 10.49% p.a.)</span>
              <span class="badge bg-light text-muted">Loans</span>
            </a>
            <a href="credit-cards.html" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2">
              <span><i class="bi bi-credit-card-2-front text-primary me-2"></i>Lifetime Free Credit Cards</span>
              <span class="badge bg-light text-muted">Cards</span>
            </a>
            <a href="bank-statement.html" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2">
              <span><i class="bi bi-file-earmark-spreadsheet text-info me-2"></i>Bank Statement Analyzer</span>
              <span class="badge bg-light text-muted">Tools</span>
            </a>
            <a href="emi-calculator.html" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2">
              <span><i class="bi bi-calculator text-warning me-2"></i>Loan EMI Calculator</span>
              <span class="badge bg-light text-muted">Calculators</span>
            </a>
            <a href="credit-score.html" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2">
              <span><i class="bi bi-speedometer2 text-danger me-2"></i>Free Credit Health Check</span>
              <span class="badge bg-light text-muted">Credit</span>
            </a>
          </div>
        `
      });
    });
  }
}

window.filterSearchResults = function(query) {
  const items = document.querySelectorAll('#searchResultsList a');
  const q = query.toLowerCase().trim();
  items.forEach(el => {
    if (el.textContent.toLowerCase().includes(q)) {
      el.style.display = 'flex';
    } else {
      el.style.display = 'none';
    }
  });
};

/* ==========================================================================
   TOAST NOTIFICATION ENGINE
   ========================================================================== */
window.showToast = function(message, type = 'info') {
  let container = document.querySelector('.fb-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'fb-toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: 'bi-check-circle-fill text-success',
    error: 'bi-exclamation-triangle-fill text-danger',
    info: 'bi-info-circle-fill text-primary'
  };

  const toast = document.createElement('div');
  toast.className = `fb-toast ${type}`;
  toast.innerHTML = `
    <i class="bi ${icons[type] || icons.info} fs-5"></i>
    <div class="flex-grow-1">
      <div class="small fw-semibold text-navy">${message}</div>
    </div>
    <button type="button" class="btn-close btn-close-sm" onclick="this.parentElement.remove()"></button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }
  }, 4000);
};

