import { ProductData, ProductStock } from '../lib/types'

export class Product {
	private id: string
	private name: string
	private modal: number
	private price: number
	private stock: ProductStock

	constructor({ id, name, modal, price, stock }: ProductData) {
		this.id = id
		this.name = name
		this.modal = modal
		this.price = price
		this.stock = stock
	}

	data(): ProductData {
		return {
			id: this.id,
			name: this.name,
			modal: this.modal,
			price: this.price,
			stock: this.stock,
		}
	}
}
