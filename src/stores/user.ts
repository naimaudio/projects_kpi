import { defineStore } from "pinia";
import type { DailyDeclaration, DeclarationInput, Preferences } from "../typing/index"
import { computed, ref, watch } from "vue";
import { useProjectStore } from "./projects";
import { cloneDeep } from 'lodash'
import type { Project } from "@/typing/project";
export const useUserStore = defineStore('user', () => {
  const preferences = ref<Preferences>({
    preferedMethod: "daily"
  })
  const projectStore = useProjectStore()
  const favorites = ref<Set<string>>(new Set(["FH2101"]))
  const getElementaryDeclaration = computed<DeclarationInput[]>(()=> {
    return projectStore.projects.reduce<DeclarationInput[]>(
      (declarations, project) => 
      { 
        if (favorites.value.has(project.id)){
          declarations.push({"name": project.name, "hours": 1, 'projectId': project.id})
        }
        return declarations
      }, [])})

  const dailyHoursSpend = ref<DailyDeclaration>({
    monday: cloneDeep(getElementaryDeclaration.value),
    tuesday: cloneDeep(getElementaryDeclaration.value),
    wednesday: cloneDeep(getElementaryDeclaration.value),
    thursday: cloneDeep(getElementaryDeclaration.value),
    friday: cloneDeep(getElementaryDeclaration.value)
  })

  function isFavorite(projectId: string) {
    return favorites.value.has(projectId)
  }
  function setFavorite(projectId: string, value: boolean) {
    if (value){
      favorites.value.add(projectId)
      const newFavoriteProject = projectStore.projects.find(project => project.id === projectId)
      if (newFavoriteProject !== undefined ) {
        dailyHoursSpend.value.monday.push({hours:0, projectId: projectId, name: newFavoriteProject.name})
        dailyHoursSpend.value.tuesday.push({hours:0, projectId: projectId, name: newFavoriteProject.name})
        dailyHoursSpend.value.wednesday.push({hours:0, projectId: projectId, name: newFavoriteProject.name})
        dailyHoursSpend.value.thursday.push({hours:0, projectId: projectId, name: newFavoriteProject.name})
        dailyHoursSpend.value.friday.push({hours:0, projectId: projectId, name: newFavoriteProject.name})
      } 
      else {
        throw new Error('project has not been found')
      }
    } else {
      favorites.value.delete(projectId)
      const i = dailyHoursSpend.value.monday.findIndex((declaration) => declaration.projectId === projectId)
      if (i !== -1 ) {
        dailyHoursSpend.value.monday.splice(i,1)
        dailyHoursSpend.value.tuesday.splice(i,1)
        dailyHoursSpend.value.wednesday.splice(i,1)
        dailyHoursSpend.value.thursday.splice(i,1)
        dailyHoursSpend.value.friday.splice(i,1)
      } 
      else {
        throw new Error('project has not been found')
      }
    }
  }
  
  const getUserProjects = computed<Project[]>(() =>
    projectStore.projects.map(
      ( project ) =>
      {
        const displayableProject: Project = {
          id: project.id,
          manager: project?.manager,
          favorite: isFavorite(project.id),
          name: project.name,
          time_spend: 0
        }
        return displayableProject}
    )
  )

  return {preferences, favorites, getUserProjects, dailyHoursSpend, getElementaryDeclaration, isFavorite, setFavorite}
})
