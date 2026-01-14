import BaseModel from "./BaseModel.js";

class ClientsModel extends BaseModel {
    constructor() {
        super("Clients", ["id", "name", "phone", "email", "address"]);
    }
}

export default new ClientsModel();
