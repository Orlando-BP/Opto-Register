import CalibrationsModel from "../models/calibrations.model.js";

const CalibrationsService = {
	async create(data) {
		return CalibrationsModel.create(data);
	},

	async findAll(where = {}) {
		return CalibrationsModel.findAll({ where });
	},

	async findById(id) {
		return CalibrationsModel.findById(id);
	},

	async findOneByWhere(where = {}) {
		return CalibrationsModel.findOne(where);
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
