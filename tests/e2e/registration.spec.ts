import { test, expect } from "@playwright/test";

/**
 * Registration happy path.
 *
 * Exercises the real stack: Next.js server action -> Supabase Auth signUp ->
 * the `handle_new_user` trigger (which creates a profile + default org) ->
 * middleware session -> dashboard render.
 *
 * Requires the local Supabase stack running and .env.local configured. Email
 * confirmation is disabled locally, so signUp returns an active session and
 * the app redirects straight to /dashboard.
 *
 * Note: each run creates a fresh auth user (unique email). Cleaning up test
 * users is a later workshop exercise (a global teardown using the service-role
 * key).
 */
test("a new founder can register and lands on the dashboard", async ({ page }) => {
  const email = `e2e+${Date.now()}@launchpad.test`;

  await page.goto("/register");

  await page.getByLabel("Full name").fill("E2E Founder");
  await page.getByLabel("Startup name").fill("E2E Labs");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("workshop-password-123");

  await page.getByRole("button", { name: "Create account" }).click();

  // The signup redirects to the authenticated dashboard.
  await expect(page).toHaveURL(/\/dashboard\/?$/);

  // The overview header proves the dashboard shell rendered for the new user.
  await expect(
    page.getByRole("heading", { name: "Overview", exact: true })
  ).toBeVisible();

  // The default organization created by the DB trigger shows the new user in.
  await expect(page.getByText(/Welcome back/i)).toBeVisible();
});
