# ICS 511 Milestone 1 - Compliance and Submission Guide

**Assignment source:** ICS 511, Web Programming, Winter 2026, Milestone 1; deadline **14 November 2026**.

## Implemented features and required fixes

- Angular 22 frontend only; no backend required in this milestone.
- Home with login/signup/profile navigation and four demo account roles.
- Signup: username, full name, email, password/confirmation, optional profile picture, optional **fictional card last four digits**, and food preference.
- Profile: avatar, username, name, email, ID, role, food preference, and masked fictional card suffix. Passwords are not stored or displayed after registration.
- Storage: `sessionStorage` (demo user/profile), `localStorage` (payroll & budget), cookie (non-sensitive preference). Wallet, invoices, orders and plans are in-memory.
- Lazy-loaded standalone routes, guards, responsive Tailwind/SCSS, Chart.js budget charts, Jasmine/Karma tests.
- Animation/audio/AI chat are bonus items, not required.

## Important scope and security notes

Educational **frontend prototype** only. No backend/database/payment gateway or production server authorization. Browser storage can be read/altered by a browser user. Never enter real financial details, expiry dates or CVV. This form accepts only **four fictional digits** as a demo card suffix.

Order, invoice and wallet changes may reset on refresh. Payroll and budget remain only on the same browser via localStorage. Cookies are only for non-sensitive preferences, not authentication. No refund on cancelled mock orders.

## Test commands

```powershell
npm install
npx ng build
npx ng test --watch=false
```

Record the **actual** result after applying the patch. The previous 135/135 were verified on the earlier master, not on this new branch.

## Browser smoke tests

1. Signup with a username, small picture, fictional card suffix and preference; inspect the Profile page.
2. Refresh Profile; confirm details restored from sessionStorage. Logout; confirm sensitive session metadata cleared.
3. In DevTools > Application inspect `campus_finance_food_preference` cookie, sessionStorage profile, and Payroll/Budget localStorage after creating demo records.
4. Login using all four seeded roles; confirm guarded routes.
5. Check mobile width 390 px and desktop width 1440 px (signup, finance tables, charts).
6. Demo food checkout -> staff order management within the **same tab, without full refresh**.
7. Verify payroll JSON export, charts, invoices and payments.

## Actual assignment deliverables checklist

- [ ] Exactly **3 pages** of report containing team name, member **full names, official IDs, university emails**, project idea, app description, storage justification/UX/privacy/security and **actual screenshots**.
- [ ] Fully running source code / accessible repo link, tested from clean install.
- [ ] Add ONE accessible deliverables link in the team's Web Programming registration by the deadline.
- [ ] Register idea/team and confirm unique idea assignment.
- [ ] Confirm four team members or obtain explicit instructor/TA approval for three. This assignment says four.
- [ ] Submit by **14 Nov 2026**, or risk grade deductions.

## Included separate ZIP tools

- `apply-compliance.ps1`: creates new Git branch and applies code patch with backups; never commits or pushes.
- `scripts/capture-screenshots.mjs`: captures actual browser pages with Chrome DevTools.
- `report/submission-data.json`: fill exact team metadata and registration status.
- `scripts/build-report.mjs`: builds three-page PDF/HTML using real screenshots.
