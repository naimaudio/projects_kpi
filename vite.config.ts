import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import basicSsl from '@vitejs/plugin-basic-ssl'
import fs from 'fs'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
    base: "/app",
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => {
                        return tag.startsWith("fluent");
                    },
                },
            },
        }),
        basicSsl(),
    ],
    server: {
        https: {
            key: fs.readFileSync(path.resolve(__dirname, 'ssl', 'key.pem')),
            cert: fs.readFileSync(path.resolve(__dirname, 'ssl', 'cert.pem')),
          },
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
});
