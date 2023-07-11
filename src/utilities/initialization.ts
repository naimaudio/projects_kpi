import { PublicClientApplication } from "@azure/msal-browser";
import { useAuthStore } from "@/stores/authStore";
import { useProjectStore } from "@/stores/projectStore";
import { useUserStore } from "@/stores/userStore";

import { getProjects, getFavorites, getDeclarations, getUser } from "@/API/requests";
import type { RawProject } from "@/typing/project";

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
            .then((user) => userStore.setUserFromRaw(user))
            .then(() => getProjects())
            .then((projects: RawProject[]) => projectStore.setProjectsFromRaw(projects))
            .then(() => {
                const userId = userStore.userIdGetter;
                if (userId !== undefined) {
                    return getFavorites(userId);
                } else throw Error("User not logged in");
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
                } else throw Error("User not logged in");
            })
            .then((declarations) => userStore.setDeclarationsFromRaw(declarations));
    }
}
