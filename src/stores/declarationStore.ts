import { defineStore } from "pinia";
import type { Declaration, DeclarationInput, domain } from "@/typing/index";
import { computed, ref } from "vue";
import { useProjectStore } from "./projectStore";
import { cloneDeep } from "lodash";
import type { UserProject, WeekInYear } from "@/typing/project";
import { deleteFavorites, postFavorites } from "@/API/requests";
import { type DeclRecord } from "@/typing/index";
export const useDeclarationStore = defineStore("declaration", () => {
    const projectStore = useProjectStore();

    const favorites = ref<Set<number>>(new Set([]));
    const userDomain = ref<domain>("General");
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

    const elementaryDeclarationGetter = computed<DeclarationInput[]>(() => {
        return projectStore.projects.reduce<DeclarationInput[]>((declarations, project) => {
            if (favorites.value.has(project.id)) {
                declarations.push({
                    name: project.name,
                    hours: 0,
                    projectId: project.id,
                    projectCode: project.code,
                    domain: userDomain.value,
                });
            }
            return declarations;
        }, []);
    });

    const getDeclarations = computed(() => {
        return declarations.value;
    });
    async function getDeclaration(year: number, week: number, userId: number): Promise<DeclarationInput[]> {
        const alreadyRegisteredDeclaration = declarations.value.filter((value) => {
            return value.week === week && value.year === year;
        });
        await addFavorites(
            alreadyRegisteredDeclaration
                .filter((d) => {
                    return !favorites.value.has(d.projectId);
                })
                .map((d) => ({
                    userId: userId,
                    projectId: d.projectId,
                }))
        );
        return elementaryDeclarationGetter.value.map((elDec) => ({
            ...elDec,
            hours: alreadyRegisteredDeclaration.find((dec) => dec.projectId === elDec.projectId)?.hours || 0,
        }));
    }
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
                favorite: isFavorite(project.id),
                name: project.name,
                code: project.code,
                time_spent: 0,
                status: project.status,
            };
            return displayableProject;
        });
        const sortedProjects = cloneDeep(userProjects).sort((p1, p2) => {
            return p1.id - p2.id;
        });

        sortedProjects.forEach((p) => {
            if (cumulTDE[p.id] !== undefined) {
                p.time_spent = cumulTDE[p.id];
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
            await postFavorites([{ userId: userId, projectId: projectId }]);
            favorites.value.add(projectId);
        } else {
            favorites.value.delete(projectId);
            await deleteFavorites(userId, projectId);
        }
    }
    async function addFavorites(newFavorites: { projectId: number; userId: number }[]) {
        await postFavorites(newFavorites);
        newFavorites.forEach((val) => favorites.value.add(val.projectId));
    }
    return {
        records,
        userDomain,
        favorites,
        getUserProjects,
        elementaryDeclarationGetter,
        setDeclarations,
        weeksDeclared,
        isFavorite,
        setFavorite,
        addFavorites,
        initFavorites,
        getDeclarations,
        getDeclaration,
    };
});
