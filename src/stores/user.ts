import { defineStore } from "pinia";
import type { DailyDeclaration, DeclarationInput, Preferences } from "../typing/index";
import { computed, ref, watch } from "vue";
import { useProjectStore } from "./projects";
import { cloneDeep } from "lodash";
import type { UserProject } from "@/typing/project";
import { deleteFavorites, postFavorites } from "@/API/requests";
export const useUserStore = defineStore("user", () => {
    const preferences = ref<Preferences>({
        preferedMethod: "weekly",
    });
    const projectStore = useProjectStore();
    const favorites = ref<Set<number>>(new Set([]));
    const getElementaryDeclaration = computed<DeclarationInput[]>(() => {
        return projectStore.projects.reduce<DeclarationInput[]>((declarations, project) => {
            if (favorites.value.has(project.id)) {
                declarations.push({
                    name: project.name,
                    hours: 0,
                    projectId: project.id,
                });
            }
            return declarations;
        }, []);
    });

    const dailyHoursSpend = ref<DailyDeclaration>([
        cloneDeep(getElementaryDeclaration.value),
        cloneDeep(getElementaryDeclaration.value),
        cloneDeep(getElementaryDeclaration.value),
        cloneDeep(getElementaryDeclaration.value),
        cloneDeep(getElementaryDeclaration.value),
    ]);

    const getDailyDeclarationTotal = computed<number>(() => {
        let total = 0;
        total += dailyHoursSpend.value[0].reduce<number>((sum, declaration) => {
            return sum + declaration.hours;
        }, 0);
        total += dailyHoursSpend.value[1].reduce<number>((sum, declaration) => {
            return sum + declaration.hours;
        }, 0);
        total += dailyHoursSpend.value[2].reduce<number>((sum, declaration) => {
            return sum + declaration.hours;
        }, 0);
        total += dailyHoursSpend.value[3].reduce<number>((sum, declaration) => {
            return sum + declaration.hours;
        }, 0);
        total += dailyHoursSpend.value[4].reduce<number>((sum, declaration) => {
            return sum + declaration.hours;
        }, 0);
        return total;
    });

    const getDailyDeclarationToWeekly = computed<DeclarationInput[]>(() => {
        const declarationInput: DeclarationInput[] = cloneDeep(getElementaryDeclaration.value);
        dailyHoursSpend.value[0].forEach((declaration, index) => {
            declarationInput[index].hours += declaration.hours;
        }, 0);
        dailyHoursSpend.value[1].forEach((declaration, index) => {
            declarationInput[index].hours += declaration.hours;
        }, 0);
        dailyHoursSpend.value[2].forEach((declaration, index) => {
            declarationInput[index].hours += declaration.hours;
        }, 0);
        dailyHoursSpend.value[3].forEach((declaration, index) => {
            declarationInput[index].hours += declaration.hours;
        }, 0);
        dailyHoursSpend.value[4].forEach((declaration, index) => {
            declarationInput[index].hours += declaration.hours;
        }, 0);
        return declarationInput;
    });

    function isFavorite(projectId: number) {
        return favorites.value.has(projectId);
    }

    watch(favorites.value, (newValue) => {
        projectStore.projects.forEach((project) => {
            if (newValue.has(project.id)) {
                if (dailyHoursSpend.value[0].findIndex((decl) => decl.projectId === project.id) === -1) {
                    dailyHoursSpend.value[0].push({ hours: 0, projectId: project.id, name: project.name });
                    dailyHoursSpend.value[1].push({ hours: 0, projectId: project.id, name: project.name });
                    dailyHoursSpend.value[2].push({ hours: 0, projectId: project.id, name: project.name });
                    dailyHoursSpend.value[3].push({ hours: 0, projectId: project.id, name: project.name });
                    dailyHoursSpend.value[4].push({ hours: 0, projectId: project.id, name: project.name });
                } else {
                    // throw new Error("project has not been found");
                }
            }
        });
        dailyHoursSpend.value[0].forEach((decl, i) => {
            if (!newValue.has(decl.projectId)) {
                dailyHoursSpend.value[0].splice(i, 1);
                dailyHoursSpend.value[1].splice(i, 1);
                dailyHoursSpend.value[2].splice(i, 1);
                dailyHoursSpend.value[3].splice(i, 1);
                dailyHoursSpend.value[4].splice(i, 1);
            }
        });
    });
    async function setFavorite(projectId: number, value: boolean) {
        if (value) {
            await postFavorites(2, projectId);
            favorites.value.add(projectId);
        } else {
            favorites.value.delete(projectId);
            await deleteFavorites(2, projectId);
        }
    }

    const getUserProjects = computed<UserProject[]>(() => {
        return projectStore.projects.map((project) => {
            const displayableProject: UserProject = {
                id: project.id,
                manager: project?.manager,
                favorite: isFavorite(project.id),
                name: project.name,
                code: project.code,
                time_spend: 0,
            };
            return displayableProject;
        });
    });
    function initFavorites(newFavorites: number[]) {
        favorites.value.clear();
        newFavorites.forEach((fav) => favorites.value.add(fav));
    }
    return {
        preferences,
        favorites,
        getUserProjects,
        dailyHoursSpend,
        getElementaryDeclaration,
        getDailyDeclarationTotal,
        getDailyDeclarationToWeekly,
        isFavorite,
        setFavorite,
        initFavorites,
    };
});
