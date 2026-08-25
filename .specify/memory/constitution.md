<!--
SYNC IMPACT REPORT
==================
Version change: (unversioned / all-placeholder) → 1.0.0
Added sections:
  - Core Principles (I–V): Code Quality, Test-First, Testing Standards, UX Consistency, Performance
  - Quality Gates
  - Development Workflow
  - Governance
Removed sections: none (template placeholders replaced)
Modified principles: n/a (initial authoring)
Follow-up TODOs:
  - TODO(RATIFICATION_DATE): No project history available; set to initial authoring date 2026-08-25.
  - TODO(TECH_STACK): No source files present; tech-stack constraints left as open guidance.
-->

# Verified Strava Segments Constitution

## Core Principles

### I. Code Quality (NON-NEGOTIABLE)

Every line of production code MUST be readable, maintainable, and purposeful.

- Functions MUST have a single, clearly named responsibility; side effects MUST be explicit.
- Cyclomatic complexity MUST NOT exceed 10 per function; refactor before merging.
- Magic numbers and strings MUST be replaced with named constants or configuration values.
- Dead code, commented-out blocks, and speculative stubs MUST NOT be committed.
- Dependencies MUST be justified; prefer standard-library solutions when capability is equivalent.
- All public interfaces MUST be typed; implicit `any` is prohibited in TypeScript/typed languages.

**Rationale**: Unreadable or over-complex code is a long-term liability that multiplies defect
rates and onboarding time. These rules keep the codebase navigable as it scales.

### II. Test-First Development (NON-NEGOTIABLE)

New behaviour MUST be specified by a failing test before implementation begins.

- Red-Green-Refactor cycle MUST be followed: write failing test → implement minimally → refactor.
- Tests MUST be reviewed and approved before implementation code is written.
- A feature branch MUST NOT be merged if it reduces overall test coverage below the established
  project baseline.
- Tests MUST be deterministic; flaky tests MUST be quarantined and fixed within one sprint.

**Rationale**: Test-first development surfaces design problems early, documents intended behaviour
precisely, and ensures changes are always backed by a safety net.

### III. Testing Standards

All tested code MUST meet explicit coverage and quality thresholds.

- Unit test coverage MUST be ≥ 80 % for core business logic modules.
- Integration tests MUST cover every public API contract and inter-service boundary.
- End-to-end tests MUST cover the primary user journeys (happy path + top two error paths).
- Test names MUST follow the pattern `<unit>_<scenario>_<expected outcome>` for clarity.
- Mocks MUST NOT replace real infrastructure in integration tests; use test containers or
  equivalent in-process fakes with identical schemas.
- Performance-sensitive code paths MUST include regression benchmarks executed in CI.

**Rationale**: Coverage thresholds and naming standards ensure tests act as living documentation
and prevent the false confidence of shallow test suites.

### IV. User Experience Consistency

Every user-facing surface MUST conform to established design and interaction conventions.

- UI components MUST be sourced from the project's shared component library; one-off bespoke
  components require explicit design review and documentation.
- Copy, labels, and error messages MUST follow the project style guide (tone, capitalisation,
  punctuation); changes MUST be reviewed by a content owner.
- Error states, loading states, and empty states MUST be explicitly designed and implemented for
  every feature; they are not optional polish.
- Interaction patterns (navigation, form submission, confirmation dialogs) MUST be consistent
  across the application; deviations MUST be documented and justified.
- Accessibility MUST meet WCAG 2.1 AA; automated axe/pa11y checks MUST pass in CI.

**Rationale**: Inconsistency erodes user trust and increases support burden. A shared component
library and content standards are the minimum viable guardrails.

### V. Performance Requirements

The application MUST meet defined performance budgets; regressions block merges.

- Page Time-to-Interactive MUST NOT exceed 3 s on a simulated mid-range mobile device (4G).
- Core API endpoints MUST respond within 200 ms at p95 under nominal load.
- Bundle size MUST NOT increase by more than 5 % in a single PR without explicit approval.
- Database queries introduced or modified MUST include an execution-plan review; full table scans
  on tables > 10 k rows are prohibited without pagination or index justification.
- Background jobs and batch processes MUST define and document their expected runtime and
  resource envelope before deployment.

**Rationale**: Performance is a feature. Budgets defined up front prevent the slow accumulation
of regressions that are expensive to reverse once users experience them.

## Quality Gates

The following gates MUST pass before any branch is merged to the main branch:

- All tests pass (unit, integration, and e2e suites).
- Code coverage meets or exceeds the project baseline.
- Static analysis (linter + type checker) reports zero errors.
- Accessibility checks (axe/pa11y) report zero violations.
- Performance budget checks (bundle size, Lighthouse scores) pass.
- Security scan (Snyk or equivalent) reports no new high/critical vulnerabilities.
- At least one peer code review approval from a team member who did not author the PR.

Exceptions MUST be documented in the PR description with a remediation ticket linked.

## Development Workflow

- Feature work MUST be developed on short-lived branches (< 5 days); long-running branches
  MUST rebase daily against the main branch.
- Commits MUST be atomic and follow Conventional Commits (`feat:`, `fix:`, `test:`, `chore:`,
  etc.).
- PR descriptions MUST include: motivation, approach summary, test plan, and screenshot/recording
  for any visual change.
- Breaking changes MUST be flagged with `BREAKING CHANGE:` in the commit footer and announced
  in the team channel before merging.

## Governance

This constitution is the authoritative source of engineering standards for this project. It
supersedes all informal agreements, prior conventions, and README-level guidance where they
conflict.

**Amendment procedure**:
1. Propose the change in a PR that modifies this file only; include rationale and impact.
2. Require approval from at least two team members (or the project lead when team size < 3).
3. Increment the version according to semantic rules (MAJOR / MINOR / PATCH).
4. Update `LAST_AMENDED_DATE` to the merge date.
5. Communicate the change to all contributors before the next sprint begins.

**Versioning policy**: MAJOR for principle removals or redefinitions; MINOR for new principles
or materially expanded guidance; PATCH for wording clarifications and typo fixes.

**Compliance review**: Constitution compliance MUST be verified in every PR review. Reviewers
are expected to cite the relevant principle when requesting changes tied to this document.

**Version**: 1.0.0 | **Ratified**: 2026-08-25 | **Last Amended**: 2026-08-25
