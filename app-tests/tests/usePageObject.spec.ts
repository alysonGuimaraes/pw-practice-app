import {test, expect} from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
})


test('navigate to form page', async ({page}) => {
    const pm = new PageManager(page)

    await pm.toNavigationPage().formLayoutsPage()
    await pm.toNavigationPage().datePickerPage()
    await pm.toNavigationPage().smartTablePage()
    await pm.toNavigationPage().toastrPage()
    await pm.toNavigationPage().tooltipPage()
})


test('parametrized methods', async({page}) => {
    const pm = new PageManager(page)

    await pm.toNavigationPage().formLayoutsPage()
    await pm.toFormLayoutPage().submitUsingTheGridFormWithCredentialsAndSelectOption('test@test.com', 'test123', 'Option 1')
    await pm.toFormLayoutPage().submitInlineFormWithNameAndCheckbox('John Smith', 'John@test.com', false)

    await pm.toNavigationPage().datePickerPage()
    await pm.toDatepickerPage().selectCommonPickerDateFromToday(1)
    await pm.toDatepickerPage().selectDatepickerWithRangeFromToday(2, 54)
})