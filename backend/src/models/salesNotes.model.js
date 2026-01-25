import BaseModel from "../BaseModel.js";
import ProductsModel from "./products.model.js";
import ClientsModel from "./clients.model.js";

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

        this.schema = {
            id: "number",
            idClient: "number",
            issueDate: "date",
            deliveryDate: "date",
            totalPrice: "number",
            advance: "number",
            balance: "number",
        };

        this.attributes = {
            id: null,
            idClient: null,
            issueDate: null,
            deliveryDate: null,
            totalPrice: 0,
            advance: 0,
            balance: 0,
        };

        this.relations = {
            Products: {
                type: "hasMany",
                model: ProductsModel,
                foreignKey: "idNote",
                localKey: "id",
                as: "Products",
            },
        };

        this.foreignKeys = {
            idClient: {
                model: ClientsModel,
                refColumn: "id",
                refTable: "Clients",
            },
        };
    }
}

export default new SalesNotesModel();
