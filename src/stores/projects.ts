import { defineStore } from "pinia";
import type { Project, RawProject } from "@/typing/project";
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
    function addProject(project: Project) {
        projects.value.push(project);
    }
    function setProjectsFromRaw(rawProjects: RawProject[]) {
        projects.value = rawProjects.map<Project>((rawProject) => {
            return {
                id: rawProject.id,
                code: rawProject.project_code,
                division: rawProject.division,
                name: rawProject.project_name,
                sub_category: rawProject.sub_category,
                classification: rawProject.classification,
                expansion_renewal: rawProject.expansion_renewal,
                manager: rawProject.project_manager,
            };
        });
    }
    return { projects, projectCodes, addProject, setProjectsFromRaw };
});
