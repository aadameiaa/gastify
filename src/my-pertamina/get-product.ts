import { Page } from 'playwright'

import { writeJSONFile } from '../lib/file'
import type { Credentials } from '../lib/types'
import { ProductPage } from '../pages/product'
import { performAuthenticatedAction } from './perform-authenticated-action'

export async function getProduct(page: Page, credentials: Credentials) {
	const productPage = new ProductPage(page)

	try {
		await performAuthenticatedAction(page, credentials, async () => {
			await productPage.navigate()
			const product = await productPage.fetch()

			writeJSONFile(product.toJSON(), 'product.json')
		})
	} catch (error) {}
}
