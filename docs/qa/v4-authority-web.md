# QA Report: Web v4-authority
**Platform:** Web
**SHA:** b0d12c15ad56b5debdef6c01e7ce030119a5261a

## Verdict: [QA FAIL]

### Findings

1. **A (Content Safety) - Missing mandatory verification advice:** The feedback message for `gentleFailureMissedManipulation` in `scenarios/v4-inoculation-authority.json` omits the phrase "verify by calling a number you already know". The V3 checklist requires this phrasing in advice.
2. **C (Assistive Technology) - Heading order violation (Moderate):** An Axe audit on the `AuthorityScenario` component identified a `heading-order` violation (an `<h3>` tag is used without a preceding `<h2>`). While the checklist only blocks on 'serious' or 'critical' Axe issues, this should be corrected.

## Evidence
- Web CI run: [SUCCESS](https://github.com/atullal/canopy/actions/runs/37120522433/job/111195563171)
- Automated Axe accessibility audit performed locally via `jest-axe`, surfacing 1 moderate issue and 0 serious/critical issues.
