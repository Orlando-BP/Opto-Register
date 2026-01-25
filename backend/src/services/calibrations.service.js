import CalibrationsModel from "../models/calibrations.model.js";

const CalibrationsService = {
	async create(data) {
		return CalibrationsModel.create(data);
	},

	async findAll() {
		return CalibrationsModel.findAll();
	},

	async findById(id) {
		return CalibrationsModel.findById(id);
	},

	async update(id, data) {
		return CalibrationsModel.update(id, data);
	},

	async replace(id, data) {
		return CalibrationsModel.replace(id, data);
	},

	async delete(id) {
		return CalibrationsModel.delete(id);
	},
};

export default CalibrationsService;
