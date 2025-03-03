import { Response } from 'playwright'

import type {
	ProductResponse,
	ProfileResponse,
	ReportResponse,
	VerifyNationalityIdResponse,
} from './responses'
import type {
	CustomerRecord,
	CustomerType,
	ProductRecord,
	ProfileRecord,
	ReportRecord,
} from './types'

export async function parseResponseToProfileRecord(
	response: Response
): Promise<ProfileRecord> {
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

export async function parseResponseToProductRecord(
	response: Response
): Promise<ProductRecord> {
	const { data } = (await response.json()) as ProductResponse

	return {
		id: data.productId,
		name: data.productName,
		modal: data.modal,
		price: data.price,
		stock: {
			available: data.stockAvailable,
			redeem: data.stockRedeem,
			sold: data.sold,
			date: data.stockDate,
		},
	}
}

export async function parseResponseToReportRecord(
	response: Response
): Promise<ReportRecord> {
	const { data } = (await response.json()) as ReportResponse
	const summaryReport = data.summaryReport[0]

	return {
		summary: {
			sold: summaryReport.sold,
			modal: summaryReport.modal,
			profit: summaryReport.profit,
			income: summaryReport.incomeMyptm,
		},
		transactions: data.customersReport.map((customerReport) => ({
			id: customerReport.customerReportId,
			customer: {
				nationalityId: customerReport.nationalityId,
				name: customerReport.name,
				types: customerReport.categories as CustomerType[],
			},
			product: {
				quantity: customerReport.total,
			},
		})),
	}
}

export async function parseResponseToCustomerRecord(
	response: Response,
	nationalityId: string
): Promise<CustomerRecord> {
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
