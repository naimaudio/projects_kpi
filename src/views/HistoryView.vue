<template>
    <div class="page-container">
        <h1 class="title">History</h1>
        <fluent-tabs :activeid="activeId">
            <fluent-tab id="record"><span>Records</span></fluent-tab>
            <fluent-tab id="comments">Comments</fluent-tab>
            <fluent-tab-panel id="recordPanel">
                <div style="display: flex; width: auto; height: 15px" />
                <div v-if="declarations.length !== 0">
                    <BaseTable :headers="recordHeaders" :items="declarations" />
                </div>
                <div v-else class="centered-flex">
                    <div class="divider"></div>
                    <span class="big">Oh ! It's time to make your first declaration</span>
                    <img
                        src="@/assets/icons/slightly-smiling-face.png"
                        alt="Slightly Smiling Face"
                        width="60"
                        height="60"
                    />
                </div>
            </fluent-tab-panel>
            <fluent-tab-panel id="commentsPanel">
                <div style="display: flex; width: auto; height: 15px" />
                <div v-if="declarations.length !== 0">
                    <BaseTable :headers="commentHeaders" :items="comments" />
                </div>
                <div v-else class="centered-flex">
                    <div class="divider"></div>
                    <span class="big">Oh ! It's time to make your first declaration</span>
                    <img
                        src="@/assets/icons/slightly-smiling-face.png"
                        alt="Slightly Smiling Face"
                        width="60"
                        height="60"
                    /></div
            ></fluent-tab-panel>
        </fluent-tabs>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";
import type { Header } from "@/typing";
import { computed, ref } from "vue";
import BaseTable from "@/components/BaseTable.vue";
const activeId = ref<string>("record");
const recordHeaders: Header[] = [
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
        id: "projectCode",
        name: "Project code",
        filterable: false,
    },
];

const commentHeaders: Header[] = [
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
        id: "comment",
        name: "Comment",
        filterable: false,
    },
];
const userStore = useUserStore();
const declarations = computed(() => {
    return userStore.getDeclarations;
});

const comments = computed(() => {
    return userStore.records;
});
</script>
