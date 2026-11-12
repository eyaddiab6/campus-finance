# Final Submission Checklist

## Verified from reported evidence (11 November 2026)

- [x] Team's application code merged via GitHub PR #2 into `master`.
- [x] `master` synchronized with `origin/master` (merge commit `cbf13e4`).
- [x] `npm install` completed locally.
- [x] `npx ng build` succeeded (non-blocking stylesheet warnings).
- [x] `npx ng test --watch=false` completed with 135/135 SUCCESS.
- [x] Shared student checkout → staff order workflow implemented.
- [x] Meal plan activation → unpaid invoice linkage implemented.

## Documentation prepared in this delivery

- [x] Project README
- [x] Architecture document
- [x] Features and role matrix
- [x] Team contributions
- [x] Testing and acceptance plan
- [x] Presentation/demo script
- [x] Likely evaluation questions and answers

## Final steps the team must verify

- [ ] Apply and review the documentation changes in a dedicated Git branch.
- [ ] Push the documentation branch and merge its PR to `master`.
- [ ] Capture real screenshots from the running application **if required by the assignment** (do not fabricate screens).
- [ ] Run the full browser demo on the exact machine used during evaluation.
- [ ] Check assignment-specific deliverables, format, deadline and submission platform against the instructor's instructions.
- [ ] Confirm all three members agree with the contribution descriptions and can answer evaluation questions.
- [ ] Verify the final submission link/ZIP and that the evaluator can install dependencies and run the app.

## Known limitations to disclose

- No backend or persistent database; simulated finance transactions only.
- Runtime wallet, invoice, subscriptions and orders reset on application reload.
- Payroll/Budget persist locally in the browser; not shared among devices.
- No automatic refund on cancelled order.
- Two non-blocking component CSS budget warnings.
- No verified CI or browser-automated E2E pipeline.
