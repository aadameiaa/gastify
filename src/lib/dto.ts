import { Response } from 'playwright'

import { VerifyNationalityIdResponse } from './responses'
import { CustomerData, CustomerType } from './types'

export async function parseResponseToCustomerData(
	response: Response,
	nationalityId: string
): Promise<CustomerData> {
	const { data } = (await response.json()) as VerifyNationalityIdResponse

	return {
		nationalityId,
		name: data.name,
		quota: data.quotaRemaining.parent,
		types: data.customerTypes.map(
			(customerType) => customerType.name as CustomerType
		),
		flags: {
			isAgreedTermsConditions: data.isAgreedTermsConditions,
			isCompleted: data.isCompleted,
			isSubsidy: data.isSubsidi,
			isRecommendationLetter: data.isRecommendationLetter,
			isBlocked: data.isBlocked,
			isBusinessType: data.isBusinessType,
		},
	}
}
