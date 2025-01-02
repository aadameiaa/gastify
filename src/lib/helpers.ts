import { Customer } from '../models/customer'
import { CustomerData } from './types'

export function getUniqueNationalityIds(nationalityIds: string[]): string[] {
	return nationalityIds.filter(
		(nationalityId, index, array) => array.indexOf(nationalityId) === index
	)
}

export function getEligibleCustomers(customers: Customer[]): Customer[] {
	return customers.filter((customer) => customer.isEligible())
}

export function convertCustomersToCustomerDataList(
	customers: Customer[]
): CustomerData[] {
	return customers.map((customer) => customer.data())
}