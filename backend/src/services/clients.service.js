import ClientsModel from "../models/clients.model.js";

const ClientsService = {
	async create(data) {
		return ClientsModel.create(data);
	},

	async findAll(where = {}) {
		return ClientsModel.findAll({
			where,
			include: [
				{
					name: "Calibration",
					attributes: ["id", "age", "registrationDate"],
				},
				{
					name: "SalesNotes",
					attributes: ["id", "issueDate", "deliveryDate", "totalPrice", "advance", "balance"],
				},
			],
		});
	},

	async findById(id) {
		return ClientsModel.findById(id, {
			include: [
				{
					name: "Calibration",
					attributes: ["id", "age", "registrationDate"],
				},
				{
					name: "SalesNotes",
					attributes: ["id", "issueDate", "deliveryDate", "totalPrice", "advance", "balance"],
				},
			],
		});
	},

	async findOneByWhere(where = {}) {
		return ClientsModel.findOne(where, {
			include: [
				{
					name: "Calibration",
					attributes: ["id", "age", "registrationDate"],
				},
				{
					name: "SalesNotes",
					attributes: ["id", "issueDate", "deliveryDate", "totalPrice", "advance", "balance"],
				},
			],
		});
	},

	async update(id, data) {
		return ClientsModel.update(id, data);
	},

	async replace(id, data) {
		return ClientsModel.replace(id, data);
	},

	async delete(id) {
		return ClientsModel.delete(id);
	},
};

export default ClientsService;
