import { Page } from 'playwright'

import { writeJSONFile } from '../lib/file'
import type { Credentials, Dates } from '../lib/types'
import { ReportPage } from '../pages/report'
import { performAuthenticatedAction } from './perform-authenticated-action'

export async function getReport(
	page: Page,
	credentials: Credentials,
	dates: Dates
) {
	const reportPage = new ReportPage(page)

	try {
		await performAuthenticatedAction(page, credentials, async () => {
			await reportPage.navigate(dates)
			const report = await reportPage.fetch(dates)

			writeJSONFile(
				report.toJSON(),
				`report-${dates.started}_to_${dates.ended}.json`
			)
		})
	} catch (error) {}
}
