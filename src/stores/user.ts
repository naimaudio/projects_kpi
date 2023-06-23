import { defineStore } from "pinia"
import type { DailyDeclaration, DeclarationInput, Preferences } from "../typing/index"
import { computed, ref } from "vue"
import { useProjectStore } from "./projects"
import { cloneDeep } from "lodash"
import type { Project } from "@/typing/project"
export const useUserStore = defineStore("user", () => {
    const preferences = ref<Preferences>({
        preferedMethod: "weekly",
    })
    const projectStore = useProjectStore()
    const favorites = ref<Set<number>>(new Set([41, 23]))
    const getElementaryDeclaration = computed<DeclarationInput[]>(() => {
        return projectStore.projects.reduce<DeclarationInput[]>((declarations, project) => {
            if (favorites.value.has(project.id)) {
                declarations.push({
                    name: project.name,
                    hours: 0,
                    projectId: project.id,
                })
            }
            return declarations
        }, [])
    })

    const dailyHoursSpend = ref<DailyDeclaration>({
        monday: cloneDeep(getElementaryDeclaration.value),
        tuesday: cloneDeep(getElementaryDeclaration.value),
        wednesday: cloneDeep(getElementaryDeclaration.value),
        thursday: cloneDeep(getElementaryDeclaration.value),
        friday: cloneDeep(getElementaryDeclaration.value),
    })

    const getDailyDeclarationTotal = computed<number>(() => {
        let total = 0
        total += dailyHoursSpend.value.monday.reduce<number>((sum, declaration) => {
            return sum + declaration.hours
        }, 0)
        total += dailyHoursSpend.value.tuesday.reduce<number>((sum, declaration) => {
            return sum + declaration.hours
        }, 0)
        total += dailyHoursSpend.value.wednesday.reduce<number>((sum, declaration) => {
            return sum + declaration.hours
        }, 0)
        total += dailyHoursSpend.value.thursday.reduce<number>((sum, declaration) => {
            return sum + declaration.hours
        }, 0)
        total += dailyHoursSpend.value.friday.reduce<number>((sum, declaration) => {
            return sum + declaration.hours
        }, 0)
        return total
    })

    const getDailyDeclarationToWeekly = computed<DeclarationInput[]>(() => {
        const declarationInput: DeclarationInput[] = cloneDeep(getElementaryDeclaration.value)
        dailyHoursSpend.value.monday.forEach((declaration, index) => {
            declarationInput[index].hours += declaration.hours
        }, 0)
        dailyHoursSpend.value.tuesday.forEach((declaration, index) => {
            declarationInput[index].hours += declaration.hours
        }, 0)
        dailyHoursSpend.value.wednesday.forEach((declaration, index) => {
            declarationInput[index].hours += declaration.hours
        }, 0)
        dailyHoursSpend.value.thursday.forEach((declaration, index) => {
            declarationInput[index].hours += declaration.hours
        }, 0)
        dailyHoursSpend.value.friday.forEach((declaration, index) => {
            declarationInput[index].hours += declaration.hours
        }, 0)
        return declarationInput
    })

    function isFavorite(projectId: number) {
        return favorites.value.has(projectId)
    }
    function setFavorite(projectId: number, value: boolean) {
        if (value) {
            favorites.value.add(projectId)
            const newFavoriteProject = projectStore.projects.find((project) => project.id === projectId)
            if (newFavoriteProject !== undefined) {
                dailyHoursSpend.value.monday.push({ hours: 0, projectId: projectId, name: newFavoriteProject.name })
                dailyHoursSpend.value.tuesday.push({ hours: 0, projectId: projectId, name: newFavoriteProject.name })
                dailyHoursSpend.value.wednesday.push({ hours: 0, projectId: projectId, name: newFavoriteProject.name })
                dailyHoursSpend.value.thursday.push({ hours: 0, projectId: projectId, name: newFavoriteProject.name })
                dailyHoursSpend.value.friday.push({ hours: 0, projectId: projectId, name: newFavoriteProject.name })
            } else {
                throw new Error("project has not been found")
            }
        } else {
            favorites.value.delete(projectId)
            const i = dailyHoursSpend.value.monday.findIndex((declaration) => declaration.projectId === projectId)
            if (i !== -1) {
                dailyHoursSpend.value.monday.splice(i, 1)
                dailyHoursSpend.value.tuesday.splice(i, 1)
                dailyHoursSpend.value.wednesday.splice(i, 1)
                dailyHoursSpend.value.thursday.splice(i, 1)
                dailyHoursSpend.value.friday.splice(i, 1)
            } else {
                throw new Error("project has not been found")
            }
        }
    }

    const getUserProjects = computed<Project[]>(() => {
        return projectStore.projects.map((project) => {
            const displayableProject: Project = {
                id: project.id,
                manager: project?.manager,
                favorite: isFavorite(project.id),
                name: project.name,
                time_spend: 0,
            }
            return displayableProject
        })
    })

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
    }
})
