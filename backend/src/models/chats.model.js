import BaseModel from "../BaseModel.js";
import ClientsModel from "./clients.model.js";
import MessagesModel from "./messages.model.js";

class ChatsModel extends BaseModel {
    constructor() {
        super("Chats", ["id", "id_client", "is_deleted"]);

        this.schema = {
            id: "number",
            id_client: "number",
            is_deleted: "boolean",
        };

        this.attributes = {
            id: null,
            id_client: null,
            is_deleted: false,
        };

        this.relations = {
            Client: {
                type: "hasOne",
                model: () => ClientsModel,
                foreignKey: "id",
                localKey: "id_client",
                as: "Client",
            },
            Messages: {
                type: "hasMany",
                model: () => MessagesModel,
                foreignKey: "id_chat",
                localKey: "id",
                as: "Messages",
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

export default new ChatsModel();
