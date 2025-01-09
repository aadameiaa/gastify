import { Page } from 'playwright'

import { writeJSONFile } from '../lib/file'
import type { Credentials } from '../lib/types'
import { NationalityIdVerificationPage } from '../pages/nationality-id-verification'
import { performAuthenticatedAction } from './perform-authenticated-action'

export async function verifyNationalityId(
	page: Page,
	credentials: Credentials,
	nationalityId: string
) {
	const nationalityIdVerificationPage = new NationalityIdVerificationPage(page)

	try {
		await performAuthenticatedAction(page, credentials, async () => {
			const customer = await nationalityIdVerificationPage.verify(nationalityId)
			await nationalityIdVerificationPage.closeModals(customer)

			writeJSONFile(customer.toJSON(), 'customer.json')
		})
	} catch (error) {
		if (error instanceof Error) {
			const statusCode = parseInt(error.message, 10)
			await nationalityIdVerificationPage.handleVerifyError(statusCode)
		}
	}
}
