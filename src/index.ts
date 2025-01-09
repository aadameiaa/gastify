import { config } from 'dotenv'

import { launchBrowser } from './lib/playwright'
import type { Credentials } from './lib/types'
import { verifyNationalityId } from './my-pertamina/verify-nationality-id'

config()

const main = async () => {
	const phoneNumber = process.env.PHONE_NUMBER as string
	const pin = process.env.PIN as string
	const credentials: Credentials = { phoneNumber, pin }

	const { browser, context, page } = await launchBrowser()

	await verifyNationalityId(page, credentials, '3276034501850002')

	await context.close()
	await browser.close()
}

main()
