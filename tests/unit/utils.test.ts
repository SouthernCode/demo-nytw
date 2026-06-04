import { describe, it, expect } from "vitest";
import { cn, formatDate, initials } from "@/lib/utils";

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });

  it("lets later Tailwind classes win on conflict (twMerge)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });
});

describe("formatDate", () => {
  it("returns an em dash for empty values", () => {
    expect(formatDate(null)).toBe("—");
    expect(formatDate(undefined)).toBe("—");
    expect(formatDate("")).toBe("—");
  });

  it("formats a Date as 'Mon D, YYYY' (en-US)", () => {
    // Constructed via local-time fields to avoid timezone drift in the test.
    expect(formatDate(new Date(2026, 5, 4))).toBe("Jun 4, 2026");
  });

  it("accepts ISO date strings", () => {
    const out = formatDate("2026-06-04T12:00:00.000Z");
    expect(out).toMatch(/Jun \d{1,2}, 2026/);
  });
});

describe("initials", () => {
  it("takes the first letter of the first two words, uppercased", () => {
    expect(initials("Ada Lovelace")).toBe("AL");
    expect(initials("grace brewster hopper")).toBe("GB");
  });

  it("handles a single name", () => {
    expect(initials("madonna")).toBe("M");
  });

  it("collapses extra whitespace", () => {
    expect(initials("   ada   lovelace   ")).toBe("AL");
  });

  it("returns the fallback for empty input", () => {
    expect(initials(null)).toBe("?");
    expect(initials(undefined)).toBe("?");
    expect(initials("", "NA")).toBe("NA");
  });
});
