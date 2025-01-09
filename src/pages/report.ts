import { Page } from 'playwright'

import { REPORT_ENDPOINT, REPORT_PAGE_URL } from '../lib/constants'
import { parseResponseToReportRecord } from '../lib/dto'
import type { Dates } from '../lib/types'
import { Report } from '../models/report'

export class ReportPage {
	private readonly url: string = REPORT_PAGE_URL
	private readonly page: Page

	constructor(page: Page) {
		this.page = page
	}

	public async navigate(dates: Dates) {
		await this.page.goto(
			`${this.url}?startDate=${dates.started}&endDate=${dates.ended}`
		)
	}

	public async fetch(dates: Dates): Promise<Report> {
		const response = await this.waitForResponse(dates)
		const reportRecord = await parseResponseToReportRecord(response)
		const report = new Report(reportRecord)

		return report
	}

	private async waitForResponse(dates: Dates) {
		return await this.page.waitForResponse(
			(response) =>
				response.request().method() === 'GET' &&
				response.url() ===
					`${REPORT_ENDPOINT}?startDate=${dates.started}&endDate=${dates.ended}`
		)
	}
}
