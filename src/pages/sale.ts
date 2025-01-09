import { Page } from 'playwright'

export class SalePage {
	private readonly page: Page

	constructor(page: Page) {
		this.page = page
	}

	public async waitForURL() {
		await this.page.waitForURL('**/sale', { waitUntil: 'networkidle' })
	}

	public async changeBuyer() {
		await this.page.getByTestId('btnChangeBuyer').click()
	}

	public async increaseOrderQuantity(quantity: number) {
		await this.page
			.getByTestId('actionIcon2')
			.click({ clickCount: quantity - 1, delay: 100 })
	}

	public async submitForm() {
		await this.page.getByRole('button', { name: 'Cek Pesanan' }).click()
	}

	public async closeBeyondReasonableLimitsModal() {
		await this.page
			.getByRole('dialog')
			.getByRole('button', { name: 'Oke' })
			.click()
	}
}
