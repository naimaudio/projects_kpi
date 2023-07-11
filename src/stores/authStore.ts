import { envVariableWithValidation } from "@/utilities/main";
import { LogLevel, type Configuration, type AccountInfo, PublicClientApplication } from "@azure/msal-browser";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
export const useAuthStore = defineStore("auth", () => {
    const msalConfig = computed<Configuration>(() => {
        return {
            auth: {
                clientId: envVariableWithValidation("VITE_CLIENT_ID"),
                authority: envVariableWithValidation("VITE_AUTHORITY"),
                redirectUri: envVariableWithValidation("VITE_REDIRECT_URI"),
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
        };
    });
    const msalInstance = ref<PublicClientApplication | undefined>();
    const accessToken = ref<string>("");

    const account = ref<AccountInfo | null>(null);
    const accountGetter = computed(() => {
        return account.value;
    });
    function setAccessToken(token: string) {
        accessToken.value = token;
    }

    function setAccount(newAccount: AccountInfo) {
        account.value = newAccount;
    }

    return {
        msalInstance,
        msalConfig,
        accessToken,
        setAccessToken,
        setAccount,
        accountGetter,
    };
});
