import { ReportData, ReportSummary, Transaction } from '../lib/types'

export class Report {
	private summaries: ReportSummary[]
	private transactions: Transaction[]

	constructor({ summaries, transactions }: ReportData) {
		this.summaries = summaries
		this.transactions = transactions
	}

	data(): ReportData {
		return {
			summaries: this.summaries,
			transactions: this.transactions,
		}
	}
}
