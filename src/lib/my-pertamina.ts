import { StatusCodes } from 'http-status-codes'
import { Page } from 'playwright'

import {
	MY_PERTAMINA_DELAY,
	PHONE_NUMBER,
	PIN,
	VERIFY_NIK_ENDPOINT,
} from './constants'
import { delay } from './utils'

export async function fillLoginForm(page: Page) {
	await page.getByPlaceholder('Email atau No. Handphone').fill(PHONE_NUMBER)
	await page.getByPlaceholder('PIN (6-digit)').fill(PIN)
}

export async function submitLoginForm(page: Page) {
	await page.getByText('Masuk').click()
}

export async function closeAnnouncementModal(page: Page) {
	await page.locator('[data-testid^="btnClose"]').click()
}

export async function closeNIKRegistrationModal(page: Page) {
	await page.getByRole('dialog').getByTestId('btnModalBack').click()
}

export async function closeChooseCustomerTypeModal(page: Page) {
	await page.getByRole('dialog').getByTestId('btnBack').click()
}

export async function closeUpdateCustomerDataModal(page: Page) {
	await page.getByRole('dialog').getByText('Kembali').click()
}

export async function fillVerifyNikForm(page: Page, nationalityId: string) {
	await page
		.getByPlaceholder('Masukkan 16 digit NIK KTP Pelanggan')
		.fill(nationalityId)
}

export async function resetVerifyNikForm(page: Page) {
	await page.getByPlaceholder('Masukkan 16 digit NIK KTP Pelanggan').fill('A')
	await page
		.getByPlaceholder('Masukkan 16 digit NIK KTP Pelanggan')
		.press('Backspace')
}

export async function submitVerifyNikForm(page: Page, nationalityId: string) {
	await page.getByTestId('btnCheckNik').click()

	const response = await page.waitForResponse(
		(response) =>
			response.request().method() === 'GET' &&
			response.url() === `${VERIFY_NIK_ENDPOINT}?nationalityId=${nationalityId}`
	)

	if (!response.ok()) {
		switch (response.status()) {
			case StatusCodes.NOT_FOUND:
				await closeNIKRegistrationModal(page)
				return StatusCodes.NOT_FOUND
			case StatusCodes.TOO_MANY_REQUESTS:
				await delay(MY_PERTAMINA_DELAY)
				return StatusCodes.TOO_MANY_REQUESTS
			default:
				return StatusCodes.INTERNAL_SERVER_ERROR
		}
	}

	const body = await response.json()

	const customer = {
		nationalityId,
		name: body.data.name,
		customerTypes: body.data.customerTypes.map(
			(customerType: any) => customerType.name
		),
		quota: body.data.quotaRemaining,
	}

	const isMultipleCustomerTypes = body.data.customerTypes.length > 1
	const outDatedMicroBusinessRecommendationLetter =
		Boolean(
			body.data.customerTypes.find(
				(customerType: any) => customerType.name === 'Usaha Mikro'
			)
		) && !body.data.isRecommendationLetter

	if (outDatedMicroBusinessRecommendationLetter) {
		await closeUpdateCustomerDataModal(page)
	} else if (isMultipleCustomerTypes) {
		await closeChooseCustomerTypeModal(page)
	} else {
		await page.getByTestId('btnChangeBuyer').click()
	}

	return customer
}

export async function logout(page: Page) {
	await page.getByTestId('btnLogout').click()
	await page.getByRole('dialog').getByTestId('btnLogout').click()
}
