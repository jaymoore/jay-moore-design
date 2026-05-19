# Lead Response Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Spec is the source of truth — when a step says "per spec §3" or similar, open `process/2026-05-19-lead-response-loop-design.md` and read that section before acting.

**Goal:** Ship a productized missed-lead-recovery system (Twilio + Claude Haiku + Cal.com) for one HVAC/plumbing beta partner AND a password-gated portfolio case study at `/work/lead-response-loop` documenting the build, in 14 days.

**Architecture:** Two repos, two GitHub orgs. Product (`/Users/jay/00-Dev/auto-lead-response-loop`, github.com/simplepathmedia) runs on Cloudflare Workers + D1 + KV; exposes `POST /qualify` (sync inference) + `GET /metrics/public` (aggregates) over HTTPS with bearer-token auth. Portfolio (`/Users/jay/00-Dev-jaymoore/jay-moore-design`, github.com/jaymoore) is Next.js 15 on Cloudflare Workers; the case study page hosts an interactive simulator that proxies to the product's `/qualify` via Server Action. No parallel inference code in the portfolio.

**Tech Stack:** TypeScript everywhere · Cloudflare Workers + D1 + KV + Cron Triggers · Twilio Voice + SMS · Anthropic Claude Haiku 4.5 · Cal.com · Upstash Redis (rate-limit) · Resend (escalation email) · Next.js 15 (App Router, Server Components, Server Actions) · Tailwind CSS v4 · Vitest (product unit tests) · Playwright (portfolio component + e2e) · GitHub Actions

**Spec source of truth:** `process/2026-05-19-lead-response-loop-design.md`

---

## Phase 0: Pre-flight (Day 0 — before Day 1 work begins)

These tasks must complete before Day 1. Estimated: 2–3 hours.

### Task 0.1: Accounts + budget caps

**Files:** none (external account setup)

- [ ] **Step 1: Twilio account.** Sign up if needed. Buy one test phone number. Note Account SID + Auth Token. Set $20 prepaid balance + budget alert at $15. Disable auto-recharge.

- [ ] **Step 2: Anthropic API key.** Generate new key dedicated to this project. In console settings → usage limits → set hard cap at $50/month. Set alert at $30.

- [ ] **Step 3: Cloudflare account.** Confirm Workers Paid plan or free tier (free is enough for v1). Enable D1, KV, Cron Triggers. Note Account ID.

- [ ] **Step 4: Cal.com instance.** Create test workspace. Create one event type: "HVAC service appointment", 30 min, availability matching test hours. Note booking URL pattern + webhook secret.

- [ ] **Step 5: Upstash Redis.** Free tier database in nearest region. Note REST URL + REST token.

- [ ] **Step 6: Resend account.** Free tier. Verify Jay's personal email as recipient. Generate API key.

- [ ] **Step 7: GitHub organization `simplepathmedia`.** Confirm Jay has admin access. Create empty repo `auto-lead-response-loop` (private at first, flip to public when ready). No README/license at create — local repo will push initial commit.

### Task 0.2: SSH host aliases for two GitHub accounts

**Files:**
- Modify: `~/.ssh/config`

Jay needs to push to two GitHub accounts (personal `jaymoore` for portfolio, org `simplepathmedia` for product) from the same machine.

- [ ] **Step 1: Open `~/.ssh/config`.** Confirm there's already a `github-jaymoore` host block. If not, add it:

```sshconfig
Host github-jaymoore
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_jaymoore
  IdentitiesOnly yes
```

- [ ] **Step 2: Add a `github-simplepathmedia` host block.**

```sshconfig
Host github-simplepathmedia
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_simplepathmedia
  IdentitiesOnly yes
```

- [ ] **Step 3: Generate SSH key for simplepathmedia if it doesn't exist.**

```bash
ls ~/.ssh/id_ed25519_simplepathmedia 2>/dev/null || ssh-keygen -t ed25519 -C "simplepathmedia" -f ~/.ssh/id_ed25519_simplepathmedia -N ""
```

- [ ] **Step 4: Add public key to GitHub simplepathmedia account.** Copy `~/.ssh/id_ed25519_simplepathmedia.pub` and paste into github.com/simplepathmedia → settings → SSH keys.

- [ ] **Step 5: Verify both work.**

```bash
ssh -T git@github-jaymoore
ssh -T git@github-simplepathmedia
```

Expected: each prints `Hi <username>! You've successfully authenticated, but GitHub does not provide shell access.`

### Task 0.3: Local secrets file (gitignored)

**Files:**
- Create: `~/.config/auto-lead-response-loop/.env` (outside both repos)

- [ ] **Step 1: Create directory + file.**

```bash
mkdir -p ~/.config/auto-lead-response-loop
touch ~/.config/auto-lead-response-loop/.env
chmod 600 ~/.config/auto-lead-response-loop/.env
```

- [ ] **Step 2: Populate.** Open in editor, paste:

```
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
ANTHROPIC_API_KEY=...
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_API_TOKEN=...
CALCOM_API_KEY=...
CALCOM_WEBHOOK_SECRET=...
CALCOM_EVENT_TYPE_ID=...
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
RESEND_API_KEY=...
JAY_ALERT_EMAIL=...
QUALIFY_API_TOKEN=...
METRICS_API_TOKEN=...
CASE_STUDY_PASSWORD=...
```

The last 3 are tokens we generate ourselves. Use `openssl rand -hex 32` for each.

- [ ] **Step 3: Confirm file is sourceable.** Run `cat ~/.config/auto-lead-response-loop/.env | grep -c =`. Expected: 16.

---

## Phase 1: Product foundation (Days 1–4)

### Task 1.1: Init product repo (Day 1, ~1 hour)

**Files:**
- Create: `/Users/jay/00-Dev/auto-lead-response-loop/` (entire repo)

- [ ] **Step 1: Create directory + cd into it.**

```bash
mkdir -p /Users/jay/00-Dev/auto-lead-response-loop
cd /Users/jay/00-Dev/auto-lead-response-loop
```

- [ ] **Step 2: Init wrangler project + git.**

```bash
npm create cloudflare@latest -- . --type=hello-world --ts --no-deploy --no-git
```

Choose: existing directory, TypeScript, no git init (we'll do it manually), no deploy.

- [ ] **Step 3: Init git + remote.**

```bash
git init -b main
git remote add origin git@github-simplepathmedia:simplepathmedia/auto-lead-response-loop.git
```

- [ ] **Step 4: Create `.gitignore`.**

```
node_modules
.wrangler
.dev.vars
dist
.DS_Store
*.log
.env
.env.local
coverage
```

- [ ] **Step 5: Create `wrangler.jsonc` skeleton.**

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "auto-lead-response-loop",
  "main": "src/index.ts",
  "compatibility_date": "2026-05-19",
  "compatibility_flags": ["nodejs_compat"],
  "observability": { "enabled": true },
  "d1_databases": [
    { "binding": "DB", "database_name": "lrl-db", "database_id": "TBD-after-d1-create" }
  ],
  "kv_namespaces": [
    { "binding": "KV", "id": "TBD-after-kv-create" }
  ],
  "triggers": {
    "crons": ["* * * * *"]
  },
  "vars": {
    "SCHEMA_VERSION": "v1"
  }
}
```

- [ ] **Step 6: Add Vitest + Cloudflare workers-vitest setup.**

```bash
npm install -D vitest @cloudflare/vitest-pool-workers @types/node
```

Create `vitest.config.ts`:

```ts
import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig({
  test: {
    poolOptions: {
      workers: {
        wrangler: { configPath: "./wrangler.jsonc" },
      },
    },
  },
});
```

- [ ] **Step 7: Add scripts to `package.json`.**

```json
{
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit",
    "eval": "tsx eval/run-eval.ts"
  }
}
```

- [ ] **Step 8: Install runtime deps.**

```bash
npm install @anthropic-ai/sdk twilio @upstash/redis
npm install -D tsx typescript @cloudflare/workers-types
```

- [ ] **Step 9: First commit.**

```bash
git add -A
git commit -m "feat: scaffold auto-lead-response-loop with wrangler + vitest"
```

Run `codex-second-opinion` on the diff before committing per Jay's rule (see `feedback_second_opinion_gating` memory). The session's primary agent handles this gate.

- [ ] **Step 10: Push.**

```bash
git push -u origin main
```

### Task 1.2: D1 schema + first migration (Day 1, ~1 hour)

**Files:**
- Create: `schema.sql`
- Create: `src/lib/db.ts`
- Create: `test/db.test.ts`

- [ ] **Step 1: Write `schema.sql`.**

```sql
-- v1 schema. All timestamps in UTC epoch milliseconds.

CREATE TABLE IF NOT EXISTS calls (
  id TEXT PRIMARY KEY,                    -- correlation id
  twilio_call_sid TEXT UNIQUE NOT NULL,
  from_number_hash TEXT NOT NULL,         -- last-4 hash for privacy
  from_number_raw TEXT NOT NULL,          -- needed for outbound SMS; never published
  to_number TEXT NOT NULL,
  call_status TEXT NOT NULL,              -- no-answer|busy|failed|completed
  occurred_at INTEGER NOT NULL,
  received_at INTEGER NOT NULL,
  partner_id TEXT NOT NULL                -- partner identifier (single-tenant v1, but column exists)
);

CREATE INDEX IF NOT EXISTS idx_calls_received_at ON calls(received_at);
CREATE INDEX IF NOT EXISTS idx_calls_partner ON calls(partner_id, received_at);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  call_id TEXT,
  twilio_message_sid TEXT UNIQUE NOT NULL,
  direction TEXT NOT NULL,                -- inbound_caller|outbound_caller|inbound_owner|outbound_owner
  from_number_hash TEXT NOT NULL,
  to_number_hash TEXT NOT NULL,
  body TEXT NOT NULL,
  occurred_at INTEGER NOT NULL,
  received_at INTEGER NOT NULL,
  partner_id TEXT NOT NULL,
  compliance_basis TEXT,                  -- implicit_consent_post_inbound_call|owner_authenticated
  FOREIGN KEY (call_id) REFERENCES calls(id)
);

CREATE INDEX IF NOT EXISTS idx_messages_call ON messages(call_id);
CREATE INDEX IF NOT EXISTS idx_messages_direction ON messages(direction, received_at);

CREATE TABLE IF NOT EXISTS classifications (
  id TEXT PRIMARY KEY,
  message_id TEXT UNIQUE NOT NULL,
  prefilter_decision TEXT,                -- spam|pass|null (null if LLM ran)
  prefilter_pattern TEXT,                 -- regex name that matched
  label TEXT,                             -- urgent|standard|not_a_fit|spam (null if prefilter short-circuited)
  confidence REAL,
  evidence_quotes TEXT,                   -- JSON array
  extracted TEXT,                         -- JSON object
  recommended_action TEXT,
  schema_version TEXT NOT NULL,
  latency_ms INTEGER,
  occurred_at INTEGER NOT NULL,
  partner_id TEXT NOT NULL,
  FOREIGN KEY (message_id) REFERENCES messages(id)
);

CREATE INDEX IF NOT EXISTS idx_classifications_partner ON classifications(partner_id, occurred_at);

CREATE TABLE IF NOT EXISTS owner_decisions (
  id TEXT PRIMARY KEY,
  classification_id TEXT NOT NULL,
  decision TEXT NOT NULL,                 -- yes|no|info
  matched_recommendation INTEGER,         -- 1 if decision == recommended_action, 0 otherwise
  occurred_at INTEGER NOT NULL,
  partner_id TEXT NOT NULL,
  FOREIGN KEY (classification_id) REFERENCES classifications(id)
);

CREATE INDEX IF NOT EXISTS idx_owner_decisions_partner ON owner_decisions(partner_id, occurred_at);

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  calcom_booking_id TEXT UNIQUE NOT NULL,
  classification_id TEXT,
  scheduled_at INTEGER NOT NULL,
  occurred_at INTEGER NOT NULL,
  partner_id TEXT NOT NULL,
  FOREIGN KEY (classification_id) REFERENCES classifications(id)
);

CREATE INDEX IF NOT EXISTS idx_bookings_partner ON bookings(partner_id, occurred_at);

CREATE TABLE IF NOT EXISTS opt_outs (
  number_hash TEXT PRIMARY KEY,
  occurred_at INTEGER NOT NULL,
  reason TEXT NOT NULL                    -- caller_stop|caller_unsubscribe|carrier_block
);
```

- [ ] **Step 2: Create D1 database via CLI.**

```bash
npx wrangler d1 create lrl-db
```

Copy the printed `database_id` value into `wrangler.jsonc` (replace `TBD-after-d1-create`).

- [ ] **Step 3: Apply migration.**

```bash
npx wrangler d1 execute lrl-db --file=schema.sql --remote
npx wrangler d1 execute lrl-db --file=schema.sql --local
```

- [ ] **Step 4: Create KV namespace.**

```bash
npx wrangler kv namespace create LRL_KV
```

Copy the `id` into `wrangler.jsonc` (replace `TBD-after-kv-create`).

- [ ] **Step 5: Write `src/lib/db.ts` with typed query helpers (failing tests first).**

Create `test/db.test.ts`:

```ts
import { env } from "cloudflare:test";
import { describe, it, expect, beforeEach } from "vitest";
import { insertCall, getCallByTwilioSid } from "../src/lib/db";

describe("db.calls", () => {
  beforeEach(async () => {
    await env.DB.prepare("DELETE FROM calls").run();
  });

  it("inserts and retrieves a call by twilio_call_sid", async () => {
    await insertCall(env.DB, {
      id: "test-correlation-1",
      twilio_call_sid: "CA-test-1",
      from_number_hash: "0000",
      from_number_raw: "+15551234567",
      to_number: "+15557654321",
      call_status: "no-answer",
      occurred_at: 1747740000000,
      partner_id: "partner-1",
    });

    const row = await getCallByTwilioSid(env.DB, "CA-test-1");
    expect(row).toMatchObject({
      twilio_call_sid: "CA-test-1",
      call_status: "no-answer",
    });
  });
});
```

- [ ] **Step 6: Run the test — confirm it fails.**

```bash
npm test test/db.test.ts
```

Expected: FAIL — "insertCall is not exported from ../src/lib/db".

- [ ] **Step 7: Implement `src/lib/db.ts` to pass.**

```ts
import type { D1Database } from "@cloudflare/workers-types";

export type CallRow = {
  id: string;
  twilio_call_sid: string;
  from_number_hash: string;
  from_number_raw: string;
  to_number: string;
  call_status: "no-answer" | "busy" | "failed" | "completed";
  occurred_at: number;
  partner_id: string;
};

export async function insertCall(db: D1Database, c: CallRow): Promise<void> {
  await db
    .prepare(
      `INSERT INTO calls (id, twilio_call_sid, from_number_hash, from_number_raw,
        to_number, call_status, occurred_at, received_at, partner_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      c.id, c.twilio_call_sid, c.from_number_hash, c.from_number_raw,
      c.to_number, c.call_status, c.occurred_at, Date.now(), c.partner_id,
    )
    .run();
}

export async function getCallByTwilioSid(
  db: D1Database,
  sid: string,
): Promise<CallRow | null> {
  const result = await db
    .prepare("SELECT * FROM calls WHERE twilio_call_sid = ?")
    .bind(sid)
    .first<CallRow>();
  return result ?? null;
}
```

- [ ] **Step 8: Run test — confirm pass.**

```bash
npm test test/db.test.ts
```

Expected: PASS.

- [ ] **Step 9: Commit.**

```bash
git add schema.sql src/lib/db.ts test/db.test.ts wrangler.jsonc
git commit -m "feat: D1 schema + db.ts insertCall/getCallByTwilioSid"
```

### Task 1.3: Twilio signature verification (Day 2, ~1 hour)

**Files:**
- Create: `src/lib/sig-verify.ts`
- Create: `test/sig-verify.test.ts`

- [ ] **Step 1: Write failing test.** Use Twilio's documented test vectors.

```ts
import { describe, it, expect } from "vitest";
import { verifyTwilioSignature } from "../src/lib/sig-verify";

describe("verifyTwilioSignature", () => {
  it("returns true for a valid signature", () => {
    // Vector from Twilio docs: https://www.twilio.com/docs/usage/webhooks/webhooks-security
    const authToken = "12345";
    const url = "https://mycompany.com/myapp.php?foo=1&bar=2";
    const params = { CallSid: "CA1234", Caller: "+14158675309" };
    const expectedSig = "RSOYDt4T1cUTdK1PDd93/VVr8B8=";
    expect(verifyTwilioSignature(authToken, expectedSig, url, params)).toBe(true);
  });

  it("returns false for tampered params", () => {
    const authToken = "12345";
    const url = "https://mycompany.com/myapp.php?foo=1&bar=2";
    const params = { CallSid: "CA1234", Caller: "+19999999999" };
    const expectedSig = "RSOYDt4T1cUTdK1PDd93/VVr8B8=";
    expect(verifyTwilioSignature(authToken, expectedSig, url, params)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test — fail.** `npm test test/sig-verify.test.ts` expected: FAIL.

- [ ] **Step 3: Implement `src/lib/sig-verify.ts`.**

```ts
// Twilio webhook signature verification.
// Algorithm: sort params alphabetically, concat key+value, prepend URL,
// HMAC-SHA1 with auth token, base64-encode, compare to X-Twilio-Signature header.

export function verifyTwilioSignature(
  authToken: string,
  signature: string,
  url: string,
  params: Record<string, string>,
): boolean {
  const sorted = Object.keys(params).sort();
  let data = url;
  for (const k of sorted) data += k + params[k];

  const enc = new TextEncoder();
  return crypto.subtle
    .importKey("raw", enc.encode(authToken), { name: "HMAC", hash: "SHA-1" }, false, ["sign"])
    .then((key) => crypto.subtle.sign("HMAC", key, enc.encode(data)))
    .then((sig) => {
      const b64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
      return timingSafeEqual(b64, signature);
    }) as unknown as boolean;
  // Note: Workers Web Crypto is async. We wrap in a sync helper that returns the promise
  // for the route handler. For test ergonomics, expose an async variant in the next iteration.
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
```

**Implementation note:** The synchronous return shape above is wrong — Workers `crypto.subtle` is async. Fix in step 4.

- [ ] **Step 4: Refactor to async.** Replace `src/lib/sig-verify.ts`:

```ts
export async function verifyTwilioSignature(
  authToken: string,
  signature: string,
  url: string,
  params: Record<string, string>,
): Promise<boolean> {
  const sorted = Object.keys(params).sort();
  let data = url;
  for (const k of sorted) data += k + params[k];

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(authToken),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  const computed = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return timingSafeEqual(computed, signature);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
```

Update test to `async`:

```ts
it("returns true for a valid signature", async () => {
  // ... same setup ...
  expect(await verifyTwilioSignature(authToken, expectedSig, url, params)).toBe(true);
});
```

- [ ] **Step 5: Run tests — pass.**

```bash
npm test test/sig-verify.test.ts
```

Expected: 2 passing.

- [ ] **Step 6: Commit.**

```bash
git add src/lib/sig-verify.ts test/sig-verify.test.ts
git commit -m "feat: Twilio webhook signature verification"
```

### Task 1.4: KV-backed idempotency keys (Day 2, ~45 min)

**Files:**
- Create: `src/lib/idempotency.ts`
- Create: `test/idempotency.test.ts`

- [ ] **Step 1: Write failing test.**

```ts
import { env } from "cloudflare:test";
import { describe, it, expect, beforeEach } from "vitest";
import { claimIdempotencyKey } from "../src/lib/idempotency";

describe("claimIdempotencyKey", () => {
  beforeEach(async () => {
    // Wipe all known test keys
    await env.KV.delete("idem:test-key-1");
  });

  it("returns claimed=true the first time", async () => {
    const result = await claimIdempotencyKey(env.KV, "test-key-1");
    expect(result.claimed).toBe(true);
  });

  it("returns claimed=false on duplicate within TTL", async () => {
    await claimIdempotencyKey(env.KV, "test-key-1");
    const second = await claimIdempotencyKey(env.KV, "test-key-1");
    expect(second.claimed).toBe(false);
  });
});
```

- [ ] **Step 2: Run — fail.**

- [ ] **Step 3: Implement.**

```ts
import type { KVNamespace } from "@cloudflare/workers-types";

const TTL_SECONDS = 24 * 60 * 60;

export async function claimIdempotencyKey(
  kv: KVNamespace,
  key: string,
): Promise<{ claimed: boolean }> {
  const fullKey = `idem:${key}`;
  const existing = await kv.get(fullKey);
  if (existing !== null) return { claimed: false };
  await kv.put(fullKey, "1", { expirationTtl: TTL_SECONDS });
  return { claimed: true };
}
```

- [ ] **Step 4: Run — pass.**

- [ ] **Step 5: Commit.**

```bash
git add src/lib/idempotency.ts test/idempotency.test.ts
git commit -m "feat: KV-backed idempotency keys with 24h TTL"
```

### Task 1.5: Twilio call-status webhook → text-back SMS (Day 2, ~2 hours)

**Files:**
- Create: `src/lib/notifier.ts`
- Create: `src/lib/phone.ts`
- Create: `src/routes/webhooks/twilio/call-status.ts`
- Create: `src/index.ts` (router)
- Create: `test/call-status.test.ts`

- [ ] **Step 1: Implement phone-number hash helper.** `src/lib/phone.ts`:

```ts
export function hashLast4(phoneNumber: string): string {
  // Returns the last 4 digits as a non-reversible "hash" for privacy display.
  // Not cryptographic — display + dedup only.
  const digits = phoneNumber.replace(/\D/g, "");
  return digits.slice(-4);
}
```

- [ ] **Step 2: Implement Twilio SMS notifier.** `src/lib/notifier.ts`:

```ts
type SmsEnv = {
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  TWILIO_PHONE_NUMBER: string;
};

export async function sendSms(
  env: SmsEnv,
  args: { to: string; body: string },
): Promise<{ message_sid: string }> {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`;
  const auth = btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`);
  const body = new URLSearchParams({
    From: env.TWILIO_PHONE_NUMBER,
    To: args.to,
    Body: args.body,
  });
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!res.ok) {
    throw new Error(`Twilio API error: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as { sid: string };
  return { message_sid: json.sid };
}
```

- [ ] **Step 3: Write failing test for the call-status handler.** `test/call-status.test.ts`:

```ts
import { env, SELF } from "cloudflare:test";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("POST /webhooks/twilio/call-status", () => {
  beforeEach(async () => {
    await env.DB.prepare("DELETE FROM calls").run();
    await env.DB.prepare("DELETE FROM messages").run();
  });

  it("logs call, sends text-back when CallStatus is no-answer", async () => {
    // Mock Twilio SMS API
    const sendMock = vi.fn(async () => ({ message_sid: "SM-mock-1" }));
    vi.mock("../src/lib/notifier", () => ({ sendSms: sendMock }));

    const params = new URLSearchParams({
      CallSid: "CA-test-1",
      CallStatus: "no-answer",
      From: "+15551234567",
      To: env.TWILIO_PHONE_NUMBER,
    });

    // For test convenience, disable sig-verify via env flag (set in vitest config)
    const res = await SELF.fetch("http://test/webhooks/twilio/call-status", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    expect(res.status).toBe(200);
    const row = await env.DB
      .prepare("SELECT * FROM calls WHERE twilio_call_sid = ?")
      .bind("CA-test-1")
      .first();
    expect(row).toBeTruthy();
    expect(sendMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ to: "+15551234567" }),
    );
  });

  it("does not text-back when CallStatus is completed", async () => {
    const sendMock = vi.fn();
    vi.mock("../src/lib/notifier", () => ({ sendSms: sendMock }));

    const params = new URLSearchParams({
      CallSid: "CA-test-2",
      CallStatus: "completed",
      From: "+15551234567",
      To: env.TWILIO_PHONE_NUMBER,
    });

    await SELF.fetch("http://test/webhooks/twilio/call-status", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    expect(sendMock).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 4: Run — fail (no route).**

- [ ] **Step 5: Implement route + index router.**

`src/routes/webhooks/twilio/call-status.ts`:

```ts
import type { D1Database, KVNamespace } from "@cloudflare/workers-types";
import { verifyTwilioSignature } from "../../../lib/sig-verify";
import { claimIdempotencyKey } from "../../../lib/idempotency";
import { insertCall } from "../../../lib/db";
import { sendSms } from "../../../lib/notifier";
import { hashLast4 } from "../../../lib/phone";

type Env = {
  DB: D1Database;
  KV: KVNamespace;
  TWILIO_AUTH_TOKEN: string;
  TWILIO_ACCOUNT_SID: string;
  TWILIO_PHONE_NUMBER: string;
  PARTNER_ID: string;
  SKIP_SIG_VERIFY?: string;
};

const TEXT_BACK_BODY =
  "Sorry we missed your call. Can we help via text? Reply with what you need and we'll get back to you. Reply STOP to opt out.";
const NO_ANSWER_STATUSES = new Set(["no-answer", "busy", "failed"]);

export async function handleCallStatus(req: Request, env: Env): Promise<Response> {
  const form = await req.formData();
  const params: Record<string, string> = {};
  for (const [k, v] of form.entries()) params[k] = String(v);

  // Signature verification
  if (env.SKIP_SIG_VERIFY !== "1") {
    const signature = req.headers.get("X-Twilio-Signature") ?? "";
    const url = req.url;
    const ok = await verifyTwilioSignature(env.TWILIO_AUTH_TOKEN, signature, url, params);
    if (!ok) return new Response("Invalid signature", { status: 403 });
  }

  // Idempotency: key on CallSid + CallStatus (Twilio may retry same status)
  const idemKey = `call-status:${params.CallSid}:${params.CallStatus}`;
  const claim = await claimIdempotencyKey(env.KV, idemKey);
  if (!claim.claimed) return new Response("ok (duplicate)", { status: 200 });

  // Insert call row
  await insertCall(env.DB, {
    id: crypto.randomUUID(),
    twilio_call_sid: params.CallSid,
    from_number_hash: hashLast4(params.From),
    from_number_raw: params.From,
    to_number: params.To,
    call_status: params.CallStatus as never,
    occurred_at: Date.now(),
    partner_id: env.PARTNER_ID,
  });

  // Text-back only for no-answer/busy/failed
  if (NO_ANSWER_STATUSES.has(params.CallStatus)) {
    await sendSms(env, { to: params.From, body: TEXT_BACK_BODY });
  }

  return new Response("ok", { status: 200 });
}
```

`src/index.ts`:

```ts
import { handleCallStatus } from "./routes/webhooks/twilio/call-status";

export default {
  async fetch(req: Request, env: never, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(req.url);
    if (req.method === "POST" && url.pathname === "/webhooks/twilio/call-status") {
      return handleCallStatus(req, env);
    }
    return new Response("Not found", { status: 404 });
  },
};
```

- [ ] **Step 6: Configure test env to skip sig-verify.** Add to `vitest.config.ts` workers options:

```ts
bindings: {
  TWILIO_PHONE_NUMBER: "+15557654321",
  TWILIO_ACCOUNT_SID: "AC-test",
  TWILIO_AUTH_TOKEN: "token-test",
  PARTNER_ID: "test-partner",
  SKIP_SIG_VERIFY: "1",
},
```

- [ ] **Step 7: Run — pass.**

- [ ] **Step 8: Commit.**

```bash
git add src/lib/notifier.ts src/lib/phone.ts src/routes src/index.ts test/call-status.test.ts wrangler.jsonc vitest.config.ts
git commit -m "feat: call-status webhook with sig-verify + idempotency + text-back"
```

### Task 1.6: KV-backed outbound retry registry (Day 2, ~1 hour)

**Files:**
- Create: `src/lib/retry-registry.ts`
- Create: `test/retry-registry.test.ts`

- [ ] **Step 1: Write failing test.**

```ts
import { env } from "cloudflare:test";
import { describe, it, expect, beforeEach } from "vitest";
import { enqueueRetry, listDueRetries, advanceRetry, removeRetry } from "../src/lib/retry-registry";

describe("retry-registry", () => {
  beforeEach(async () => {
    const list = await env.KV.list({ prefix: "retry:" });
    for (const k of list.keys) await env.KV.delete(k.name);
  });

  it("enqueues and lists a retry that's due", async () => {
    await enqueueRetry(env.KV, {
      id: "test-1",
      next_attempt_at: Date.now() - 1000,
      attempts: 0,
      payload: { to: "+15551234567", body: "hello" },
    });
    const due = await listDueRetries(env.KV, Date.now());
    expect(due.map((r) => r.id)).toContain("test-1");
  });

  it("excludes a retry not yet due", async () => {
    await enqueueRetry(env.KV, {
      id: "test-2",
      next_attempt_at: Date.now() + 60_000,
      attempts: 0,
      payload: { to: "+15551234567", body: "hello" },
    });
    const due = await listDueRetries(env.KV, Date.now());
    expect(due.map((r) => r.id)).not.toContain("test-2");
  });

  it("advanceRetry increments attempts and pushes next attempt out", async () => {
    await enqueueRetry(env.KV, {
      id: "test-3",
      next_attempt_at: Date.now() - 1000,
      attempts: 0,
      payload: { to: "+15551234567", body: "hello" },
    });
    await advanceRetry(env.KV, "test-3");
    const list = await listDueRetries(env.KV, Date.now() + 999_999);
    const r = list.find((x) => x.id === "test-3");
    expect(r?.attempts).toBe(1);
  });
});
```

- [ ] **Step 2: Run — fail.**

- [ ] **Step 3: Implement.**

```ts
import type { KVNamespace } from "@cloudflare/workers-types";

const PREFIX = "retry:";
const BACKOFF_MS = [60_000, 5 * 60_000, 15 * 60_000]; // 1m, 5m, 15m

export type RetryRecord = {
  id: string;
  next_attempt_at: number;
  attempts: number;
  payload: { to: string; body: string };
};

export async function enqueueRetry(kv: KVNamespace, r: RetryRecord): Promise<void> {
  await kv.put(PREFIX + r.id, JSON.stringify(r));
}

export async function listDueRetries(kv: KVNamespace, now: number): Promise<RetryRecord[]> {
  const out: RetryRecord[] = [];
  const list = await kv.list({ prefix: PREFIX });
  for (const k of list.keys) {
    const raw = await kv.get(k.name);
    if (!raw) continue;
    const r = JSON.parse(raw) as RetryRecord;
    if (r.next_attempt_at <= now) out.push(r);
  }
  return out;
}

export async function advanceRetry(kv: KVNamespace, id: string): Promise<RetryRecord | null> {
  const raw = await kv.get(PREFIX + id);
  if (!raw) return null;
  const r = JSON.parse(raw) as RetryRecord;
  r.attempts += 1;
  r.next_attempt_at = Date.now() + BACKOFF_MS[Math.min(r.attempts - 1, BACKOFF_MS.length - 1)];
  await kv.put(PREFIX + id, JSON.stringify(r));
  return r;
}

export async function removeRetry(kv: KVNamespace, id: string): Promise<void> {
  await kv.delete(PREFIX + id);
}
```

- [ ] **Step 4: Run — pass.**

- [ ] **Step 5: Commit.**

```bash
git add src/lib/retry-registry.ts test/retry-registry.test.ts
git commit -m "feat: KV-backed outbound retry registry with exponential backoff"
```

### Task 1.7: Wire outbound SMS retry into notifier (Day 2, ~30 min)

**Files:**
- Modify: `src/lib/notifier.ts`
- Modify: `src/routes/webhooks/twilio/call-status.ts`

- [ ] **Step 1: Update `src/lib/notifier.ts` to write to retry registry on failure.**

```ts
import { enqueueRetry } from "./retry-registry";
import type { KVNamespace } from "@cloudflare/workers-types";

type SmsEnv = {
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  TWILIO_PHONE_NUMBER: string;
};

export async function sendSms(
  env: SmsEnv,
  args: { to: string; body: string },
): Promise<{ message_sid?: string; queued?: boolean }> {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`;
  const auth = btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`);
  const body = new URLSearchParams({ From: env.TWILIO_PHONE_NUMBER, To: args.to, Body: args.body });
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) throw new Error(`Twilio ${res.status}: ${await res.text()}`);
    const json = (await res.json()) as { sid: string };
    return { message_sid: json.sid };
  } catch (e) {
    return { queued: true };
  }
}

export async function sendSmsWithRetry(
  env: SmsEnv & { KV: KVNamespace },
  args: { to: string; body: string; id?: string },
): Promise<{ message_sid?: string; queued?: boolean }> {
  const result = await sendSms(env, args);
  if (result.queued) {
    await enqueueRetry(env.KV, {
      id: args.id ?? crypto.randomUUID(),
      next_attempt_at: Date.now() + 60_000,
      attempts: 0,
      payload: { to: args.to, body: args.body },
    });
  }
  return result;
}
```

- [ ] **Step 2: Update call-status route to use `sendSmsWithRetry` instead of `sendSms`.**

- [ ] **Step 3: Run all tests.**

```bash
npm test
```

Expected: all green.

- [ ] **Step 4: Commit.**

```bash
git add src/lib/notifier.ts src/routes/webhooks/twilio/call-status.ts
git commit -m "feat: outbound SMS auto-queues to retry-registry on failure"
```

### Task 1.8: Opt-out tracking + STOP/HELP handling (Day 3, ~1.5 hours)

**Files:**
- Create: `src/lib/opt-out.ts`
- Create: `test/opt-out.test.ts`
- Modify: `src/lib/notifier.ts` (consult opt-out list before sending)

- [ ] **Step 1: Write failing test for opt-out tracking.**

```ts
import { env } from "cloudflare:test";
import { describe, it, expect, beforeEach } from "vitest";
import { addOptOut, isOptedOut } from "../src/lib/opt-out";

describe("opt-out", () => {
  beforeEach(async () => {
    await env.DB.prepare("DELETE FROM opt_outs").run();
  });

  it("adds a number to opt-out list, isOptedOut returns true after", async () => {
    await addOptOut(env.DB, "1234", "caller_stop");
    expect(await isOptedOut(env.DB, "1234")).toBe(true);
  });

  it("returns false for a number not on the list", async () => {
    expect(await isOptedOut(env.DB, "9999")).toBe(false);
  });
});
```

- [ ] **Step 2: Implement `src/lib/opt-out.ts`.**

```ts
import type { D1Database } from "@cloudflare/workers-types";

export async function addOptOut(db: D1Database, numberHash: string, reason: string): Promise<void> {
  await db
    .prepare(
      "INSERT OR IGNORE INTO opt_outs (number_hash, occurred_at, reason) VALUES (?, ?, ?)",
    )
    .bind(numberHash, Date.now(), reason)
    .run();
}

export async function isOptedOut(db: D1Database, numberHash: string): Promise<boolean> {
  const row = await db
    .prepare("SELECT 1 FROM opt_outs WHERE number_hash = ?")
    .bind(numberHash)
    .first();
  return !!row;
}
```

- [ ] **Step 3: Run — pass.**

- [ ] **Step 4: Wire opt-out check into `sendSmsWithRetry`.** Update notifier signature to accept the DB binding + recipient hash. Reject if opted out (log + skip).

- [ ] **Step 5: Detect STOP/HELP keywords in inbound caller SMS.** This will be wired in Task 1.10. For now, just expose the helper:

```ts
// Append to src/lib/opt-out.ts
const STOP_KEYWORDS = new Set(["STOP", "UNSUBSCRIBE", "END", "QUIT", "CANCEL"]);
const HELP_KEYWORDS = new Set(["HELP", "INFO"]);

export function classifyKeyword(body: string): "stop" | "help" | null {
  const normalized = body.trim().toUpperCase();
  if (STOP_KEYWORDS.has(normalized)) return "stop";
  if (HELP_KEYWORDS.has(normalized)) return "help";
  return null;
}
```

- [ ] **Step 6: Commit.**

```bash
git add src/lib/opt-out.ts test/opt-out.test.ts src/lib/notifier.ts
git commit -m "feat: opt-out tracking + STOP/HELP keyword detection"
```

### Task 1.9: Deterministic spam pre-filter (Day 3, ~1 hour)

**Files:**
- Create: `src/lib/prefilter.ts`
- Create: `test/prefilter.test.ts`

- [ ] **Step 1: Write failing test with 8 cases (4 spam, 4 pass-through).**

```ts
import { describe, it, expect } from "vitest";
import { prefilterMessage } from "../src/lib/prefilter";

describe("prefilterMessage", () => {
  const spamCases = [
    "You won $5000 click here http://bit.ly/abc",
    "Congratulations! Claim your prize at www.spam.example",
    "Hot singles in your area",
    "Get rich quick guaranteed!! visit bitcoinwin.example",
  ];
  const passCases = [
    "Hi I have a leaking water heater",
    "Looking for AC tune up next week",
    "Can you do plumbing repair tomorrow morning",
    "What are your rates for furnace install",
  ];

  for (const body of spamCases) {
    it(`flags spam: "${body.slice(0, 30)}..."`, () => {
      const r = prefilterMessage(body);
      expect(r.decision).toBe("spam");
      expect(r.matched_pattern).toBeTruthy();
    });
  }

  for (const body of passCases) {
    it(`passes through: "${body}"`, () => {
      expect(prefilterMessage(body).decision).toBe("pass");
    });
  }
});
```

- [ ] **Step 2: Run — fail.**

- [ ] **Step 3: Implement.**

```ts
type PrefilterResult =
  | { decision: "spam"; matched_pattern: string }
  | { decision: "pass" };

const PATTERNS: Array<{ name: string; re: RegExp }> = [
  { name: "shortened_url", re: /\b(bit\.ly|tinyurl\.com|t\.co|goo\.gl)\/\S+/i },
  { name: "lottery_winnings", re: /\b(you\s+won|congratulations.{0,30}prize|claim\s+your\s+(prize|reward))\b/i },
  { name: "adult_spam", re: /\b(hot\s+singles|adult\s+chat|nude\s+pics)\b/i },
  { name: "get_rich_quick", re: /\b(get\s+rich\s+quick|guaranteed\s+income|bitcoin.{0,10}win)\b/i },
];

export function prefilterMessage(body: string): PrefilterResult {
  for (const p of PATTERNS) {
    if (p.re.test(body)) return { decision: "spam", matched_pattern: p.name };
  }
  return { decision: "pass" };
}
```

- [ ] **Step 4: Run — pass.**

- [ ] **Step 5: Commit.**

```bash
git add src/lib/prefilter.ts test/prefilter.test.ts
git commit -m "feat: deterministic spam pre-filter with 4 high-confidence patterns"
```

### Task 1.10: LLM qualifier with schema-enforced output (Day 3, ~2.5 hours)

**Files:**
- Create: `prompts/qualifier.md`
- Create: `src/lib/qualifier.ts`
- Create: `src/lib/contracts/qualifier-schema.ts`
- Create: `test/qualifier.test.ts`

- [ ] **Step 1: Define the contract.** `src/lib/contracts/qualifier-schema.ts`:

```ts
export const SCHEMA_VERSION = "v1" as const;

export type QualifierLabel = "urgent" | "standard" | "not_a_fit" | "spam";
export type Urgency = "high" | "medium" | "low" | "none";
export type RecommendedAction = "send_owner_notification" | "auto_dismiss" | "manual_review";

export type QualifierOutput = {
  label: QualifierLabel;
  confidence: number;
  evidence_quotes: string[];
  extracted: {
    service_type: string;
    urgency: Urgency;
    name: string | null;
    location: string | null;
  };
  recommended_action: RecommendedAction;
};

export const QUALIFIER_TOOL = {
  name: "classify_lead",
  description: "Classify an inbound SMS reply from a missed-call prospect.",
  input_schema: {
    type: "object",
    properties: {
      label: { type: "string", enum: ["urgent", "standard", "not_a_fit", "spam"] },
      confidence: { type: "number", minimum: 0, maximum: 1 },
      evidence_quotes: { type: "array", items: { type: "string" } },
      extracted: {
        type: "object",
        properties: {
          service_type: { type: "string" },
          urgency: { type: "string", enum: ["high", "medium", "low", "none"] },
          name: { type: ["string", "null"] },
          location: { type: ["string", "null"] },
        },
        required: ["service_type", "urgency", "name", "location"],
      },
      recommended_action: {
        type: "string",
        enum: ["send_owner_notification", "auto_dismiss", "manual_review"],
      },
    },
    required: ["label", "confidence", "evidence_quotes", "extracted", "recommended_action"],
  },
} as const;

export type BusinessProfile = {
  partner_id: string;
  business_name: string;
  service_offerings: string[];
  service_area: string[];
  hours: string;
};
```

- [ ] **Step 2: Write `prompts/qualifier.md`** (versioned prompt — system prompt + role behavior). Markdown so it's reviewable.

```markdown
# Qualifier prompt v1

## Role
You are a lead-qualification classifier for a home-services business. You receive an SMS reply from a prospect who just called the business and didn't get through. Classify the message and extract structured fields.

## Labels
- `urgent` — emergency or same-day need (active leaking, no heat/AC in extreme weather, gas smell, etc.)
- `standard` — real service request, not emergency (schedule maintenance, get a quote, ask about install)
- `not_a_fit` — request the business doesn't serve (wrong trade, out of service area, parts-only request)
- `spam` — promotional, irrelevant, or non-service messages

## Confidence
Float between 0 and 1. Lower confidence (0.3–0.6) for ambiguous messages. High confidence (0.8+) only when the message clearly fits a label.

## Evidence
Quote 1–3 verbatim phrases from the message that drove your label decision. Empty array if no specific quote drove it.

## Extracted fields
- `service_type`: short noun phrase (e.g., "water heater repair", "AC tune-up"). If unclear, "unspecified".
- `urgency`: `high` if same-day pressure; `medium` if within-week; `low` if flexible timing; `none` if not a service request.
- `name`: if the prospect introduced themselves, extract first name. Else null.
- `location`: if they mentioned a city/neighborhood. Else null.

## Recommended action
- `send_owner_notification` — for urgent or standard
- `auto_dismiss` — for spam (this should be rare; spam usually caught by pre-filter)
- `manual_review` — for low-confidence or ambiguous cases (confidence < 0.5)

## Business context
You will receive the business profile in a separate message. Use it to determine `not_a_fit` (services not offered or location out of area).

## Output
Use the `classify_lead` tool. Always call the tool; never reply with plain text.
```

- [ ] **Step 3: Write failing test with mocked Anthropic.**

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { qualifyMessage } from "../src/lib/qualifier";

const mockAnthropic = vi.hoisted(() => ({
  messages: { create: vi.fn() },
}));

vi.mock("@anthropic-ai/sdk", () => ({
  default: vi.fn(() => mockAnthropic),
}));

describe("qualifyMessage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns parsed QualifierOutput from tool_use response", async () => {
    mockAnthropic.messages.create.mockResolvedValueOnce({
      content: [
        {
          type: "tool_use",
          name: "classify_lead",
          input: {
            label: "urgent",
            confidence: 0.92,
            evidence_quotes: ["water heater leaking now"],
            extracted: {
              service_type: "water heater repair",
              urgency: "high",
              name: null,
              location: null,
            },
            recommended_action: "send_owner_notification",
          },
        },
      ],
    });

    const result = await qualifyMessage({
      apiKey: "key-test",
      prospect_messages: ["my water heater is leaking now help"],
      business_profile: {
        partner_id: "test",
        business_name: "Test HVAC",
        service_offerings: ["water heater", "AC", "furnace"],
        service_area: ["Austin"],
        hours: "8a-6p Mon-Fri",
      },
    });

    expect(result.output.label).toBe("urgent");
    expect(result.output.confidence).toBe(0.92);
    expect(result.latency_ms).toBeGreaterThanOrEqual(0);
  });

  it("throws on schema-invalid response (no tool_use block)", async () => {
    mockAnthropic.messages.create.mockResolvedValueOnce({
      content: [{ type: "text", text: "I refuse" }],
    });

    await expect(
      qualifyMessage({
        apiKey: "key-test",
        prospect_messages: ["test"],
        business_profile: {
          partner_id: "test",
          business_name: "Test",
          service_offerings: ["x"],
          service_area: ["y"],
          hours: "9a-5p",
        },
      }),
    ).rejects.toThrow(/no classify_lead tool_use/);
  });
});
```

- [ ] **Step 4: Implement `src/lib/qualifier.ts`.**

```ts
import Anthropic from "@anthropic-ai/sdk";
import { QUALIFIER_TOOL, type QualifierOutput, type BusinessProfile } from "./contracts/qualifier-schema";

const SYSTEM_PROMPT_PATH = "prompts/qualifier.md";

type QualifyArgs = {
  apiKey: string;
  prospect_messages: string[];
  business_profile: BusinessProfile;
  timeoutMs?: number;
};

export type QualifyResult = {
  output: QualifierOutput;
  latency_ms: number;
};

const SYSTEM_PROMPT = `\
You are a lead-qualification classifier for a home-services business.
Use the classify_lead tool. Never reply in plain text.

Labels: urgent | standard | not_a_fit | spam.
Confidence: 0..1 (use < 0.5 for ambiguous; map to recommended_action=manual_review).
Evidence: 1-3 verbatim quotes.
Extract: service_type, urgency (high|medium|low|none), name, location.
Recommended action: send_owner_notification | auto_dismiss | manual_review.

Use the business profile in the next message to decide not_a_fit.`;

export async function qualifyMessage(args: QualifyArgs): Promise<QualifyResult> {
  const client = new Anthropic({ apiKey: args.apiKey });
  const t0 = Date.now();

  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    tools: [QUALIFIER_TOOL],
    tool_choice: { type: "tool", name: "classify_lead" },
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: `Business profile:\n${JSON.stringify(args.business_profile, null, 2)}` },
          { type: "text", text: `Prospect messages:\n${args.prospect_messages.join("\n---\n")}` },
        ],
      },
    ],
  });

  const toolBlock = response.content.find(
    (b): b is { type: "tool_use"; name: string; input: unknown } => b.type === "tool_use",
  );
  if (!toolBlock || toolBlock.name !== "classify_lead") {
    throw new Error("Qualifier returned no classify_lead tool_use block");
  }

  return {
    output: toolBlock.input as QualifierOutput,
    latency_ms: Date.now() - t0,
  };
}
```

- [ ] **Step 5: Run tests — pass.**

- [ ] **Step 6: Commit.**

```bash
git add src/lib/qualifier.ts src/lib/contracts/qualifier-schema.ts prompts/qualifier.md test/qualifier.test.ts
git commit -m "feat: LLM qualifier with tool-use schema-enforced output"
```

### Task 1.11: `POST /qualify` sync endpoint (Day 3, ~1 hour)

**Files:**
- Create: `src/routes/qualify.ts`
- Create: `test/qualify-route.test.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Write failing test.** Test bearer-token auth + valid request → returns schema. Test missing token → 401. Test malformed body → 400.

```ts
import { env, SELF } from "cloudflare:test";
import { describe, it, expect, vi } from "vitest";

vi.mock("../src/lib/qualifier", () => ({
  qualifyMessage: vi.fn(async () => ({
    output: {
      label: "standard",
      confidence: 0.75,
      evidence_quotes: ["AC tune up"],
      extracted: { service_type: "AC tune-up", urgency: "low", name: null, location: null },
      recommended_action: "send_owner_notification",
    },
    latency_ms: 320,
  })),
}));

describe("POST /qualify", () => {
  it("rejects unauthorized requests", async () => {
    const res = await SELF.fetch("http://test/qualify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(401);
  });

  it("returns 400 on malformed body", async () => {
    const res = await SELF.fetch("http://test/qualify", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.QUALIFY_API_TOKEN}`, "Content-Type": "application/json" },
      body: "not json",
    });
    expect(res.status).toBe(400);
  });

  it("returns classification + X-Schema-Version header on valid request", async () => {
    const res = await SELF.fetch("http://test/qualify", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.QUALIFY_API_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        prospect_messages: ["AC tune up please"],
        business_profile: {
          partner_id: "test",
          business_name: "Test HVAC",
          service_offerings: ["AC"],
          service_area: ["Austin"],
          hours: "9a-5p",
        },
      }),
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("X-Schema-Version")).toBe("v1");
    const json = await res.json();
    expect(json.label).toBe("standard");
  });
});
```

- [ ] **Step 2: Implement `src/routes/qualify.ts`.**

```ts
import { qualifyMessage } from "../lib/qualifier";
import { SCHEMA_VERSION, type BusinessProfile } from "../lib/contracts/qualifier-schema";

type Env = {
  ANTHROPIC_API_KEY: string;
  QUALIFY_API_TOKEN: string;
};

type Body = {
  prospect_messages: string[];
  business_profile: BusinessProfile;
};

export async function handleQualify(req: Request, env: Env): Promise<Response> {
  const auth = req.headers.get("Authorization") ?? "";
  if (auth !== `Bearer ${env.QUALIFY_API_TOKEN}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return new Response("Bad request", { status: 400 });
  }
  if (!Array.isArray(body.prospect_messages) || !body.business_profile) {
    return new Response("Bad request", { status: 400 });
  }

  // Length cap for abuse prevention
  const totalChars = body.prospect_messages.reduce((n, m) => n + m.length, 0);
  if (totalChars > 1000) return new Response("Payload too large", { status: 413 });

  try {
    const result = await Promise.race([
      qualifyMessage({
        apiKey: env.ANTHROPIC_API_KEY,
        prospect_messages: body.prospect_messages,
        business_profile: body.business_profile,
      }),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error("timeout")), 5000)),
    ]);
    return new Response(JSON.stringify(result.output), {
      status: 200,
      headers: { "Content-Type": "application/json", "X-Schema-Version": SCHEMA_VERSION },
    });
  } catch (e) {
    return new Response(`Qualifier error: ${(e as Error).message}`, { status: 502 });
  }
}
```

- [ ] **Step 3: Wire route in `src/index.ts`.**

```ts
import { handleQualify } from "./routes/qualify";

// In fetch handler:
if (req.method === "POST" && url.pathname === "/qualify") {
  return handleQualify(req, env);
}
```

- [ ] **Step 4: Run tests — pass.**

- [ ] **Step 5: Commit.**

```bash
git add src/routes/qualify.ts test/qualify-route.test.ts src/index.ts
git commit -m "feat: POST /qualify sync inference endpoint with bearer auth"
```

### Task 1.12: Twilio sms-inbound webhook (Day 3, ~2 hours)

**Files:**
- Create: `src/routes/webhooks/twilio/sms-inbound.ts`
- Modify: `src/lib/db.ts` (add `insertMessage`, `insertClassification`)
- Create: `test/sms-inbound.test.ts`

The sms-inbound handler: (1) verify sig, (2) idempotency-claim, (3) insert message, (4) check opt-out keywords (STOP/HELP), (5) run prefilter, (6) if pass, call internal qualifier path (NOT external /qualify — direct lib call), (7) insert classification, (8) trigger owner notification (Task 1.13).

- [ ] **Step 1: Extend `src/lib/db.ts` with insertMessage + insertClassification helpers.** (Mirror the schema columns; bind in order.)

- [ ] **Step 2: Write integration test simulating an inbound SMS that should classify as urgent.**

- [ ] **Step 3: Run — fail.**

- [ ] **Step 4: Implement `src/routes/webhooks/twilio/sms-inbound.ts`.**

```ts
import type { D1Database, KVNamespace } from "@cloudflare/workers-types";
import { verifyTwilioSignature } from "../../../lib/sig-verify";
import { claimIdempotencyKey } from "../../../lib/idempotency";
import { insertMessage, insertClassification, getCallByFromNumber } from "../../../lib/db";
import { hashLast4 } from "../../../lib/phone";
import { addOptOut, classifyKeyword, isOptedOut } from "../../../lib/opt-out";
import { prefilterMessage } from "../../../lib/prefilter";
import { qualifyMessage } from "../../../lib/qualifier";
import type { BusinessProfile } from "../../../lib/contracts/qualifier-schema";
import { SCHEMA_VERSION } from "../../../lib/contracts/qualifier-schema";

// Inline business profile for v1 single-tenant — read from env vars
function readBusinessProfile(env: { BUSINESS_PROFILE_JSON: string }): BusinessProfile {
  return JSON.parse(env.BUSINESS_PROFILE_JSON);
}

type Env = {
  DB: D1Database;
  KV: KVNamespace;
  TWILIO_AUTH_TOKEN: string;
  ANTHROPIC_API_KEY: string;
  PARTNER_ID: string;
  BUSINESS_PROFILE_JSON: string;
  SKIP_SIG_VERIFY?: string;
};

export async function handleSmsInbound(req: Request, env: Env): Promise<Response> {
  const form = await req.formData();
  const params: Record<string, string> = {};
  for (const [k, v] of form.entries()) params[k] = String(v);

  if (env.SKIP_SIG_VERIFY !== "1") {
    const signature = req.headers.get("X-Twilio-Signature") ?? "";
    const ok = await verifyTwilioSignature(env.TWILIO_AUTH_TOKEN, signature, req.url, params);
    if (!ok) return new Response("Invalid signature", { status: 403 });
  }

  const idem = await claimIdempotencyKey(env.KV, `sms-inbound:${params.MessageSid}`);
  if (!idem.claimed) return new Response("ok (duplicate)", { status: 200 });

  const fromHash = hashLast4(params.From);
  const messageId = crypto.randomUUID();

  // Find correlated call (most recent missed call from this number, within last 24h)
  const callId = await getCallByFromNumber(env.DB, params.From, Date.now() - 86_400_000);

  await insertMessage(env.DB, {
    id: messageId,
    call_id: callId,
    twilio_message_sid: params.MessageSid,
    direction: "inbound_caller",
    from_number_hash: fromHash,
    to_number_hash: hashLast4(params.To),
    body: params.Body,
    occurred_at: Date.now(),
    partner_id: env.PARTNER_ID,
    compliance_basis: "implicit_consent_post_inbound_call",
  });

  // Keyword handling: STOP / HELP
  const keyword = classifyKeyword(params.Body);
  if (keyword === "stop") {
    await addOptOut(env.DB, fromHash, "caller_stop");
    return new Response("ok (opted out)", { status: 200 });
  }
  if (keyword === "help") {
    // Static HELP response; not generating a classification
    return new Response("ok (help requested)", { status: 200 });
  }

  // Pre-filter
  const pre = prefilterMessage(params.Body);
  if (pre.decision === "spam") {
    await insertClassification(env.DB, {
      id: crypto.randomUUID(),
      message_id: messageId,
      prefilter_decision: "spam",
      prefilter_pattern: pre.matched_pattern,
      label: null,
      confidence: null,
      evidence_quotes: null,
      extracted: null,
      recommended_action: "auto_dismiss",
      schema_version: SCHEMA_VERSION,
      latency_ms: 0,
      occurred_at: Date.now(),
      partner_id: env.PARTNER_ID,
    });
    return new Response("ok (prefiltered spam)", { status: 200 });
  }

  // LLM qualification
  const profile = readBusinessProfile(env);
  try {
    const result = await qualifyMessage({
      apiKey: env.ANTHROPIC_API_KEY,
      prospect_messages: [params.Body],
      business_profile: profile,
    });
    await insertClassification(env.DB, {
      id: crypto.randomUUID(),
      message_id: messageId,
      prefilter_decision: "pass",
      prefilter_pattern: null,
      label: result.output.label,
      confidence: result.output.confidence,
      evidence_quotes: JSON.stringify(result.output.evidence_quotes),
      extracted: JSON.stringify(result.output.extracted),
      recommended_action: result.output.recommended_action,
      schema_version: SCHEMA_VERSION,
      latency_ms: result.latency_ms,
      occurred_at: Date.now(),
      partner_id: env.PARTNER_ID,
    });
    // Owner notification dispatched in Task 1.13
    return new Response("ok", { status: 200 });
  } catch (e) {
    // Fallback: log + alert owner with raw text
    return new Response(`Qualifier failed: ${(e as Error).message}`, { status: 502 });
  }
}
```

- [ ] **Step 5: Add `getCallByFromNumber` helper to `src/lib/db.ts`.**

```ts
export async function getCallByFromNumber(
  db: D1Database,
  fromNumber: string,
  sinceMs: number,
): Promise<string | null> {
  const row = await db
    .prepare(
      "SELECT id FROM calls WHERE from_number_raw = ? AND received_at >= ? ORDER BY received_at DESC LIMIT 1",
    )
    .bind(fromNumber, sinceMs)
    .first<{ id: string }>();
  return row?.id ?? null;
}
```

- [ ] **Step 6: Wire route in index.ts.**

- [ ] **Step 7: Add `BUSINESS_PROFILE_JSON` to test env (`vitest.config.ts`).**

```ts
BUSINESS_PROFILE_JSON: JSON.stringify({
  partner_id: "test-partner",
  business_name: "Test HVAC",
  service_offerings: ["AC", "furnace", "water heater"],
  service_area: ["Austin"],
  hours: "8a-6p Mon-Fri",
}),
QUALIFY_API_TOKEN: "test-qualify-token",
```

- [ ] **Step 8: Run tests — pass. Commit.**

```bash
git add -A
git commit -m "feat: sms-inbound webhook with prefilter + qualify + opt-out handling"
```

### Task 1.13: Owner notification + sms-owner-reply (Day 4, ~2 hours)

**Files:**
- Create: `src/routes/webhooks/twilio/sms-owner-reply.ts`
- Create: `src/lib/owner-notifier.ts`
- Modify: `src/routes/webhooks/twilio/sms-inbound.ts` (dispatch owner notification at end)
- Modify: `src/lib/db.ts` (`insertOwnerDecision`, `getLatestClassificationForOwner`)
- Create: `test/owner-notify.test.ts`

- [ ] **Step 1: Implement owner notification formatter.** `src/lib/owner-notifier.ts`:

```ts
import type { QualifierOutput } from "./contracts/qualifier-schema";

export function formatOwnerNotification(args: {
  classification: QualifierOutput;
  caller_alias: string;       // e.g., "Caller A"
  classification_id: string;
}): string {
  const c = args.classification;
  const conf = Math.round((c.confidence ?? 0) * 100);
  const quote = c.evidence_quotes[0] ?? "(no quote)";
  const name = c.extracted.name ? `${c.extracted.name} (${args.caller_alias})` : args.caller_alias;
  return (
    `New lead: ${name} — ${c.extracted.service_type} — ${c.label.toUpperCase()} · ${conf}% conf\n` +
    `Evidence: "${quote}"\n` +
    `Reply YES to send booking link, NO to dismiss, INFO for details.\n` +
    `[id:${args.classification_id.slice(0, 8)}]`
  );
}
```

- [ ] **Step 2: TDD on `formatOwnerNotification`** with a few classification fixtures.

- [ ] **Step 3: Dispatch owner notification at end of sms-inbound (after classification insert).** Send via `sendSmsWithRetry` to `env.OWNER_PHONE_NUMBER`. Skip if `recommended_action === "auto_dismiss"`.

- [ ] **Step 4: Implement `sms-owner-reply` route.** Parses owner's reply (YES/NO/INFO/HELP), looks up the most recent classification awaiting decision for that owner, inserts owner_decisions row, and on YES sends Cal.com link to caller.

- [ ] **Step 5: TDD: simulate YES reply → expect Cal.com link sent to original caller's phone (mock notifier).**

- [ ] **Step 6: Run tests. Commit.**

### Task 1.14: Cal.com webhook handler (Day 4, ~1 hour)

**Files:**
- Create: `src/routes/webhooks/calcom/booking-created.ts`
- Modify: `src/lib/db.ts` (`insertBooking`)
- Create: `test/calcom-webhook.test.ts`

- [ ] **Step 1: Verify Cal.com signature header (`X-Cal-Signature-256`, HMAC-SHA256 with webhook secret).**

- [ ] **Step 2: On valid booking event, insert booking + send SMS confirmation to caller.**

- [ ] **Step 3: TDD. Commit.**

### Task 1.15: Escalation logic (10/30-min ignored notification) (Day 4, ~1.5 hours)

**Files:**
- Modify: `src/routes/webhooks/twilio/sms-inbound.ts` (schedule escalation on notification dispatch)
- Create: `src/lib/escalation.ts`
- Create: `test/escalation.test.ts`

Approach: when owner is notified, write an escalation record to KV with `next_action_at = now + 10min`. The retry-replay cron also checks for escalations. If owner hasn't replied by 10m → send reminder SMS. If 30m → send email via Resend.

- [ ] **Step 1: Implement `src/lib/escalation.ts` with `scheduleEscalation`, `listDueEscalations`, `markEscalated`.**

- [ ] **Step 2: TDD on the scheduling helpers.**

- [ ] **Step 3: Add an `acknowledgeEscalation` call inside `sms-owner-reply` handler that removes the escalation entry when owner replies.**

- [ ] **Step 4: TDD: simulate notification dispatch → wait beyond 10min (mock clock) → verify reminder fires.**

- [ ] **Step 5: Commit.**

---

## Phase 2: Eval harness + reliability (Days 5–7)

### Task 2.1: Eval harness skeleton (Day 5, ~2 hours)

**Files:**
- Create: `eval/test-set.jsonl`
- Create: `eval/run-eval.ts`
- Create: `eval/types.ts`
- Create: `eval/README.md`

- [ ] **Step 1: Define eval record schema.** `eval/types.ts`:

```ts
import type { QualifierLabel, Urgency } from "../src/lib/contracts/qualifier-schema";

export type EvalRecord = {
  id: string;
  body: string;
  expected_label: QualifierLabel;
  expected_urgency: Urgency;
  expected_service_type?: string;
  rationale: string;            // human-written, why this label
};

export type EvalResult = {
  record_id: string;
  predicted_label: QualifierLabel | null;
  predicted_urgency: Urgency | null;
  correct_label: boolean;
  correct_urgency: boolean;
  latency_ms: number;
  prefilter_decision: "spam" | "pass";
};
```

- [ ] **Step 2: Author 50 labeled examples in `eval/test-set.jsonl`.** Distribute: 15 urgent, 15 standard, 12 not_a_fit, 8 spam. Include 5 edge cases (very short replies, mixed-language, partial info, sarcasm, multi-issue).

```jsonl
{"id":"u1","body":"Water heater leaking everywhere can you come now","expected_label":"urgent","expected_urgency":"high","expected_service_type":"water heater repair","rationale":"Active leak, same-day need"}
{"id":"u2","body":"No heat in the house and it's 28 degrees outside","expected_label":"urgent","expected_urgency":"high","expected_service_type":"heating repair","rationale":"Cold-weather no-heat emergency"}
...
```

(Author all 50 by hand — Day 5 work.)

- [ ] **Step 3: Implement `eval/run-eval.ts` runner.**

```ts
import { readFile, writeFile } from "node:fs/promises";
import { qualifyMessage } from "../src/lib/qualifier";
import { prefilterMessage } from "../src/lib/prefilter";
import type { EvalRecord, EvalResult } from "./types";

const TEST_SET_PATH = "eval/test-set.jsonl";

const PROFILE = {
  partner_id: "eval-partner",
  business_name: "Test HVAC + Plumbing",
  service_offerings: ["AC", "heating", "plumbing", "water heater"],
  service_area: ["Austin", "Round Rock"],
  hours: "8a-6p Mon-Fri",
};

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY required");

  const raw = await readFile(TEST_SET_PATH, "utf8");
  const records: EvalRecord[] = raw
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l));

  const results: EvalResult[] = [];
  for (const r of records) {
    const pre = prefilterMessage(r.body);
    if (pre.decision === "spam") {
      results.push({
        record_id: r.id,
        predicted_label: "spam",
        predicted_urgency: null,
        correct_label: r.expected_label === "spam",
        correct_urgency: true,
        latency_ms: 0,
        prefilter_decision: "spam",
      });
      continue;
    }
    const out = await qualifyMessage({
      apiKey, prospect_messages: [r.body], business_profile: PROFILE,
    });
    results.push({
      record_id: r.id,
      predicted_label: out.output.label,
      predicted_urgency: out.output.extracted.urgency,
      correct_label: out.output.label === r.expected_label,
      correct_urgency: out.output.extracted.urgency === r.expected_urgency,
      latency_ms: out.latency_ms,
      prefilter_decision: "pass",
    });
  }

  // Confusion matrix
  const labels = ["urgent", "standard", "not_a_fit", "spam"] as const;
  const matrix: Record<string, Record<string, number>> = {};
  for (const a of labels) {
    matrix[a] = {};
    for (const b of labels) matrix[a][b] = 0;
  }
  for (let i = 0; i < records.length; i++) {
    const expected = records[i].expected_label;
    const predicted = results[i].predicted_label ?? "spam";
    matrix[expected][predicted] += 1;
  }

  const summary = {
    total: records.length,
    label_accuracy: results.filter((r) => r.correct_label).length / results.length,
    urgency_accuracy: results.filter((r) => r.correct_urgency).length / results.length,
    latency_p50_ms: percentile(results.map((r) => r.latency_ms), 0.5),
    latency_p95_ms: percentile(results.map((r) => r.latency_ms), 0.95),
    confusion_matrix: matrix,
  };

  await writeFile("eval/last-run.json", JSON.stringify({ summary, results }, null, 2));
  console.log(JSON.stringify(summary, null, 2));
}

function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor(sorted.length * p));
  return sorted[idx];
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

- [ ] **Step 4: Document the eval in `eval/README.md`.** How to run, how to add examples, what targets we're chasing (label accuracy ≥ 85%, urgency accuracy ≥ 75%, P95 latency ≤ 3500ms).

- [ ] **Step 5: Run eval against actual Claude Haiku.**

```bash
ANTHROPIC_API_KEY=$(grep ANTHROPIC ~/.config/auto-lead-response-loop/.env | cut -d= -f2) npm run eval
```

Expected: JSON summary printed + `eval/last-run.json` written. If accuracy < target, iterate prompt.

- [ ] **Step 6: Commit.**

```bash
git add eval package.json
git commit -m "feat: eval harness + 50-example labeled test set + confusion matrix"
```

### Task 2.2: Iterate prompt to target accuracy (Day 5, time-boxed 2 hours)

- [ ] **Step 1: Run eval. Review confusion matrix. Identify worst category.**
- [ ] **Step 2: Tighten prompt (e.g., add explicit examples to system prompt, or refine label definitions).**
- [ ] **Step 3: Re-run. Compare.**
- [ ] **Step 4: Repeat up to 3 iterations or until label_accuracy ≥ 0.85.** Document each iteration in `eval/iterations.md` (prompt diff + result delta — feeds the case study build log).
- [ ] **Step 5: Commit each iteration separately.**

### Task 2.3: Public metrics endpoint (Day 5, ~1.5 hours)

**Files:**
- Create: `src/routes/metrics-public.ts`
- Modify: `src/lib/db.ts` (`getMetricsAggregate`)
- Create: `test/metrics-public.test.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Write aggregator query.** `getMetricsAggregate` returns:

```ts
{
  total_calls: number,
  qualified_pct: number,
  latency_p50_ms: number,
  latency_p95_ms: number,
  accuracy_on_labeled_set: number,
  beta_partner_days_live: number,
  schema_version: "v1",
  generated_at: number,
}
```

`accuracy_on_labeled_set` is read from `eval/last-run.json` (committed file, read at request time via a wrangler binding to the bundled asset OR served as a static value updated by deploy).

For v1, embed accuracy as an env var `EVAL_ACCURACY` set during deploy after each eval run. Cheaper than bundling JSON.

- [ ] **Step 2: TDD on the route. Verify bearer auth, returns aggregate, sets `X-Schema-Version: v1` header.**

- [ ] **Step 3: Wire route. Test. Commit.**

### Task 2.4: CF Cron Trigger for retry replay (Day 5, ~1.5 hours)

**Files:**
- Create: `src/routes/cron/retry-replay.ts`
- Modify: `src/index.ts` (add `scheduled` handler)
- Create: `test/cron-replay.test.ts`

- [ ] **Step 1: Implement `scheduled` handler.** Worker entry point.

```ts
import { handleRetryReplay } from "./routes/cron/retry-replay";

export default {
  async fetch(/* ... */) { /* existing */ },
  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(handleRetryReplay(env));
  },
};
```

- [ ] **Step 2: Implement `handleRetryReplay`.** List due retries, attempt resend, advance/remove, escalate via Resend if attempts >= 3.

- [ ] **Step 3: TDD via simulated cron triggering Worker's `scheduled` handler.**

- [ ] **Step 4: Deploy + verify cron fires.**

```bash
npx wrangler deploy
npx wrangler tail --format=pretty
```

Expected: log line every minute.

- [ ] **Step 5: Commit.**

### Task 2.5: Resend escalation email (Day 5, ~30 min)

**Files:**
- Create: `src/lib/resend.ts`
- Modify: `src/routes/cron/retry-replay.ts`

Standard Resend HTTP API call. After 3 retry failures → email Jay's alert address.

- [ ] **Step 1: Implement, TDD, commit.**

### Task 2.6: Beta partner onboarding outreach (Day 5, ~1 hour, parallel)

Non-code task. Outside the build sequence's code work, but tracked here.

- [ ] **Step 1: Draft outreach message** (use `process/2026-05-19-lead-response-loop-design.md` §8 data-use agreement as the deal).

- [ ] **Step 2: Send to 5–10 HVAC/plumbing owners in Jay's network (LinkedIn, local FB groups, BNI, etc.). Goal: 1 yes.**

- [ ] **Step 3: Schedule a 20-min call with the first interested owner. Walk through what's instrumented + the agreement.**

- [ ] **Step 4: Document the conversation in `process/beta-partner-call-notes.md` (anonymized) → feeds build-log appendix.**

### Task 2.7: Beta partner onboarding wire-up (Day 6, ~3 hours, GATES on Task 2.6)

**Files:**
- Modify: `wrangler.jsonc` (production secrets including `OWNER_PHONE_NUMBER`, `BUSINESS_PROFILE_JSON`)
- Create: `process/beta-onboarding-checklist.md`

- [ ] **Step 1: Get partner's verbal commitment + signed data-use agreement.**

- [ ] **Step 2: Submit Twilio A2P 10DLC registration for partner's number (this is the long-tail risk — may extend into Day 7).**

- [ ] **Step 3: While 10DLC pending: route partner's Google Business Profile number's missed calls to Jay's Twilio test number temporarily.**

- [ ] **Step 4: Author partner's `BUSINESS_PROFILE_JSON` (service offerings, service area, hours).**

- [ ] **Step 5: Deploy production worker.**

```bash
cd /Users/jay/00-Dev/auto-lead-response-loop
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler secret put TWILIO_AUTH_TOKEN
npx wrangler secret put TWILIO_ACCOUNT_SID
npx wrangler secret put TWILIO_PHONE_NUMBER
npx wrangler secret put OWNER_PHONE_NUMBER
npx wrangler secret put PARTNER_ID
npx wrangler secret put BUSINESS_PROFILE_JSON
npx wrangler secret put QUALIFY_API_TOKEN
npx wrangler secret put METRICS_API_TOKEN
npx wrangler secret put EVAL_ACCURACY
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put JAY_ALERT_EMAIL
npx wrangler secret put UPSTASH_REDIS_REST_URL
npx wrangler secret put UPSTASH_REDIS_REST_TOKEN
npx wrangler deploy
```

- [ ] **Step 6: Configure Twilio number webhook URLs** in Twilio console:
- Call-status callback → `https://auto-lead-response-loop.<account>.workers.dev/webhooks/twilio/call-status`
- SMS inbound → `https://auto-lead-response-loop.<account>.workers.dev/webhooks/twilio/sms-inbound`

- [ ] **Step 7: Test end-to-end with Jay's own phone:** call the Twilio number, let it ring out, verify text-back arrives, reply with "water heater leaking", verify owner notification arrives, reply YES, verify Cal.com link arrives.

- [ ] **Step 8: Commit `process/beta-onboarding-checklist.md` (checklist for repeating with future partners).**

### Task 2.8: Smoke test buffer (Day 7, ~variable)

- [ ] **Step 1: Run partner's real traffic through.** Monitor `wrangler tail`. Fix bugs as they appear.
- [ ] **Step 2: Daily aggregate from D1: how many calls / messages / classifications today? Confidence distribution?**
- [ ] **Step 3: Write up the Day 7 reliability snapshot for the build log: `process/day-7-snapshot.md` (anonymized).**

---

## Phase 3: Case study scaffold + simulator (Days 8–9)

These tasks run in the **portfolio repo**: `/Users/jay/00-Dev-jaymoore/jay-moore-design`. Switch working directory!

### Task 3.1: Delete old scaffold + rename to lead-response-loop (Day 8, ~30 min)

**Files (portfolio repo):**
- Delete: `app/work/spm-lifecycle/` (entire directory)
- Create: `app/work/lead-response-loop/page.tsx`
- Create: `app/work/lead-response-loop/password-gate.tsx`
- Create: `app/work/lead-response-loop/actions.ts`
- Create: `app/work/lead-response-loop/case-study-content.tsx`
- Modify: any nav/homepage references to the old route

- [ ] **Step 1: `cd /Users/jay/00-Dev-jaymoore/jay-moore-design`.**

- [ ] **Step 2: Delete old scaffold.**

```bash
git rm -r app/work/spm-lifecycle
```

- [ ] **Step 3: Create new directory `app/work/lead-response-loop/` and copy the old scaffold structure as a starting template** (page.tsx, password-gate.tsx, actions.ts, case-study-content.tsx). Rename cookie `spm-case-study-auth` → `lrl-case-study-auth` in all places.

- [ ] **Step 4: Update page metadata title/description, page label, tagline.**

```ts
export const metadata: Metadata = {
  title: "Lead Response Loop — case study",
  description: "Decision-support response system for high-noise inbound lead channels. HVAC + plumbing first, pattern transferable.",
};
```

- [ ] **Step 5: Search for all remaining `spm-lifecycle` / `SPM lifecycle` strings in portfolio.**

```bash
grep -rn "spm-lifecycle\|SPM lifecycle\|SPM-lifecycle" --include="*.tsx" --include="*.ts" --include="*.md" .
```

Replace each. Update homepage card label + href. Update sitemap. Update `robots.txt` disallow rule from old path to new path.

- [ ] **Step 6: Build + dev-start.**

```bash
npm run build
npm run dev
```

Visit `http://localhost:3001/work/lead-response-loop` — confirm password gate appears.

- [ ] **Step 7: Commit.**

```bash
git add -A
git commit -m "refactor: rename /work/spm-lifecycle to /work/lead-response-loop"
```

### Task 3.2: Simulator skeleton (Day 8, ~3 hours)

**Files (portfolio repo):**
- Create: `app/work/lead-response-loop/simulator/index.tsx` (Server Component shell)
- Create: `app/work/lead-response-loop/simulator/scenario-picker.tsx` (client)
- Create: `app/work/lead-response-loop/simulator/prospect-pane.tsx` (client)
- Create: `app/work/lead-response-loop/simulator/owner-pane.tsx` (client)
- Create: `app/work/lead-response-loop/simulator/event-log.tsx` (client)
- Create: `app/work/lead-response-loop/simulator/state-machine.ts` (pure functions)
- Create: `app/work/lead-response-loop/simulator/scenarios.ts` (canned scenarios)
- Create: `tests/simulator/state-machine.test.ts`

- [ ] **Step 1: Define the scenarios.** `scenarios.ts`:

```ts
export type Scenario = {
  id: string;
  label: string;
  prospect_text: string;
};

export const CANNED_SCENARIOS: Scenario[] = [
  {
    id: "water-heater",
    label: "Water heater leak",
    prospect_text: "Hi I just called you - my water heater is leaking everywhere can someone come today",
  },
  {
    id: "ac-tune-up",
    label: "AC tune-up",
    prospect_text: "Hey, looking to schedule an AC tune-up sometime next month if possible",
  },
  {
    id: "parts-inquiry",
    label: "Parts inquiry",
    prospect_text: "Do you guys sell parts? Just need a replacement thermostat, not install",
  },
  {
    id: "obvious-spam",
    label: "Obvious spam",
    prospect_text: "Congratulations! You won $5000 click here bit.ly/abc",
  },
];
```

- [ ] **Step 2: Define the state machine.** Pure-function reducer that takes current state + event and returns next state. Events: `scenario_selected`, `call_missed`, `text_back_sent`, `prospect_replied`, `prefilter_run`, `llm_classified`, `owner_notified`, `owner_replied_yes`, `owner_replied_no`, `booking_link_sent`.

- [ ] **Step 3: TDD on the state machine.** All 10 events tested.

- [ ] **Step 4: Implement the visual components.** Use existing portfolio Tailwind tokens (see `app/globals.css` and existing scaffold). The case study aesthetic per `2026-05-13-portfolio-redesign-design.md`.

- [ ] **Step 5: Commit.**

### Task 3.3: Simulator wires to product `/qualify` (Day 9, ~3 hours)

**Files (portfolio repo):**
- Create: `app/work/lead-response-loop/simulator/qualify-action.ts` (Next.js Server Action)
- Create: `app/work/lead-response-loop/simulator/rate-limit.ts` (Upstash via fetch)
- Create: `app/work/lead-response-loop/simulator/fallback.ts` (cached canned outputs)
- Modify: scenario picker to invoke the Server Action
- Create: `tests/simulator/qualify-action.test.ts`

- [ ] **Step 1: Implement Upstash rate-limit helper.** Fetch-based — no SDK needed.

```ts
// rate-limit.ts
type RateLimitResult = { allowed: boolean; remaining: number; reset_at: number };

export async function checkRateLimit(
  identifier: string,
  env: { UPSTASH_REDIS_REST_URL: string; UPSTASH_REDIS_REST_TOKEN: string },
  windowMs = 60 * 60 * 1000,
  max = 10,
): Promise<RateLimitResult> {
  const key = `rl:lrl:${identifier}`;
  const url = `${env.UPSTASH_REDIS_REST_URL}/pipeline`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", key],
      ["PEXPIRE", key, windowMs, "NX"],
    ]),
  });
  const [count] = ((await res.json()) as Array<{ result: number }>).map((r) => r.result);
  return {
    allowed: count <= max,
    remaining: Math.max(0, max - count),
    reset_at: Date.now() + windowMs,
  };
}
```

- [ ] **Step 2: Implement the Server Action.** Includes: rate-limit (by IP from headers), input length cap, calls product `/qualify`, returns the JSON or a fallback.

```ts
"use server";
import { headers } from "next/headers";
import { checkRateLimit } from "./rate-limit";
import { FALLBACK_OUTPUTS } from "./fallback";
import type { QualifierOutput } from "@/types/qualifier"; // duplicate the type in portfolio

export async function qualifyAction(input: {
  scenario_id: string;
  prospect_text: string;
}): Promise<{ output: QualifierOutput; source: "live" | "fallback" }> {
  const h = await headers();
  const ip = h.get("cf-connecting-ip") ?? h.get("x-forwarded-for") ?? "unknown";

  const rl = await checkRateLimit(ip, {
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL!,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
  if (!rl.allowed) return { output: FALLBACK_OUTPUTS[input.scenario_id], source: "fallback" };

  if (input.prospect_text.length > 280) {
    return { output: FALLBACK_OUTPUTS[input.scenario_id] ?? FALLBACK_OUTPUTS["water-heater"], source: "fallback" };
  }

  try {
    const res = await Promise.race([
      fetch(`${process.env.QUALIFY_ENDPOINT_URL}/qualify`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.QUALIFY_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prospect_messages: [input.prospect_text],
          business_profile: {
            partner_id: "simulator",
            business_name: "Demo HVAC",
            service_offerings: ["AC", "heating", "water heater", "plumbing"],
            service_area: ["Austin"],
            hours: "8a-6p Mon-Fri",
          },
        }),
      }),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error("timeout")), 8000)),
    ]);
    if (!res.ok) throw new Error(`Upstream ${res.status}`);
    const output = (await res.json()) as QualifierOutput;
    return { output, source: "live" };
  } catch {
    return {
      output: FALLBACK_OUTPUTS[input.scenario_id] ?? FALLBACK_OUTPUTS["water-heater"],
      source: "fallback",
    };
  }
}
```

- [ ] **Step 3: Author `FALLBACK_OUTPUTS` in `fallback.ts`** — pre-recorded real outputs for each canned scenario (so the demo still works if API down).

- [ ] **Step 4: Wire scenario picker → calls `qualifyAction(scenario)` → renders result via state machine.**

- [ ] **Step 5: Add "show advanced" disclosure toggle that reveals freeform input. Default closed.**

- [ ] **Step 6: TDD: mock the upstream fetch, assert rate-limit + fallback behavior + happy path.**

- [ ] **Step 7: Add visual fallback banner: "Demo offline, showing cached output" when `source === "fallback"`.**

- [ ] **Step 8: Verify in browser at `http://localhost:3001/work/lead-response-loop` with password.** Test water heater, AC tune-up, parts inquiry, spam, write-your-own (rate-limited after 10 runs).

- [ ] **Step 9: Commit.**

---

## Phase 4: Case study prose, build log, ship (Days 10–14)

### Task 4.1: Case study prose v1 (Day 10, ~4 hours)

**Files (portfolio repo):**
- Modify: `app/work/lead-response-loop/case-study-content.tsx` (replace placeholders with real prose)

Author each section per the spec §2 shape. Pure writing work; no new code.

- [ ] **Step 1: Transferability preamble.** Read spec §1+§2; write the up-front callout for non-HVAC readers. 2–3 sentences max.

- [ ] **Step 2: TL;DR.** 3 tiles. Plug in live values: `P95_LATENCY_MS`, `LABEL_ACCURACY`, `BETA_RECOVERED_PCT` (the last comes from the build-time committed `metrics-snapshot.json`).

- [ ] **Step 3: Problem section.** HVAC/plumbing economics: response time vs. job conversion. 2 paragraphs.

- [ ] **Step 4: Approach section.** Multi-agent loop framing. Embed architecture diagram (SVG export, made Day 1). Three artifact panels: system diagram, prompt design excerpt, sample qualification trace (from `eval/last-run.json`).

- [ ] **Step 5: Decisions section (3–4 incl. one reversal).** From `eval/iterations.md` Day 5: pick the one most-interesting prompt reversal. Frame as a decision narrative.

- [ ] **Step 6: Evaluation section.** Render the confusion matrix from `metrics-snapshot.json`. P50/P95. False-positive/negative policy. SLO targets.

- [ ] **Step 7: Outcomes section.** Honest "in build" with telemetry tiles + next-measurement-date gates per spec.

- [ ] **Step 8: Roadmap section.** The 4 next components from spec §2.

- [ ] **Step 9: Commit each section as you finish it** (1 commit per section, 8 commits total) — feeds the build log appendix.

### Task 4.2: Build-log appendix (Day 11, ~3 hours)

**Files (portfolio repo):**
- Create: `app/work/lead-response-loop/build-log.tsx`
- Create: `app/work/lead-response-loop/build-log-entries.ts` (data)

- [ ] **Step 1: Curate the 14 days of PR diffs + screenshots.** Pull from both product repo commits + portfolio repo commits. Each entry: date, repo, summary, link to commit, anchor to a decision/outcome section.

- [ ] **Step 2: Add sidenote anchors in the prose sections that link to build-log entries.** E.g., in Decisions section's prompt-reversal narrative: "[build log Day 5 →](#bl-day-5)".

- [ ] **Step 3: Commit.**

### Task 4.3: Metrics snapshot mechanism (Day 11, ~1.5 hours)

**Files (portfolio repo):**
- Create: `.github/workflows/refresh-metrics-snapshot.yml`
- Create: `scripts/refresh-metrics-snapshot.ts`
- Create: `app/work/lead-response-loop/metrics-snapshot.json` (initial seed)

Per spec §5 server-only-fetch + build-time-snapshot rule.

- [ ] **Step 1: Author the GitHub Action** (runs every 6 hours): hits product's `/metrics/public`, compares to committed snapshot, commits if changed, opens PR if changed (auto-merge on green).

```yaml
name: Refresh metrics snapshot
on:
  schedule:
    - cron: "0 */6 * * *"
  workflow_dispatch:
permissions:
  contents: write
jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20" }
      - run: |
          curl -fsSL -H "Authorization: Bearer ${{ secrets.METRICS_API_TOKEN }}" \
            "${{ secrets.METRICS_ENDPOINT_URL }}/metrics/public" \
            -o app/work/lead-response-loop/metrics-snapshot.json.new
      - id: diff
        run: |
          if ! cmp -s app/work/lead-response-loop/metrics-snapshot.json app/work/lead-response-loop/metrics-snapshot.json.new; then
            mv app/work/lead-response-loop/metrics-snapshot.json.new app/work/lead-response-loop/metrics-snapshot.json
            echo "changed=true" >> "$GITHUB_OUTPUT"
          else
            rm app/work/lead-response-loop/metrics-snapshot.json.new
          fi
      - if: steps.diff.outputs.changed == 'true'
        run: |
          git config user.name "metrics-bot"
          git config user.email "metrics@jaymoore.dev"
          git add app/work/lead-response-loop/metrics-snapshot.json
          git commit -m "chore: refresh metrics-snapshot.json"
          git push
```

- [ ] **Step 2: Configure repo secrets `METRICS_API_TOKEN`, `METRICS_ENDPOINT_URL`.**

- [ ] **Step 3: Implement Server Component fetch with ISR + fallback.**

```tsx
// case-study-content.tsx (excerpt)
async function getMetrics(): Promise<MetricsSnapshot> {
  try {
    const res = await fetch(`${process.env.QUALIFY_ENDPOINT_URL}/metrics/public`, {
      headers: { Authorization: `Bearer ${process.env.METRICS_API_TOKEN}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("upstream failed");
    return await res.json();
  } catch {
    return JSON.parse(
      await readFile(
        path.join(process.cwd(), "app/work/lead-response-loop/metrics-snapshot.json"),
        "utf8",
      ),
    );
  }
}
```

- [ ] **Step 4: Commit.**

### Task 4.4: Compliance hardening + design review (Day 12, ~3 hours)

**Files (portfolio + product):**
- Add: secret-grep step to portfolio CI

- [ ] **Step 1: Audit the client bundle.** Build production portfolio:

```bash
cd /Users/jay/00-Dev-jaymoore/jay-moore-design
npm run build
```

Then `grep -r "QUALIFY_API_TOKEN\|METRICS_API_TOKEN\|ANTHROPIC_API_KEY" .next/static`. Expected: zero matches.

- [ ] **Step 2: Add as a CI step** in `.github/workflows/ci.yml`. Fail the build if secret tokens appear in the static bundle.

- [ ] **Step 3: Run design review skill against the case study page.** Address findings.

- [ ] **Step 4: Run codex-second-opinion on the case study page** (per Jay's after-every-major-decision rule). Address findings.

- [ ] **Step 5: A11y pass.** Run axe via CLI or manually with the browser plugin. Fix any issues.

- [ ] **Step 6: Mobile pass.** Test at 375px, 414px, 768px. Stack-vertically layout for simulator at narrow widths.

- [ ] **Step 7: Commit.**

### Task 4.5: Real beta metrics integration (Day 13, ~2 hours)

- [ ] **Step 1: If beta partner has been live ≥ 5 days, the GitHub Action's snapshot has real data.** Verify the JSON contents.

- [ ] **Step 2: Update prose to reflect actual data** — replace any remaining placeholder values with real numbers.

- [ ] **Step 3: Add a "last refreshed" timestamp visible on the page.**

- [ ] **Step 4: If beta partner is NOT live (10DLC delay):** keep the in-build framing with "telemetry lands week of <date>" copy.

- [ ] **Step 5: Commit.**

### Task 4.6: Final audit + ship (Day 14, ~4 hours)

- [ ] **Step 1: Lighthouse audit on the case study page.** Run from Chrome DevTools or `npx unlighthouse` against deploy preview. Target: ≥ 95 on Performance + Accessibility + Best Practices.

- [ ] **Step 2: Axe-core a11y audit.** Zero serious/critical issues.

- [ ] **Step 3: Final codex-second-opinion** on the deployed site URL + case study content.

- [ ] **Step 4: Set the password in production env var `CASE_STUDY_PASSWORD`.**

- [ ] **Step 5: Deploy portfolio.**

```bash
cd /Users/jay/00-Dev-jaymoore/jay-moore-design
npm run build
npx wrangler deploy
```

- [ ] **Step 6: Verify the deployed URL.** Visit `https://jaymoore.net/work/lead-response-loop`, enter password, walk through the simulator, check the metrics tiles render, click through to build-log.

- [ ] **Step 7: Send the URL to the first hiring manager.** Outreach message references the password verbally or via separate channel.

- [ ] **Step 8: Commit final state of both repos.** Tag a v1 release in each:

```bash
# portfolio
git tag v1.0-lead-response-loop-launch
git push --tags

# product
cd /Users/jay/00-Dev/auto-lead-response-loop
git tag v1.0
git push --tags
```

---

## Phase 5: Inter-repo contract CI gate (Day 14, ~1 hour)

Per spec §6: portfolio CI must run a smoke test against a staging deployment of the product on every PR. Schema-mismatch failure blocks the portfolio PR.

### Task 5.1: Smoke-test workflow

**Files (portfolio repo):**
- Create: `.github/workflows/contract-smoke.yml`
- Create: `scripts/contract-smoke.ts`

- [ ] **Step 1: Author the smoke test script.** Calls `/qualify` with a known input, validates output against the schema (using zod or hand-written validator). Same for `/metrics/public`.

- [ ] **Step 2: Wire into PR CI.** Fail if either response is missing the `X-Schema-Version: v1` header or fails validation.

- [ ] **Step 3: Commit.**

---

## Plan self-review checklist

After writing this plan, the author ran the following:

1. **Spec coverage** — every section of `process/2026-05-19-lead-response-loop-design.md` has at least one task:
   - §1 (context + repos) → Tasks 0.1–0.2, 1.1
   - §2 (case study shape) → Tasks 3.1, 4.1, 4.2
   - §3 (MVP scope + compliance) → Tasks 1.3–1.15, 1.8 (compliance specifically)
   - §4 (live demo) → Tasks 3.2, 3.3
   - §5 (architecture) → Tasks 1.1–1.15, 2.3, 2.4, 2.5, 4.3
   - §6 (inter-repo contract) → Task 5.1
   - §7 (build sequence) → Phase 1–4 daily structure mirrors the sequence
   - §8 (beta partner protocol) → Tasks 2.6, 2.7
   - §9 (what's left open) — addressed inline (prompt iteration in Task 2.2; Cal.com config in Task 1.14; eval composition in Task 2.1; etc.)

2. **Placeholder scan** — no "TBD"s in the plan body. Wrangler.jsonc has `TBD-after-d1-create` placeholders but those are intentional (real IDs come from running the create command).

3. **Type consistency** — `QualifierOutput`, `BusinessProfile`, `EvalRecord` referenced consistently across tasks. `SCHEMA_VERSION` constant referenced from `src/lib/contracts/qualifier-schema.ts` in every consumer.

---

## Execution choice

**Plan complete and saved to `process/2026-05-19-lead-response-loop.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — Fresh subagent per task, two-stage review between tasks, fast iteration. Best for a 14-day sprint with many independent units.

**2. Inline Execution** — Execute tasks in the current session with checkpoints. Slower per-task but lower coordination overhead.

**Which approach?**
