# Testing and Quality Assurance

## Automated test commands

From the repository root:

```powershell
npm install
npx ng build
npx ng test --watch=false
```

The project uses **Jasmine + Karma + Chrome**. The Angular CLI default text in the original scaffold was outdated: this is not a Vitest-based setup.

## Last reported verification

**Date:** 11 November 2026  
**Branch:** `master`  
**Commit:** `cbf13e4`  
**Result:** `npx ng build` succeeded; `npx ng test --watch=false` reported **135 of 135 SUCCESS** in Chrome 157 on Windows 10.  
**Install:** `npm install` reported 0 vulnerabilities found in the local audit. npm also displayed notices about install scripts pending allowScripts approval.  
**Build warnings:** `food-ordering.scss` exceeded the component style warning threshold by 653 bytes; `payroll.scss` exceeded it by 776 bytes. Neither warning stopped the build.

These are **recorded local results**, not a continuous-integration badge or a blanket claim of production readiness. There is no evidence of a configured GitHub Actions verification pipeline or a complete browser-automated E2E suite.

## Smoke-test checklist (manual)

| Scenario | Procedure | Expected result |
| --- | --- | --- |
| Student login | Sign in using demo student credentials | Student navigation appears |
| Student fees | Visit `/student-fees` | Student's own mock invoices and history show |
| Wallet top-up | Add positive demo funds | Balance and credit record update |
| Invalid top-up | Enter zero/negative amount | Validation prevents changing the balance |
| Checkout | Add food and pay using wallet | One debit and one pending order |
| Duplicate checkout | Submit again with empty cart | No second charge/order |
| Staff order management | Logout, login as staff **without refreshing tab**, visit `/cafeteria-orders` | New order appears |
| Order transitions | Advance status from pending to completed | Transitions follow required sequence |
| Meal plan invoice | As student, activate plan and visit fees | New unpaid meal-plan invoice exists |
| Duplicate plan | Activate a second plan during an active one | Activation rejected |
| Accounting | Sign in as accounting | Student Fees, Payroll and Budget routes are available |
| Payroll | Generate record for a selected employee/month | Correct net salary and record |
| Budget | Add one income and one expense record | Totals/charts recompute |
| Route guarding | Visit another role's route | Navigation is denied/redirected by Angular guard |
| Page refresh limitation | Refresh after creating an order | Runtime order state may reset; disclose in demo |

## Calculation checks

- Wallet: `new balance = old balance + top-up − debits`.
- Cart: `total = Σ(unit price × quantity)`.
- Payroll: `net salary = base salary + shift allowance − deductions`.
- Department Budget: `remaining balance = total income − total expenses`.

## Coverage caveats

- 135 tests passed locally, but no code coverage percentage was supplied. Do not claim a coverage percentage.
- Browser manual verification and local unit tests are complementary; one is not a substitute for the other.
- Real concurrency, multiple devices, backend persistence, security and payment processing are outside the implemented scope.
