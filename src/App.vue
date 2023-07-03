<template>
    <div class="global">
        <RouterView v-if="done" />

        <div v-else class="centered"><fluent-progress-ring /></div>
    </div>
</template>
<script setup lang="ts">
import { useProjectStore } from "./stores/projects";
import { useUserStore } from "./stores/user";

import { getProjects, getFavorites, getDeclarations } from "@/API/requests";
import type { RawProject } from "./typing/project";
import { ref } from "vue";
const projectStore = useProjectStore();
const userStore = useUserStore();
const done = ref(false);
getProjects()
    .then((projects: RawProject[]) => projectStore.setProjectsFromRaw(projects))
    .then(() => getFavorites(2))
    .then((favorites: number[]) => {
        userStore.initFavorites(favorites);
    })
    .then(() => getDeclarations(2))
    .then((declarations) => userStore.setDeclarationsFromRaw(declarations))
    .then(() => {
        done.value = true;
    });
</script>

<style scoped>
.centered {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>
