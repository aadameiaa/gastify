export const DEFAULT_TIMEOUT = 60 * 1000
export const MY_PERTAMINA_DELAY = 60 * 1000

export const LOGIN_URL =
	'https://subsiditepatlpg.mypertamina.id/merchant/auth/login'
export const PROFILE_URL =
	'https://subsiditepatlpg.mypertamina.id/merchant/app/profile-merchant'
export const VERIFY_NATIONALITY_ID_URL =
	'https://subsiditepatlpg.mypertamina.id/merchant/app/verification-nik'

export const VERIFY_NATIONALITY_ID_ENDPOINT =
	'https://api-map.my-pertamina.id/customers/v1/verify-nik'
export const PROFILE_ENDPOINT =
	'https://api-map.my-pertamina.id/general/v1/users/profile'

export const NATIONALITY_ID_LENGTH = 16
export const CUSTOMER_TYPES = [
	'Rumah Tangga',
	'Usaha Mikro',
	'Pengecer',
] as const
