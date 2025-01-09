import type { CustomerFlags, CustomerRecord, CustomerType } from '../lib/types'

export class Customer {
	private readonly nationalityId: string
	private readonly name: string
	private readonly quota: number
	private readonly types: CustomerType[]
	private readonly flags: CustomerFlags

	constructor({ nationalityId, name, quota, types, flags }: CustomerRecord) {
		this.nationalityId = nationalityId
		this.name = name
		this.quota = quota
		this.types = types
		this.flags = flags
	}

	hasOutdatedRecommendationLetter(): boolean {
		return this.isMicroBusiness() && !this.flags.isRecommendationLetter
	}

	private isMicroBusiness(): boolean {
		return this.types.includes('Usaha Mikro')
	}

	isMultipleTypes(): boolean {
		return this.types.length > 1
	}

	isEligible(): boolean {
		return this.quota >= 1
	}

	isOutOfQuota(): boolean {
		return this.quota === 0
	}

	isBeyondReasonableLimits(orderQuantity: number): boolean {
		return orderQuantity > this.quota
	}

	toJSON(): Readonly<CustomerRecord> {
		return {
			nationalityId: this.nationalityId,
			name: this.name,
			quota: this.quota,
			types: this.types,
			flags: this.flags,
		}
	}
}
