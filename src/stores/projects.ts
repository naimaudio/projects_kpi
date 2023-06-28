import { defineStore } from "pinia";
import type { Project } from "../typing/project";
import { ref } from "vue";

export const useProjectStore = defineStore("project", () => {
    const projects = ref<Project[]>([]);
    function addProject(project: Project) {
        projects.value.push(project);
    }

    return { projects, addProject };
});
