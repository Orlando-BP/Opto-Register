import BaseModel from "./BaseModel.js";

class AdminsModel extends BaseModel {
	constructor() {
		super("Admins", ["id", "username", "password"]);
	}
}

export default new AdminsModel();