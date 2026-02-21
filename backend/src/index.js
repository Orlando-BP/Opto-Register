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

// const ADMIN_ROOM = "admins";

io.on("connection", async (socket) => {
            // Permitir que el admin se una a la sala de un chat específico
            socket.on("admin:joinChat", ({ chatId }) => {
                if (chatId) {
                    socket.join(String(String(chatId)));
                    console.log(`[SOCKET][DEBUG] Admin ${socket.id} unido a sala de chat ${chatId}`);
                }
            });
            socket.on("admin:joinGeneral", ({  }) => {
                socket.join("general");
                console.log(`[SOCKET][DEBUG] Admin ${socket.id} unido a sala general`);
            });
        // Permitir que el cliente se una a la sala de su chat
        socket.on("client:join", ({ chatId }) => {
            if (chatId) {
                socket.join(String(String(chatId)));
                console.log(`[SOCKET][DEBUG] Cliente ${socket.id} unido a sala ${chatId}`);
            }
        });
        // Depuración desde el cliente
        // socket.on("chat:debug", (data) => {
        //     console.log(`[SOCKET][DEBUG] Mensaje de depuración recibido:`, data);
        // });
    // console.log("Nuevo cliente conectado:", socket.id);
    // socket.join(socket.id);

    // socket.on("admin:join", () => {
    //     socket.join(ADMIN_ROOM);
    //     console.log(`[SOCKET][DEBUG] Admin ${socket.id} unido a sala ${ADMIN_ROOM}`);
    // });

    socket.on("disconnect", () => {
        console.log("Cliente desconectado:", socket.id);
    });

        socket.on("chat message", async (msg) => {
            console.log(`[SOCKET][DEBUG] Mensaje recibido para enviar:`, msg);
            // Determinar el id del cliente
            let clientId = null;
            if (msg?.idClient && Number.isFinite(Number(msg.idClient))) {
                clientId = Number(msg.idClient);
            }

            // Si no hay texto, no procesar
            const text = typeof msg === "string" ? msg : msg?.text ?? "";
            if (!text) {
                console.log(`[SOCKET][DEBUG] Mensaje vacío, no se envía.`);
                return;
            }

            let clientChatId = null;
            let chatCreated = false;
            try {
                // Buscar si ya existe un chat para ese cliente
                if (clientId) {
                    let chat = await ChatsService.findOneByWhere({ id_client: clientId, is_deleted: false });
                    if (!chat) {
                        chat = await ChatsService.create({ id_client: clientId });
                        chatCreated = true;
                    }
                    clientChatId = chat.id;
                }
                // Guardar el mensaje
                if (clientChatId) {
                    await MessagesService.create({
                        id_chat: Number(clientChatId),
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
                clientChatId,
                sender: msg?.sender ?? "client",
                remitent: msg?.remitent ?? "admin",
                idClient: msg?.idClient ?? "??",
                clientName: msg?.clientName ?? "Cliente-Desconocido",
            };

            // Log sockets conectados a la sala
            const socketsInRoom = io.sockets.adapter.rooms.get(String(clientId));
            console.log(`[SOCKET][DEBUG] Sockets en sala ${clientId}:`, socketsInRoom ? Array.from(socketsInRoom) : []);

            console.log(`[SOCKET][DEBUG] Emitiendo mensaje a sala ${clientId}. Payload:`, payload);
            io.to(String(clientId)).emit("chat message", payload);
            console.log(`[SOCKET][DEBUG] Emitiendo mensaje a sala general.`);
            io.to("general").emit("chat message general", payload);
            // io.to(ADMIN_ROOM).emit("chat message", payload);
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
