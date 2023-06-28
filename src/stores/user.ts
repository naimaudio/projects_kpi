import { defineStore } from "pinia";
import type { DailyDeclaration, DeclarationInput, Preferences } from "../typing/index";
import { computed, ref } from "vue";
import { useProjectStore } from "./projects";
import { cloneDeep } from "lodash";
import type { UserProject } from "@/typing/project";
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
    function setFavorite(projectId: number, value: boolean) {
        if (value) {
            favorites.value.add(projectId);
            const newFavoriteProject = projectStore.projects.find((project) => project.id === projectId);
            if (newFavoriteProject !== undefined) {
                dailyHoursSpend.value[0].push({ hours: 0, projectId: projectId, name: newFavoriteProject.name });
                dailyHoursSpend.value[1].push({ hours: 0, projectId: projectId, name: newFavoriteProject.name });
                dailyHoursSpend.value[2].push({ hours: 0, projectId: projectId, name: newFavoriteProject.name });
                dailyHoursSpend.value[3].push({ hours: 0, projectId: projectId, name: newFavoriteProject.name });
                dailyHoursSpend.value[4].push({ hours: 0, projectId: projectId, name: newFavoriteProject.name });
            } else {
                throw new Error("project has not been found");
            }
        } else {
            favorites.value.delete(projectId);
            const i = dailyHoursSpend.value[0].findIndex((declaration) => declaration.projectId === projectId);
            if (i !== -1) {
                dailyHoursSpend.value[0].splice(i, 1);
                dailyHoursSpend.value[1].splice(i, 1);
                dailyHoursSpend.value[2].splice(i, 1);
                dailyHoursSpend.value[3].splice(i, 1);
                dailyHoursSpend.value[4].splice(i, 1);
            } else {
                throw new Error("project has not been found");
            }
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
    };
});
