import { defineStore } from "pinia";
import type { DailyDeclaration, Declaration, DeclarationInput } from "@/typing/index";
import { computed, ref, watch } from "vue";
import { useProjectStore } from "./projectStore";
import { cloneDeep } from "lodash";
import type { UserProject, WeekInYear } from "@/typing/project";
import { deleteFavorites, postFavorites } from "@/API/requests";
import { type DeclRecord } from "@/typing/index";
export const useDeclarationStore = defineStore("declaration", () => {
    const projectStore = useProjectStore();

    const favorites = ref<Set<number>>(new Set([]));

    const declarations = ref<Declaration[]>([]);

    const records = ref<DeclRecord[]>([]);

    const weeksDeclared = computed<WeekInYear[]>(() => {
        const sortedDeclarations = declarations.value.sort((decl1, decl2) =>
            decl2.year !== decl1.year ? decl1.year - decl2.year : decl1.week - decl2.week
        );
        return sortedDeclarations.reduce<WeekInYear[]>((previousValue, currentValue) => {
            const length = previousValue.length;
            if (
                length === 0 ||
                currentValue.week !== previousValue[length - 1].week ||
                currentValue.year !== previousValue[length - 1].year
            ) {
                previousValue.push({
                    week: currentValue.week,
                    year: currentValue.year,
                });
            }
            return previousValue;
        }, []);
    });
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

    const getDeclarations = computed(() => {
        return declarations.value;
    });

    const getUserProjects = computed<UserProject[]>(() => {
        const sortedDeclarations = cloneDeep(declarations.value).sort((decl1, decl2) =>
            decl2.year !== decl1.year ? decl1.year - decl2.year : decl1.week - decl2.week
        );
        const cumulTDE: { [projectId: number]: number } = {};
        sortedDeclarations.forEach((decl) => {
            if (cumulTDE[decl.projectId] === undefined) {
                cumulTDE[decl.projectId] = decl.hours;
            } else {
                cumulTDE[decl.projectId] += decl.hours;
            }
        });
        const userProjects = projectStore.projects.map((project) => {
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
        const sortedProjects = cloneDeep(userProjects).sort((p1, p2) => {
            return p1.id - p2.id;
        });

        sortedProjects.forEach((p) => {
            if (cumulTDE[p.id] !== undefined) {
                p.time_spend = cumulTDE[p.id];
            }
        });
        return sortedProjects;
    });

    function initFavorites(newFavorites: number[]) {
        favorites.value.clear();
        newFavorites.forEach((fav) => favorites.value.add(fav));
    }

    function setDeclarations(newDeclarations: Declaration[], newRecords: DeclRecord[]) {
        declarations.value = newDeclarations;
        records.value = newRecords;
    }

    function isFavorite(projectId: number) {
        return favorites.value.has(projectId);
    }

    async function setFavorite(projectId: number, value: boolean, userId: number) {
        if (value) {
            await postFavorites(userId, projectId);
            favorites.value.add(projectId);
        } else {
            favorites.value.delete(projectId);
            await deleteFavorites(userId, projectId);
        }
    }

    return {
        records,
        favorites,
        getUserProjects,
        dailyHoursSpend,
        getElementaryDeclaration,
        getDailyDeclarationTotal,
        getDailyDeclarationToWeekly,
        setDeclarations,
        weeksDeclared,
        isFavorite,
        setFavorite,
        initFavorites,
        getDeclarations,
    };
});
