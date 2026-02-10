import express from "express";
import { FRONTEND_URL, PORT } from "./config.js";
import mainRoutes from "./api/v1/routes/index.js";
import morgan from "morgan";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import MessagesService from "./services/messages.service.js";
import ChatsModel from "./models/chats.model.js";
import ChatsService from "./services/chats.service.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: FRONTEND_URL,
        credentials: true,
    },
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
    },
});

const ADMIN_ROOM = "admins";

io.on("connection", (socket) => {
        // Permitir que el cliente se una a la sala de su chat
        socket.on("client:join", ({ chatId }) => {
            if (chatId) {
                socket.join(String(chatId));
            }
        });
    console.log("Nuevo cliente conectado:", socket.id);
    socket.join(socket.id);

    socket.on("admin:join", () => {
        socket.join(ADMIN_ROOM);
    });

    socket.on("disconnect", () => {
        console.log("Cliente desconectado:", socket.id);
    });

        socket.on("chat message", async (msg) => {
            // Determinar el id del cliente
            let clientId = null;
            if (msg?.chatId && Number.isFinite(Number(msg.chatId))) {
                clientId = Number(msg.chatId);
            } else if (msg?.clientId && Number.isFinite(Number(msg.clientId))) {
                clientId = Number(msg.clientId);
            } else if (msg?.senderId && Number.isFinite(Number(msg.senderId))) {
                clientId = Number(msg.senderId);
            }

            // Si no hay texto, no procesar
            const text = typeof msg === "string" ? msg : msg?.text ?? "";
            if (!text) return;

            let chatId = null;
            let chatCreated = false;
            try {
                // Buscar si ya existe un chat para ese cliente
                if (clientId) {
                    let chat = await ChatsService.findOneByWhere({ id_client: clientId, is_deleted: false });
                    if (!chat) {
                        chat = await ChatsService.create({ id_client: clientId });
                        chatCreated = true;
                    }
                    chatId = chat.id;
                } else {
                    // Si no hay clientId, usar el id del socket como fallback
                    chatId = socket.id;
                }

                // Unir al cliente a la sala del chat (importante para recibir mensajes de ese chat)
                socket.join(String(chatId));

                // Guardar el mensaje
                if (chatId) {
                    await MessagesService.create({
                        id_chat: Number(chatId),
                        sender: String(msg?.sender ?? "client"),
                        remitent: String(msg?.remitent ?? "admin"),
                        message: String(text),
                    });
                }
            } catch (error) {
                console.error("Error guardando mensaje o creando chat:", error);
            }

            // Preparar el payload para emitir
            const payload = {
                text,
                senderId: socket.id,
                chatId,
                sender: msg?.sender ?? "client",
                remitent: msg?.remitent ?? "admin",
            };

            // Si se acaba de crear el chat, notificar al cliente el id del chat
            if (chatCreated && chatId) {
                socket.emit("chat:assign", { chatId });
            }

            io.to(chatId).emit("chat message", payload);
            io.to(ADMIN_ROOM).emit("chat message", payload);
    });
});

app.use(morgan("dev"));
app.use(express.json());
app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true,
    }),
);

// Desactivar ETag para evitar respuestas 304 basadas en ETag
app.disable("etag");
// Forzar no-cache en todas las respuestas
app.use((req, res, next) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    next();
});

app.use("/v1", mainRoutes);

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
