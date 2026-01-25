import SalesNotesModel from "../models/salesNotes.model.js";

const SalesNotesService = {
	async create(data) {
		return SalesNotesModel.create(data);
	},

	async findAll(where = {}) {
		return SalesNotesModel.findAll({
			where,
			include: [
				{
					name: "Products",
					attributes: ["id", "type", "material", "frame", "color", "size", "observations"],
				},
			],
		});
	},

	async findById(id) {
		return SalesNotesModel.findById(id, {
			include: [
				{
					name: "Products",
					attributes: ["id", "type", "material", "frame", "color", "size", "observations"],
				},
			],
		});
	},

	async findOneByWhere(where = {}) {
		return SalesNotesModel.findOne(where, {
			include: [
				{
					name: "Products",
					attributes: ["id", "type", "material", "frame", "color", "size", "observations"],
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
