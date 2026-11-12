# Live Demo and Presentation Script

**Suggested duration:** about 7–10 minutes (adapt to evaluator's allocated time).

## Presenter 1 — Eyad: Introduction, Authentication and Student Fees

**Suggested spoken introduction:**

> Campus Finance is a university finance and cafeteria management prototype built with Angular 22. Our goal is to demonstrate student-facing financial services and administrative workflows in one role-based application. All payments and records are simulated for this academic demo.

1. Show the Home screen and Login.
2. Sign in as `student@demo.test` with `Student123!`.
3. Point out the Student navigation and Profile.
4. Open Student Fees; explain paid/unpaid invoices and demo payment records.
5. Mention that Accounting/Admin can add invoices and record mock payments.

**Key technical terms:** Angular standalone components, reactive forms, route guards, Auth signal, Invoices service.

## Presenter 2 — Yassin: Wallet, Food Ordering and Meal Plans

1. Open Wallet: show balance and demo top-up.
2. Open Food Ordering: choose Chicken Sandwich, change quantity, show total, check out.
3. Explain that checkout debits the demo wallet, adds a transaction and creates a `pending` order.
4. Open Meal Plans and activate Weekly Plan, then revisit Student Fees to point out its unpaid invoice.

**Key technical terms:** service injection, TypeScript models, cart calculations, validation, cross-module invoice integration.

## Presenter 3 — Ali: Staff Operations and Finance

**Important: switch accounts using the app's Logout/Login controls without a full browser refresh.**

1. Sign in as `staff@demo.test` / `Staff123!`.
2. Open Cafeteria Orders and find the order placed by the student.
3. Advance Pending → Preparing → Ready → Completed.
4. Log in as `admin@demo.test` / `Admin123!`.
5. Open Payroll: demonstrate a selected employee, allowance, deduction and monthly salary record.
6. Open Department Budget: show income/expense items, category charts and JSON report exports.

**Key technical terms:** shared order ledger, state transitions, localStorage, Chart.js, payroll formula.

## Closing statement

> We completed the role-based frontend workflows, integrated the modules through common Angular services, and verified the final `master` branch using a successful production build and 135 passing Jasmine/Karma tests. This is an academic MVP; secure backend services, durable storage and real payment processing are future extensions.

## Live demo precautions

- Start the app using `npm start` and open http://localhost:4200/.
- Keep one browser tab open throughout the student-to-staff order demonstration; the order ledger is in memory.
- If using a newly signed-up student instead of the seeded `STU001`, checkout may be unavailable because a new wallet is not provisioned automatically.
- Do not describe order cancellation as a refund: it changes order status but does not return demo wallet funds.
- If an action is unexpectedly missing, show the relevant unit test, feature code and README rather than improvising a false result.

## Suggested screenshots to capture (not included in this repository)

Capture clear screenshots of: Home/Login; Student Fees; Wallet; Food Ordering/cart; successful checkout; Meal Plan; Cafeteria Orders; Payroll; Department Budget; terminal showing 135/135 tests. Crop out personal details, notifications and other applications. Suggested storage folder: `docs/screenshots/` if your assignment requires them.
