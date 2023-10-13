<template>
    <div class="page-container">
        <div class="title-container">
            <div style="margin-left: 26.8px">
                <span class="title">Projects</span>
            </div>
            <BaseButton
                v-if="userStore.userRoleGetter === 'Project Manager' || userStore.userRoleGetter === 'Business Manager'"
                big
                style="margin-right: 26.8px"
                @click="router.push({ name: 'newProject', query: route.query })"
            >
                <template #start>
                    <AddOutlineIcon big />
                </template>
                <template #default> <span>New project</span></template></BaseButton
            >
        </div>
        <div style="margin: 9px 0">
            <fluent-checkbox
                :checked="archivedProjectsDisplay"
                @change="(event: ChangeEvent) => archivedProjectsDisplay = event.target.currentChecked"
                >Display archived projects</fluent-checkbox
            >
            <fluent-checkbox
                :checked="lockedProjectsDisplay"
                @change="(event: ChangeEvent) => lockedProjectsDisplay = event.target.currentChecked"
                >Display locked projects</fluent-checkbox
            >
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
import { computed, ref } from "vue";

const router = useRouter();
const route = useRoute();

const declarationStore = useDeclarationStore();
const userStore = useUserStore();
const archivedProjectsDisplay = ref<boolean>(false);
const lockedProjectsDisplay = ref<boolean>(false);
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
            (lockedProjectsDisplay.value && !(lockedProjectsDisplay.value && p.status !== "Frozen")) ||
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
</script>
<style>
.end {
    display: block;
    margin-left: auto;
    width: fit-content;
}
</style>
