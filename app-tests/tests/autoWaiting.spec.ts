import {test, expect} from '@playwright/test'

test.beforeEach(async({page}, testInfo) => {
    await page.goto('http://uitestingplayground.com/ajax')
    await page.getByText('Button Triggering AJAX Request').click()
    testInfo.setTimeout(testInfo.timeout + 2000) // adds 2 seconds to default timeout for each test
})

test('auto waiting', async({page}) => {
    const successButton = page.locator('.bg-success')

    // await successButton.click()

    // const text = await successButton.textContent()
    // await successButton.waitFor({state: 'attached'})
    // const text = await successButton.allTextContents()
    // expect(text).toContain('Data loaded with AJAX get request.')

    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})
})

test('alternative waits', async({page}) => {
    const successButton = page.locator('.bg-success')

    // ___ wait for element
    // await page.waitForSelector('.bg-success')

    // ___ wait for particular response
    // await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    // __ wait for network calls to be completed ('NOT RECOMMENDED')
    await page.waitForLoadState('networkidle')

    // Others types of alternatives waits are avaiable for use

    const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')
})

test('timeouts', async ({page}) => {

    // test.setTimeout(10000) // Set a custom timeout for this test

    // test.slow() // Set the timeout for this test to 3× the value in .config

    const successButton = page.locator('.bg-success')
    await successButton.click() // click({timeout: 16000}): Set a custom timeout for this action
})