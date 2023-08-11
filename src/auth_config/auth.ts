import { envVariableWithValidation } from "../utilities/main";
import { LogLevel, PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
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
                        if (!message.includes("CacheManager:getIdToken - No token found")) {
                            console.info(message);
                        }
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

export const msalInstance = new PublicClientApplication(msalConfig);
