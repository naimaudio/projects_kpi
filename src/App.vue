<template>
    <div class="global">
        <RouterView />
    </div>
</template>
<script setup lang="ts">
import { useProjectStore } from "./stores/projects";
import { type RawProject, type Project } from "./typing/project";

const projectStore = useProjectStore();

fetch("http://192.168.14.30:8080/projects/", {
    headers: {
        "Content-Type": "application/json",
    },
})
    .then((projects) => {
        return projects.json();
    })
    .then((rawProjects: RawProject[]) => {
        projectStore.projects = rawProjects.map<Project>((rawProject) => {
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
    });
</script>
