import BaseModel from "../BaseModel.js";
import ChatsModel from "./chats.model.js";

class MessagesModel extends BaseModel {
    constructor() {
        super("Messages", [
            "id",
            "id_chat",
            "sender",
            "remitent",
            "message",
            "timestamp",
            "is_deleted",
        ]);

        this.schema = {
            id: "number",
            id_chat: "number",
            sender: "string",
            remitent: "string",
            message: "string",
            timestamp: "date",
            is_deleted: "boolean",
        };

        this.attributes = {
            id: null,
            id_chat: null,
            sender: "",
            remitent: "",
            message: "",
            timestamp: null,
            is_deleted: false,
        };

        this.relations = {
            Chat: {
                type: "hasOne",
                model: () => ChatsModel,
                foreignKey: "id",
                localKey: "id_chat",
                as: "Chat",
            },
        };

        this.foreignKeys = {
            id_chat: {
                model: () => ChatsModel,
                refColumn: "id",
                refTable: "Chats",
            },
        };
    }
}

export default new MessagesModel();
