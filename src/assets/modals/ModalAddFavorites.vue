<template>
    <Teleport to=".global">
        <div class="modal">
            <div v-clickOutside="() => emit('close')" class="modal-container column-flex">
                <span class="sub-title">Favorites</span>
                <span>Please select projects you have spend time in</span>
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
import { useUserStore } from "@/stores/userStore";
import type { Header } from "@/typing";
import { type SelectableProject } from "@/typing/project";
import { ref } from "vue";

const emit = defineEmits<{
    (event: "close"): void;
}>();
const change = (id: number, field: string, value: string | number | boolean | undefined) => {
    if (field === "selected" && typeof value === "boolean") {
        const index = selectionableProjects.value.findIndex((p) => p.id === id);
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
        id: "code",
        name: "Project code",
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
