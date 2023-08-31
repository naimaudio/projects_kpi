<template>
    <ModalComponent @close="emits('close')">
        <span> Select the users you want to display </span>
        <BaseTable style="width: 100%" :headers="headers" :items="users" @change="change" />
        <BaseButton
            @click="
                () => {
                    emits('change', Array.from(selectedColumnsSet));
                    emits('close');
                }
            "
            >Validate</BaseButton
        >
    </ModalComponent>
</template>

<script setup lang="ts">
import ModalComponent from "@/components/ModalComponent.vue";
import BaseTable from "@/components/base/BaseTable.vue";
import { computed, ref } from "vue";
import BaseButton from "@/components/base/BaseButton.vue";
import type { Header, Person } from "@/typing";

const props = defineProps<{
    selectedColumns: number[];
    users: Person[];
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
        id: "name",
        name: "Name",
        filterable: false,
        width: "1fr",
    },
    {
        id: "email",
        name: "Email",
        filterable: false,
        width: "1fr",
    },
    {
        id: "domain",
        name: "Domain",
        filterable: false,
        width: "1fr",
    },
];

const selectedColumnsSet = ref<Set<number>>(new Set<number>(props.selectedColumns));
const users = computed<Person[]>(() => {
    return props.users.map((project) => {
        return { ...project, selected: selectedColumnsSet.value.has(project.id) };
    });
});

const change = (id: number, field: string, value: string | number | boolean | undefined) => {
    if (field === "selected" && typeof value === "boolean") {
        if (value === false) {
            selectedColumnsSet.value.delete(id);
        } else if (value === true) {
            selectedColumnsSet.value.add(id);
        }
    }
};
</script>
