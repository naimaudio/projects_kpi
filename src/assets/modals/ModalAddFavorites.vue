<template>
    <ModalComponent @close="emit('close')">
        <p class="sub-title">Favorites</p>
        <p>Please select projects you have spend time in</p>
        <BaseTable style="width: 100%" :headers="headers" :items="selectionableProjects" @change="change" />
        <div class="footer-buttons-block">
            <fluent-button appearance="accent" @click="addFavoriteProjects">Add favorites</fluent-button>
        </div>
    </ModalComponent>
</template>

<script setup lang="ts">
import BaseTable from "@/components/base/BaseTable.vue";
import { useDeclarationStore } from "@/stores/declarationStore";
import type { Header } from "@/typing";
import { type SelectableProject } from "@/typing/project";
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";
import { useUserStore } from "../../stores/userStore";
import ModalComponent from "@/components/ModalComponent.vue";
const emit = defineEmits<{
    (event: "close"): void;
}>();
const change = (id: number, field: string, value: string | number | boolean | undefined) => {
    if (field === "selected" && typeof value === "boolean") {
        const index = selectionableProjects.value.findIndex((p) => p.id === id);
        selectionableProjects.value[index][field] = value;
    }
};
const declarationStore = useDeclarationStore();
const headers: Header[] = [
    {
        id: "selected",
        name: "",
        filterable: false,
        width: "60px",
    },
    {
        id: "code",
        name: "Project code",
        filterable: false,
        width: "1fr",
    },
    {
        id: "name",
        name: "Name",
        filterable: false,
        width: "2fr",
    },
];
const userStore = useUserStore();
const target = ref(null);
const projects = declarationStore.getUserProjects;
const selectionableProjects = ref<SelectableProject[]>(
    projects
        .filter((project) => project.favorite === false)
        .map<SelectableProject>((project) => {
            return { ...project, selected: false };
        })
);
const userId = userStore.userIdGetter;
const addFavoriteProjects = () => {
    if (userId !== undefined) {
        selectionableProjects.value
            .filter((p) => p.selected)
            .forEach((p) => {
                declarationStore.setFavorite(p.id, true, userId);
            });
    }
    emit("close");
};

onClickOutside(target, () => emit("close"));
</script>
