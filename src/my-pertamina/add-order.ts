import { Page } from 'playwright'

import type { Credentials, Order } from '../lib/types'
import { NationalityIdVerificationPage } from '../pages/nationality-id-verification'
import { OrderPage } from '../pages/order'
import { SalePage } from '../pages/sale'
import { TransactionPage } from '../pages/transaction'
import { performAuthenticatedAction } from './perform-authenticated-action'

export async function addOrder(
	page: Page,
	credentials: Credentials,
	order: Order
) {
	const nationalityIdVerificationPage = new NationalityIdVerificationPage(page)
	const salePage = new SalePage(page)
	const orderPage = new OrderPage(page)
	const transactionPage = new TransactionPage(page)

	await performAuthenticatedAction(page, credentials, async () => {
		for (let index = 0; index < getOrderIteration(order.quantity); index++) {
			const orderQuantity = getOrderQuantity(order.quantity, index)

			const customer = await nationalityIdVerificationPage.verify(
				order.nationalityId
			)

			await nationalityIdVerificationPage.closeModals(customer)
			await salePage.waitForURL()
			if (
				customer.isOutOfQuota() ||
				customer.isBeyondReasonableLimits(orderQuantity)
			) {
				return await salePage.changeBuyer()
			}

			await salePage.increaseOrderQuantity(orderQuantity)
			await salePage.submitForm()
			await orderPage.waitForURL()
			await orderPage.submitForm()
			await transactionPage.waitForURL()
			await nationalityIdVerificationPage.navigate()
		}
	})
}

function getOrderIteration(quantity: number): number {
	return quantity > 5 ? 2 : 1
}

function getOrderQuantity(quantity: number, index: number): number {
	return quantity > 5 ? (index === 0 ? 5 : quantity - 5) : quantity
}
