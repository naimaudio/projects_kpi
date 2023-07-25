<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
    <div class="page-container">
        <button
            class="breadcrumb-item button-style-reset clickable"
            @click="router.push({ name: 'projects', query: route.query })"
        >
            Projects
        </button>
        <span>></span>
        <span class="breadcrumb-item">{{ project === undefined ? "New project" : project.name }}</span>
        <h2>{{ newProject ? "New project" : project?.name }}</h2>
        <h3>Project properties</h3>

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
                <fluent-option v-for="subCategory in subDivisions" :key="subCategory" :value="subCategory">
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
        <h3>Project phases</h3>
        <div v-if="projectPhases.length < phases.length" class="icon-with-text">
            <AddOutlineIcon
                clickable
                @click="
                    (event) => {
                        projectPhases.push({ date: undefined });
                    }
                "
            />
            <span class="prefix align-center italic">add a phase</span>
        </div>
        <div v-else style="height: 24px"></div>
        <div v-if="projectPhases.length >= 1" class="icon-with-text">
            <SubtractOutlineIcon
                clickable
                @click="
                    (event) => {
                        projectPhases.pop();
                    }
                "
            />
            <span class="prefix align-center italic">remove a phase</span>
        </div>
        <div v-else style="height: 24px"></div>
        <br />
        <div v-if="user.role === 'Project Manager' || user.role === 'Business Manager'" class="parent-phases">
            <span>Phase code</span>
            <span>Phase name</span>
            <span>Phase start date</span>
            <template v-for="(projectPhase, i) in projectPhases" :key="i">
                <span>{{ phases[i].code }}</span>
                <span>{{ phases[i].name }}</span>
                <VueDatePicker
                    v-model="projectPhase.date"
                    :min-date="i !== 0 ? projectPhases[i - 1].date : undefined"
                    :max-date="i !== projectPhases.length - 1 ? projectPhases[i + 1].date : undefined"
                    ignore-time-validation
                    format="dd/MM/yyyy"
                    :clearable="false"
                    :auto-apply="true"
                    :enable-time-picker="false"
                ></VueDatePicker>
            </template>
        </div>
        <br />
        <div v-if="user.role === 'Project Manager' || user.role === 'Business Manager'" class="footer-buttons-block">
            <BaseButton :disabled="loading" :loading="loading" accent @click="clickHandler">Update Project</BaseButton>
        </div>
        <br />
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useProjectStore } from "@/stores/projectStore";
import {
    type Project,
    type BlankProject,
    type SubCategory,
    divisionOptions,
    divisions,
    subCategoryLabels,
    classifications,
    classificationLabels,
} from "@/typing/project";
import VueDatePicker from "@vuepic/vue-datepicker";

import BaseButton from "@/components/base/BaseButton.vue";
import { useUserStore } from "@/stores/userStore";
import { useGlobalStore } from "@/stores/globalStore";
import type { User } from "@/typing/index";
import { organizationNames } from "@/stores/nonReactiveStore";
import { updateProject } from "@/API/requests";
import AddOutlineIcon from "@/components/icons/AddOutlineIcon.vue";
import SubtractOutlineIcon from "@/components/icons/SubtractOutlineIcon.vue";
const route = useRoute();
const router = useRouter();
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
const newProject = ref<boolean>(false);
const projectId = computed<number | undefined>(() => {
    const pId: number = Number(route.params["projectId"]);
    return isNaN(pId) ? undefined : pId;
});

const subDivisions = computed<SubCategory[]>(() => {
    const division = editedProject.value.division;
    return division !== undefined ? divisionOptions[division].subDivisions : [];
});

const phases: { code: string; name: string }[] = [
    { code: "NPI", name: "Phase 0" },
    { code: "DMU", name: "concept" },
    { code: "POC/PF", name: "feasability" },
    { code: "ES", name: "Development 2" },
    { code: "EVT", name: "Development 1" },
    { code: "DVT", name: "Pre-production" },
    { code: "PVT", name: "Mass production" },
    { code: "STOP", name: "Project closure" },
];
const projectPhases = ref<{ date: string | undefined }[]>([]);

const globalStore = useGlobalStore();
const selectKey = ref(0);
const project = computed<Project | undefined>(() => {
    return projectStore.projects.find((p) => p.id === projectId.value);
});
const find = projectStore.projects.find((p) => p.id === projectId.value);
if (find === undefined) {
    newProject.value = true;
}

const editedProject = ref<Project | BlankProject>(
    find || { entity: organizationNames[0], division: "ALL", classification: "NC" }
);
const loading = ref<boolean>(false);
const clickHandler = () => {
    loading.value = true;
    if (!newProject.value && "id" in editedProject.value)
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
    grid-template-columns: minmax(200px, 1fr) 3fr;
    grid-template-rows: repeat(6, 1fr);
    grid-column-gap: 0px;
    grid-row-gap: 10px;
    max-width: 1000px;
}

.parent-phases {
    display: grid;
    grid-template-columns: 1fr 2fr 3fr;
    grid-template-rows: repeat(9, 38px);
    grid-column-gap: 0px;
    grid-row-gap: 10px;
    max-width: 1000px;
}

.parent-employee {
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: repeat(3, 1fr);
    grid-column-gap: 0px;
    grid-row-gap: 10px;
    width: 100%;
}

.breadcrumb-item {
    color: #1a1a1a;
}

.breadcrumb-item.clickable:hover {
    color: #7a7a7a;
    cursor: pointer;
}

.button-style-reset {
    display: inline;
    background: none;
    border: none;
    padding: 0;
    font-size: 16px;
}
</style>
