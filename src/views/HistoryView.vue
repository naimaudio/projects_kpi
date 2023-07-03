<template>
    <div class="page-container">
        <h1 class="title">History</h1>
        <div v-if="declarations.length !== 0">
            <BaseTable :headers="headers" :items="declarations" />
        </div>
        <div v-else class="centered-flex">
            <div class="divider"></div>
            <span class="big">Oh ! It's time to make your first declaration</span>
            <img src="@/assets/icons/slightly-smiling-face.png" alt="Slightly Smiling Face" width="60" height="60" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import type { Header } from "@/typing";
import { computed } from "vue";
import BaseTable from "@/components/BaseTable.vue";
const headers: Header[] = [
    {
        id: "week",
        name: "Week",
        filterable: false,
    },
    {
        id: "year",
        name: "Year",
        filterable: false,
    },
    {
        id: "hours",
        name: "Hours",
        filterable: false,
    },
    {
        id: "projectId",
        name: "Project ID ( will be code)",
        filterable: false,
    },
    {
        id: "comment",
        name: "Comment",
        filterable: false,
    },
];
const userStore = useUserStore();
const declarations = computed(() => {
    return userStore.getDeclarations;
});
</script>
