export const DEFAULT_TIMEOUT = 60_000
export const VERIFY_NATIONALITY_ID_REQUEST_TIMEOUT = 60_000
export const VERIFY_NATIONALITY_ID_TIMEOUT = 6_000

export const LOGIN_PAGE_URL =
	'https://subsiditepatlpg.mypertamina.id/merchant/auth/login'
export const NATIONALITY_ID_VERIFICATION_PAGE_URL =
	'https://subsiditepatlpg.mypertamina.id/merchant/app/verification-nik'
export const PROFILE_PAGE_URL =
	'https://subsiditepatlpg.mypertamina.id/merchant/app/profile-merchant'
export const PRODUCT_PAGE_URL =
	'https://subsiditepatlpg.mypertamina.id/merchant/app/manage-product'
export const REPORT_PAGE_URL =
	'https://subsiditepatlpg.mypertamina.id/merchant/app/transaction-report'

export const NATIONALITY_ID_VERIFICATION_ENDPOINT =
	'https://api-map.my-pertamina.id/customers/v1/verify-nik'
export const PROFILE_ENDPOINT =
	'https://api-map.my-pertamina.id/general/v1/users/profile'
export const PRODUCT_ENDPOINT =
	'https://api-map.my-pertamina.id/general/v2/products'
export const REPORT_ENDPOINT =
	'https://api-map.my-pertamina.id/general/v1/transactions/report'

export const NATIONALITY_ID_LENGTH = 16
export const CUSTOMER_TYPES = [
	'Rumah Tangga',
	'Usaha Mikro',
	'Pengecer',
] as const
