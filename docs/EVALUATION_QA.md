# Evaluation — Likely Questions and Model Answers

## 1. Why did you choose Angular?

Angular provides standalone components, routing, dependency injection, forms and test infrastructure, making it suitable for a modular university portal with different user roles.

## 2. How did you divide the work?

Eyad handled Auth, profile, student fees, invoices and navigation; Yassin implemented Wallet, food ordering, checkout and meal plans; Ali implemented Payroll, Department Budget and Cafeteria Orders. The team then integrated changes on a shared integration branch.

## 3. How does role-based access work?

The Auth service holds the current demo user; guards read the role required by each route. This is **client-side route protection**, not server-enforced security.

## 4. How does login persist?

The Auth service stores the demo session in browser `sessionStorage`. The app restores that session while the tab/session data remains available. This is not a secure production authentication system.

## 5. How is food checkout processed?

FoodStoreService validates the cart and item availability, checks the student's wallet, requests a demo debit from WalletService, records an order with pending status, and clears the cart after success.

## 6. How do staff see orders placed by students?

The student checkout and Cafeteria Orders view share **the same root FoodStoreService**. They read from the same in-memory list during the running application instance. Refreshing resets these orders.

## 7. What prevents invalid order states?

FoodStoreService only allows `pending → preparing → ready → completed`, with cancellation allowed before a terminal state. It rejects changes to completed or cancelled orders.

## 8. How do Meal Plans connect to Student Fees?

MealPlanService calls the existing Invoices service to add an unpaid `meal-plan` invoice before recording the new subscription. The resulting `invoiceId` is stored on the subscription.

## 9. What is the payroll formula?

Net salary equals base salary plus shift allowance minus deductions. Inputs are validated, and duplicate employee/month records are rejected by the component.

## 10. What charts are included?

Department Budget uses Chart.js to visualize income versus expenses and expense categories.

## 11. Where is the database?

There is **no database** in the academic MVP. MockData provides seeded examples; some services keep runtime state in memory, and Payroll/Budget use browser localStorage.

## 12. What tests were run?

The reported merged `master` build succeeded, and 135 Jasmine/Karma tests passed in Chrome. The project also requires a manual smoke test to verify cross-role browser interaction.

## 13. What is the main current limitation?

The frontend has no secure server-side authorization, persistent order/payment database, real payment processing or automatic refund. These would be essential for production use.

## 14. What would you implement next?

A backend REST API, relational database, authenticated role enforcement, persistent transactional wallet/order records, secure audit logs, automated E2E tests, and safe refunds.
