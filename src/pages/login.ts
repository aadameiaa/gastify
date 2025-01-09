import { Page } from 'playwright'

import { LOGIN_PAGE_URL } from '../lib/constants'
import { Credentials } from '../lib/types'

export class LoginPage {
	private readonly url: string = LOGIN_PAGE_URL
	private readonly page: Page

	constructor(page: Page) {
		this.page = page
	}

	public async navigate() {
		await this.page.goto(this.url, { waitUntil: 'networkidle' })
	}

	public async login(credentials: Credentials) {
		await this.fillForm(credentials)
		await this.submitForm()
	}

	private async fillForm({ phoneNumber, pin }: Credentials) {
		await this.page
			.getByPlaceholder('Email atau No. Handphone')
			.fill(phoneNumber)
		await this.page.getByPlaceholder('PIN (6-digit)').fill(pin)
	}

	private async submitForm() {
		await this.page.getByRole('button', { name: 'Masuk' }).click()
	}
}
