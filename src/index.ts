import { config } from 'dotenv'

import { launchBrowser } from './lib/playwright'
import { Credentials } from './lib/types'

config()

const main = async () => {
	const phoneNumber = process.env.PHONE_NUMBER as string
	const pin = process.env.PIN as string
	const credentials: Credentials = { phoneNumber, pin }

	const { browser, context, page } = await launchBrowser()

	await context.close()
	await browser.close()
}

main()
