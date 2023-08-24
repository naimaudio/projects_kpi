<template>
    <ModalComponent @close="emits('close')">
        <span> Select the projects you want to display </span>
        <BaseTable style="width: 100%" :headers="headers" :items="projects" @change="change" />
        <BaseButton
            @click="
                () => {
                    emits('change', Array.from(selectedRowsSet));
                    emits('close');
                }
            "
            >Validate</BaseButton
        >
        <span>{{ selectedRowsSet }}</span>
    </ModalComponent>
</template>

<script setup lang="ts">
import ModalComponent from "@/components/ModalComponent.vue";
import BaseTable from "@/components/base/BaseTable.vue";
import type { SelectableProject } from "../../typing/project";
import { computed, ref } from "vue";
import { useProjectStore } from "../../stores/projectStore";
import BaseButton from "@/components/base/BaseButton.vue";
import type { Header } from "@/typing";

const props = defineProps<{
    selectedRows: number[];
}>();

const emits = defineEmits<{
    (event: "close"): void;
    (event: "change", value: number[]): void;
}>();
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
const projectStore = useProjectStore();

const selectedRowsSet = ref<Set<number>>(new Set<number>(props.selectedRows));

const projects = computed<SelectableProject[]>(() => {
    return projectStore.projects.map<SelectableProject>((project) => {
        return { ...project, selected: selectedRowsSet.value.has(project.id) };
    });
});

const change = (id: number, field: string, value: string | number | boolean | undefined) => {
    if (field === "selected" && typeof value === "boolean") {
        if (value === false) {
            selectedRowsSet.value.delete(id);
        } else if (value === true) {
            selectedRowsSet.value.add(id);
        }
    }
};
</script>
