import BaseModel from "../BaseModel.js";
import ProductsModel from "./products.model.js";
import ClientsModel from "./clients.model.js";

class SalesNotesModel extends BaseModel {
    constructor() {
        super("Sales_Notes", [
            "id",
            "id_client",
            "issue_date",
            "delivery_date",
            "total_price",
            "advance",
            "balance",
            "code",
            "is_deleted"
        ]);

        this.schema = {
            id: "number",
            id_client: "number",
            issue_date: "date",
            delivery_date: "date",
            total_price: "number",
            advance: "number",
            balance: "number",
            code: "string",
            is_deleted: "boolean",
        };

        this.attributes = {
            id: null,
            id_client: null,
            issue_date: null,
            delivery_date: null,
            total_price: 0,
            advance: 0,
            balance: 0,
            code: null,
            is_deleted: false,
        };

        this.relations = {
            Products: {
                type: "hasMany",
                model: () => ProductsModel,
                foreignKey: "id_note",
                localKey: "id",
                as: "Products",
            },
        };

        this.foreignKeys = {
            id_client: {
                model: () => ClientsModel,
                refColumn: "id",
                refTable: "Clients",
            },
        };
    }
}

export default new SalesNotesModel();
