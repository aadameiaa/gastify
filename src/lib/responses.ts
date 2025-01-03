export type ProfileResponse = MyPertaminaResponse<ProfileData>
export type ProductResponse = MyPertaminaResponse<ProductData>
export type ReportResponse = MyPertaminaResponse<ReportData>
export type VerifyNationalityIdResponse =
	MyPertaminaResponse<VerifyNationalityIdData>

type MyPertaminaResponse<T> = {
	success: boolean
	code: number
	message: string
	data: T
}

type ProfileData = {
	registrationId: string
	name: string
	address: string
	city: string
	province: string
	coordinate: string
	storeName: string
	storeAddress: string
	phoneNumber: string
	tid: string
	mid: any
	spbu: string
	merchantType: string
	midMap: string
	isSubsidiProduct: boolean
	storePhoneNumber: string
	email: string
	nationalityId: string
	ditrictName: string
	villageName: string
	zipcode: string
	agen: Agen
	isActiveMyptm: boolean
	bank: Bank
	myptmActivationStatus: any
	isAvailableTransaction: boolean
}

type Agen = {
	id: string
	name: string
}

type Bank = {
	bankName: any
	accountName: any
	accountNumber: any
}

type ProductData = {
	registrationId: string
	storeName: string
	productId: string
	productName: string
	stockAvailable: number
	stockRedeem: number
	sold: number
	modal: number
	price: number
	productMinPrice: number
	productMaxPrice: number
	image: string
	stockDate: string
	lastStock: number
	lastStockDate: string
	lastSyncAt: string
}

type ReportData = {
	summaryReport: SummaryReport[]
	customersReport: CustomersReport[]
}

type SummaryReport = {
	sold: number
	modal: number
	profit: number
	incomeMyptm: number
}

type CustomersReport = {
	customerReportId: string
	nationalityId: string
	name: string
	categories: string[]
	total: number
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
