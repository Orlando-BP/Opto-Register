import ProductsNoteSaleModel from "../models/product_notesale.model.js";

const ProductsNoteSaleService = {
	async create(data) {
		return ProductsNoteSaleModel.create(data);
	},

	async findAll(where = {}) {
		return ProductsNoteSaleModel.findAll({ where });
	},

	async findById(id) {
		return ProductsNoteSaleModel.findById(id);
	},

	async findOneByWhere(where = {}) {
		return ProductsNoteSaleModel.findOne(where);
	},

	async update(id, data) {
		return ProductsNoteSaleModel.update(id, data);
	},

	async replace(id, data) {
		return ProductsNoteSaleModel.replace(id, data);
	},

	async delete(id) {
		return ProductsNoteSaleModel.delete(id);
	},
};

export default ProductsNoteSaleService;
