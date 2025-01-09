import { Page } from 'playwright'

export class TransactionPage {
	private readonly page: Page

	constructor(page: Page) {
		this.page = page
	}

	public async waitForURL() {
		await this.page.waitForURL('**/sale/struk?transactionId*')
	}
}
