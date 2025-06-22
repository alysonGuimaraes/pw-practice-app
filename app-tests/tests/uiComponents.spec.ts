import {test, expect} from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
})

test.describe('Form Layouts page', () => {
    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('input fields', async({page}) => {
        const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: 'Email'})

        await usingTheGridEmailInput.fill('test.test@test.com.br')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test.123@test.com.br', {delay: 500})

        // generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('test.123@test.com.br')

        // locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test.123@test.com.br')
    })

    test('radio buttons', async({page}) => {
        const usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"})

        // await usingTheGridForm.getByLabel('Option 1').check({force: true})
        await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).check({force: true})

        const radioStatus = await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).isChecked()
        expect(radioStatus).toBeTruthy()

        await expect(usingTheGridForm.getByRole('radio', {name: 'Option 1'})).toBeChecked()


        await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).check({force: true})
        await expect(usingTheGridForm.getByRole('radio', {name: 'Option 1'})).toBeChecked({checked: false})
        await expect(usingTheGridForm.getByRole('radio', {name: 'Option 2'})).toBeChecked({checked: true})
    })
})


test.describe('Modal & Overlays page', () => {
    test.beforeEach(async({page}) => {
        await page.getByText('Modal & Overlays').click()
    })

    test('Checkboxes', async({page}) => {
        await page.getByText('Toastr').click()

        await page.getByRole('checkbox', {name: 'Hide on click'}).click({force:true}) // It will click the checkbox. If it is already checked, it will uncheck it. Doesn't validate the status of the checkbox

        // Validate the checkbox status before performing an action.
        await page.getByRole('checkbox', {name: 'Prevent arising of duplicate toast'}).check({force:true}) 
        await page.getByRole('checkbox', {name: 'Show toast with icon'}).uncheck({force:true}) 

        const allBoxes = page.getByRole('checkbox')
        for (const box of await allBoxes.all()){
            await box.check({force:true})
            expect(await box.isChecked()).toBeTruthy()
        }
    })

    test('Tooltips', async({page}) => {
        await page.getByText('Tooltip').click()

        const toolTipCard = page.locator('nb-card', {hasText: 'Tooltip Placements'})

        await toolTipCard.getByRole('button', {name: 'Top'}).hover()
        page.getByRole('tooltip') // if you have a role tooltip created

        const tooltip = await page.locator('nb-tooltip').textContent()
        expect(page.locator('nb-tooltip', {hasText: 'This is a tooltip'})).toBeVisible()
        expect(tooltip).toEqual('This is a tooltip')
    })
})


test.describe('Home page', () => {
    test('Lists and Dropdowns', async({page}) => {
        const dropDownMenu = page.locator('ngx-header nb-select')
        await dropDownMenu.click()

        page.getByRole('list') // When the list has a UL tag
        page.getByRole('listitem') // When the list has LI tag

        const optionList = page.getByRole('list').locator('nb-option')
        // const optionList = page.locator('nb-option-list nb-option')

        await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
        await optionList.filter({hasText: "Dark"}).click()
        const header = page.locator('nb-layout-header')
        await expect(header).toHaveCSS('background-color', 'rgb(34, 43, 69)')

        const bgColors = {
            "Light": "rgb(255, 255, 255)",
            "Dark": "rgb(34, 43, 69)",
            "Cosmic": "rgb(50, 50, 89)",
            "Corporate": "rgb(255, 255, 255)"
        }

        for (const [theme, rgb] of Object.entries(bgColors)) {
            await dropDownMenu.click()
            await optionList.filter({hasText: theme}).click()
            await expect(header).toHaveCSS('background-color', `${rgb}`)
        }
    })
})


test.describe('Tables & Data page', () => {
    test.beforeEach(async({page}) => {
        await page.getByText('Tables & Data').click()
    })

    test('Dialog Boxes', async({page}) => {
        await page.getByText('Smart Table').click()

        // Add a listener to the dialog box to override the default cancel action in Playwright.
        page.on('dialog', dialog => {
            expect(dialog.message()).toEqual('Are you sure you want to delete?')
            dialog.accept()
        })

        const tableRow =  page.getByRole('table').locator('tr', {hasText: /\S+@\S+\.\S+/}).first()
        const email = await tableRow.locator('td', {hasText: /\S+@\S+\.\S+/}).textContent();

        await tableRow.locator('.nb-trash').click()

        await expect(page.getByRole('table').locator('tr', {hasText: /\S+@\S+\.\S+/}).first()).not.toHaveText(email)
    })

    test('Web Tables', async({page}) => {
        await page.getByText('Smart Table').click()

        // 1 - Get the row by any test in this row
        const targetRow =  page.getByRole('row', {name: "twitter@outlook.com"})

        await targetRow.locator('.nb-edit').click()
        await page.locator('input-editor').getByPlaceholder('Age').clear()
        await page.locator('input-editor').getByPlaceholder('Age').fill('35')
        await page.locator('.nb-checkmark').click()

        await expect(targetRow.locator('td').last()).toHaveText('35')


        // 2 - Get the row based on the value in the specific column

        await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
        const targetRowById = page.getByRole('row', {name: '11'}).filter({has: page.locator('td').nth(1).getByText('11')})
        await targetRowById.locator('.nb-edit').click()
        await page.locator('input-editor').getByPlaceholder('E-mail').clear()
        await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
        await page.locator('.nb-checkmark').click()

        await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')


        // 3 - Test filter of the table

        const ages = ["20", "30", "40", "200"]

        for (let age of ages) {
            await page.locator('input-filter').getByPlaceholder('Age').clear()
            await page.locator('input-filter').getByPlaceholder('Age').fill(age)
            await page.waitForTimeout(500)

            const ageRows = await page.locator('tbody tr').all()

            for (let row of ageRows){
                const cellValue = await row.locator('td').last().textContent()

                if (age == '200') {
                    expect(await page.getByRole('table').textContent()).toContain('No data found')
                } else {
                    expect(cellValue).toEqual(age)
                }                
            }
        }
    })
})