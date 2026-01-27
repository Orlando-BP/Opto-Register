import BaseModel from "../BaseModel.js";

class AdminsModel extends BaseModel {
	constructor() {
		super("Admins", ["id", "username", "password", "is_deleted"]);

		// Schema: define the type for each attribute
		this.schema = {
			id: "number",
			username: "string",
			password: "string",
			is_deleted: "boolean",
		};

		// Attributes: initialized values according to their type
		this.attributes = {
			id: null,
			username: "",
			password: "",
			is_deleted: false,
		};
	}
}

export default new AdminsModel();