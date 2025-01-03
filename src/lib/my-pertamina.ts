import { StatusCodes } from 'http-status-codes'
import { Page } from 'playwright'

import { Customer } from '../models/customer'
import { Profile } from '../models/profile'
import {
	LOGIN_URL,
	MY_PERTAMINA_DELAY,
	PROFILE_ENDPOINT,
	PROFILE_URL,
	VERIFY_NATIONALITY_ID_ENDPOINT,
	VERIFY_NATIONALITY_ID_URL,
} from './constants'
import { parseResponseToCustomerData, parseResponseToProfileData } from './dto'
import { readJSONFile, writeJSONFile } from './file'
import {
	convertCustomersToCustomerDataList,
	getEligibleCustomers,
	getUniqueNationalityIds,
} from './helpers'
import { delay } from './utils'

export async function getProfile(
	page: Page,
	{ phoneNumber, pin }: { phoneNumber: string; pin: string }
) {
	await gotoLoginPage(page)
	await fillLoginForm(page, { phoneNumber, pin })
	await submitLoginForm(page)
	await closeAnnouncementModal(page)
	await gotoProfilePage(page)

	const profile = await fetchProfile(page)

	writeJSONFile(profile.data(), 'profile.json')

	await gotoNationalityVerificationPage(page)
	await logout(page)
}

export async function verifyNationalityIds(
	page: Page,
	{
		phoneNumber,
		pin,
		nationalityIdsPath,
	}: { phoneNumber: string; pin: string; nationalityIdsPath: string }
) {
	await gotoLoginPage(page)
	await fillLoginForm(page, { phoneNumber, pin })
	await submitLoginForm(page)
	await closeAnnouncementModal(page)

	const nationalityIds = readJSONFile(nationalityIdsPath) as string[]
	const uniqueNationalityIds = getUniqueNationalityIds(nationalityIds)

	const customers = await processNationalityIds(page, uniqueNationalityIds)
	const eligibleCustomers = getEligibleCustomers(customers)

	writeJSONFile(convertCustomersToCustomerDataList(customers), 'customers.json')
	writeJSONFile(
		convertCustomersToCustomerDataList(eligibleCustomers),
		'eligible-customers.json'
	)

	await logout(page)
}

async function gotoLoginPage(page: Page) {
	await page.goto(LOGIN_URL, { waitUntil: 'networkidle' })
}

async function gotoProfilePage(page: Page) {
	await page.goto(PROFILE_URL)
}

async function gotoNationalityVerificationPage(page: Page) {
	await page.goto(VERIFY_NATIONALITY_ID_URL)
}

async function fillLoginForm(
	page: Page,
	{ phoneNumber, pin }: { phoneNumber: string; pin: string }
) {
	await page.getByPlaceholder('Email atau No. Handphone').fill(phoneNumber)
	await page.getByPlaceholder('PIN (6-digit)').fill(pin)
}

async function submitLoginForm(page: Page) {
	await page.getByText('Masuk').click()
}

async function fetchProfile(page: Page): Promise<Profile> {
	const response = await waitForProfileResponse(page)

	const profileData = await parseResponseToProfileData(response)
	const profile = new Profile(profileData)

	return profile
}

async function processNationalityIds(
	page: Page,
	nationalityIds: string[]
): Promise<Customer[]> {
	const customers: Customer[] = []

	for (let index = 0; index < nationalityIds.length; index++) {
		const data = await processSingleNationalityId(page, nationalityIds[index])

		if (data instanceof Customer) {
			customers.push(data)
		} else {
			if (data === StatusCodes.TOO_MANY_REQUESTS) {
				index--
			}
		}
	}

	return customers
}

async function processSingleNationalityId(
	page: Page,
	nationalityId: string
): Promise<Customer | StatusCodes> {
	await fillVerifyNikForm(page, nationalityId)
	return await submitVerifyNikForm(page, nationalityId)
}

async function fillVerifyNikForm(page: Page, nationalityId: string) {
	await page
		.getByPlaceholder('Masukkan 16 digit NIK KTP Pelanggan')
		.fill(nationalityId)
	await page
		.getByPlaceholder('Masukkan 16 digit NIK KTP Pelanggan')
		.press('Escape')
}

async function submitVerifyNikForm(
	page: Page,
	nationalityId: string
): Promise<Customer | StatusCodes> {
	await triggerNationalityIdVerification(page)

	const response = await waitForNationalityIdResponse(page, nationalityId)
	if (!response.ok()) {
		return handleNationalityIdVerificationError(page, response.status())
	}

	const customerData = await parseResponseToCustomerData(
		response,
		nationalityId
	)
	const customer = new Customer(customerData)

	await handleCustomerTypeModals(page, customer)

	return customer
}

async function triggerNationalityIdVerification(page: Page) {
	await page.getByTestId('btnCheckNik').click()
}

async function waitForProfileResponse(page: Page) {
	return page.waitForResponse(
		(response) =>
			response.request().method() === 'GET' &&
			response.url() === PROFILE_ENDPOINT
	)
}

async function waitForNationalityIdResponse(page: Page, nationalityId: string) {
	return await page.waitForResponse(
		(response) =>
			response.request().method() === 'GET' &&
			response.url() ===
				`${VERIFY_NATIONALITY_ID_ENDPOINT}?nationalityId=${nationalityId}`
	)
}

async function handleNationalityIdVerificationError(
	page: Page,
	status: StatusCodes
) {
	switch (status) {
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

async function handleCustomerTypeModals(
	page: Page,
	customer: Customer
): Promise<void> {
	if (customer.hasOutdatedRecommendationLetter()) {
		return await closeUpdateCustomerDataModal(page)
	}

	if (customer.isMultipleTypes()) {
		return await closeChooseCustomerTypeModal(page)
	}

	// return await page.getByTestId('btnChangeBuyer').click()
	return await gotoNationalityVerificationPage(page)
}

async function closeAnnouncementModal(page: Page) {
	await page.locator('[data-testid^="btnClose"]').click()
}

async function closeNIKRegistrationModal(page: Page) {
	await page.getByRole('dialog').getByTestId('btnModalBack').click()
}

async function closeChooseCustomerTypeModal(page: Page) {
	await page.getByRole('dialog').getByTestId('btnBack').click()
}

async function closeUpdateCustomerDataModal(page: Page) {
	await page.getByRole('dialog').getByText('Kembali').click()
}

async function logout(page: Page) {
	await page.getByTestId('btnLogout').click()
	await page.getByRole('dialog').getByTestId('btnLogout').click()
}
