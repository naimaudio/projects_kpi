<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
    <ModalComponent
        :close-route="{
            name: 'projects',
        }"
    >
        <h2>{{ project?.name }}</h2>
        <h3>{{ currentPage === 1 ? "Project properties" : "Project phases" }}</h3>
        <!--
            PAGE 1
        -->
        <template v-if="currentPage === 1">
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
                    <fluent-option
                        v-for="classification in classifications"
                        :key="classification"
                        :value="classification"
                    >
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
        </template>
        <!--
            PAGE 2
        -->
        <template v-if="currentPage === 2">
            <div v-if="projectPhases.length < 7" class="icon-with-text">
                <AddOutlineIcon
                    clickable
                    @click="
                        (event) => {
                            if (projectPhases.length === 0) {
                                projectPhases.push({ date: dayjs(new Date()).format('YYYY-MM-DD') });
                            } else {
                                projectPhases.push(cloneDeep(projectPhases[projectPhases.length - 1]));
                            }
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
                <h4>Phase code</h4>
                <h4>Phase name</h4>
                <h4>Phase start date</h4>
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
        </template>
        <!--
            FOOTER
        -->
        <br />
        <div v-if="user.role === 'Project Manager' || user.role === 'Business Manager'" class="footer-buttons-block">
            <BaseButton :disabled="currentPage === 1" style="margin-right: 15px" @click="currentPage = 1">
                Back
            </BaseButton>
            <BaseButton :disabled="loading" :loading="loading" accent @click="clickHandler">{{
                currentPage === 1 ? "Next section" : currentPage === 2 ? "Update Project" : "Can't happen"
            }}</BaseButton>
        </div>
    </ModalComponent>
</template>

<script setup lang="ts">
import ModalComponent from "@/components/ModalComponent.vue";
import { useRoute } from "vue-router";
import { computed, ref, watch } from "vue";
import { useProjectStore } from "@/stores/projectStore";
import {
    type Project,
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
import dayjs from "dayjs";
import { cloneDeep } from "lodash";
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

const maxDate = computed<{ date: string | undefined }>(() => {
    return cloneDeep(
        projectPhases.value.reduce<{ date: string | undefined }>(
            (previous, current) => {
                return current.date === undefined ? previous : current;
            },
            { date: undefined }
        )
    );
});
const projectId = computed<number | undefined>(() => {
    const pId: number = Number(route.params["projectId"]);
    return isNaN(pId) ? undefined : pId;
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
// watch(projectPhases.value, (nxtValue) => {
//     let lastDate = nxtValue[0].date;
//     console.log(1);
//     nxtValue.forEach((phaseStartDate, index) => {
//         if (index !== 0) {
//             console.log(2);
//             if (lastDate !== undefined) {
//                 console.log(3);
//                 if (phaseStartDate.date !== undefined) {
//                     if (dayjs(phaseStartDate.date, "YYYY-MM-DD").diff(lastDate) < 0) {
//                         phaseStartDate.date = undefined;
//                         console.log(4);
//                     } else {
//                         lastDate = phaseStartDate.date;
//                         console.log(5);
//                     }
//                 }
//             } else {
//                 phaseStartDate.date = undefined;
//                 console.log(6);
//             }
//         }
//     });
// });
const globalStore = useGlobalStore();
const selectKey = ref(0);
const project = computed<Project | undefined>(() => {
    return projectStore.projects.find((p) => p.id === projectId.value);
});
const find = projectStore.projects.find((p) => p.id === projectId.value);
if (find === undefined) {
    throw Error("no project id");
}
const currentPage = ref<number>(1);

const editedProject = ref<Project>(find);
const loading = ref<boolean>(false);
const clickHandler = () => {
    if (currentPage.value === 1) {
        currentPage.value = 2;
    } else if (currentPage.value === 2) {
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
    }
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

.parent-phases {
    display: grid;
    grid-template-columns: 1fr 2fr 3fr;
    grid-template-rows: repeat(8, 38px);
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
