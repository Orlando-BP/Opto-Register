import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { API_URL } from "@/api/config";

type Chat = {
    id: number;
    idClient: number;
    title: string;
    client: { id: number; name: string; phone?: string; email?: string } | null;
    lastMessage: string | null;
    messages: ChatMessage[];
};

type ChatMessage = {
    id: string;
    chatId: string;
    sender: "me" | "other";
    text: string;
    time?: string;
};

export default function ChatPage() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loadingChats, setLoadingChats] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const socketRef = useRef<any>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Cargar todos los chats con sus mensajes
    useEffect(() => {
        setLoadingChats(true);
        fetch(`${API_URL}/v1/chats`)
            .then((r) => r.json())
            .then((json) => {
                let data = json?.data;
                if (data && data.chats) data = data.chats;
                if (!Array.isArray(data)) data = [];
                setChats(data);
                setLoadingChats(false);
                // Seleccionar el primer chat si no hay uno seleccionado
                if (data.length > 0 && selectedChatId == null) {
                    setSelectedChatId(data[0].id);
                }
            })
            .catch(() => setLoadingChats(false));
    }, []);

    // Cargar mensajes históricos solo cuando cambie el chat seleccionado
    useEffect(() => {
        if (!selectedChatId) {
            setMessages([]);
            return;
        }
        setLoadingMessages(true);
        const chat = chats.find((c) => c.id === selectedChatId);
        if (chat) {
            const mappedMsgs: ChatMessage[] = (chat.messages || []).map((m: any) => ({
                id: String(m.id),
                chatId: String(m.idChat ?? m.id_chat ?? chat.id),
                sender: m.sender === "admin" ? "me" : "other",
                text: m.message,
                time: m.timestamp ? new Date(m.timestamp).toLocaleTimeString() : undefined,
            }));
            setMessages(mappedMsgs);
        } else {
            setMessages([]);
        }
        setLoadingMessages(false);
    }, [selectedChatId]);

    // Conexión socket.io y lógica de mensajes
    useEffect(() => {
        const socket = io(API_URL, { transports: ["websocket"] });
        socketRef.current = socket;

        socket.on("connect", () => {
            socket.emit("admin:join");
        });

        // Recibir mensajes en tiempo real
        const onMessage = (payload: any) => {
            if (!payload) return;
            const chatId = String(payload.idChat ?? payload.chatId ?? payload.chatID ?? "");
            const sender = payload.sender === "admin" ? "me" : "other";
            const time = payload.timestamp ? new Date(payload.timestamp).toLocaleTimeString() : undefined;
            const newMsg: ChatMessage = {
                id: String(payload.id ?? `s_${Date.now()}`),
                chatId,
                sender,
                text: String(payload.message ?? payload.text ?? ""),
                time,
            };
            // Debug: log para ver si el mensaje llega y a qué chat corresponde
            console.log('[ADMIN SOCKET] Recibido', { payload, selectedChatId, chatId, newMsg });
            // Si el mensaje es del chat seleccionado, agregarlo a la lista
            if (selectedChatId && String(selectedChatId) === chatId) {
                setMessages((prev) => [...prev, newMsg]);
            }
            // Actualizar el último mensaje en la lista de chats
            setChats((prev) => prev.map((c) =>
                String(c.id) === chatId ? { ...c, lastMessage: newMsg.text } : c
            ));
        };
        socket.on("chat message", onMessage);

        return () => {
            socket.off("chat message", onMessage);
            socket.disconnect();
            socketRef.current = null;
        };
    }, [selectedChatId]);

    // Unirse a la sala del chat seleccionado
    useEffect(() => {
        if (!socketRef.current || !selectedChatId) return;
        socketRef.current.emit("client:join", { chatId: selectedChatId });
    }, [selectedChatId]);

    // Enviar mensaje
    function handleSendMessage() {
        const text = inputRef.current?.value.trim() ?? "";
        if (!text || !selectedChatId) return;
        const now = new Date();
        const time = now.toLocaleTimeString();
        const outgoing: ChatMessage = {
            id: `a_${Date.now()}`,
            chatId: String(selectedChatId),
            sender: "me",
            text,
            time,
        };
        setMessages((prev) => [...prev, outgoing]);
        if (inputRef.current) inputRef.current.value = "";
        socketRef.current?.emit("chat message", {
            text,
            chatId: selectedChatId,
            sender: "admin",
            remitent: "client",
        });
    }

    // Obtener datos del chat seleccionado
    const selectedChat = chats.find((c) => c.id === selectedChatId);

    return (
        <div className="h-svh bg-slate-950 text-slate-100">
            <div className="mx-auto flex h-full max-w-6xl flex-col gap-4 px-6 py-10">
                <div className="space-y-1">
                    <h1 className="text-3xl font-semibold">Centro de chat</h1>
                    <p className="text-sm text-slate-400">
                        Atiende consultas de clientes en tiempo real.
                    </p>
                </div>

                <div className="grid h-full min-h-135 grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
                    <section className="flex h-full flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                        <div className="space-y-2">
                            <h2 className="text-sm font-semibold text-slate-200">
                                Conversaciones
                            </h2>
                        </div>
                        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                            {loadingChats ? (
                                <div className="text-xs text-slate-400">Cargando chats...</div>
                            ) : chats.length === 0 ? (
                                <div className="text-xs text-slate-400">No hay chats</div>
                            ) : (
                                chats.map((chat) => (
                                    <div
                                        key={chat.id}
                                        className={`rounded-lg px-3 py-2 cursor-pointer transition-colors ${selectedChatId === chat.id ? "bg-blue-700/30" : "hover:bg-slate-800/60"}`}
                                        onClick={() => setSelectedChatId(chat.id)}
                                    >
                                        <div className="font-medium text-slate-200 text-sm">
                                            {chat.title}
                                        </div>
                                        <div className="text-xs text-slate-400 truncate">
                                            {chat.lastMessage || "Sin mensajes"}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    <section className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/70">
                        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
                            <div className="space-y-1">
                                <h2 className="text-lg font-semibold">
                                    {selectedChat?.client?.name || selectedChat?.title || "Sin cliente"}
                                </h2>
                                <p className="text-xs text-slate-400">
                                    {selectedChat?.client?.email || selectedChat?.client?.phone || ""}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-slate-700 text-slate-200"
                                >
                                    Ver perfil
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-slate-700 text-slate-200"
                                >
                                    Marcar como resuelto
                                </Button>
                            </div>
                        </header>

                        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-6">
                            {/* Debug: mostrar mensajes actuales en consola */}
                            {console.log('[ADMIN UI] Render messages', messages)}
                            {loadingMessages ? (
                                <div className="text-xs text-slate-400">Cargando mensajes...</div>
                            ) : messages.length === 0 ? (
                                <div className="text-xs text-slate-400">Sin mensajes aún</div>
                            ) : (
                                messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[78%] space-y-1 rounded-2xl px-4 py-2 text-sm shadow-sm ${message.sender === "me" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-100"}`}
                                        >
                                            <p>{message.text}</p>
                                            <span className="text-[10px] opacity-70">{message.time}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <footer className="border-t border-slate-800 px-5 py-4">
                            <form
                                className="flex flex-wrap gap-2"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    handleSendMessage();
                                }}
                            >
                                <Input
                                    // No value ni onChange para permitir edición
                                    placeholder="Escribe un mensaje..."
                                    className="flex-1"
                                    ref={inputRef}
                                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleSendMessage(); } }}
                                />
                                <Button type="submit">Enviar</Button>
                            </form>
                        </footer>
                    </section>
                </div>
            </div>
        </div>
    );
}