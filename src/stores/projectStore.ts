import { defineStore } from "pinia";
import type { Project } from "@/typing/project";
import { computed, ref } from "vue";

export const useProjectStore = defineStore("project", () => {
    const projects = ref<Project[]>([]);

    const projectCodes = computed(() => {
        const projectCodes: { [key: number]: string } = {};
        projects.value.forEach((project) => {
            projectCodes[project.id] = project.code;
            return project;
        });
        return projectCodes;
    });
    const projectCodeIds = computed(() => {
        const projectCodes: { [key: string]: number } = {};
        projects.value.forEach((project) => {
            projectCodes[project.code] = project.id;
            return project;
        });
        return projectCodes;
    });
    function addProject(project: Project) {
        projects.value.push(project);
    }
    function setProjects(newProjects: Project[]) {
        projects.value = newProjects;
    }
    return { projects, projectCodes, projectCodeIds, addProject, setProjects };
});
