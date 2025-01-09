import { CUSTOMER_TYPES } from './constants'

export type ProfileRecord = {
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

export type ProductRecord = {
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

export type ReportRecord = {
	summary: ReportSummary
	transactions: Transaction[]
}

export type ReportSummary = {
	sold: number
	modal: number
	profit: number
	income: number
}

export type Transaction = {
	id: string
	customer: {
		nationalityId: string
		name: string
		types: CustomerType[]
	}
	product: {
		quantity: number
	}
}

export type CustomerRecord = {
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

export type Credentials = {
	phoneNumber: string
	pin: string
}

export type Dates = {
	started: string
	ended: string
}

export type Order = {
	nationalityId: string
	quantity: number
}
