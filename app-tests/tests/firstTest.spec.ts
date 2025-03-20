import {test} from '@playwright/test'

// Hook usually used to execute some code before all the test, like a pre condition to the tests (Search in the database or something).
test.beforeAll(() => {
    // Code here
})

// Hook to execute code before each test. For example, the hook below navigates to the page and clicks the button that contains the specified text.
test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
})

/* Tests without a describe block work too.
test('the first test', async ({page}) => {
    await page.getByText('Form Layouts').click()
})

test('navigate o datepicker page', async ({page}) => {
    await page.getByText('Datepicker').click()
})
*/

// test.afterEach() and test.afterAll() are considered not good practice. They are similar to beforeEach and beforeAll, but they run code after the tests.

test.describe('suite 1', () => {

    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click()
    })

    test('navigate to \'Form Layouts\' page', async ({page}) => {
        await page.getByText('Form Layouts').click()
    })
    
    test('navigate to \'Datepicker\' page', async ({page}) => {
        await page.getByText('Datepicker').click()
    })
})

test.describe('suite 2', () => {

    test.beforeEach(async({page}) => {
        await page.getByText('Charts', {exact: true}).click()
    })

    test('navigate to \'Echarts\' page', async ({page}) => {
        await page.getByText('Echarts').click()
    })
})

/*
Example of test structure

// single test
test('the first test', () => {

})

// Multiple test of the same context
test.describe('test suite 1', () => {

    test('the first test', () => {

    })

    test('the first test', () => {

    })

})

test.describe('test suite 1', () => {

    test('the first test', () => {

    })

    test('the first test', () => {

    })

    test('the first test', () => {

    })

})

*/