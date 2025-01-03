import { Response } from 'playwright'

import { ProfileResponse, VerifyNationalityIdResponse } from './responses'
import { CustomerData, CustomerType, ProfileData } from './types'

export async function parseResponseToProfileData(
	response: Response
): Promise<ProfileData> {
	const { data } = (await response.json()) as ProfileResponse

	return {
		registrationId: data.registrationId,
		nationalityId: data.nationalityId,
		name: data.name,
		phoneNumber: data.phoneNumber,
		email: data.email,
		location: {
			province: data.province,
			city: data.city,
			district: data.ditrictName,
			village: data.villageName,
			address: data.address,
			zipCode: data.zipcode,
			coordinate: data.coordinate,
		},
		agent: {
			id: data.agen.id,
			name: data.agen.name,
		},
		flags: {
			isSubsidyProduct: data.isSubsidiProduct,
			isActiveMyPertamina: data.isActiveMyptm,
			isAvailableTransaction: data.isAvailableTransaction,
		},
	}
}

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
