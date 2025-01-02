export const DEFAULT_TIMEOUT = 60 * 1000
export const MY_PERTAMINA_DELAY = 60 * 1000

export const LOGIN_URL =
	'https://subsiditepatlpg.mypertamina.id/merchant/auth/login'

export const VERIFY_NIK_ENDPOINT =
	'https://api-map.my-pertamina.id/customers/v1/verify-nik'

export const NIK_LENGTH = 16
export const CUSTOMER_TYPES = [
	'Rumah Tangga',
	'Usaha Mikro',
	'Pengecer',
] as const
