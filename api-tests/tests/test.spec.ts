import test, { expect } from "@playwright/test";
import { tags, user } from "../test-data/tags.json"


test.beforeEach(async ({ page }) => {
  // '*/**/api/tags' also works
  await page.route('*/**/api/tags', async route => {
    await route.fulfill({
      body: JSON.stringify(tags)
    })
  })

  await page.goto('https://conduit.bondaracademy.com')
  await page.getByText('Sign in').click()
  await page.getByRole('textbox', {name: 'Email'}).fill(user.email)
  await page.getByRole('textbox', {name: 'Password'}).fill(user.password)
  await page.getByRole('button').click()
})

test('login test', async ({ page }) => {
    await expect(page.locator('.navbar-brand')).toHaveText('conduit');
})