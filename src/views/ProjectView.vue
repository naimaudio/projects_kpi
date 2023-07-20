<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
    <ModalComponent
        :close-route="{
            name: 'projects',
        }"
    >
        <h2>{{ project?.name }}</h2>
        <div v-if="user.role === 'Project Manager'" class="parent">
            <span class="label1">Name</span>
            <fluent-text-field class="field1" :value="editedProject?.name"></fluent-text-field>
            <span class="label2">Code</span>
            <fluent-text-field class="field2" :value="editedProject?.code"></fluent-text-field>
            <span class="label3">Sub-category</span>
            <fluent-select v-model="editedProject.sub_category" class="field3">
                <fluent-option v-for="option in options" :key="option.id" :value="option.id">
                    <span>{{ option.id }}</span>
                    <span style="color: #8f8f8f; font-size: 12px; margin-left: 4px"> {{ option.label }}</span>
                </fluent-option>
                <span slot="selected-value">{{ editedProject.sub_category }}</span>
            </fluent-select>
            <span class="label4">Division</span>
            <fluent-select v-model="editedProject.division" class="field4">
                <fluent-option v-for="option in divisions" :key="option.id" :value="option.id">
                    <span>{{ option.label }}</span>
                </fluent-option>
            </fluent-select>

            <span class="label5">Classification</span>
            <fluent-select v-model="editedProject.classification" class="field5">
                <fluent-option v-for="option in classifications" :key="option.id" :value="option.id">
                    <span>{{ option.label }}</span>
                </fluent-option>
            </fluent-select>
        </div>
        <div v-else-if="user.role === 'Employee'" class="parent-employee">
            <span class="label1">Name</span>
            <span class="field1">{{ editedProject?.name }}</span>
            <span class="label2">Code</span>
            <span class="field2">{{ editedProject?.code }}</span>
        </div>
        <div v-if="user.role === 'Project Manager'" class="footer-buttons-block">
            <BaseButton accent>
                <template #default> <span> Validate</span> </template>
                <template v-if="false" #start>
                    <fluent-progress-ring style="width: 14px; height: 14px; stroke: lightblue" />
                </template>
            </BaseButton>
        </div>
    </ModalComponent>
</template>

<script setup lang="ts">
import ModalComponent from "@/components/ModalComponent.vue";
import { useRoute } from "vue-router";
import { computed, ref } from "vue";
import { useProjectStore } from "@/stores/projectStore";
import type { Project } from "@/typing/project";
import BaseButton from "@/components/BaseButton.vue";
import { useUserStore } from "@/stores/userStore";
import type { User } from "@/typing/index";
const route = useRoute();
const projectStore = useProjectStore();
const userStore = useUserStore();
const user = computed<User>(() => {
    const u = userStore.user;
    if (u === undefined) {
        throw Error("no User Logged In");
    } else {
        return u;
    }
});
const projectId = computed<number | undefined>(() => {
    const pId: number = Number(route.params["projectId"]);
    return isNaN(pId) ? undefined : pId;
});

const options = [
    { id: "H_CI", label: "Home CI" },
    { id: "H_LSP", label: "Home Loudspeaker" },
    { id: "H_HP", label: "Home Headphone" },
    { id: "M_CAR", label: "Motorities Car" },
    { id: "M_MAR", label: "Motorities Marine" },
    { id: "M_OEM", label: "Motorities OEM" },
    { id: "P_LSP", label: "Pro Loudspeaker" },
    { id: "P_HP", label: "Pro Headphone" },
    { id: "ETC", label: "Others" },
    { id: "H_AMP", label: "Home Amplifier" },
];
const divisions = [
    { id: "ALL", label: "All" },
    { id: "HOME", label: "Home" },
    { id: "MOTORITIES", label: "Motorities" },
    { id: "PRO", label: "Pro" },
    { id: "RESEARCH", label: "Research" },
];
const classifications = [
    { id: "NC", label: "All" },
    { id: "1 STRATEGIC", label: "Strategic" },
    { id: "2 TACTICAL", label: "Tactical" },
    { id: "3 DEFENSIVE", label: "Defensive" },
];
const project = computed<Project | undefined>(() => {
    return projectStore.projects.find((p) => p.id === projectId.value);
});
const find = projectStore.projects.find((p) => p.id === projectId.value);
if (find === undefined) {
    throw Error("no project id");
}
const editedProject = ref<Project>(find);
</script>
<style>
.inline-field {
    display: inline-block;
    margin: auto;
}
.parent {
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: repeat(5, 1fr);
    grid-column-gap: 0px;
    grid-row-gap: 10px;
    width: 100%;
}

.parent-employee {
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: repeat(2, 1fr);
    grid-column-gap: 0px;
    grid-row-gap: 10px;
    width: 100%;
}

.label1 {
    grid-area: 1 / 1 / 2 / 2;
}
.field1 {
    grid-area: 1 / 2 / 2 / 3;
}
.label2 {
    grid-area: 2 / 1 / 3 / 2;
}
.field2 {
    grid-area: 2 / 2 / 3 / 3;
}
.label3 {
    grid-area: 3 / 1 / 4 / 2;
}
.field3 {
    grid-area: 3 / 2 / 4 / 3;
}
.label4 {
    grid-area: 4 / 1 / 5 / 2;
}
.field4 {
    grid-area: 4 / 2 / 5 / 3;
}
.label5 {
    grid-area: 5 / 1 / 6 / 2;
}
.field5 {
    grid-area: 5 / 2 / 6 / 3;
}
</style>
