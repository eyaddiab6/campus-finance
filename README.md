# Campus Finance — University Finance & Cafeteria Management MVP

A role-based, frontend-only Angular application demonstrating selected university finance and cafeteria workflows: student tuition invoices, a digital wallet, food ordering, meal subscriptions, employee payroll, budget reporting, and cafeteria order fulfillment.

> **Academic demo, not a live financial system.** Authentication, payments, invoice records, and wallets are simulated in the browser. There is no backend/database/payment gateway. Do not enter real credentials or financial information.

## Project overview

**University:** German International University (GIU)  
**Team:** Eyad, Yassin, Ali  
**Code:** [GitHub repository](https://github.com/eyaddiab6/campus-finance)  
**Main application:** Angular 22 (standalone components), TypeScript, Tailwind CSS v4, SCSS, Angular forms, Chart.js, Jasmine and Karma.

### Features and access

| Module | What it demonstrates | Allowed roles |
| --- | --- | --- |
| Home / navigation | Role-aware feature navigation | Public home; links depend on login |
| Login, signup and profile | Demo login, temporary registration and session-based profile | Login/signup public; profile authenticated |
| Student Fees | Tuition and meal-plan invoices, filters, payment records; accounting/admin invoice management | Student, Accounting, Admin |
| Digital Wallet | Demo balance, top-ups and transaction history | Student |
| Food Ordering | Food catalog, search, cart and wallet-funded demo checkout | Student |
| Meal Plans | Weekly/monthly plans, subscription and unpaid meal-plan invoice | Student |
| Cafeteria Orders | View student orders and advance/cancel their status | Cafeteria Staff, Admin |
| Payroll | Employee salaries, allowances, deductions, monthly entries and JSON report | Accounting, Admin |
| Department Budget | Income/expense entries, charts, category analysis and JSON report | Accounting, Admin |

For more detail, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/FEATURES_AND_ROLES.md](docs/FEATURES_AND_ROLES.md).

## Requirements

- Node.js and npm compatible with the Angular 22 project dependencies (use a current supported Node.js LTS release).
- Chrome installed to run the Karma test suite locally.
- Windows PowerShell, macOS terminal, or Linux shell.

## Run locally

```powershell
# Clone once
 git clone https://github.com/eyaddiab6/campus-finance.git
 cd campus-finance

# Install and run
npm install
npm start
```

Open **http://localhost:4200/**. Stop the dev server with `Ctrl+C`.

### Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Student | `student@demo.test` | `Student123!` |
| Accounting | `accounting@demo.test` | `Accounting123!` |
| Admin | `admin@demo.test` | `Admin123!` |
| Cafeteria Staff | `staff@demo.test` | `Staff123!` |

**Only demo credentials.** The seeded student is `STU001`, with seeded invoice and wallet examples. Students created through signup receive a new student ID; a new account is not automatically given the seeded student's wallet.

## Build and tests

```powershell
npx ng build
npx ng test --watch=false
```

The latest **reported local verification**, on 11 November 2026 after merging PR #2 into `master`, was a successful production build and **135/135 passing Jasmine/Karma tests**. This is a recorded test result, not a claim that CI is configured. Build reported two non-blocking component stylesheet warnings (Food Ordering and Payroll). See [docs/TESTING.md](docs/TESTING.md).

## Demo walk-through

1. Sign in as Student. Visit Wallet and inspect the demo balance; optionally add demo funds.
2. Open Food Ordering, add an item to the cart and check out. Observe the wallet debit and new pending order.
3. **Without refreshing the browser tab**, log out; sign in as Cafeteria Staff.
4. In Cafeteria Orders, find that order and move it through **Pending → Preparing → Ready → Completed**.
5. Log in as Student again, activate a Meal Plan, and visit Student Fees to see its newly created unpaid invoice.
6. Log in as Accounting or Admin to inspect Student Fees, Payroll and Department Budget.

A narrated presentation outline and fallback plan are in [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md).

## Folder structure

```text
src/app/
  app.routes.ts                 # lazy loaded routes and role restrictions
  core/
    guards/auth.guard.ts        # authenticated/role route guards
    models/campus.models.ts     # shared domain model interfaces
    models/payment.models.ts    # demo payment record interface
    services/                  # Auth, Invoices, Wallet, FoodStore, MealPlan, MockData
  features/
    auth/                      # login, signup, profile
    home/
    student-fees/
    wallet/
    food-ordering/
    meal-plans/
    cafeteria-orders/
    payroll/
    department-budget/
docs/                          # architecture, testing, demo, team and evaluation notes
```

## Important demo limitations

- The frontend runs independently, with **no backend, persistent database, server-side authorization or real-money transactions**. Angular route guards protect navigation in the demo, not a production API.
- Food orders and wallet transactions are **in-memory**; a full page reload resets their runtime state. The shared FoodStoreService makes an order visible across student/staff screens within the running app instance.
- Invoice and meal subscription state is **in-memory**. Activating a meal plan creates an unpaid invoice; it does not charge a bank card.
- Payroll and Department Budget use browser **localStorage** for their demo records. Session/login information uses **sessionStorage**.
- A new registered student has no pre-seeded wallet. Checkout requires an available wallet.
- Cancelling an order does **not** automatically refund its wallet debit. Do not represent this as a production payment workflow.
- This is not an E2E automation suite; the reported 135 tests are component/service/guard unit tests. Use the browser checks described in `docs/TESTING.md` before presenting.

## Documentation

- [Architecture and data flows](docs/ARCHITECTURE.md)
- [Features, roles, and workflow details](docs/FEATURES_AND_ROLES.md)
- [Team contributions](docs/TEAM_CONTRIBUTIONS.md)
- [Testing evidence and acceptance checklist](docs/TESTING.md)
- [Demo/presentation script](docs/DEMO_SCRIPT.md)
- [Evaluation questions and answers](docs/EVALUATION_QA.md)
- [Final submission checklist](docs/SUBMISSION_CHECKLIST.md)

## Team collaboration

Development was split into feature branches, reviewed and brought together through `integration/eyad-yassin` and `integration/all-team`. The combined MVP was merged to `master` via [Pull Request #2](https://github.com/eyaddiab6/campus-finance/pull/2), yielding merge commit `cbf13e4` (11 November 2026).
