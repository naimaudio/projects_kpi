<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
    <ModalComponent
        :close-route="{
            name: 'projects',
        }"
    >
        <h2>{{ project?.name }}</h2>
        <div v-if="user.role === 'Project Manager' || user.role === 'Business Manager'" class="parent">
            <span class="label1">Name</span>
            <fluent-text-field class="field1" :value="editedProject?.name"></fluent-text-field>
            <span class="label2">Code</span>
            <fluent-text-field class="field2" :value="editedProject?.code"></fluent-text-field>
            <span class="label3">Category</span>
            <fluent-select
                v-model="editedProject.division"
                class="field3"
                @change="
                    () => {
                        editedProject.sub_category = '';
                        selectKey += 1;
                    }
                "
            >
                <fluent-option v-for="division in divisions" :key="division" :value="division">
                    <span>{{ divisionOptions[division].label }}</span>
                </fluent-option>
            </fluent-select>
            <span class="label4">Sub-category</span>
            <fluent-select :key="selectKey" v-model="editedProject.sub_category" class="field4">
                <fluent-option
                    v-for="subCategory in divisionOptions[editedProject.division].subDivisions"
                    :key="subCategory"
                    :value="subCategory"
                >
                    <span>{{ subCategoryLabels[subCategory] }}</span>
                    <span style="color: #8f8f8f; font-size: 12px; margin-left: 4px"> {{ subCategory }}</span>
                </fluent-option>
                <span slot="selected-value">{{ editedProject.sub_category }}</span>
            </fluent-select>

            <span class="label5">Classification</span>
            <fluent-select v-model="editedProject.classification" class="field5">
                <fluent-option v-for="classification in classifications" :key="classification" :value="classification">
                    <span>{{ classificationLabels[classification] }}</span>
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
        <br />
        <span class="footer-buttons-block">
            <BaseButton accent>Update Project</BaseButton>
        </span>
    </ModalComponent>
</template>

<script setup lang="ts">
import ModalComponent from "@/components/ModalComponent.vue";
import { useRoute } from "vue-router";
import { computed, ref } from "vue";
import { useProjectStore } from "@/stores/projectStore";
import {
    type Project,
    divisionOptions,
    divisions,
    subCategoryLabels,
    classifications,
    classificationLabels,
} from "@/typing/project";
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
const selectKey = ref(0);
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
