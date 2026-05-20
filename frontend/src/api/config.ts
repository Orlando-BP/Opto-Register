export const PORT = window.location.protocol === "http:" ? ":3070" : ":3070"

export const API_URL = (import.meta as any).env.DEV
    ? `http://192.168.0.82${PORT}`//`http://192.168.0.82${PORT}`//ip del localhost
    : "https://https://www.youtube.com/watch?v=dQw4w9WgXcQ";
