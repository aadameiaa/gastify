import { config } from 'dotenv'

import { verifyNationalityIds } from './lib/my-pertamina'
import { launchBrowser } from './lib/playwright'

config()

const main = async () => {
	const phoneNumber = process.env.PHONE_NUMBER as string
	const pin = process.env.PIN as string

	const { browser, context, page } = await launchBrowser()

	await verifyNationalityIds(page, {
		phoneNumber,
		pin,
		nationalityIdsPath: '../data/nationality-ids.json',
	})

	await context.close()
	await browser.close()
}

main()
