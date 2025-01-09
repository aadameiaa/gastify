import { StatusCodes } from 'http-status-codes'
import { Page, Response } from 'playwright'

import {
	NATIONALITY_ID_VERIFICATION_ENDPOINT,
	NATIONALITY_ID_VERIFICATION_PAGE_URL,
	VERIFY_NATIONALITY_ID_REQUEST_TIMEOUT,
} from '../lib/constants'
import { parseResponseToCustomerRecord } from '../lib/dto'
import { Customer } from '../models/customer'

export class NationalityIdVerificationPage {
	private readonly url: string = NATIONALITY_ID_VERIFICATION_PAGE_URL
	private readonly page: Page

	constructor(page: Page) {
		this.page = page
	}

	public async navigate() {
		await this.page.goto(this.url)
	}

	public async waitForURL() {
		await this.page.waitForURL(this.url)
	}

	public async verify(nationalityId: string): Promise<Customer> {
		const responsePromise = this.waitForResponse(nationalityId)
		await this.fillForm(nationalityId)
		await this.submitForm()
		const response = await responsePromise

		if (!response.ok()) {
			throw new Error(response.status().toString())
		}

		const customerRecord = await parseResponseToCustomerRecord(
			response,
			nationalityId
		)
		const customer = new Customer(customerRecord)

		return customer
	}

	private async waitForResponse(nationalityId: string): Promise<Response> {
		return await this.page.waitForResponse(
			(response) =>
				response.request().method() === 'GET' &&
				response.url() ===
					`${NATIONALITY_ID_VERIFICATION_ENDPOINT}/nationalityId=${nationalityId}`
		)
	}

	private async fillForm(nationalityId: string) {
		await this.page
			.getByPlaceholder('Masukkan 16 digit NIK KTP Pelanggan')
			.fill(nationalityId)
		await this.page
			.getByPlaceholder('Masukkan 16 digit NIK KTP Pelanggan')
			.press('Escape')
	}

	private async submitForm() {
		await this.page.getByRole('button', { name: 'Cek' }).click()
	}

	public async logout() {
		await this.page.getByTestId('btnLogout').click()
		await this.page
			.getByRole('dialog')
			.getByRole('button', { name: 'Keluar' })
			.click()
	}

	public async closeAnnouncementModal() {
		await this.page.locator('[data-testid^="btnClose"]').click()
	}

	public async handleVerifyError(status: StatusCodes) {
		switch (status) {
			case StatusCodes.NOT_FOUND:
				await this.closeNationalityIdRegistrationModal()
			case StatusCodes.TOO_MANY_REQUESTS:
				await this.page.waitForTimeout(VERIFY_NATIONALITY_ID_REQUEST_TIMEOUT)
		}
	}

	private async closeNationalityIdRegistrationModal() {
		await this.page.getByRole('dialog').getByTestId('btnModalBack').click()
	}

	public async closeModals(customer: Customer) {
		if (customer.hasOutdatedRecommendationLetter()) {
			return await this.closeUpdateCustomerModal()
		}

		if (customer.isMultipleTypes()) {
			return await this.closeChooseCustomerTypeModal()
		}
	}

	private async closeUpdateCustomerModal() {
		await this.page.getByRole('dialog').getByText('Kembali').click()
	}

	private async closeChooseCustomerTypeModal() {
		await this.page.getByRole('dialog').getByTestId('btnBack').click()
	}
}
