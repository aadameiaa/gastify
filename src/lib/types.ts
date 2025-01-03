import { CUSTOMER_TYPES } from './constants'

export type ProfileData = {
	registrationId: string
	nationalityId: string
	name: string
	phoneNumber: string
	email: string
	location: ProfileLocation
	agent: ProfileAgent
	flags: ProfileFlags
}

export type ProfileLocation = {
	province: string
	city: string
	district: string
	village: string
	address: string
	zipCode: string
	coordinate: string
}

export type ProfileAgent = {
	id: string
	name: string
}

export type ProfileFlags = {
	isSubsidyProduct: boolean
	isActiveMyPertamina: boolean
	isAvailableTransaction: boolean
}

export type ProductData = {
	id: string
	name: string
	modal: number
	price: number
	stock: ProductStock
}

export type ProductStock = {
	available: number
	redeem: number
	sold: number
	date: string
}

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
