import { Page } from 'playwright'

import { writeJSONFile } from '../lib/file'
import type { Credentials } from '../lib/types'
import { ProfilePage } from '../pages/profile'
import { performAuthenticatedAction } from './perform-authenticated-action'

export async function getProfile(page: Page, credentials: Credentials) {
	const profilePage = new ProfilePage(page)

	try {
		await performAuthenticatedAction(page, credentials, async () => {
			await profilePage.navigate()
			const profile = await profilePage.fetch()

			writeJSONFile(profile.toJSON(), 'profile.json')
		})
	} catch (error) {}
}
