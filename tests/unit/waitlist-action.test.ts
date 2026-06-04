import { describe, it, expect, vi, beforeEach } from "vitest";

// Capture what the server action tries to insert into Supabase. `vi.hoisted`
// runs before the `vi.mock` factory below, so the spy exists when it is wired.
const { insertMock } = vi.hoisted(() => ({ insertMock: vi.fn() }));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    from: vi.fn(() => ({ insert: insertMock })),
  })),
}));

import { submitWaitlist } from "@/app/waitlist/actions";

function form(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) fd.append(key, value);
  return fd;
}

beforeEach(() => {
  insertMock.mockReset();
  insertMock.mockResolvedValue({ error: null });
});

describe("submitWaitlist — validation", () => {
  it("rejects a missing email without touching the database", async () => {
    const result = await submitWaitlist(undefined, form({ name: "Ada" }));
    expect(result).toEqual({ error: expect.stringContaining("valid email") });
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("rejects an email with no @ sign", async () => {
    const result = await submitWaitlist(undefined, form({ email: "not-an-email" }));
    expect(result?.error).toBeTruthy();
    expect(insertMock).not.toHaveBeenCalled();
  });
});

describe("submitWaitlist — happy path", () => {
  it("stores a submission and reports success", async () => {
    const result = await submitWaitlist(
      undefined,
      form({
        email: "founder@startup.com",
        name: "Ada Lovelace",
        company: "Analytical Engines",
        building: "An AI pair programmer",
        referral: "Twitter",
      })
    );

    expect(result).toEqual({ ok: true });
    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(insertMock).toHaveBeenCalledWith({
      email: "founder@startup.com",
      name: "Ada Lovelace",
      company: "Analytical Engines",
      building: "An AI pair programmer",
      referral: "Twitter",
    });
  });

  it("normalizes empty optional fields to null", async () => {
    await submitWaitlist(undefined, form({ email: "solo@startup.com" }));
    expect(insertMock).toHaveBeenCalledWith({
      email: "solo@startup.com",
      name: null,
      company: null,
      building: null,
      referral: null,
    });
  });

  it("trims surrounding whitespace from the email", async () => {
    await submitWaitlist(undefined, form({ email: "  spaced@startup.com  " }));
    expect(insertMock.mock.calls[0][0].email).toBe("spaced@startup.com");
  });

  it("returns a generic error when the insert fails", async () => {
    insertMock.mockResolvedValueOnce({ error: { message: "db down" } });
    const result = await submitWaitlist(undefined, form({ email: "x@y.com" }));
    expect(result?.error).toBeTruthy();
    expect(result?.ok).toBeUndefined();
  });
});

describe("submitWaitlist — documented workshop gap", () => {
  // This is intentionally a CHARACTERIZATION test: it documents the current
  // (unsafe) behavior so the workshop can later harden it. The free-text
  // "building" field is persisted verbatim — no sanitization, no encoding —
  // which is what enables the stored-XSS demo on the waitlist admin view.
  it("persists HTML in the 'building' field verbatim (no sanitization yet)", async () => {
    const payload = '<img src=x onerror="alert(1)">';
    await submitWaitlist(undefined, form({ email: "attacker@evil.com", building: payload }));
    expect(insertMock.mock.calls[0][0].building).toBe(payload);
  });
});
