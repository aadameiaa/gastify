import { CustomerData, CustomerFlags, CustomerType } from '../lib/types'

export class Customer {
	private readonly nationalityId: string
	private readonly name: string
	private readonly quota: number
	private readonly types: CustomerType[]
	private readonly flags: CustomerFlags

	constructor({ nationalityId, name, quota, types, flags }: CustomerData) {
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

	toJSON(): Readonly<CustomerData> {
		return {
			nationalityId: this.nationalityId,
			name: this.name,
			quota: this.quota,
			types: this.types,
			flags: this.flags,
		}
	}
}
