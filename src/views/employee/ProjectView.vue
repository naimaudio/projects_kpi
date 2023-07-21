<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
    <ModalComponent
        :close-route="{
            name: 'projects',
        }"
    >
        <h2>{{ project?.name }}</h2>
        <div v-if="user.role === 'Project Manager' || user.role === 'Business Manager'" class="parent">
            <span>Name</span>
            <fluent-text-field :value="editedProject?.name"></fluent-text-field>
            <span>Organization</span>
            <fluent-select :value="editedProject?.entity">
                <fluent-option v-for="org in organizationNames" :key="org">{{ org }}</fluent-option>
            </fluent-select>
            <span>Code</span>
            <fluent-text-field :value="editedProject?.code"></fluent-text-field>
            <span>Category</span>
            <fluent-select
                v-model="editedProject.division"
                @change="
                    () => {
                        editedProject.subCategory = '';
                        selectKey += 1;
                    }
                "
            >
                <fluent-option v-for="division in divisions" :key="division" :value="division">
                    <span>{{ divisionOptions[division].label }}</span>
                </fluent-option>
            </fluent-select>
            <span>Sub-category</span>
            <fluent-select :key="selectKey" v-model="editedProject.subCategory">
                <fluent-option
                    v-for="subCategory in divisionOptions[editedProject.division].subDivisions"
                    :key="subCategory"
                    :value="subCategory"
                >
                    <span>{{ subCategoryLabels[subCategory] }}</span>
                    <span style="color: #8f8f8f; font-size: 12px; margin-left: 4px"> {{ subCategory }}</span>
                </fluent-option>
                <span slot="selected-value">{{ editedProject.subCategory }}</span>
            </fluent-select>

            <span>Classification</span>
            <fluent-select v-model="editedProject.classification">
                <fluent-option v-for="classification in classifications" :key="classification" :value="classification">
                    <span>{{ classificationLabels[classification] }}</span>
                </fluent-option>
            </fluent-select>
        </div>
        <div v-else-if="user.role === 'Employee'" class="parent-employee">
            <span>Name</span>
            <span>{{ editedProject?.name }}</span>
            <span>Code</span>
            <span>{{ editedProject?.code }}</span>
            <span>Organization</span>
            <span>{{ editedProject?.entity }}</span>
        </div>
        <br />
        <span v-if="user.role === 'Project Manager' || user.role === 'Business Manager'" class="footer-buttons-block">
            <BaseButton :disabled="loading" :loading="loading" accent @click="clickHandler">Update Project</BaseButton>
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
import { useGlobalStore } from "@/stores/globalStore";
import type { User } from "@/typing/index";
import { organizationNames } from "@/stores/nonReactiveStore";
import { updateProject } from "@/API/requests";
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
const globalStore = useGlobalStore();
const selectKey = ref(0);
const project = computed<Project | undefined>(() => {
    return projectStore.projects.find((p) => p.id === projectId.value);
});
const find = projectStore.projects.find((p) => p.id === projectId.value);
if (find === undefined) {
    throw Error("no project id");
}
const editedProject = ref<Project>(find);
const loading = ref<boolean>(false);
const clickHandler = () => {
    loading.value = true;
    updateProject(editedProject.value).then((response) => {
        if (response.status === 200) {
            globalStore.notification.content = "Project successfully updated";
            globalStore.notification.display = true;
            globalStore.notification.type = "SUCCESS";
        } else {
            globalStore.notification.content = "Oh no, there was an error";
            globalStore.notification.display = true;
            globalStore.notification.type = "FAILURE";
            close();
        }
    });
    loading.value = false;
};
</script>

<style>
.inline-field {
    display: inline-block;
    margin: auto;
}
.parent {
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: repeat(6, 1fr);
    grid-column-gap: 0px;
    grid-row-gap: 10px;
    width: 100%;
}

.parent-employee {
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: repeat(3, 1fr);
    grid-column-gap: 0px;
    grid-row-gap: 10px;
    width: 100%;
}
</style>
