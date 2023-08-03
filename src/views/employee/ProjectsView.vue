<template>
    <div class="page-container">
        <div class="title-container">
            <div>
                <span class="title">Projects</span>
            </div>
            <BaseButton
                v-if="userStore.userRoleGetter === 'Project Manager' || userStore.userRoleGetter === 'Business Manager'"
                big
                @click="router.push({ name: 'newProject', query: route.query })"
            >
                <template #start>
                    <AddOutlineIcon big />
                </template>
                <template #default> <span>New project</span></template></BaseButton
            >
        </div>
        <div v-if="declarationStore.getUserProjects.length !== 0">
            <BaseTable
                :headers="headers"
                :items="declarationStore.getUserProjects"
                clickable-row
                @change="change"
                @raw-click="rowClickHandler"
            />
        </div>
        <div v-else class="column-flex">
            <div class="centered-flex">
                <div class="divider"></div>
                <span class="big"> Oh ! No projects found for your organisation</span>
                <img src="@/assets/icons/neutral-face.png" alt="Neutral Face" width="60" height="60" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import BaseTable from "@/components/base/BaseTable.vue";
import { useDeclarationStore } from "@/stores/declarationStore";
import type { Header } from "@/typing";
import type { UserProject } from "@/typing/project";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import BaseButton from "@/components/base/BaseButton.vue";
import AddOutlineIcon from "@/components/icons/AddOutlineIcon.vue";

const router = useRouter();
const headers: Header[] = [
    { name: "Code", id: "code", filterable: false, width: "80px" },
    { name: "Name", id: "name", filterable: false, clickable: true },
    { name: "Personal time (h)", id: "time_spent", filterable: false },
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
<style>
.end {
    display: block;
    margin-left: auto;
    width: fit-content;
}

.title-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    line-height: 52px;
    margin: 26.8px 0;
}
</style>
