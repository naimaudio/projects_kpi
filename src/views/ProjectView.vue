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
        <span class="breadcrumb-item">{{
            project === undefined || newProject === true ? "New project" : project.name
        }}</span>
        <h2>{{ newProject ? "New project" : project?.name }}</h2>
        <h3>Project properties</h3>

        <div v-if="user.role === 'Project Manager' || user.role === 'Business Manager'" class="parent">
            <span>* Name</span>
            <fluent-text-field v-model="editedProject.name" required></fluent-text-field>
            <span>* Organization</span>
            <fluent-select v-model="editedProject.entity">
                <fluent-option v-for="org in organizationNames" :key="org">{{ org }}</fluent-option>
            </fluent-select>
            <span>* Code</span>
            <div class="field-with-validation">
                <fluent-text-field v-model="editedProject.code" @input="codeValidation = undefined"></fluent-text-field>
                <span v-if="codeValidation !== undefined" class="icon-with-text" style="color: #f04e85"
                    ><ErrorIcon /> {{ codeValidation }}</span
                >
            </div>
            <span>* Category</span>
            <fluent-select
                v-model="editedProject.division"
                @input="
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
            <span>* Sub-category</span>
            <fluent-select :key="selectKey" v-model="editedProject.subCategory">
                <fluent-option v-for="subCategory in subDivisions" :key="subCategory" :value="subCategory">
                    <span>{{ subCategoryLabels[subCategory] }}</span>
                    <span style="color: #8f8f8f; font-size: 12px; margin-left: 4px"> {{ subCategory }}</span>
                </fluent-option>
                <span slot="selected-value">{{ editedProject.subCategory }}</span>
            </fluent-select>
            <span>* Type</span>
            <fluent-select v-model="editedProject.expansionRenewal">
                <fluent-option v-for="expRen in expansionRenewalArray" :key="expRen" :value="expRen">{{
                    expansionRenewalLabels[expRen]
                }}</fluent-option>
            </fluent-select>
            <span>* Classification</span>
            <fluent-select v-model="editedProject.classification">
                <fluent-option v-for="classification in classifications" :key="classification" :value="classification">
                    <span>{{ classificationLabels[classification] }}</span>
                </fluent-option>
            </fluent-select>
            <span>Complexity</span>
            <fluent-select
                :value="String(editedProject.complexity)"
                @change="(event: any) => {editedProject.complexity = Number(event.target.value)}"
            >
                <fluent-option v-for="(complexity, index) in complexities" :key="index" :value="Number(index)">
                    <span>{{ complexity }}</span>
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
        <div v-if="editedProject.phases.length < phases.length" class="icon-with-text">
            <AddOutlineIcon
                clickable
                @click="
                    (event) => {
                        editedProject.phases.push({
                            projectPhase: editedProject.phases.length,
                            startDate: undefined,
                            endDate: undefined,
                        });
                    }
                "
            />
            <span class="prefix align-center italic">add a phase</span>
        </div>
        <div v-else style="height: 24px"></div>
        <div v-if="editedProject.phases.length >= 1" class="icon-with-text">
            <SubtractOutlineIcon
                clickable
                @click="
                    (event) => {
                        editedProject.phases.pop();
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
            <span>Phase end date</span>
            <template v-for="(projectPhase, i) in editedProject.phases" :key="i">
                <span>{{ phases[i].code }}</span>
                <span>{{ phases[i].name }}</span>
                <VueDatePicker
                    :model-value="projectPhase.startDate"
                    :min-date="i !== 0 ? editedProject.phases[i - 1].startDate : undefined"
                    :max-date="
                        i !== editedProject.phases.length - 1 ? editedProject.phases[i + 1].startDate : undefined
                    "
                    ignore-time-validation
                    format="dd/MM/yyyy"
                    model-type="yyyy-MM-dd"
                    :auto-apply="true"
                    :enable-time-picker="false"
                    @update:model-value="
                        (val) => {
                            projectPhase.startDate = val;
                            if (i !== 0) {
                                editedProject.phases[i - 1].endDate = val;
                            }
                        }
                    "
                ></VueDatePicker>
                <VueDatePicker
                    v-model="projectPhase.endDate"
                    :min-date="i !== 0 ? projectPhase.startDate : undefined"
                    ignore-time-validation
                    format="dd/MM/yyyy"
                    model-type="yyyy-MM-dd"
                    :auto-apply="true"
                    :enable-time-picker="false"
                    :disabled="i !== editedProject.phases.length - 1"
                ></VueDatePicker>
            </template>
        </div>
        <br />
        <div v-if="user.role === 'Project Manager' || user.role === 'Business Manager'">
            <BaseButton :disabled="loading" :loading="loading" accent @click="clickHandler">{{
                newProject ? "Create Project" : "Update Project"
            }}</BaseButton>
        </div>
        <br />
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useProjectStore } from "@/stores/projectStore";
import {
    type BlankProject,
    type SubCategory,
    divisionOptions,
    divisions,
    subCategoryLabels,
    classifications,
    classificationLabels,
    type CompleteProject,
    expansionRenewalLabels,
    expansionRenewalArray,
} from "@/typing/project";
import VueDatePicker from "@vuepic/vue-datepicker";
import { phases } from "@/stores/nonReactiveStore";
import BaseButton from "@/components/base/BaseButton.vue";
import { useUserStore } from "@/stores/userStore";
import { useGlobalStore } from "@/stores/globalStore";
import type { User } from "@/typing/index";
import { organizationNames } from "@/stores/nonReactiveStore";
import { getProject, postProject, updateProject } from "@/API/requests";
import AddOutlineIcon from "@/components/icons/AddOutlineIcon.vue";
import SubtractOutlineIcon from "@/components/icons/SubtractOutlineIcon.vue";
import { rawProjectToProjectComplete } from "@/typing/conversions";
import ErrorIcon from "@/components/icons/ErrorIcon.vue";
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

const complexities = ["", "★", "★★", "★★★", "★★★★", "★★★★★"];
const globalStore = useGlobalStore();
const selectKey = ref(1294821749);
const loadingInitialRequest = ref<boolean>(false);
const project = ref<CompleteProject | undefined>();
const find = projectStore.projects.find((p) => p.id === projectId.value);
console.log("aa", find);
if (find === undefined) {
    newProject.value = true;
} else {
    loadingInitialRequest.value = true;
    getProject(find.code).then((response) => {
        console.log(response);
        project.value = rawProjectToProjectComplete(response.data);
        editedProject.value = rawProjectToProjectComplete(response.data);
        console.log(project.value);
    });
}
const editedProject = ref<BlankProject>({
    entity: organizationNames[0],
    division: "ALL",
    classification: "NC",
    complexity: 0,
    phases: [],
    expansionRenewal: "",
});
const loading = ref<boolean>(false);
const codeValidation = ref<string | undefined>();

const clickHandler = () => {
    loading.value = true;
    if (!newProject.value && "id" in editedProject.value)
        updateProject(editedProject.value as CompleteProject).then((response) => {
            console.log(response);
            if (response.status === 200) {
                globalStore.notification.content = "Project successfully updated";
                globalStore.notification.display = true;
                globalStore.notification.type = "SUCCESS";
            } else if (response.status === 400 && response.data.detail === "Project code already exists") {
                codeValidation.value = "Project code already exists";
            } else {
                globalStore.notification.content = "Oh no, there was an error";
                globalStore.notification.display = true;
                globalStore.notification.type = "FAILURE";
                close();
            }
        });
    else {
        postProject(editedProject.value as CompleteProject).then((response) => {
            if (response.status === 200) {
                globalStore.notification.content = "Project successfully updated";
                globalStore.notification.display = true;
                globalStore.notification.type = "SUCCESS";
            } else if (response.status === 400 && response.data.detail === "Project code already exists") {
                codeValidation.value = "Project code already exists";
            } else {
                globalStore.notification.content = "Oh no, there was an error";
                globalStore.notification.display = true;
                globalStore.notification.type = "FAILURE";
                close();
            }
        });
    }
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
    grid-column-gap: 0px;
    grid-row-gap: 10px;
    max-width: 1000px;
}

.parent-phases {
    display: grid;
    grid-template-columns: 1fr 2fr 2fr 2fr;
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

.field-with-validation {
    width: 100%;
    gap: 5px;
    display: flex;
    flex-direction: column;
}
</style>
