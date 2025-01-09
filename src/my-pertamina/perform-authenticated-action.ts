import { Page } from 'playwright'

import type { Credentials } from '../lib/types'
import { LoginPage } from '../pages/login'
import { NationalityIdVerificationPage } from '../pages/nationality-id-verification'

export async function performAuthenticatedAction(
	page: Page,
	credentials: Credentials,
	action: () => Promise<void>
) {
	const loginPage = new LoginPage(page)
	const nationalityIdVerificationPage = new NationalityIdVerificationPage(page)

	try {
		await loginPage.navigate()
		await loginPage.login(credentials)
		await nationalityIdVerificationPage.waitForURL()
		await nationalityIdVerificationPage.closeAnnouncementModal()

		await action()

		await nationalityIdVerificationPage.navigate()
		await nationalityIdVerificationPage.logout()
	} catch (error) {}
}
