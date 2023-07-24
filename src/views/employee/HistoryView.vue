<template>
    <div class="page-container">
        <h1 class="title">History</h1>
        <div style="display: flex; width: auto; height: 15px" />
        <div v-if="declarations.length !== 0">
            <BaseTable :headers="commentHeaders" :items="comments" />
        </div>
        <div v-else class="centered-flex">
            <div class="divider"></div>
            <span class="big">Oh ! It's time to make your first declaration</span>
            <img src="@/assets/icons/slightly-smiling-face.png" alt="Slightly Smiling Face" width="60" height="60" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useDeclarationStore } from "@/stores/declarationStore";
import type { Header } from "@/typing";
import { computed } from "vue";
import BaseTable from "@/components/base/BaseTable.vue";

const commentHeaders: Header[] = [
    {
        id: "week",
        name: "Week",
        filterable: false,
        width: "1fr",
    },
    {
        id: "year",
        name: "Year",
        filterable: false,
        width: "1fr",
    },
    {
        id: "projectCodes",
        name: "Project codes",
        filterable: false,
        width: "2fr",
    },
    {
        id: "comment",
        name: "Comment",
        filterable: false,
        width: "3fr",
    },
];
const declarationStore = useDeclarationStore();
const declarations = computed(() => {
    return declarationStore.getDeclarations;
});

const comments = computed(() => {
    return declarationStore.records.map((record) => {
        return { ...record, comment: record.comment === undefined ? "" : record.comment };
    });
});
</script>
