import { test, expect, request } from '@playwright/test';
import tags from '../test-data/tags.json'

test.beforeEach(async ({ page }) => {
  // '*/**/api/tags' also works
  await page.route('*/**/api/tags', async route => {
    await route.fulfill({
      body: JSON.stringify(tags)
    })
  })

  await page.goto('https://conduit.bondaracademy.com')
  await page.getByText('Sign in').click()
  await page.getByRole('textbox', {name: 'Email'}).fill("alyson.test@test.com")
  await page.getByRole('textbox', {name: 'Password'}).fill("test1234")
  await page.getByRole('button').click()
  await page.waitForTimeout(500)
})

test('has title', async ({ page }) => {
  await page.route('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', async route => {
    const response = await route.fetch()

    const bodyRes = await response.json()
    bodyRes.articles[0].title = "This is a MOCK test title"
    bodyRes.articles[0].description = "This is a MOCK description"

    await route.fulfill({
      body: JSON.stringify(bodyRes)
    })
  })
  
  await page.waitForTimeout(1000)
  await page.getByText('Global Feed').click()
  await expect(page.locator('.navbar-brand')).toHaveText('conduit');

  await expect(page.locator('app-article-list h1').first()).toContainText('This is a MOCK test title')
  await expect(page.locator('app-article-list p').first()).toContainText('This is a MOCK description')
});


test('delete article', async ({page, request}) => {
  const loginResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {
      "user": {
        "email": "alyson.test@test.com", 
        "password": "test1234"
      }
    }
  })

  const loginBody = await loginResponse.json()
  const loginToken = loginBody.user.token

  const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article": {
        "title": "Test title", 
        "description": "test description",
        "tagList": [
          "test"
        ],
        "body": "test body"
      }
    },
    headers: {
      Authorization: `Token ${loginToken}`
    }
  })

  expect(articleResponse.status()).toEqual(201)

  await page.getByText('Global Feed').click()
  await page.getByText('Test title').click()
  await page.getByRole('button', { name: "Delete Article" }).first().click()
  await page.getByText('Global Feed').click()

  // await expect(page.locator('app-article-list h1').first()).not.toContainText('Test title')
  // Create article URL: https://conduit-api.bondaracademy.com/api/articles/ - POST
  /* Payload da requisição
    {
      article: {
        title: "Test title", 
        description: "test description",
        tagList: [
          "test"
        ],
        body: "testtesttesttesttesttesttesttesttesttest"
      }
    }
  */

  // Login URL: https://conduit-api.bondaracademy.com/api/users/login - POST
  /* Payload da requisição
    {
      user: {
        email: "alyson.test@test.com", 
        password: "test1234"
      }
    }
  */


  // delete article URL: https://conduit-api.bondaracademy.com/api/articles/Test-title-29810 - DELETE

})
