<template>
    <div class="global">
        <RouterView />
    </div>
</template>
<script setup lang="ts">
import { useProjectStore } from "./stores/projects";
import { useUserStore } from "./stores/user";

import { getProjects, getFavorites, getDeclarations } from "@/API/requests";
import type { RawProject } from "./typing/project";
const projectStore = useProjectStore();
const userStore = useUserStore();
getProjects()
    .then((projects: RawProject[]) => projectStore.setProjectsFromRaw(projects))
    .then(() => getFavorites(2))
    .then((favorites: number[]) => {
        userStore.initFavorites(favorites);
    })
    .then(() => getDeclarations(2))
    .then((declarations) => userStore.setDeclarationsFromRaw(declarations));
</script>
