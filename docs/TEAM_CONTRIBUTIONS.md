# Team Contributions and Collaboration

## Members and ownership

| Member | Primary work | Integration responsibilities |
| --- | --- | --- |
| **Eyad** | Login/signup/profile, Auth service, guards, Student Fees, invoice creation and payment history, role-aware Home | Shared integration, merged workflows, validation of full team build/tests |
| **Yassin** | Digital Wallet, wallet transactions, food catalog/cart/checkout, Meal Plans | Checkout-wallet coordination; authenticated student identity; meal-plan invoice linkage |
| **Ali** | Payroll, Department Budget, Cafeteria Orders | Connecting staff order management to the shared FoodStoreService |

The contribution matrix describes module ownership, not a claim that every line was written by one person; integration fixes were applied across branches.

## Git workflow

1. The team worked on isolated feature branches: `feature/eyad-auth-fees`, `feature/yassin-wallet-store`, and `feature/ali-payroll-budget`.
2. Shared integration was completed on `integration/eyad-yassin`, then `integration/all-team`.
3. Conflicting data ownership was resolved by sharing the FoodStoreService order ledger between student checkout and Cafeteria Orders.
4. The final integration branch was merged into `master` via [PR #2](https://github.com/eyaddiab6/campus-finance/pull/2) on 11 November 2026, merge commit `cbf13e4`.
5. Full local Angular build and Jasmine/Karma tests were rerun on `master` and reported as passing.

## Evidence

- [Repository](https://github.com/eyaddiab6/campus-finance)
- [Yassin's original PR #1](https://github.com/eyaddiab6/campus-finance/pull/1)
- [Final team integration PR #2](https://github.com/eyaddiab6/campus-finance/pull/2)
- Latest recorded verified master merge SHA: `cbf13e4`.

## Notes for evaluator

All financial workflows are **simulated** and scoped to the academic demonstration. The project was intentionally designed for functional frontend demonstration, modular service logic, and test coverage rather than production deployment.
