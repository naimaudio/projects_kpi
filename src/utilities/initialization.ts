import { useProjectStore } from "@/stores/projectStore";
import { useUserStore } from "@/stores/userStore";

import { getProjects, getFavorites, getDeclarations, getUser } from "@/API/requests";
import type { RawProject } from "@/typing/project";
import type { SimplifiedResponse } from "@/typing/index";
import { declarationsFromRaw } from "@/API/conversions";
import { projectsFromRaw, userFromRaw } from "../API/conversions";
import { useDeclarationStore } from "@/stores/declarationStore";
import { msalInstance } from "@/auth_config/auth";

export async function initialization() {
    const projectStore = useProjectStore();
    const userStore = useUserStore();
    const declarationStore = useDeclarationStore();
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 1) {
        if (userStore.user?.email !== accounts[0].username) {
            await getUser().then((response) => {
                if (response.status !== 200) {
                    throw Error("Initialization failed");
                } else {
                    userStore.setUser(userFromRaw(response.data));
                }
            });
        }
        await getProjects()
            .then((response: SimplifiedResponse<RawProject[]>) => {
                if (response.status !== 200) {
                    throw Error("Initialization failed");
                } else {
                    projectStore.setProjects(projectsFromRaw(response.data));
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
                    declarationStore.initFavorites(data);
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
                    const { declarations, records } = declarationsFromRaw(response.data, projectStore.projectCodes);
                    declarationStore.setDeclarations(declarations, records);
                }
            });
    }
}
