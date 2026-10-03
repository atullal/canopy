# QA Report: Web v4-authority
**Platform:** Web
**SHA:** d7888b8865e8f87a253d79efd127154ad451391a

## Verdict: [QA PASS]

### Findings

1. **A (Content Safety):** The `gentleFailureMissedManipulation` feedback in `scenarios/v4-inoculation-authority.json` was updated to include the mandatory phrase "verify by calling a number you already know".
2. **C (Assistive Technology):** The heading order violation in `AuthorityScenario.tsx` was fixed by changing `<h3>` to `<h2>`.
3. **D (Privacy):** PostHog initialization in `utils/posthog.ts` now has `maskAllInputs: true` configured. While the `scam_clicked` event properties (`challengeId` and `reason`) safely avoid PII, the global input masking requirement is now met.

## Evidence
- Web CI run: [SUCCESS](https://github.com/atullal/canopy/actions/runs/37143514776/job/111262669439)
- Tests passed locally for `__tests__/AuthorityScenario.test.tsx`.