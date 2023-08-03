<template>
    <div class="page-container">
        <h1 class="title">History</h1>
        <div style="display: flex; width: auto; height: 15px" />
        <div v-if="declarations.length !== 0">
            <BaseTable
                :headers="commentHeaders"
                clickable-row
                :items="declarations"
                @raw-click="(rowId: number) => (currentDeclaration = declarations.find((decl) => decl.id === rowId))"
            />
        </div>
        <div v-else class="centered-flex">
            <div class="divider"></div>
            <span class="big">Oh ! It's time to make your first declaration</span>
            <img src="@/assets/icons/slightly-smiling-face.png" alt="Slightly Smiling Face" width="60" height="60" />
        </div>
    </div>
    <DeclConfirmationModal
        v-if="currentDeclaration !== undefined"
        :comment="currentDeclaration.comment"
        :user-id="userStore.userIdGetter"
        :declaration="currentDeclarationData"
        :week-number="currentDeclaration.week"
        :year="currentDeclaration.year"
        :confirmation="false"
        @close="currentDeclaration = undefined"
    />
</template>

<script setup lang="ts">
import { useDeclarationStore } from "@/stores/declarationStore";
import type { Header, DeclRecord, DeclarationInput } from "@/typing";
import { computed, ref } from "vue";
import BaseTable from "@/components/base/BaseTable.vue";
import DeclConfirmationModal from "@/components/DeclConfirmationModal.vue";
import { useUserStore } from "../../stores/userStore";
import { useProjectStore } from "../../stores/projectStore";

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
        clickable: true,
    },
    {
        id: "comment",
        name: "Comment",
        filterable: false,
        width: "3fr",
    },
];
const projectStore = useProjectStore();
const declarationStore = useDeclarationStore();
const userStore = useUserStore();
const currentDeclaration = ref<undefined | DeclRecord>();
const currentDeclarationData = computed<DeclarationInput[]>(() => {
    return declarationStore.getDeclarations
        .filter((value) =>
            currentDeclaration.value === undefined
                ? false
                : value.week === currentDeclaration.value.week && value.year === currentDeclaration.value.year
        )
        .map<DeclarationInput>((decl) => {
            const name = projectStore.projects.find((project) => project.id === decl.projectId)?.name;
            if (name === undefined) {
                throw Error("Invalid project ID");
            }
            return {
                hours: decl.hours,
                projectId: decl.projectId,
                projectCode: decl.projectCode,
                name: name,
            };
        });
});
const declarations = computed(() => {
    return declarationStore.records.map((record) => {
        return { ...record, comment: record.comment === undefined ? "" : record.comment };
    });
});
</script>
