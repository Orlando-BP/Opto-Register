import BaseModel from "../BaseModel.js";

class AdminsModel extends BaseModel {
	constructor() {
		super("Admins", ["id", "username", "password"]);

		// Schema: define the type for each attribute
		this.schema = {
			id: "number",
			username: "string",
			password: "string",
		};

		// Attributes: initialized values according to their type
		this.attributes = {
			id: null,
			username: "",
			password: "",
		};
	}
}

export default new AdminsModel();