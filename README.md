# FinBridge — Premium Indian FinTech Marketplace & Personal Finance Platform

FinBridge is an enterprise-grade, multi-page Indian financial marketplace and personal finance intelligence dashboard. It delivers an experience inspired by leading platforms such as Paisabazaar, designed with an original brand identity, modern UX, privacy-first client-side data parsing, and zero server lock-in.

---

## 🌟 Key Features

### 1. Consumer Financial Marketplace
- **Personal Loans Marketplace:** Real-time filterable lending catalog with APRs from 10.49% p.a., loan amount sliders, estimated monthly EMIs, and multi-lender comparison.
- **Business & MSME Loans:** Working capital financing, machinery capex loans, and GST-based fast-track sanctions.
- **Credit Cards Catalog:** Filter by Cashback, Rewards, Travel, Lifetime Free, and RuPay UPI cards with feature comparisons and fee waivers.
- **Credit Health & Bureau Simulator:** Interactive circular credit score gauge, breakdown of 5 core credit health factors (payment history, credit utilization, credit age, active lines, inquiries) with zero credit bureau penalty.
- **Insurance Marketplace:** Cashless health insurance, term life insurance with 99.3% claim settlement ratios, and premium calculator.
- **Investments & Wealth Hub:** Top-rated direct mutual fund SIPs, DICGC-insured fixed deposits up to 9.00% p.a., and Sovereign Gold avenues.

### 2. Standout Feature: 100% Client-Side Bank Statement Analyzer
- **Privacy-First Local Processing:** Bank statements (PDF, CSV, Excel) are parsed strictly within the browser memory sandbox using PapaParse, SheetJS, and PDF.js. No financial records are ever sent to remote servers.
- **3-Month Realistic Demo Dataset:** Single-click "Try With Sample Bank Statement" loads 65+ authentic Indian banking transactions across 3 consecutive months (Salary credits from Infosys, D-Mart, Swiggy, Zomato, HDFC Home Loan EMI, Bajaj Finance EMI, Netflix, Spotify, utilities).
- **Automated Analytics:**
  - KPI Cards: Total Money In, Total Money Out, Net Savings, Savings Rate %, and Transaction Count.
  - Interactive Chart.js Visualizations: Monthly Inflow vs Outflow Cash Flow Bar Chart & 20+ Category Expense Donut Chart.
  - Recurring Payment Detection: Automatic pattern recognition for monthly OTT/software subscriptions and recurring Loan EMIs.
  - Financial Health Summary: Emergency fund recommendations and EMI-to-income debt burden ratios.
  - Filterable & Searchable Table: Instant narration search, category filter, debit/credit filter, and pagination.
  - One-Click Exports: Real downloadable CSV export and print-ready PDF statement summary.

### 3. Financial Calculators Engine
- **Loan EMI Calculator:** Dynamic slider controls for Principal, Annual Rate, and Tenure. Computes monthly EMI, total interest, principal-to-interest donut chart, and complete year-by-year amortization schedule.
- **SIP Wealth Calculator:** Forecasts compounding growth on monthly mutual fund investments.
- **Fixed Deposit (FD) Calculator:** Calculates quarterly compounding returns and maturity values.
- **GST Tax Calculator:** Computes 5%, 12%, 18%, and 28% tax slabs for both GST-inclusive and GST-exclusive transactions.
- **Loan Eligibility Calculator:** FOIR-based borrowing capacity estimator based on net income and existing obligations.

### 4. Customer Portal (`dashboard/`)
- **Dashboard Overview:** Active application status badges, credit health score, monthly net savings, and bookmarked products.
- **Application Tracking:** Interactive timeline stepper (Submitted → Verified → Sanctioned → Disbursed) with unique tracking IDs (e.g. `#FB-982142`).
- **Secure Document Locker:** Encrypted digital locker for Aadhaar, PAN, salary slips, and statement records.
- **Profile Management:** Update personal demographic and contact details persisted in `localStorage`.
- **Notifications Hub:** Real-time notifications for application approvals, credit refreshes, and lender offers.

### 5. Admin Console (`admin/`)
- **Executive Overview:** Real-time KPI counters for active leads, submitted applications, published loans, and cards.
- **Live JavaScript CRUD:**
  - Loan Products CRUD: Add new loan, edit rates/limits/tenures, delete, and toggle status.
  - Credit Cards CRUD: Manage card catalogs, reward multipliers, and annual fees.
  - Application Workflow: Review applicant details and update status (`Under Review`, `Approved`, `Disbursed`, `Rejected`) which immediately updates in the Customer Portal!
  - Lead Management: Filter and assign executive specialists to high-intent inquiries.
  - Analytics & Funnel: Conversion metrics, product demand distribution charts, and lender rankings.
  - Statement Processing Logs: Anonymized audit logs respecting zero-retention privacy rules.

---

## 🛠️ Technology Stack

- **Markup & Layout:** HTML5, CSS3, Bootstrap 5.3.3
- **Icons:** Bootstrap Icons 1.11.3
- **Typography:** Google Fonts (`Manrope` for headings, `Inter` for body)
- **Data Visualizations:** Chart.js 4.4.4
- **CSV Engine:** PapaParse 5.4.1
- **Spreadsheet Engine:** SheetJS (xlsx 0.18.5)
- **Client Storage:** Browser `localStorage` for non-sensitive demo state persistence

---

## 🚀 How to Run & Demo

1. Open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
2. Or use a simple local HTTP server:
   ```bash
   # Using Python
   python -m http.server 8000
   ```
   Then navigate to `http://localhost:8000/`.

### Quick Demo Credentials:
- **Customer Portal:** Click **Login** on the navbar and select **"Customer"** to log in as *Aditya Sharma*.
- **Admin Console:** Click **Login** on the navbar and select **"Admin Portal"** to log in as *System Administrator*.
- **Bank Statement Analyzer:** Navigate to **Statement Analyzer** and click **"Try With Sample Bank Statement"** to immediately load the 65+ transaction dataset and view the dynamic charts!

---

## 📄 License & Disclaimer

FinBridge is built as a realistic fintech product design demonstration. All lender names, brand identities, interest rate quotes, and credit score metrics are illustrative sample records for UI/UX demonstration purposes. Bank statement analysis occurs strictly inside the user's browser sandbox.

