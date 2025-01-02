import { CustomerData, CustomerFlags, CustomerType } from '../lib/types'

export class Customer {
	private nationalityId: string
	private name: string
	private quota: number
	private types: CustomerType[]
	private flags: CustomerFlags

	constructor({ nationalityId, name, quota, types, flags }: CustomerData) {
		this.nationalityId = nationalityId
		this.name = name
		this.quota = quota
		this.types = types
		this.flags = flags
	}

	hasOutdatedRecommendationLetter(): boolean {
		return (
			this.types.includes('Usaha Mikro') && !this.flags.isRecommendationLetter
		)
	}

	isMultipleTypes(): boolean {
		return this.types.length > 1
	}

	isEligible(): boolean {
		return this.quota >= 1
	}

	data(): CustomerData {
		return {
			nationalityId: this.nationalityId,
			name: this.name,
			quota: this.quota,
			types: this.types,
			flags: this.flags,
		}
	}
}
