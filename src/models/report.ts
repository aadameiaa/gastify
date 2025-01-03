import { ReportData, ReportSummary, Transaction } from '../lib/types'

export class Report {
	private readonly summary: ReportSummary
	private readonly transactions: Transaction[]

	constructor({ summary, transactions }: ReportData) {
		this.summary = summary
		this.transactions = transactions
	}

	toJSON(): Readonly<ReportData> {
		return {
			summary: this.summary,
			transactions: this.transactions,
		}
	}
}
