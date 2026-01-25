import ClientsModel from "../models/clients.model.js";

const ClientsService = {
	async create(data) {
		return ClientsModel.create(data);
	},

	async findAll() {
		return ClientsModel.findAll({
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
