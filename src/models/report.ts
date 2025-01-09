import type { ReportRecord, ReportSummary, Transaction } from '../lib/types'

export class Report {
	private readonly summary: ReportSummary
	private readonly transactions: Transaction[]

	constructor({ summary, transactions }: ReportRecord) {
		this.summary = summary
		this.transactions = transactions
	}

	toJSON(): Readonly<ReportRecord> {
		return {
			summary: this.summary,
			transactions: this.transactions,
		}
	}
}
