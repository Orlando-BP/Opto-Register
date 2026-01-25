import AdminsModel from "../models/admins.model.js";
import bcrypt from "bcryptjs";

const withHashedPassword = async data => {
	const payload = { ...data };
	if (payload.password) {
		payload.password = await bcrypt.hash(payload.password, 10);
	}
	return payload;
};

const AdminsService = {
	async create(data) {
		const payload = await withHashedPassword(data);
		return AdminsModel.create(payload);
	},

	async findAll() {
		return AdminsModel.findAll();
	},

	async findAllByWhere(where = {}) {
		return AdminsModel.findAll({ where });
	},

	async findById(id) {
		return AdminsModel.findById(id);
	},

	async findOneByWhere(where = {}) {
		return AdminsModel.findOne(where);
	},

	async authenticate(username, password) {
		const admins = await AdminsModel.findAll();
		const user = admins.find(a => a.username === username);
		if (!user) return null;
		const match = await bcrypt.compare(password, user.password);
		if (!match) return null;
		return user;
	},

	async verifyPassword(id, password) {
		const user = await AdminsModel.findById(id);
		if (!user) return { user: null, match: false };
		const match = await bcrypt.compare(password, user.password);
		return { user, match };
	},

	async update(id, data) {
		const payload = await withHashedPassword(data);
		return AdminsModel.update(id, payload);
	},

	async replace(id, data) {
		const payload = await withHashedPassword(data);
		return AdminsModel.replace(id, payload);
	},

	async delete(id) {
		return AdminsModel.delete(id);
	},
};

export default AdminsService;
