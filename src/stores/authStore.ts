import { LogLevel, type Configuration } from "@azure/msal-browser";
import { defineStore } from "pinia";
import { ref } from "vue";
export const useAuthStore = defineStore("auth", () => {
    const msalConfig = ref<Configuration>({
        auth: {
            clientId: import.meta.env.CLIENT_ID,
            authority: import.meta.env.AUTHORITY,
            redirectUri: import.meta.env.REDIRECT_URI,
        },
        cache: {
            cacheLocation: "localStorage",
        },
        system: {
            loggerOptions: {
                loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
                    if (containsPii) {
                        return;
                    }
                    switch (level) {
                        case LogLevel.Error:
                            console.error(message);
                            return;
                        case LogLevel.Info:
                            console.info(message);
                            return;
                        case LogLevel.Verbose:
                            console.debug(message);
                            return;
                        case LogLevel.Warning:
                            console.warn(message);
                            return;
                    }
                },
            },
        },
    });
    const accessToken = ref<string>("");

    function setAccessToken(token: string) {
        accessToken.value = token;
    }
    return { msalConfig, accessToken, setAccessToken };
});
