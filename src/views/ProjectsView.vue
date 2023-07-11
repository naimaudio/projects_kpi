<template>
    <div class="page-container">
        <h1 class="title">Projects</h1>
        <div v-if="userStore.getUserProjects.length !== 0">
            <BaseTable :headers="headers" :items="userStore.getUserProjects" @change="change" />
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
import BaseTable from "@/components/BaseTable.vue";
import { useUserStore } from "@/stores/userStore";
import type { Header } from "@/typing";
import type { UserProject } from "@/typing/project";

const headers: Header[] = [
    { name: "Code", id: "code", filterable: false },
    { name: "Name", id: "name", filterable: false },
    { name: "Manager", id: "manager", filterable: false },
    { name: "Time spend (hours)", id: "time_spend", filterable: false },
    { name: "Fav", id: "favorite", filterable: false },
];
const userStore = useUserStore();

function change<K extends keyof UserProject>(id: number, field: K, value: UserProject[K]) {
    if (field === "favorite" && typeof value === "boolean") {
        userStore.setFavorite(id, value);
    }
}
</script>
<style></style>
