import { create } from 'zustand';

export type ChatMessage = {
  id: string;
  chatId: string;
  sender: "me" | "other";
  text: string;
  time?: string;
};

interface ChatState {
  messagesByChat: { [chatId: string]: ChatMessage[] };
  addMessage: (chatId: string, msg: ChatMessage) => void;
  setMessages: (chatId: string, msgs: ChatMessage[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messagesByChat: {},
  addMessage: (chatId, msg) =>
    set((state) => ({
      messagesByChat: {
        ...state.messagesByChat,
        [chatId]: [...(state.messagesByChat[chatId] || []), msg],
      },
    })),
  setMessages: (chatId, msgs) =>
    set((state) => ({
      messagesByChat: {
        ...state.messagesByChat,
        [chatId]: msgs,
      },
    })),
}));
