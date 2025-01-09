import type { ProductRecord, ProductStock } from '../lib/types'

export class Product {
	private readonly id: string
	private readonly name: string
	private readonly modal: number
	private readonly price: number
	private readonly stock: ProductStock

	constructor({ id, name, modal, price, stock }: ProductRecord) {
		this.id = id
		this.name = name
		this.modal = modal
		this.price = price
		this.stock = stock
	}

	toJSON(): Readonly<ProductRecord> {
		return {
			id: this.id,
			name: this.name,
			modal: this.modal,
			price: this.price,
			stock: this.stock,
		}
	}
}
