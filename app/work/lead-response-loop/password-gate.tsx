"use client";

import { useActionState } from "react";
import { unlockCaseStudy, type UnlockState } from "./actions";

const INITIAL_STATE: UnlockState = { ok: false };

export function PasswordGate() {
  const [state, formAction, isPending] = useActionState(
    unlockCaseStudy,
    INITIAL_STATE,
  );

  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-[480px] flex-col justify-center px-6 py-24">
      <p className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
        Case study · access required
      </p>
      <h1 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-tight text-fg sm:text-4xl">
        Lead Response Loop.
      </h1>
      <p className="mt-6 text-base text-fg-soft">
        Private case study. Enter the password shared with you to continue.
      </p>

      <form action={formAction} className="mt-8 flex flex-col gap-3">
        <label htmlFor="case-study-password" className="sr-only">
          Password
        </label>
        <input
          type="password"
          id="case-study-password"
          name="password"
          autoComplete="current-password"
          autoFocus
          required
          placeholder="Password"
          aria-invalid={state.error ? "true" : undefined}
          aria-describedby={state.error ? "case-study-password-error" : undefined}
          className="rounded-sm border border-line bg-bg px-3 py-2 text-sm text-fg placeholder:text-fg-faint focus:outline-none focus-visible:border-accent"
        />
        {state.error && (
          <p
            id="case-study-password-error"
            role="alert"
            className="font-mono text-2xs font-medium uppercase tracking-wider text-fg"
          >
            {state.error}
          </p>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-1 rounded-sm bg-accent px-4 py-2 font-mono text-2xs uppercase tracking-wider text-selection-fg transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Unlocking" : "Unlock"}
          <span aria-hidden>→</span>
        </button>
      </form>

      <p className="mt-8 font-mono text-2xs text-fg-faint">
        Need access?{" "}
        <a
          href="mailto:jay@jaymoore.net"
          className="text-accent transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:text-accent-deep"
        >
          Email for the password
        </a>
        .
      </p>
    </section>
  );
}
