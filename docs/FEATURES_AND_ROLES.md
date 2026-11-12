# Features and Role-Based Workflows

## Student

- **Login and Profile:** sign in with a seeded student account or create a temporary demo student session through signup.
- **Student Fees:** inspect the student's tuition and meal-plan invoices, status, amounts and demo payment history.
- **Wallet:** inspect a seeded demo wallet balance, make a simulated top-up and review credit/debit records. A newly registered account does not automatically have a seeded wallet.
- **Food Ordering:** search/filter the food catalog, add to cart, change quantity, remove items, and check out against an available demo wallet balance. The order is created with status `pending`.
- **Meal Plans:** activate a weekly or monthly plan (only one active plan at a time); activation creates a corresponding unpaid invoice that is visible under Student Fees.

## Accounting

- View and manage mock student fees and payment records, including invoice creation and marking invoices as paid.
- Generate payroll records using base salary, allowances and deductions; review monthly results and export a JSON report.
- Manage income and expense entries and review charts/JSON exports under Department Budget.

## Admin

- Has access to Student Fees, Payroll, Department Budget and Cafeteria Orders according to the existing router configuration.
- Uses mock finance management screens; these are not production financial controls.

## Cafeteria Staff

- Sees submitted food orders in Cafeteria Orders while the app instance remains running.
- Filters/searches orders, views items and totals, and applies sequential status changes:

  `pending → preparing → ready → completed`

- Can cancel a non-terminal order. Cancellation does not refund a previously charged demo wallet.

## Cross-module constraints

- A new order is visible to staff after switching roles **without a full browser page refresh**.
- Checkout checks item availability and demo wallet balance before creating an order.
- Login/route role checks are implemented entirely in Angular and cannot replace backend authorization.
- Session state uses `sessionStorage`; order, invoice, wallet and subscription service data is in-memory; Payroll and Department Budget records use `localStorage`.

## Example negative scenarios

- Insufficient wallet balance → checkout fails without creating an order.
- Unavailable product → checkout fails.
- Invalid or negative top-up → rejected.
- Activating a second plan while a plan is active → rejected.
- Attempting to update a completed/cancelled order → rejected.
- Trying to pay an already-paid invoice → rejected by the mock invoice service.
