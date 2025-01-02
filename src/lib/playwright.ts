import pw, { Browser, BrowserContext, Page } from 'playwright'

import { DEFAULT_TIMEOUT } from './constants'

export async function launchBrowser(): Promise<{
	browser: Browser
	context: BrowserContext
	page: Page
}> {
	const browser = await pw.chromium.launch({ headless: false })
	const context = await browser.newContext()
	const page = await browser.newPage()

	context.setDefaultTimeout(DEFAULT_TIMEOUT)

	return { browser, context, page }
}
