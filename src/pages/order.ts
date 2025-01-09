import { Page } from 'playwright'

export class OrderPage {
	private readonly page: Page

	constructor(page: Page) {
		this.page = page
	}

	public async waitForURL() {
		await this.page.waitForURL('**/sale?orderPage=true')
	}

	public async submitForm() {
		await this.page.getByRole('button', { name: 'Proses Transaksi' }).click()
	}
}
