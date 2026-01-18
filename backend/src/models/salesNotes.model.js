import BaseModel from "./BaseModel.js";

class SalesNotesModel extends BaseModel {
    constructor() {
        super("SalesNotes", [
            "id",
            "idClient",
            "issueDate",
            "deliveryDate",
            "totalPrice",
            "advance",
            "balance",
        ]);
    }
}

export default new SalesNotesModel();
