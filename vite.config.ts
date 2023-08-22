import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import fs from "fs";
import { envVariableWithValidation } from "./src/utilities/main";
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
    ],
    server: {
        https: {
            key: fs.readFileSync(envVariableWithValidation("VITE_SSL_KEY_PATH")),
            cert: fs.readFileSync(envVariableWithValidation("VITE_SSL_CERT_PATH")),
            passphrase: envVariableWithValidation("VITE_SSL_KEY_PASSPHRASE"),
        },
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
});
