import { CUSTOMER_TYPES } from './constants'

export type CustomerData = {
	nationalityId: string
	name: string
	quota: number
	types: CustomerType[]
	flags: CustomerFlags
}

export type CustomerType = (typeof CUSTOMER_TYPES)[number]

export type CustomerFlags = {
	isAgreedTermsConditions: boolean
	isCompleted: boolean
	isSubsidy: boolean
	isRecommendationLetter: boolean
	isBlocked: boolean
	isBusinessType: boolean
}
