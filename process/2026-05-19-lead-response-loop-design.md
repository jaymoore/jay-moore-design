# Lead Response Loop — Case Study + Product Design Spec

**Author:** Jay Moore
**Date:** 2026-05-19
**Status:** Approved (1 brainstorming round + 1 Codex second-opinion review on sections 1–4 with kill list folded in; final pass pending)
**Replaces:** the "SPM lifecycle engine" framing of `/work/spm-lifecycle` in `2026-05-13-portfolio-redesign-design.md`
**Companion plan:** `2026-05-19-lead-response-loop.md` (to be authored next by the writing-plans skill)

---

## 1. Context and decision

### The two-birds strategy

Jay is running two parallel projects that each consume full time:

1. **Job search** — targeting Staff/Principal Design Engineer roles at Vercel (primary) and Anthropic (secondary). The portfolio at `jaymoore.net` is the deliverable.
2. **SPM agency** — pre-revenue. Needs a productized offer to sell HVAC + plumbing business owners ($500K–$5M ARR).

Strategy: build the SPM productized product **as** the portfolio case study. One real build serves both goals. Time math wins, authenticity wins (real ICP, real prospects, real friction), and the live demo is the actual product instead of a fabricated artifact.

### Critical correction to prior spec

`2026-05-13-portfolio-redesign-design.md` lists "SPM lifecycle automation engine (current, 2026)" with shipped metrics: TTF-touch 30 min → 60s; reply rate 4.6–4.9%; 30+ qualified leads/campaign/client. **These metrics were a spec idea, not real shipped numbers.** This spec corrects that. All case study copy uses honest in-build framing + real telemetry as it accrues. No fabricated outcomes.

### Decision

- **Case study URL:** `/work/lead-response-loop` (the existing `/app/work/spm-lifecycle` scaffold gets deleted outright — no redirect needed; no live external links to preserve)
- **Case study page label:** "Lead Response Loop"
- **Tagline:** "Decision-support response system for high-noise inbound lead channels. HVAC + plumbing first, pattern transferable."
- **Product short name:** Auto Lead Response Loop / Missed Lead Recovery
- **Sprint length:** 14 days
- **Sprint output:** (a) shippable product running for at least one beta HVAC partner; (b) password-gated case study at the URL above

### Two repos, two GitHub orgs

| Concern | Repo | GitHub remote |
|---|---|---|
| Portfolio case study (this repo) | `/Users/jay/00-Dev-jaymoore/jay-moore-design` | `github.com/jaymoore/jay-moore-design` (personal user) |
| Product (separate repo) | `/Users/jay/00-Dev/auto-lead-response-loop` | `github.com/simplepathmedia/auto-lead-response-loop` (SPM agency org) |

The case study URL on jaymoore.net is served from the portfolio repo. The portfolio's Outcomes section fetches anonymized aggregates from the product repo's deployed CF Workers endpoint at runtime. The two repos otherwise have no source-level coupling.

**Cross-repo discipline during the 14-day sprint:** every commit on either repo runs through codex-second-opinion before landing. Each repo has its own commit cadence. Watch which directory you are in before committing — `pwd` first, always.

### Non-goals

- A long-form product designer case study
- A marketing site for the product (no `/lead-response-loop` sales page in this sprint)
- Multi-tenant infrastructure
- Web dashboard for the owner (SMS-only interface in v1)
- Fabricated metrics of any kind in the case study

---

## 2. Case study shape

The case study at `/work/lead-response-loop` is structured as:

| # | Section | Content type |
|---|---|---|
| 00 | **Transferability preamble** | Up-front callout for non-HVAC readers (Vercel/Anthropic hiring managers). Decodes the HVAC vertical into Staff-level concerns: latency budgets, evaluation harnesses, reliability, abuse handling, decision support, product tradeoffs. Domain incidental, engineering universal. |
| 01 | **TL;DR** | One sentence + 3 metric tiles. Metrics are **in-build / shipped-and-measured**: P95 end-to-end latency, qualification accuracy on labeled test set, % of beta partner missed calls recovered. No TTF-touch / reply-rate numbers. |
| 02 | **Problem** | HVAC/plumbing economics: cost of a missed call. Industry response-time data. Two-paragraph narrative. |
| 03 | **Approach** | Multi-agent loop framing: intake → qualify → route → notify. One architecture diagram. Three artifact panels (system diagram, prompt design excerpt, sample qualification trace). |
| 04 | **Live demo** | Interactive in-page simulator. See §4 for full design. |
| 05 | **Decisions** | 3–4 hard calls, each with the tradeoff explicit. Includes **one reversal narrative** (a decision that turned out wrong, what changed, what was learned). Decisions: decision-support over full automation · deterministic-score-then-LLM-enrich · override stored as training data · 60s latency budget. |
| 06 | **Evaluation** ("How I know this works") | Eval harness output. Confusion matrix on labeled test set. False-positive / false-negative policy. P50/P95 SLOs. Accuracy targets vs measured. This is the Staff/Principal nod-vs-shrug section. |
| 07 | **Outcomes** | Honest "in build" framing. Real beta-partner snapshot when data accrues. Every claim has a current telemetry value + a next measurement date. No copy that implies success without data. |
| 08 | **Build log** (appendix) | Curated 14-day chronological PR + screenshot trail, anchored to decisions and outcomes (not diary noise). Main sections link to relevant entries via sidenotes. |
| 09 | **Roadmap** | The other 4 components: form follow-up, full CRM pipeline, weekly report, AI receptionist. Honest "next" framing, not vaporware. |
| 10 | **Where next** | Homepage / contact links. Inherits existing scaffold. |

### Page access

- **Password-gated.** New route reuses the existing password-gate pattern: cookie `lrl-case-study-auth`, env `CASE_STUDY_PASSWORD`. Password handed out via Jay's outreach (recruiter / hiring manager DMs).
- **Not public-indexed.** `robots.txt` disallows. Sitemap excludes.
- **Old scaffold deleted, not redirected.** `/app/work/spm-lifecycle/` directory (including `page.tsx`, `case-study-content.tsx`, `password-gate.tsx`, `actions.ts`, `SPECIMEN-D-REFORMAT.md`) is removed entirely. No 308 redirect needed — that scaffold was never linked externally; it was a placeholder only. Git history preserves the prior state for audit-trail purposes.
- **All "SPM" mentions removed** from page metadata, titles, descriptions, page label, and homepage card.

---

## 3. Product MVP scope (ships in 14 days)

### In scope — the core loop

| Stage | Behavior | Stack |
|---|---|---|
| 1. Missed-call detection | Twilio number forwards to owner's real line. On `no-answer`/`busy`/`failed` call-status webhook, fire SMS text-back to caller within 60s. | Twilio Voice + CF Workers |
| 2a. Deterministic pre-filter | Caller's SMS reply hits a regex/keyword pre-filter (`lib/prefilter.ts`): matches obvious URL spam, lottery/sweepstakes keywords, known abuse patterns, opt-out phrases. Filters cleanly-obvious spam, short-circuits the LLM call. Decision logged as `prefilter_decision` with the matched pattern. | CF Workers |
| 2b. LLM qualification | Anything not short-circuited by pre-filter is sent to Claude Haiku via `POST /qualify`. Classifies (`urgent` / `standard` / `not_a_fit` / `spam`), extracts `{service_type, urgency, name, location}`, returns `confidence` + `evidence_quotes` (verbatim phrases that drove the classification). Tool-use JSON schema enforced. 5s server-side timeout + circuit breaker. | CF Workers + Anthropic |
| 3. Owner notification (decision support) | Owner SMS: "New lead: {name} — {service} — {label} · {confidence}% conf · evidence: '{quote}'. Reply YES / NO / INFO." Owner replies trigger next action. Decisions logged as training signal. Plain-keyword interface (Twilio doesn't support inline buttons). | CF Workers + Twilio SMS |
| 4. Appointment routing | On YES: caller gets Cal.com booking link via SMS. Booking webhook confirms to both sides. | Cal.com + Twilio SMS |

**Two-stage classification.** The pre-filter is deterministic, fast, and cheap; the LLM is slower and pays per token. Routing obvious-spam to the pre-filter is **intended to reduce API cost and improve P50 latency** — the actual delta gets measured once the eval harness lands (Day 5) and is reported in the case study Evaluation section. The pre-filter is conservative: only sends a message to the spam bucket if a high-confidence pattern matches. Ambiguous cases always go to the LLM.

### Out of scope (lives in Roadmap section of case study)

- Website form follow-up (most beta-stage customers don't have a converting form)
- Full CRM pipeline UI
- Weekly lead-recovery report
- AI receptionist (voice — separate sprint)
- Self-serve signup / multi-tenant
- Sales site for the product

### Two deploys

1. **Portfolio site** (`jaymoore.net`, Next.js): hosts case study page + in-page simulator. Existing deploy.
2. **Product** (`/Users/jay/00-Dev/auto-lead-response-loop`, CF Workers): real Twilio webhook handlers, real Anthropic calls, real Cal.com routing, single-tenant for the beta partner. Separate repo, separate deploy.

### Telemetry from Day 1

Every call, message, classification, owner decision, and booking event is logged with timestamp + correlation ID. Feeds the case study's Evaluation + Outcomes sections.

### SMS compliance assumptions

US TCPA + carrier requirements apply. Documented assumptions for v1:

- **Implicit consent on text-back.** The system only texts a caller who first called the partner's business number. This falls under an "established business relationship" interpretation. The case study Decisions section documents this assumption explicitly rather than handwaving it.
- **A2P 10DLC registration.** Beta partner's Twilio number registered as A2P 10DLC before launch (this is the approval delay noted in Day 6 risk). Sample messages submitted with the registration.
- **Mandatory keywords:** `STOP` (and `UNSUBSCRIBE`, `END`, `QUIT`, `CANCEL`) honored — caller texts any of these → number added to D1 `opt_out` table → no further SMS to that number ever, across calls. `HELP` returns a static one-liner with business contact info.
- **Disclosure in text-back:** every text-back includes "Reply STOP to opt out." in the body.
- **Quiet hours:** text-back delayed if the missed call lands between 9pm and 8am caller local time (inferred from area code; conservative fallback = partner's local time). Owner notification SMS unaffected (owner has consented).
- **No marketing.** System only sends transactional SMS in direct response to the caller's own action (the missed call). No proactive marketing blasts.
- **Audit trail.** Every outbound SMS logged with `compliance_basis: implicit_consent_post_inbound_call` or `compliance_basis: owner_authenticated`. Failures (e.g., sent to a number on the opt-out list) flagged for review.

This is v1 MVP-grade compliance, not full enterprise legal review. The case study Decisions section will note this explicitly and flag formal counsel review as part of the Roadmap.

---

## 4. Live demo design (in-page simulator)

The interactive artifact at the center of the case study.

### Layout

```
┌─ Scenario picker ──────────────────────────────────────┐
│ [Water heater leak] [AC tune-up] [Parts inquiry]       │
│ [Obvious spam]    ↓ show advanced ↓                    │
└────────────────────────────────────────────────────────┘
┌─ Prospect side ────────┐  ┌─ Owner side ──────────────┐
│ ☎ Incoming call        │  │ (empty until step 3)      │
│ ⏱ no answer            │  │                           │
│ 📱 SMS arrives:        │  │                           │
│   "Sorry we missed..." │  │                           │
│ 📱 Prospect reply:     │  │                           │
│   {scenario text}      │  │                           │
└────────────────────────┘  └───────────────────────────┘
┌─ Event log + latency ──────────────────────────────────┐
│ T+0.0s  Call missed                                    │
│ T+1.2s  Auto text-back sent                            │
│ T+3.4s  Prospect reply received                        │
│ T+5.8s  Claude classified: urgent · 92% · evidence...  │
│ T+5.9s  Owner notified                                 │
└────────────────────────────────────────────────────────┘
```

### Real vs mocked

| Piece | Real / Mocked |
|---|---|
| SMS UI both sides | Mocked, pure client-side rendering |
| Call timeline | Mocked, scripted timing |
| Latency stopwatch | Real for the LLM call; other steps scripted to match production P50 |
| **LLM qualification** | **Real call to the product's `POST /qualify` endpoint** via Next.js Server Action proxy. Same prompt + same schema as the production webhook path — one source of truth, no parallel inference code. Streamed into UI. |
| Owner notification + YES/NO/INFO buttons | Mocked but functional — clicks render next state |
| Cal.com booking link | Real link to test Cal.com instance, opens new tab |

### Hardening (Codex kill #2 folded in)

- **Default UX = canned scenarios visible first.** "Write your own" hidden behind a "show advanced" disclosure toggle (friction).
- **Per-IP rate limit:** Upstash Redis via fetch (works from both CF Workers and Vercel, free tier sufficient). 10 demo runs per IP per hour. Custom 429 page.
- **Input cap:** ≤280 chars on freeform input.
- **Schema-enforced output:** Anthropic tool-use call returns strict JSON; any non-conforming output is rejected, fallback runs.
- **Server-side timeout:** 8 seconds. Circuit breaker after 3 consecutive timeouts → fallback to cached output for next 5 minutes.
- **Cost cap:** Anthropic monthly spend hard-capped at $50 in the console.
- **Fallback banner:** "Demo offline, showing cached output" when API key absent, rate-limited, or circuit-broken.

### Edge cases

- API key absent → cached output + banner
- Rate-limited → cached output + banner
- Mobile width → stacks vertically (prospect → owner → log)
- Prompt-injection attempt in freeform → schema rejection routes to fallback; no model output rendered

### Out of scope for v1 simulator

Sound effects · animations beyond opacity/translate · multi-language demos · voice (AI receptionist) preview · multi-step conversation simulation beyond first reply

---

## 5. Product architecture

### Repo layout

```
/Users/jay/00-Dev/auto-lead-response-loop/
├── src/
│   ├── routes/
│   │   ├── qualify.ts                       # POST /qualify — sync inference endpoint (shared by webhook + simulator)
│   │   ├── metrics-public.ts                # GET /metrics/public
│   │   ├── cron/retry-replay.ts             # CF Cron Trigger handler
│   │   └── webhooks/
│   │       ├── twilio/call-status.ts
│   │       ├── twilio/sms-inbound.ts        # runs prefilter, then calls /qualify path internally
│   │       ├── twilio/sms-owner-reply.ts
│   │       └── calcom/booking-created.ts
│   ├── lib/
│   │   ├── prefilter.ts         # deterministic regex/keyword pre-filter
│   │   ├── qualifier.ts         # Anthropic call + schema-enforced output (single source of truth)
│   │   ├── notifier.ts          # Twilio SMS send
│   │   ├── telemetry.ts         # event logging to D1
│   │   ├── retry-registry.ts    # KV-backed retry registry for outbound SMS
│   │   ├── sig-verify.ts        # Twilio webhook signature verification
│   │   ├── idempotency.ts       # KV-backed dedup keys
│   │   └── db.ts                # D1 query helpers
├── schema.sql                   # D1 migrations
├── prompts/qualifier.md         # versioned prompt
├── eval/
│   ├── test-set.jsonl           # 50 labeled examples
│   └── run-eval.ts              # confusion-matrix script
└── wrangler.jsonc               # CF Cron Trigger declared here (every 60s for retry replay)
```

### Storage

**Cloudflare D1** (single SQLite database, free tier sufficient). Tables: `calls`, `messages`, `classifications`, `owner_decisions`, `bookings`. Every event timestamped + correlation-id'd.

**Cloudflare KV** for: idempotency keys (TTL 24h), outbound retry registry, circuit-breaker state, rate-limit counters.

### Webhook reliability (Codex kill #3 folded in)

- **Twilio signature verification** on every inbound webhook
- **Idempotency keys** on every inbound webhook (KV-backed, 24h TTL) — duplicate Twilio retries collapse to one effect
- **Out-of-order event handling** — every event carries `received_at` + `correlation_id`; downstream logic uses event-sourced state, not last-write-wins
- **Outbound retry** — KV-backed retry registry. On outbound SMS failure, write a record to KV with `next_attempt_at` timestamp. A **CF Cron Trigger** runs `routes/cron/retry-replay.ts` **every 60 seconds**: scans the registry, replays any record whose `next_attempt_at ≤ now`, increments attempt count, sets next backoff (1m, 5m, 15m). After 3 failed attempts → record removed, escalated via Resend email to Jay.
- **Inbound replay** — relies on Twilio's built-in webhook retry (Twilio retries failed webhook delivery automatically for up to 24h). Combined with idempotency keys, this covers the "D1 down → don't lose lead" case without full CF Queues complexity.
- **SMS-loop prevention** — `direction` column tracks whether a message is owner→system, system→owner, system→caller, or caller→system. No auto-reply rules that could create owner↔system loops.

### LLM call (`qualifier.ts`)

Single source of truth — every consumer (Twilio inbound webhook, public `POST /qualify`, simulator on the portfolio) routes through this one function. Same prompt version, same schema.

- **Model:** `claude-haiku-4-5` (low latency, low cost)
- **Input:** full prospect SMS thread + business profile (service offerings, hours, geography)
- **Output schema (frozen):**
  ```ts
  {
    label: "urgent" | "standard" | "not_a_fit" | "spam",
    confidence: number,                       // 0..1
    evidence_quotes: string[],                // verbatim phrases that drove the classification
    extracted: {
      service_type: string,
      urgency: "high" | "medium" | "low" | "none",
      name: string | null,
      location: string | null
    },
    recommended_action: "send_owner_notification" | "auto_dismiss" | "manual_review"
  }
  ```
- **Schema version:** `v1`. Carried in response header `X-Schema-Version: v1`. Any future breaking change increments to `v2` and the prior version is supported for 30 days.
- **Timeout:** 5s
- **Circuit breaker:** 3 consecutive failures → fallback to manual-review mode for 5 minutes
- **Fallback:** API failure → owner gets raw SMS text with "auto-qual failed, manual review" banner. Failure logged.

### `POST /qualify` endpoint

Synchronous inference endpoint exposed by the product. Used by:

1. Internal webhook handler (`webhooks/twilio/sms-inbound.ts` calls into the qualifier path)
2. Portfolio's simulator (via Next.js Server Action proxy that adds the rate-limit and forwards a token)

Request body: `{prospect_messages: string[], business_profile: BusinessProfile, prefilter_already_passed?: boolean}`. Response: the schema above + `X-Schema-Version` header. Auth: `Authorization: Bearer <QUALIFY_API_TOKEN>` server-to-server only. Rate-limited via Upstash Redis. Never called from a browser.

### Public metrics endpoint

`GET /metrics/public` returns anonymized aggregates: `{schema_version, total_calls, qualified_pct, latency_p50_ms, latency_p95_ms, accuracy_on_labeled_set, beta_partner_days_live}`. Same schema-versioning rule as `/qualify`.

Portfolio Outcomes section fetches **at runtime via Next.js ISR** with `revalidate: 60`. If the product endpoint is 5xx or times out, the portfolio falls back to a **build-time committed JSON snapshot** at `app/work/lead-response-loop/metrics-snapshot.json`. The snapshot is refreshed by a scheduled GitHub Action (every 6 hours): the action hits `/metrics/public`, compares to the committed file, commits if changed. Runtime never writes to the repo. Result: the portfolio renders the freshest available metrics, but a product outage never breaks the deploy.

### Server-only fetch boundary

Both `/qualify` and `/metrics/public` are consumed by the portfolio **only from server-rendered code paths** (Server Components, Route Handlers, Server Actions). Tokens live in portfolio env vars: `QUALIFY_API_TOKEN`, `METRICS_API_TOKEN`. The browser bundle never sees them. Network tab inspection from a hiring manager will only show the portfolio's own origin — no leaked product tokens.

### Auth

- **None for owner-facing v1** (single-tenant beta partner only).
- **Twilio webhook signature verification** on every inbound webhook.
- **Bearer token** on `/metrics/public` and `/qualify`. Tokens scoped per consumer (portfolio gets one, beta partner ops gets another).

### Failure modes

| Mode | Behavior |
|---|---|
| LLM API down | Manual-review fallback (logged) + alert to Jay via Resend |
| Twilio API down | CF Workers exception → alert to Jay |
| D1 transient failure | Twilio retries inbound webhooks (24h window); outbound retry registry replays |
| Owner ignores notification | Escalate via second SMS after 10 min, email after 30 min |
| Caller never replies to text-back | Lead status = `awaiting_reply`; ages out after 48h |
| Duplicate webhook delivery | Idempotency key → no double-effect |
| Out-of-order webhook delivery | Event-sourced state; downstream logic handles late arrivals |

### Sequence-of-implementation order

Codex's recommended order, locked: **(1) Twilio signature verification + idempotency keys → (2) D1 write path → (3) prefilter + Anthropic classify → (4) owner decision loop → (5) Cal.com webhook reconciliation → (6) CF Cron Trigger for retry replay.**

---

## 6. Inter-repo contract

The portfolio (`jaymoore/jay-moore-design`) and the product (`simplepathmedia/auto-lead-response-loop`) live in separate repos and orgs but communicate over two HTTPS contracts: `POST /qualify` and `GET /metrics/public`. The rules below apply to both contracts.

### Schema versioning

- Every response carries `X-Schema-Version: v1`
- Breaking changes increment the version (`v2`, `v3`, ...)
- Old versions are supported for **30 days** after a new version ships, to give the portfolio time to migrate
- Schema definitions live in the **product** repo under `src/lib/contracts/` and are duplicated as type definitions in the portfolio repo. The product repo's version is canonical.

### Secret boundary

- Tokens (`QUALIFY_API_TOKEN`, `METRICS_API_TOKEN`) live in the portfolio's server-side env vars **only**
- The portfolio's `next.config.js` does **not** add any of these vars to `publicRuntimeConfig` or `NEXT_PUBLIC_*` exposures
- All fetches to either endpoint are made from Server Components / Route Handlers / Server Actions — never from `"use client"` code paths
- A linter rule or grep test verifies that no `process.env.QUALIFY_API_TOKEN` / `process.env.METRICS_API_TOKEN` reference appears in a client-bundled file. Audit step: Day 12.

### Truth-data ownership

- The **product repo is the source of truth** for telemetry, classifications, decisions, and bookings
- The **portfolio repo is a read-only consumer** — it never mutates anything in the product, only renders what `/metrics/public` returns + what `/qualify` returns for simulator runs
- If the portfolio needs new data shapes, the product repo adds them first. Portfolio does not invent new fields and then expect the product to backfill.

### Compatibility test (CI gate)

- Portfolio CI runs a smoke test against a staging deployment of the product on every PR: hits `/qualify` and `/metrics/public`, validates the response against the locked schema
- A schema-mismatch failure blocks the portfolio PR. Forces the conversation to happen before a deploy breaks.

---

## 7. Build sequence (14 days)

Every day produces both shippable product progress AND a case-study-worthy artifact.

### Week 1 — product foundations + eval harness

| Day | Product work | Case-study artifact produced |
|---|---|---|
| 1 | Repo init at `/Users/jay/00-Dev/auto-lead-response-loop` (new) + GitHub remote `github.com/simplepathmedia/auto-lead-response-loop`. Wrangler + TS + D1 schema. Twilio test number + sig-verify helper. KV namespace for idempotency + retry. Anthropic SDK smoke test. Cal.com test instance. Budget caps set (Anthropic $50/mo, Twilio $20 prepaid). | Architecture diagram v1. Stack-choice decision log. |
| 2 | `webhooks/twilio/call-status` with sig-verify + idempotency keys. Missed-call → text-back within 60s. KV-backed outbound retry. | PR diff + "why idempotency keys" decision log. |
| 3 | `webhooks/twilio/sms-inbound`. `lib/prefilter.ts` deterministic spam pre-filter (1–2 hours of work). `lib/qualifier.ts` with tool-use JSON schema, 5s timeout, circuit breaker. `routes/qualify.ts` sync endpoint exposing the qualifier. Versioned `prompts/qualifier.md`. Log `{prefilter_decision, label, confidence, evidence_quotes, extracted}` to D1. | Prompt design v1 + 10 hand-labeled test cases + prefilter rules doc. |
| 4 | Owner notification SMS (plain-keyword YES/NO/INFO). `webhooks/twilio/sms-owner-reply` parses keywords. On YES → send Cal.com link to caller. SMS-loop prevention. | Decision-support framing writeup + redacted SMS thread screenshot. |
| 5 | Eval harness: 50-example labeled test set. Confusion-matrix script. `routes/metrics-public.ts` returns ISR-friendly aggregates with `X-Schema-Version: v1` header. `routes/cron/retry-replay.ts` CF Cron Trigger (every 60s) wired. Logpush wired. Beta partner outreach + onboarding kicked off (do NOT wait until Day 6). | Eval harness output + confusion matrix + SLO targets + retry-replay smoke test. |
| 6 | Beta partner number forwarded to Twilio (A2P 10DLC approval may extend into Day 7; partner test calls can run on Twilio test number meanwhile). 10/30-min escalation logic for ignored owner notifications. Cal.com webhook reconciliation. | Onboarding decision log + partner snippet (anonymized). |
| 7 | Slack day. Smoke tests with partner's real calls. Bug fixes. Buffer for Day 1–6 slippage. | Day-7 reliability snapshot. |

### Week 2 — case study build + simulator + ship

| Day | Case-study work | Product work in parallel |
|---|---|---|
| 8 | Delete `/app/work/spm-lifecycle/` entirely. Create fresh `/app/work/lead-response-loop/` directory. Update cookie name to `lrl-case-study-auth`. Update homepage card + nav references. Simulator scaffold (scenario picker, prospect/owner panes, event log, client-side mocked state machine). | Beta partner running live; collect data. |
| 9 | Simulator wires to the product's `POST /qualify` via Next.js Server Action proxy (no direct Anthropic call in portfolio). Per-IP rate limit via Upstash Redis, 280-char cap, 8s timeout, schema validation. "Write your own" behind friction toggle. Fallback banner on `5xx` / rate-limit. | Bug fixes from beta partner traffic. |
| 10 | Case study prose v1: transferability preamble · Problem · Approach + architecture · Decisions (3–4 incl. 1 reversal) · Evaluation · Outcomes (in-build framing with telemetry + next-measurement-date gates) · Roadmap. | Telemetry refinements. |
| 11 | Build-log appendix: curate 14 days of PR diffs + screenshots, anchored to decisions/outcomes. Sidenotes link from main sections. | Beta data lands in `/metrics/public`. |
| 12 | Design review against portfolio aesthetic + a11y + mobile pass. Codex second-opinion on the case study page. Audit step: grep-check the portfolio client bundle for any leaked `QUALIFY_API_TOKEN` / `METRICS_API_TOKEN`. Address findings. | Hardening. |
| 13 | Real beta metrics from `/metrics/public` rendered via runtime ISR fetch (cached snapshot fallback). Update Outcomes section. | Continued beta operation. |
| 14 | Full audit (Lighthouse + axe). Final codex pass. Commit. Push. Send URL to first hiring manager. | Beta milestone snapshot. |

### Critical-path risks + mitigations

| Risk | Mitigation |
|---|---|
| Beta partner sign-up delays past Day 5 | Simulator + eval harness output carry the case study even with zero partner data. Outcomes section reads "telemetry lands week of {next measurement date}." |
| LLM accuracy too low on test set | Reframe Decisions to include the accuracy challenge as the reversal story. Real data > polished narrative. |
| Twilio A2P 10DLC approval delay for partner's number | Partner outreach + onboarding kicked off Day 5, not Day 6. Test calls run on Twilio test number while real number waits on approval. |
| 14-day timeline slips | **Sacrifice order:** UI polish first → build-log curation second → simulator polish third → reliability never. |

### Budget cap (set Day 1)

- Anthropic API: $50/mo hard cap in console
- Twilio: $20 pre-paid balance for 14 days
- Cal.com, CF Workers, D1, KV: free tier
- Portfolio: existing deploy

---

## 8. Beta partner protocol

### Data-use agreement (one page)

- **Publishable in case study:** anonymized aggregates only — counts, latency P50/P95, accuracy %, confusion matrix, sample SMS thread with names/business/numbers/addresses redacted
- **Stays private:** raw caller PII, partner business name (unless opted in), exact call timestamps, prospect's verbatim messages without redaction, any audio
- **Anonymization rules:** caller names → "Caller A", "Caller B"; phone numbers → last-4 hash; addresses → city only; service descriptions kept verbatim only if non-identifying
- **Partner credit option:** default = anonymous ("HVAC partner in [region]"). Named credit only on explicit opt-in.
- **Data retention:** 90 days for raw events, indefinite for aggregated metrics
- **Exit terms:** partner can pull credit + opt-out of further publication at any time; existing aggregates already published remain

### Single anchor image

One redacted SMS thread screenshot in the case study Approach section = strongest single-image proof the loop works.

---

## 9. What's left open for the implementation plan

These are the questions the writing-plans skill will resolve next:

- Exact prompt design for `qualifier.md` (system prompt, business-profile injection, examples)
- Cal.com event-type config + availability rules
- Eval test-set composition (scenario distribution, edge case coverage)
- Logpush destination + retention (90-day raw event window already locked; this is about transport choice)
- Owner-side SMS copy (decision-support framing, character economy)
- Visual design of the simulator at component level (typography, spacing, color)
- Accessibility audit checklist for the case study page
- Pre-filter regex/keyword ruleset (specific patterns)
- Beta partner conversation script + outreach list
- CI smoke test wiring (where the schema-mismatch gate runs)

---

## 10. Approvals + history

- **2026-05-19** — Brainstorming session complete (6 design sections approved by Jay)
- **2026-05-19** — Codex second-opinion pass on sections 1–4; 4 kills + 3 missing pieces folded into spec
- **2026-05-19** — Spec doc written, self-reviewed
- **2026-05-19** — Jay locked: two GitHub orgs (portfolio → `jaymoore`, product → `simplepathmedia`). Old `/app/work/spm-lifecycle` scaffold deleted entirely, no redirect. Spec updated.
- **2026-05-19** — Codex second-opinion pass on full written spec; 5 kills folded in (deterministic pre-filter added to MVP; `urgency_markers` → `urgency` + `evidence_quotes` schema cleanup; Upstash Redis locked for rate-limit; explicit server-only fetch boundary; CF Cron Trigger for retry replay every 60s). Added §6 Inter-repo contract (schema versioning, secret boundary, truth-data ownership, CI gate). Existing §6→7, §7→8, §8→9, §9→10.
- **2026-05-19** — Codex final pass; 2 last kills folded in (snapshot-refresh mechanism now explicit: build-time committed JSON refreshed via scheduled GitHub Action, never written from runtime; "saves ~20% API cost" demoted to a measurable hypothesis). New §3 subsection: SMS compliance assumptions (TCPA/STOP/HELP/quiet-hours/A2P 10DLC). Codex called the doc clean for sign-off.
- **Pending** — Jay's spec-level review of this doc
- **Pending** — Implementation plan authored via writing-plans skill at `process/2026-05-19-lead-response-loop.md`
