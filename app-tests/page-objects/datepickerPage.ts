import { Page, expect } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class DatepickerPage extends HelperBase {

    constructor (page: Page) {
        super(page)
    }


    async selectCommonPickerDateFromToday(numberOfDaysFromToday: number) {

        const calendarInputField = this.page.getByPlaceholder('Form Picker')
        await calendarInputField.click()

        const dateToAssert = await this.selectDateInTheCalendar(numberOfDaysFromToday)

        await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    async selectDatepickerWithRangeFromToday(startDayFromToday: number, endDayFromToday: number) {
        const calendarInputField = this.page.getByPlaceholder('Range Picker')
        await calendarInputField.click()
        const dateToAssertStart = await this.selectDateInTheCalendar(startDayFromToday)
        const dateToAssertEnd = await this.selectDateInTheCalendar(endDayFromToday)

        const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`
        await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    private async selectDateInTheCalendar(numberOfDaysFromToday: number) {
        let date = new Date()
        date.setDate(date.getDate() + numberOfDaysFromToday)
        const expectedDate = date.getDate().toString()
        const monthShort = date.toLocaleString('En-US', { month: 'short' })
        const monthLong = date.toLocaleString('En-US', { month: 'long' })
        const year = date.getFullYear().toString()

        const dateToAssert = `${monthShort} ${expectedDate}, ${year}`

        let calendarMonthYear = await this.page.locator('nb-calendar-view-mode').textContent()
        const expectedMonthYear = ` ${monthLong} ${year} `

        while (calendarMonthYear != expectedMonthYear) {
            await this.page.locator(`nb-calendar-pageable-navigation [data-name="chevron-right"]`).click()

            calendarMonthYear = await this.page.locator('nb-calendar-view-mode').textContent()
        }

        //console.log(expectedDate)

        await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, { exact: true }).first( ).click()

        return dateToAssert
    }
}