<template>
    <div class="page-container">
        <div class="title-container">
            <div style="margin-left: 26.8px">
                <span class="title">Projects</span>
            </div>
        </div>
        <div style="margin: 9px 0; display: flex; justify-content: space-between">
            <span>
                <fluent-checkbox
                    :checked="archivedProjectsDisplay"
                    @change="(event: ChangeEvent) => archivedProjectsDisplay = event.target.currentChecked"
                    >Display archived projects</fluent-checkbox
                >
                <fluent-checkbox
                    :checked="frozenProjectsDisplay"
                    @change="(event: ChangeEvent) => frozenProjectsDisplay = event.target.currentChecked"
                    >Display frozen projects</fluent-checkbox
                >
            </span>
            <span style="display: flex; align-items: center">
                <BaseButton @click="getXLSX">
                    <template #start> <BookDatabaseIcon /> Export projects </template>
                </BaseButton>
                <BaseButton
                    v-if="
                        userStore.userRoleGetter === 'Project Manager' ||
                        userStore.userRoleGetter === 'Business Manager'
                    "
                    style="margin-left: 10px"
                    @click="router.push({ name: 'newProject', query: route.query })"
                >
                    <template #start>
                        <AddOutlineIcon />
                    </template>
                    <template #default> <span style="font-weight: 600">New project</span></template></BaseButton
                >
            </span>
        </div>
        <div v-if="declarationStore.getUserProjects.length !== 0">
            <BaseTable :headers="headers" :items="items" clickable-row @change="change" @raw-click="rowClickHandler" />
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
import type { ChangeEvent, Header } from "@/typing";
import type { UserProject } from "@/typing/project";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import BaseButton from "@/components/base/BaseButton.vue";
import AddOutlineIcon from "@/components/icons/AddOutlineIcon.vue";
import BookDatabaseIcon from "@/components/icons/BookDatabaseIcon.vue";
import { computed, ref } from "vue";
import { getProjectsExport } from "@/API/requests";

const router = useRouter();
const route = useRoute();

const declarationStore = useDeclarationStore();
const userStore = useUserStore();
const archivedProjectsDisplay = ref<boolean>(false);
const frozenProjectsDisplay = ref<boolean>(false);
const headers: Header[] = [
    { name: "", id: "status", filterable: false, width: "40px" },
    { name: "Code", id: "code", filterable: false, clickable: true, width: "80px" },
    { name: "Name", id: "name", filterable: false, clickable: true },
    { name: "Personal time (h)", id: "time_spent", filterable: false, width: "200px" },
    { name: "Fav", id: "favorite", filterable: false, width: "40px" },
];
const items = computed<UserProject[]>(() =>
    declarationStore.getUserProjects.filter((p) => {
        return (
            p.status === "Active" ||
            (frozenProjectsDisplay.value && !(frozenProjectsDisplay.value && p.status !== "Frozen")) ||
            (archivedProjectsDisplay.value && !(archivedProjectsDisplay.value && p.status !== "Closed"))
        );
    })
);
function change<K extends keyof UserProject>(id: number, field: K, value: UserProject[K]) {
    const userId = userStore.userIdGetter;
    if (field === "favorite" && typeof value === "boolean" && userId !== undefined) {
        declarationStore.setFavorite(id, value, userId);
    }
}
function rowClickHandler(id: number) {
    router.push({ name: "project", params: { projectId: id }, query: route.query });
}

async function getXLSX() {
    const response = await getProjectsExport();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(response.data);
    link.download = "projects master list";
    link.click();
}
</script>
<style>
.end {
    display: block;
    margin-left: auto;
    width: fit-content;
}
</style>
