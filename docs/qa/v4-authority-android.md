# QA Report: V4 Authority (Android)
**Date:** 2026-10-03
**Commit SHA:** cd405f28c43a4ffd13cdf993e456bf3c137556af
**CI Run:** [Android CI 37120585148](https://github.com/atullal/canopy/actions/runs/37120585148)

## Result: [QA FAIL]

## Findings

1. **[F] Missing Evidence (Screenshots):** The CI workflow does not upload UI screenshots at default and largest text sizes (required to verify Section B). There are no artifacts attached to the CI run.
2. **[F] Missing Evidence (Audit Output):** The CI workflow does not upload Accessibility Test Framework audit output (required to verify Section C).
3. **[C] Assistive Technology (ATF Checks):** The test file `V4InoculationAuthorityTest.kt` does not enable or run Accessibility Test Framework checks.
4. **[B] Older-adult Usability (Reduced Motion):** The `SquishButton` in `V4InoculationAuthority.kt` uses `animateFloatAsState` but does not include a reduced-motion fallback as required for motion.

## Next Steps
- Update `.github/workflows/android.yml` to upload the generated screenshots and ATF output as CI artifacts.
- Update `V4InoculationAuthorityTest.kt` to capture screenshots (light/dark, default/large text) and enable Accessibility Test Framework checks.
- Add a reduced-motion fallback to `SquishButton`.
