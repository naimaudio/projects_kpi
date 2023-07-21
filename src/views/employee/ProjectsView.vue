<template>
    <div class="page-container">
        <h1 class="title">Projects</h1>
        <div v-if="declarationStore.getUserProjects.length !== 0">
            <BaseTable
                :headers="headers"
                :items="declarationStore.getUserProjects"
                clickable-row
                @change="change"
                @row-click="rowClickHandler"
            />
        </div>
        <div v-else class="column-flex">
            <div class="centered-flex">
                <div class="divider"></div>
                <span class="big"> Oh ! No projects found for your organisation</span>
                <img src="@/assets/icons/neutral-face.png" alt="Neutral Face" width="60" height="60" />
            </div>
        </div>
        <RouterView></RouterView>
    </div>
</template>

<script setup lang="ts">
import BaseTable from "@/components/BaseTable.vue";
import { useDeclarationStore } from "@/stores/declarationStore";
import type { Header } from "@/typing";
import type { UserProject } from "@/typing/project";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/userStore";

const router = useRouter();
const headers: Header[] = [
    { name: "Code", id: "code", filterable: false },
    { name: "Name", id: "name", filterable: false },
    { name: "Manager", id: "manager", filterable: false },
    { name: "Personal time (h)", id: "time_spend", filterable: false },
    { name: "Fav", id: "favorite", filterable: false, width: "80px" },
];
const declarationStore = useDeclarationStore();
const userStore = useUserStore();
function change<K extends keyof UserProject>(id: number, field: K, value: UserProject[K]) {
    const userId = userStore.userIdGetter;
    if (field === "favorite" && typeof value === "boolean" && userId !== undefined) {
        declarationStore.setFavorite(id, value, userId);
    }
}
const route = useRoute();
function rowClickHandler(id: number) {
    router.push({ name: "project", params: { projectId: id }, query: route.query });
}
</script>
<style></style>
