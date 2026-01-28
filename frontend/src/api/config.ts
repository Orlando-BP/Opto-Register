export const PORT = window.location.protocol === "http:" ? ":3000" : ":3000"

export const API_URL = (import.meta as any).env.DEV
    ? `http://${window.location.hostname}${PORT}`
    : "https://https://www.youtube.com/watch?v=dQw4w9WgXcQ";
