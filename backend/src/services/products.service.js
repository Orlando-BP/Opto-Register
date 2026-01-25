import ProductsModel from "../models/products.model.js";

const ProductsService = {
	async create(data) {
		return ProductsModel.create(data);
	},

	async findAll(where = {}) {
		return ProductsModel.findAll({ where });
	},

	async findById(id) {
		return ProductsModel.findById(id);
	},

	async findOneByWhere(where = {}) {
		return ProductsModel.findOne(where);
	},

	async update(id, data) {
		return ProductsModel.update(id, data);
	},

	async replace(id, data) {
		return ProductsModel.replace(id, data);
	},

	async delete(id) {
		return ProductsModel.delete(id);
	},
};

export default ProductsService;
