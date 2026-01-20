import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
    root: ".",
    server: {
        port: 5173,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./"),
            // fix loading all icon chunks in dev mode
            // https://github.com/tabler/tabler-icons/issues/1233
            "@tabler/icons-react":"@tabler/icons-react/dist/esm/icons/index.mjs",
        },
    },
});
