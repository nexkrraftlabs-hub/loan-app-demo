/**
 * FINBRIDGE — FINANCIAL CALCULATORS ENGINE
 * Real Financial Mathematics, Reactive Sliders, Chart.js Visualizations & Amortization Schedules
 */

let emiDonutChart = null;
let sipDonutChart = null;
let fdDonutChart = null;

document.addEventListener('DOMContentLoaded', () => {
  initEMICalculator();
  initSIPCalculator();
  initFDCalculator();
  initGSTCalculator();
  initEligibilityCalculator();
});

/* ==========================================================================
   1. LOAN EMI CALCULATOR
   ========================================================================== */
function initEMICalculator() {
  const amountSlider = document.getElementById('emiAmountSlider');
  const amountInput = document.getElementById('emiAmountInput');
  const rateSlider = document.getElementById('emiRateSlider');
  const rateInput = document.getElementById('emiRateInput');
  const tenureSlider = document.getElementById('emiTenureSlider');
  const tenureInput = document.getElementById('emiTenureInput');

  if (!amountSlider) return;

  // Sync Slider <-> Input
  const bindPair = (slider, input) => {
    slider.addEventListener('input', () => { input.value = slider.value; calculateEMI(); });
    input.addEventListener('input', () => { slider.value = input.value; calculateEMI(); });
  };

  bindPair(amountSlider, amountInput);
  bindPair(rateSlider, rateInput);
  bindPair(tenureSlider, tenureInput);

  calculateEMI();
}

function calculateEMI() {
  const p = parseFloat(document.getElementById('emiAmountSlider')?.value || 1000000);
  const annualRate = parseFloat(document.getElementById('emiRateSlider')?.value || 10.5);
  const years = parseFloat(document.getElementById('emiTenureSlider')?.value || 5);

  const r = (annualRate / 12) / 100;
  const n = years * 12;

  // E = P * r * (1 + r)^n / ((1 + r)^n - 1)
  const emi = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  const totalPayment = emi * n;
  const totalInterest = totalPayment - p;

  // Update UI Elements
  const emiValEl = document.getElementById('emiMonthlyVal');
  const totalInterestEl = document.getElementById('emiTotalInterestVal');
  const totalPaymentEl = document.getElementById('emiTotalPaymentVal');
  const principalValEl = document.getElementById('emiPrincipalVal');

  if (emiValEl) emiValEl.textContent = `₹ ${emi.toLocaleString('en-IN')}`;
  if (totalInterestEl) totalInterestEl.textContent = `₹ ${totalInterest.toLocaleString('en-IN')}`;
  if (totalPaymentEl) totalPaymentEl.textContent = `₹ ${totalPayment.toLocaleString('en-IN')}`;
  if (principalValEl) principalValEl.textContent = `₹ ${p.toLocaleString('en-IN')}`;

  // Update Chart
  updateEMIChart(p, totalInterest);

  // Update Amortization Schedule
  renderAmortizationSchedule(p, annualRate, years, emi);
}

function updateEMIChart(principal, interest) {
  const ctx = document.getElementById('emiChartCanvas')?.getContext('2d');
  if (!ctx) return;

  if (emiDonutChart) emiDonutChart.destroy();

  emiDonutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Principal Amount', 'Total Interest'],
      datasets: [{
        data: [principal, interest],
        backgroundColor: ['#00A878', '#142B4A'],
        borderWidth: 2,
        borderColor: '#FFFFFF'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 12, font: { family: 'Inter', weight: '600' } } },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ₹ ${ctx.raw.toLocaleString('en-IN')}`
          }
        }
      }
    }
  });
}

function renderAmortizationSchedule(principal, annualRate, years, emi) {
  const tbody = document.getElementById('amortizationTableBody');
  if (!tbody) return;

  let balance = principal;
  const monthlyRate = (annualRate / 12) / 100;
  let rowsHtml = '';

  for (let year = 1; year <= years; year++) {
    let yearInterest = 0;
    let yearPrincipal = 0;

    for (let month = 1; month <= 12; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = emi - interestPayment;
      yearInterest += interestPayment;
      yearPrincipal += principalPayment;
      balance = Math.max(0, balance - principalPayment);
    }

    rowsHtml += `
      <tr>
        <td class="fw-bold">Year ${year}</td>
        <td class="text-success fw-semibold">₹ ${Math.round(yearPrincipal).toLocaleString('en-IN')}</td>
        <td class="text-danger fw-semibold">₹ ${Math.round(yearInterest).toLocaleString('en-IN')}</td>
        <td class="fw-bold">₹ ${(emi * 12).toLocaleString('en-IN')}</td>
        <td class="text-muted">₹ ${Math.round(balance).toLocaleString('en-IN')}</td>
      </tr>
    `;
  }

  tbody.innerHTML = rowsHtml;
}

/* ==========================================================================
   2. SIP CALCULATOR (Mutual Fund Wealth Estimator)
   ========================================================================== */
function initSIPCalculator() {
  const investSlider = document.getElementById('sipAmountSlider');
  const investInput = document.getElementById('sipAmountInput');
  const returnSlider = document.getElementById('sipReturnSlider');
  const returnInput = document.getElementById('sipReturnInput');
  const tenureSlider = document.getElementById('sipTenureSlider');
  const tenureInput = document.getElementById('sipTenureInput');

  if (!investSlider) return;

  const bind = (s, i) => {
    s.addEventListener('input', () => { i.value = s.value; calculateSIP(); });
    i.addEventListener('input', () => { s.value = i.value; calculateSIP(); });
  };

  bind(investSlider, investInput);
  bind(returnSlider, returnInput);
  bind(tenureSlider, tenureInput);

  calculateSIP();
}

function calculateSIP() {
  const p = parseFloat(document.getElementById('sipAmountSlider')?.value || 10000);
  const annualRate = parseFloat(document.getElementById('sipReturnSlider')?.value || 12);
  const years = parseFloat(document.getElementById('sipTenureSlider')?.value || 10);

  const i = (annualRate / 12) / 100;
  const n = years * 12;

  // M = P * [((1 + i)^n - 1) / i] * (1 + i)
  const totalMaturity = Math.round(p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i));
  const investedAmount = p * n;
  const wealthGain = totalMaturity - investedAmount;

  const investedEl = document.getElementById('sipInvestedVal');
  const gainEl = document.getElementById('sipGainVal');
  const totalEl = document.getElementById('sipTotalVal');

  if (investedEl) investedEl.textContent = `₹ ${investedAmount.toLocaleString('en-IN')}`;
  if (gainEl) gainEl.textContent = `₹ ${wealthGain.toLocaleString('en-IN')}`;
  if (totalEl) totalEl.textContent = `₹ ${totalMaturity.toLocaleString('en-IN')}`;

  const ctx = document.getElementById('sipChartCanvas')?.getContext('2d');
  if (ctx) {
    if (sipDonutChart) sipDonutChart.destroy();
    sipDonutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Invested Amount', 'Estimated Wealth Gain'],
        datasets: [{
          data: [investedAmount, wealthGain],
          backgroundColor: ['#142B4A', '#00A878'],
          borderWidth: 2,
          borderColor: '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { family: 'Inter', weight: '600' } } }
        }
      }
    });
  }
}

/* ==========================================================================
   3. FIXED DEPOSIT (FD) CALCULATOR
   ========================================================================== */
function initFDCalculator() {
  const amountSlider = document.getElementById('fdAmountSlider');
  const amountInput = document.getElementById('fdAmountInput');
  const rateSlider = document.getElementById('fdRateSlider');
  const rateInput = document.getElementById('fdRateInput');
  const tenureSlider = document.getElementById('fdTenureSlider');
  const tenureInput = document.getElementById('fdTenureInput');

  if (!amountSlider) return;

  const bind = (s, i) => {
    s.addEventListener('input', () => { i.value = s.value; calculateFD(); });
    i.addEventListener('input', () => { s.value = i.value; calculateFD(); });
  };

  bind(amountSlider, amountInput);
  bind(rateSlider, rateInput);
  bind(tenureSlider, tenureInput);

  calculateFD();
}

function calculateFD() {
  const p = parseFloat(document.getElementById('fdAmountSlider')?.value || 200000);
  const r = parseFloat(document.getElementById('fdRateSlider')?.value || 7.25) / 100;
  const t = parseFloat(document.getElementById('fdTenureSlider')?.value || 3);
  const n = 4; // Compounded quarterly

  // A = P * (1 + r/n)^(n*t)
  const maturity = Math.round(p * Math.pow(1 + (r / n), n * t));
  const interestEarned = maturity - p;

  const invEl = document.getElementById('fdInvestedVal');
  const intEl = document.getElementById('fdInterestVal');
  const matEl = document.getElementById('fdMaturityVal');

  if (invEl) invEl.textContent = `₹ ${p.toLocaleString('en-IN')}`;
  if (intEl) intEl.textContent = `₹ ${interestEarned.toLocaleString('en-IN')}`;
  if (matEl) matEl.textContent = `₹ ${maturity.toLocaleString('en-IN')}`;
}

/* ==========================================================================
   4. GST CALCULATOR
   ========================================================================== */
function initGSTCalculator() {
  const baseInput = document.getElementById('gstBaseAmount');
  const rateSelect = document.getElementById('gstRateSelect');
  const typeRadios = document.querySelectorAll('input[name="gstType"]');

  if (!baseInput) return;

  const runGST = () => {
    const amount = parseFloat(baseInput.value) || 0;
    const rate = parseFloat(rateSelect?.value || 18);
    const isExclusive = document.querySelector('input[name="gstType"]:checked')?.value === 'exclusive';

    let gstAmount = 0;
    let netAmount = 0;
    let grossAmount = 0;

    if (isExclusive) {
      gstAmount = Math.round((amount * rate) / 100);
      netAmount = amount;
      grossAmount = netAmount + gstAmount;
    } else {
      gstAmount = Math.round(amount - (amount * (100 / (100 + rate))));
      netAmount = amount - gstAmount;
      grossAmount = amount;
    }

    const netEl = document.getElementById('gstNetVal');
    const taxEl = document.getElementById('gstTaxVal');
    const grossEl = document.getElementById('gstGrossVal');

    if (netEl) netEl.textContent = `₹ ${netAmount.toLocaleString('en-IN')}`;
    if (taxEl) taxEl.textContent = `₹ ${gstAmount.toLocaleString('en-IN')} (${rate}%)`;
    if (grossEl) grossEl.textContent = `₹ ${grossAmount.toLocaleString('en-IN')}`;
  };

  baseInput.addEventListener('input', runGST);
  if (rateSelect) rateSelect.addEventListener('change', runGST);
  typeRadios.forEach(r => r.addEventListener('change', runGST));
  runGST();
}

/* ==========================================================================
   5. LOAN ELIGIBILITY CALCULATOR (FOIR Based)
   ========================================================================== */
function initEligibilityCalculator() {
  const incomeInput = document.getElementById('eligIncome');
  const obligationsInput = document.getElementById('eligObligations');
  const rateInput = document.getElementById('eligRate');
  const tenureInput = document.getElementById('eligTenure');

  if (!incomeInput) return;

  const runEligibility = () => {
    const income = parseFloat(incomeInput.value) || 75000;
    const existingEMI = parseFloat(obligationsInput.value) || 12000;
    const rate = parseFloat(rateInput.value) || 10.5;
    const years = parseFloat(tenureInput.value) || 5;

    // Banking industry standard FOIR is 50% of monthly in-hand salary
    const maxAllowableEMI = Math.max(0, (income * 0.50) - existingEMI);

    const r = (rate / 12) / 100;
    const n = years * 12;

    // P = EMI * ((1+r)^n - 1) / (r * (1+r)^n)
    const maxLoan = Math.round((maxAllowableEMI * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n)));

    const maxLoanEl = document.getElementById('eligMaxLoanVal');
    const maxEmiEl = document.getElementById('eligMaxEmiVal');

    if (maxLoanEl) maxLoanEl.textContent = `₹ ${maxLoan.toLocaleString('en-IN')}`;
    if (maxEmiEl) maxEmiEl.textContent = `₹ ${Math.round(maxAllowableEMI).toLocaleString('en-IN')}/month`;
  };

  [incomeInput, obligationsInput, rateInput, tenureInput].forEach(el => {
    if (el) el.addEventListener('input', runEligibility);
  });

  runEligibility();
}

