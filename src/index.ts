import { LOGIN_URL } from './lib/constants'
import { readJSONFile, writeJSONFile } from './lib/file'
import {
	closeAnnouncementModal,
	fillLoginForm,
	fillVerifyNikForm,
	logout,
	submitLoginForm,
	submitVerifyNikForm,
} from './lib/my-pertamina'
import { launchBrowser } from './lib/playwright'

const main = async () => {
	const { browser, context, page } = await launchBrowser()

	await page.goto(LOGIN_URL, { waitUntil: 'networkidle' })

	await fillLoginForm(page)
	await submitLoginForm(page)
	await closeAnnouncementModal(page)

	const nationalityIds = readJSONFile(
		'../data/nationality-ids.json'
	) as number[]

	const uniqueNationalityIds = nationalityIds.filter(
		(nationalityId, index, array) => array.indexOf(nationalityId) === index
	)

	const customers = []
	for (const nationalityId of uniqueNationalityIds) {
		await fillVerifyNikForm(page, nationalityId.toString())
		const customer = await submitVerifyNikForm(page, nationalityId.toString())

		if (typeof customer !== 'number') {
			customers.push(customer)
		}
	}

	writeJSONFile(customers, 'customers.json')

	const targetCustomers = customers
		.filter((customer) => customer.quota.parent >= 1)
		.map((customer) => ({
			nationalityId: customer.nationalityId,
			name: customer.name,
			types: customer.customerTypes,
			quota: customer.quota.parent,
		}))

	writeJSONFile(targetCustomers, 'target-customers.json')

	await logout(page)

	await context.close()
	await browser.close()
}

main()
