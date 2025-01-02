export type VerifyNationalityIdResponse =
	MyPertaminaResponse<VerifyNationalityIdData>

type MyPertaminaResponse<T> = {
	success: boolean
	code: number
	message: string
	data: T
}

type VerifyNationalityIdData = {
	nationalityId: string
	name: string
	email: string
	phoneNumber: string
	businessType: string
	quotaRemaining: QuotaRemaining
	quotaRemainingLastMonth: QuotaRemainingLastMonth
	customerTypes: CustomerType[]
	channelInject: string
	isAgreedTermsConditions: boolean
	isCompleted: boolean
	isSubsidi: boolean
	isRecommendationLetter: boolean
	isBlocked: boolean
	isBusinessType: boolean
}

type QuotaRemaining = {
	type: number
	parent: number
	retailer: number
	fisherman: number
	farmer: number
	microBusiness: number
	all: number
}

type QuotaRemainingLastMonth = {
	type: number
	parent: number
	retailer: number
	fisherman: number
	farmer: number
	microBusiness: number
	all: number
}

type CustomerType = {
	name: string
	sourceTypeId: number
	status: number
	verifications: any[]
	merchant: any
	isBlocked: boolean
}
