import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    return {
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
                key: fs.readFileSync(env.SSL_KEY_PATH),
                cert: fs.readFileSync(env.SSL_CERT_PATH),
                passphrase: env.SSL_KEY_PASSPHRASE,
            },
        },
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
            },
        },
    };
});
