import { Page, Response } from 'playwright'

import { PROFILE_ENDPOINT, PROFILE_PAGE_URL } from '../lib/constants'
import { parseResponseToProfileRecord } from '../lib/dto'
import { Profile } from '../models/profile'

export class ProfilePage {
	private readonly url: string = PROFILE_PAGE_URL
	private readonly page: Page

	constructor(page: Page) {
		this.page = page
	}

	public async navigate() {
		await this.page.goto(this.url)
	}

	public async fetch(): Promise<Profile> {
		const response = await this.waitForResponse()
		const profileRecord = await parseResponseToProfileRecord(response)
		const profile = new Profile(profileRecord)

		return profile
	}

	private async waitForResponse(): Promise<Response> {
		return await this.page.waitForResponse(
			(response) =>
				response.request().method() === 'GET' &&
				response.url() === PROFILE_ENDPOINT
		)
	}
}
