import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { API_URL } from "@/api/config";

type ClientItem = {
    id: number;
    name: string;
};

type ChatMessage = {
    id: string;
    chatId: string;
    sender: "me" | "other";
    text: string;
    time?: string;
};

export default function ClientChatPage() {
    const [clients, setClients] = useState<ClientItem[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [draft, setDraft] = useState("");

    const socketRef = useRef<any>(null);

    useEffect(() => {
        if (clients.length > 0) return; // Ya están cargados, no vuelvas a cargar
        console.log("[Chat] Cargando lista de clientes...");
        fetch(`${API_URL}/v1/clients`)
            .then((r) => r.json())
            .then((json) => {
                const data = Array.isArray(json?.data) ? json.data : json?.data?.clients ?? [];
                const mapped = data.map((c: any) => ({ id: c.id, name: c.name }));
                setClients(mapped);
                console.log("[Chat] Clientes cargados:", mapped);
            })
            .catch((err) => {
                console.error("[Chat] Error cargando clientes", err);
            });
    }, [clients]);

    // Inicializar cliente seleccionado solo si es null y hay clientes
    useEffect(() => {
        if (clients.length > 0 && selectedClientId == null) {
            console.log(`[Chat] Inicializando cliente seleccionado con id: ${clients[0].id}`);
            setSelectedClientId(clients[0].id);
        }
    }, [clients, selectedClientId]);

    // Cargar mensajes históricos al cambiar de cliente (solo una petición)
    useEffect(() => {
        if (!selectedClientId) return;
        fetch(`${API_URL}/v1/chats/`)//trae todos los chats con sus mensajes correspondientes
            .then((r) => r.json())
            .then((json) => {
                // console.log("[Chat] Respuesta de chats:", json);
                const chat = Array.isArray(json?.data) && json.data.length > 0
                    ? json.data.find((c: any) => c.id_client === selectedClientId)
                    : null;
                // console.log("[Chat] Chat encontrado:", chat);
                if (chat && chat.id) {
                    const msgs = Array.isArray(chat.messages) ? chat.messages : [];
                    // console.log(`[Chat] Mensajes encontrados para chat ${chat.id}:`, msgs);
                    const mappedMsgs = msgs.map((m: any) => ({
                        id: String(m.id),
                        chatId: String(m.id_chat),
                        sender: m.sender === "client" ? "me" : "other",
                        text: m.message,
                        time: m.timestamp ? new Date(m.timestamp).toLocaleTimeString() : undefined,
                    }));
                    setMessages(mappedMsgs);
                } else {
                    console.log(`[Chat] No se encontró chat para el cliente ${selectedClientId}`);
                    setMessages([]);
                }
            })
            .catch((err) => {
                console.error(`[Chat] Error consultando chat para cliente ${selectedClientId}:`, err);
                setMessages([]);
            });
    }, [selectedClientId]);

    useEffect(() => {
        if (selectedClientId == null) return;
        console.log("[Chat] Inicializando conexión socket.io para cliente:", selectedClientId);
        const socket = io(API_URL, { transports: ["websocket"] });
        socketRef.current = socket;

        let chatRoomId: number | null = null;

        socket.on("connect", () => {
            console.log("[Chat] Socket conectado, socketId:", socket.id);
            // Unirse a la sala inmediatamente
            console.log(`[Chat][DEBUG] Uniendo socket a sala del cliente (on connect): ${selectedClientId}`);
            socket.emit("client:join", { chatId: selectedClientId });
            socket.emit("chat:debug", { action: "join", chatId: selectedClientId });
        });

        // Recibe el id real del chat y se une a la sala correcta
        socket.on("chat:assign", ({ chatId }) => {
            chatRoomId = chatId;
            console.log(`[Chat] Asignado a sala de chat: ${chatId}`);
            // Unirse a la sala de chatId cada vez que se recibe la asignación
            socket.emit("client:join", { chatId });
            socket.emit("chat:debug", { action: "join", chatId });
        });

        const onMessage = (payload: any) => {
            if (!payload) {
                console.log("[Chat][DEBUG] Payload vacío en chat message");
                return;
            }
            console.log("[Chat][DEBUG] Payload recibido por socket:", payload);
            const chatId = String(payload.idChat ?? payload.chatId ?? chatRoomId ?? selectedClientId ?? "");
            const sender = payload.sender === "client" ? "me" : "other";
            const time = payload.timestamp ? new Date(payload.timestamp).toLocaleTimeString() : undefined;
            const newMsg: ChatMessage = {
                id: String(payload.id ?? `s_${Date.now()}`),
                chatId,
                sender,
                text: String(payload.message ?? payload.text ?? ""),
                time,
            };
            console.log("[Chat][DEBUG] Mensaje mapeado:", newMsg);
            setMessages((prev) => [...prev, newMsg]);
        };

        // Handler para 'pong'
        const onPong = (data: any) => {
            console.log(`[Chat][DEBUG] Pong recibido:`, data);
        };
        socket.on("chat message", onMessage);
        socket.on("pong", onPong);

        return () => {
            socket.off("chat message", onMessage);
            socket.off("chat:assign");
            socket.off("pong", onPong);
            socket.disconnect();
            socketRef.current = null;
        };
    }, [selectedClientId]);

    useEffect(() => {
        if (!socketRef.current) return;
        if (selectedClientId == null) return;
        console.log(`[Chat][DEBUG] Uniendo socket a sala del cliente: ${selectedClientId}`);
        socketRef.current.emit("client:join", { chatId: selectedClientId });
        // Confirmar unión a sala
        socketRef.current.emit("chat:debug", { action: "join", chatId: selectedClientId });
    }, [selectedClientId]);

    function handleSend() {
        const text = draft.trim();
        if (!text || !selectedClientId) return;

        const now = new Date();
        const time = now.toLocaleTimeString();

        const outgoing: ChatMessage = {
            id: `c_${Date.now()}`,
            chatId: String(selectedClientId),
            sender: "me",
            text,
            time,
        };

        console.log(`[Chat] Enviando mensaje:`, outgoing);
        setMessages((prev) => [...prev, outgoing]);
        setDraft("");

        socketRef.current?.emit("chat message", {
            text,
            chatId: selectedClientId,
            sender: "client",
            remitent: "admin",
            clientId: selectedClientId,
            clientName: clients.find((c) => c.id === selectedClientId)?.name ?? `Cliente-${selectedClientId}`,
        });
    }

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Chat cliente (simulación)</h2>

            <div className="mb-4">
                <label className="block text-sm text-slate-400 mb-1">Seleccionar cliente</label>
                <select
                    className="w-full p-2 border rounded"
                    value={selectedClientId ?? ""}
                    onChange={(e) => setSelectedClientId(Number(e.target.value) || null)}
                >
                    {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name} ({c.id})
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4 border rounded p-3 h-60 overflow-y-auto bg-white/5">
                {messages.length === 0 ? (
                    <div className="text-sm text-slate-400">Sin mensajes aún</div>
                ) : (
                    messages.map((m) => {
                        // console.log("[Chat][DEBUG] Renderizando mensaje:", m);
                        return (
                            <div key={m.id} className={`mb-2 max-w-3/4 ${m.sender === "me" ? "ml-auto text-right" : "mr-auto text-left"}`}>
                                <div className={`inline-block px-3 py-2 rounded ${m.sender === "me" ? "bg-sky-600" : "bg-slate-700"}`}>
                                    <div className="text-sm">{m.text}</div>
                                    {m.time && <div className="text-xs text-slate-300 mt-1">{m.time}</div>}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="flex gap-2">
                <input
                    className="flex-1 p-2 border rounded"
                    placeholder="Escribe un mensaje..."
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSend();
                    }}
                />
                <button className="px-4 py-2 bg-sky-600 rounded text-white" onClick={handleSend}>
                    Enviar
                </button>
                <button className="px-4 py-2 bg-green-600 rounded text-white" onClick={() => {
                    if (socketRef.current && selectedClientId) {
                        console.log(`[Chat][DEBUG] Enviando ping a sala ${selectedClientId}`);
                        socketRef.current.emit("ping", { chatId: selectedClientId });
                    }
                }}>
                    Ping
                </button>
            </div>
        </div>
    );
}
