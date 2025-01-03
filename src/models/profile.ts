import {
	ProfileAgent,
	ProfileData,
	ProfileFlags,
	ProfileLocation,
} from '../lib/types'

export class Profile {
	private readonly registrationId: string
	private readonly nationalityId: string
	private readonly name: string
	private readonly phoneNumber: string
	private readonly email: string
	private readonly location: ProfileLocation
	private readonly agent: ProfileAgent
	private readonly flags: ProfileFlags

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

	toJSON(): Readonly<ProfileData> {
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
