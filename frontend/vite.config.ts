import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    root: ".",
    server: {
        port: 5173,
    },
    plugins: [
        tailwindcss()
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./"),
            // fix loading all icon chunks in dev mode
            // https://github.com/tabler/tabler-icons/issues/1233
            "@tabler/icons-react":
                "@tabler/icons-react/dist/esm/icons/index.mjs",
        },
    },
});
