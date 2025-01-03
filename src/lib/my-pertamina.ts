import { StatusCodes } from 'http-status-codes'
import { Page } from 'playwright'

import { Customer } from '../models/customer'
import { Product } from '../models/product'
import { Profile } from '../models/profile'
import { Report } from '../models/report'
import {
	LOGIN_URL,
	MY_PERTAMINA_DELAY,
	PRODUCT_ENDPOINT,
	PRODUCT_URL,
	PROFILE_ENDPOINT,
	PROFILE_URL,
	REPORT_ENDPOINT,
	REPORT_URL,
	VERIFY_NATIONALITY_ID_ENDPOINT,
	VERIFY_NATIONALITY_ID_URL,
} from './constants'
import {
	parseResponseToCustomerData,
	parseResponseToProductData,
	parseResponseToProfileData,
	parseResponseToReportData,
} from './dto'
import { readJSONFile, writeJSONFile } from './file'
import {
	convertCustomersToCustomerDataList,
	getEligibleCustomers,
	getUniqueNationalityIds,
} from './helpers'
import { Credentials, Dates } from './types'
import { delay } from './utils'

export async function getProfile(page: Page, credentials: Credentials) {
	await performAuthenticatedAction(page, credentials, async () => {
		await gotoProfilePage(page)

		const profile = await fetchProfile(page)

		writeJSONFile(profile.toJSON(), 'profile.json')
	})
}

async function fetchProfile(page: Page): Promise<Profile> {
	const response = await waitForProfileResponse(page)
	const profileData = await parseResponseToProfileData(response)
	const profile = new Profile(profileData)

	return profile
}

async function waitForProfileResponse(page: Page) {
	return page.waitForResponse(
		(response) =>
			response.request().method() === 'GET' &&
			response.url() === PROFILE_ENDPOINT
	)
}

export async function getProduct(page: Page, credentials: Credentials) {
	await performAuthenticatedAction(page, credentials, async () => {
		await gotoProductPage(page)

		const product = await fetchProduct(page)

		writeJSONFile(product.toJSON(), 'product.json')
	})
}

async function fetchProduct(page: Page): Promise<Product> {
	const response = await waitForProductResponse(page)
	const productData = await parseResponseToProductData(response)
	const product = new Product(productData)

	return product
}

async function waitForProductResponse(page: Page) {
	return page.waitForResponse(
		(response) =>
			response.request().method() === 'GET' &&
			response.url() === PRODUCT_ENDPOINT
	)
}

export async function getReport(
	page: Page,
	credentials: Credentials,
	dates: Dates
) {
	await performAuthenticatedAction(page, credentials, async () => {
		await gotoReportPage(page, dates)

		const report = await fetchReport(page, dates)

		writeJSONFile(
			report.toJSON(),
			`report-${dates.started}_to_${dates.ended}.json`
		)
	})
}

async function fetchReport(page: Page, dates: Dates): Promise<Report> {
	const response = await waitForReportResponse(page, dates)
	const reportData = await parseResponseToReportData(response)
	const report = new Report(reportData)

	return report
}

async function waitForReportResponse(page: Page, dates: Dates) {
	return page.waitForResponse(
		(response) =>
			response.request().method() === 'GET' &&
			response.url() ===
				`${REPORT_ENDPOINT}?startDate=${dates.started}&endDate=${dates.ended}`
	)
}

export async function verifyNationalityIds(
	page: Page,
	credentials: Credentials,
	nationalityIdsPath: string
) {
	await performAuthenticatedAction(page, credentials, async () => {
		const nationalityIds = readJSONFile(nationalityIdsPath) as string[]
		const uniqueNationalityIds = getUniqueNationalityIds(nationalityIds)

		const customers = await processNationalityIds(
			page,
			uniqueNationalityIds.slice(0, 20)
		)
		writeJSONFile(
			convertCustomersToCustomerDataList(customers),
			'customers.json'
		)

		const eligibleCustomers = getEligibleCustomers(customers)
		writeJSONFile(
			convertCustomersToCustomerDataList(eligibleCustomers),
			'eligible-customers.json'
		)
	})
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

	return await gotoNationalityVerificationPage(page)
}

async function performAuthenticatedAction(
	page: Page,
	credentials: Credentials,
	action: () => Promise<void>
) {
	await gotoLoginPage(page)
	await fillLoginForm(page, credentials)
	await submitLoginForm(page)
	await closeAnnouncementModal(page)
	await action()
	await gotoNationalityVerificationPage(page)
	await logout(page)
}

async function gotoLoginPage(page: Page) {
	await page.goto(LOGIN_URL, { waitUntil: 'networkidle' })
}

async function gotoProfilePage(page: Page) {
	await page.goto(PROFILE_URL)
}

async function gotoProductPage(page: Page) {
	await page.goto(PRODUCT_URL)
}

async function gotoReportPage(page: Page, dates: Dates) {
	await page.goto(
		`${REPORT_URL}?startDate=${dates.started}&endDate=${dates.ended}`
	)
}

async function gotoNationalityVerificationPage(page: Page) {
	await page.goto(VERIFY_NATIONALITY_ID_URL)
}

async function fillLoginForm(page: Page, { phoneNumber, pin }: Credentials) {
	await page.getByPlaceholder('Email atau No. Handphone').fill(phoneNumber)
	await page.getByPlaceholder('PIN (6-digit)').fill(pin)
}

async function submitLoginForm(page: Page) {
	await page.getByText('Masuk').click()
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
