import {test} from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

test('Locator sintax rules', async({page}) => {
    // by Tag name
    page.locator('input')

    // by ID
    await page.locator('#inputEmail1').click()

    // by class
    page.locator('.shape-rectangle')

    // by attribute
    page.locator('[placeholder="Email"]')

    // by Class value
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    // Combine different selectors
    page.locator('input[placeholder="Email"].shape-rectangle[nbinput]')

    // by XPATH (NOT RECOMMENDED)
    page.locator('///*[@id="inputEmail1"]')

    // by partial text match
    page.locator(':text("Using")')

    // by exact text match
    page.locator(':text-is("USing the Grid")')
})