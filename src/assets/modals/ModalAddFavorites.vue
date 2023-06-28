<template>
    <Teleport to=".global">
        <div class="modal">
            <div v-clickOutside="() => emit('close')" class="modal-container column-flex">
                <BaseTable :headers="headers" :items="selectionableProjects" @change="change" />
                <div class="footer-buttons">
                    <fluent-button appearance="accent" @click="addFavoriteProjects">Add favorites</fluent-button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import BaseTable from "@/components/BaseTable.vue";
import { useUserStore } from "@/stores/user";
import type { Header } from "@/typing";
import { type SelectableProject } from "@/typing/project";
import { ref } from "vue";

const emit = defineEmits<{
    (event: "close"): void;
}>();
const change = (index: number, field: string, value: string | number | boolean | undefined) => {
    if (field === "selected" && typeof value === "boolean") {
        selectionableProjects.value[index][field] = value;
    }
};
const userStore = useUserStore();
const headers: Header[] = [
    {
        id: "selected",
        name: "",
        filterable: false,
    },
    {
        id: "id",
        name: "Id",
        filterable: false,
    },
    {
        id: "name",
        name: "Name",
        filterable: false,
    },
];
const projects = userStore.getUserProjects;
const selectionableProjects = ref<SelectableProject[]>(
    projects
        .filter((project) => project.favorite === false)
        .map<SelectableProject>((project) => {
            return { ...project, selected: false };
        })
);
const addFavoriteProjects = () => {
    selectionableProjects.value
        .filter((p) => p.selected)
        .forEach((p) => {
            userStore.setFavorite(p.id, true);
        });
    emit("close");
};
</script>
