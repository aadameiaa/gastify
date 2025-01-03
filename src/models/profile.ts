import {
	ProfileAgent,
	ProfileData,
	ProfileFlags,
	ProfileLocation,
} from '../lib/types'

export class Profile {
	private registrationId: string
	private nationalityId: string
	private name: string
	private phoneNumber: string
	private email: string
	private location: ProfileLocation
	private agent: ProfileAgent
	private flags: ProfileFlags

	constructor({
		registrationId,
		nationalityId,
		name,
		phoneNumber,
		email,
		location,
		agent,
		flags,
	}: ProfileData) {
		this.registrationId = registrationId
		this.nationalityId = nationalityId
		this.name = name
		this.phoneNumber = phoneNumber
		this.email = email
		this.location = location
		this.agent = agent
		this.flags = flags
	}

	data(): ProfileData {
		return {
			registrationId: this.registrationId,
			nationalityId: this.nationalityId,
			name: this.name,
			phoneNumber: this.phoneNumber,
			email: this.email,
			location: this.location,
			agent: this.agent,
			flags: this.flags,
		}
	}
}
