import SalesNotesModel from "../models/salesNotes.model.js";
import ProductsNoteSaleModel from "../models/product_notesale.model.js";

const SalesNotesService = {
	async create(data) {
		return SalesNotesModel.create(data);
	},

	async findAll(where = {}) {
		return SalesNotesModel.findAll({
			where,
			include: [
				{
					name: "ProductsNoteSale",
					attributes: ["id", "id_sales_note", "id_product", "id_calibration", "value", "quantity"],
					include: [
						{
							name: "Product",
							attributes: ["id", "name", "description",]
						}
					]
				},
			],
		});
	},

	async findById(id) {
		return SalesNotesModel.findById(id, {
			include: [
				{
					name: "ProductsNoteSale",
					attributes: ["id","id_sales_note", "id_product", "id_calibration", "value", "quantity"],
					include: [
						{
							name: "Product",
							attributes: ["id", "name", "description",]
						}
					]
				},
			],
		});
	},

	async findOneByWhere(where = {}) {
		return SalesNotesModel.findOne(where, {
			include: [
				{
					name: "ProductsNoteSale",
					attributes: ["id", "id_sales_note", "id_product", "id_calibration", "value", "quantity"],
					include: [
						{
							name: "Product",
							attributes: ["id", "name", "description",]
						}
					]
				},
			],
		});
	},

	async update(id, data) {
		return SalesNotesModel.update(id, data);
	},

	async replace(id, data) {
		return SalesNotesModel.replace(id, data);
	},

	async delete(id) {
		return SalesNotesModel.delete(id);
	},
};

export default SalesNotesService;
