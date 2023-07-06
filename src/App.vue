<template>
    <div class="global">
        <RouterView v-if="done" />
        <div v-else-if="noError" class="centered"><fluent-progress-ring /></div>
        <ErrorCard v-if="!noError" @close="noError = true">Oh no, there was an error at the initialization</ErrorCard>
    </div>
</template>
<script setup lang="ts">
import { useProjectStore } from "./stores/projects";
import { useUserStore } from "./stores/user";

import { getProjects, getFavorites, getDeclarations } from "@/API/requests";
import type { RawProject } from "./typing/project";
import { ref } from "vue";
import ErrorCard from "./components/ErrorCard.vue";
import { PublicClientApplication } from "@azure/msal-browser";
import { useAuthStore } from "@/stores/authStore";
const projectStore = useProjectStore();
const userStore = useUserStore();
const authStore = useAuthStore();
const done = ref(false);
const noError = ref(true);
const msalInstance = new PublicClientApplication(authStore.msalConfig);
authStore.msalInstance = msalInstance;
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
    width: fit-content;
}
</style>
