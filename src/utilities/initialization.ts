import { PublicClientApplication } from "@azure/msal-browser";
import { useAuthStore } from "@/stores/authStore";
import { useProjectStore } from "@/stores/projectStore";
import { useUserStore } from "@/stores/userStore";

import { getProjects, getFavorites, getDeclarations, getUser } from "@/API/requests";
import type { RawProject } from "@/typing/project";
import type { SimplifiedResponse } from "@/typing/index";

export async function initialization() {
    const projectStore = useProjectStore();
    const userStore = useUserStore();
    const authStore = useAuthStore();

    const msalInstance = new PublicClientApplication(authStore.msalConfig);
    authStore.msalInstance = msalInstance;
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 1) {
        authStore.setAccount(accounts[0]);

        await getUser()
            .then((response) => {
                if (response.status !== 200) {
                    throw Error("Initialization failed");
                } else {
                    userStore.setUserFromRaw(response.data);
                }
            })
            .then(() => getProjects())
            .then((response: SimplifiedResponse<RawProject[]>) => {
                if (response.status !== 200) {
                    throw Error("Initialization failed");
                } else {
                    projectStore.setProjectsFromRaw(response.data);
                }
            })
            .then(() => {
                const userId = userStore.userIdGetter;
                if (userId !== undefined) {
                    return getFavorites(userId);
                } else throw Error("Initialization failed");
            })
            .then(({ status: status, data: data }) => {
                if (status === 200) {
                    userStore.initFavorites(data);
                }
            })
            .then(() => {
                const userId = userStore.userIdGetter;
                if (userId !== undefined) {
                    return getDeclarations(userId);
                } else throw Error("Initialization failed");
            })
            .then((response) => {
                if (response.status !== 200) {
                    throw Error("Initialization failed");
                } else {
                    userStore.setDeclarationsFromRaw(response.data);
                }
            });
    }
}
