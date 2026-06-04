import test from "node:test";
import assert from "node:assert/strict";

// Placeholder smoke test.
//
// QA is intentionally thin in this starting branch: there is no Playwright
// end-to-end coverage and no component/integration tests yet. This single
// sanity check just proves the test runner is wired up. Building an
// evidence-based QA suite (auth flows, RLS isolation, waitlist, XSS handling)
// is a later workshop exercise.
test("sanity: the test runner is wired up", () => {
  assert.equal(1 + 1, 2);
});
