<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
    <div v-if="done" class="page-container">
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
            <span>Division</span>
            <span>{{ editedProject?.division }}</span>
            <span>Sub division</span>
            <span>{{ editedProject?.subCategory }}</span>
            <span>Organization</span>
            <span>{{ editedProject?.entity }}</span>
        </div>
        <template v-if="user.role === 'Project Manager' || user.role === 'Business Manager'">
            <h3>Project dates</h3>
            <div class="parent">
                <span>Start date</span>
                <VueDatePicker
                    v-model="editedProject.startDate"
                    format="dd/MM/yyyy"
                    model-type="yyyy-MM-dd"
                    :auto-apply="true"
                    :enable-time-picker="false"
                ></VueDatePicker>
                <span>End date</span>
                <VueDatePicker
                    v-model="editedProject.endDate"
                    format="dd/MM/yyyy"
                    model-type="yyyy-MM-dd"
                    :auto-apply="true"
                    :enable-time-picker="false"
                ></VueDatePicker>
                <span>Capitalization starts</span>
                <VueDatePicker
                    v-model="editedProject.startCapDate"
                    format="dd/MM/yyyy"
                    model-type="yyyy-MM-dd"
                    :auto-apply="true"
                    :enable-time-picker="false"
                ></VueDatePicker>
                <span>Capitalization ends</span>
                <VueDatePicker
                    v-model="editedProject.endCapDate"
                    format="dd/MM/yyyy"
                    model-type="yyyy-MM-dd"
                    :auto-apply="true"
                    :enable-time-picker="false"
                ></VueDatePicker>
            </div>
            <h3>Project phases</h3>
            <div v-if="editedProject.phases.length < phases.length" class="icon-with-text">
                <AddOutlineIcon
                    clickable
                    @click="
                        (event) => {
                            const k = editedProject.phases.findIndex((p, l) => p.projectPhase !== l);
                            if (k === -1) {
                                editedProject.phases.push({
                                    projectPhase: editedProject.phases.length,
                                    startDate: undefined,
                                    endDate: undefined,
                                });
                            } else {
                                editedProject.phases.splice(k, 0, {
                                    projectPhase: k,
                                    startDate: undefined,
                                    endDate: undefined,
                                });
                            }
                        }
                    "
                />
                <span class="prefix align-center italic">add a phase</span>
            </div>
            <div v-else style="height: 24px"></div>
            <br />
            <div class="parent-phases">
                <span></span>
                <span>Phase code</span>
                <span>Phase name</span>
                <span>Phase start date</span>
                <span>Phase end date</span>
                <template v-for="(projectPhase, i) in phases" :key="i">
                    <SubtractOutlineIcon
                        v-if="editedProject.phases[jGetter[i]] !== undefined"
                        clickable
                        @click="
                            (event) => {
                                editedProject.phases.splice(jGetter[i], 1);
                            }
                        "
                    />
                    <span v-else></span>
                    <span>{{ projectPhase.code }}</span>
                    <span>{{ projectPhase.name }} </span>
                    <VueDatePicker
                        v-if="editedProject.phases[jGetter[i]] !== undefined"
                        :model-value="editedProject.phases[jGetter[i]].startDate"
                        :min-date="
                            jGetter[i] !== 0
                                ? dayjs(editedProject.phases[jGetter[i] - 1].startDate, 'YYYY-MM-DD')
                                      .add(1, 'month')
                                      .format('YYYY-MM-DD')
                                : undefined
                        "
                        :max-date="editedProject.phases[jGetter[i]].endDate"
                        ignore-time-validation
                        format="dd/MM/yyyy"
                        month-picker
                        model-type="yyyy-MM-dd"
                        :auto-apply="true"
                        :enable-time-picker="false"
                        @update:model-value="
                            (val) => {
                                if (val === null) {
                                    editedProject.phases[jGetter[i]].startDate = undefined;
                                    if (i !== 0) {
                                        editedProject.phases[jGetter[i] - 1].endDate = undefined;
                                    }
                                } else {
                                    let val2 = dayjs(val);
                                    editedProject.phases[jGetter[i]].startDate = val2
                                        .startOf('month')
                                        .format('YYYY-MM-DD');
                                    if (i !== 0) {
                                        editedProject.phases[jGetter[i] - 1].endDate = val2
                                            .subtract(1, 'month')
                                            .endOf('month')
                                            .format('YYYY-MM-DD');
                                    }
                                }
                            }
                        "
                    ></VueDatePicker>
                    <span v-else></span
                    ><VueDatePicker
                        v-if="editedProject.phases[jGetter[i]] !== undefined"
                        :model-value="editedProject.phases[jGetter[i]].endDate"
                        :min-date="i !== 0 ? editedProject.phases[jGetter[i]].startDate : undefined"
                        :max-date="
                            i !== editedProject.phases.length - 1
                                ? dayjs(editedProject.phases[jGetter[i] + 1].startDate, 'YYYY-MM-DD')
                                      .subtract(1, 'month')
                                      .format('YYYY-MM-DD')
                                : undefined
                        "
                        ignore-time-validation
                        format="dd/MM/yyyy"
                        month-picker
                        model-type="yyyy-MM-dd"
                        :auto-apply="true"
                        :enable-time-picker="false"
                        @update:model-value="
                            (val) => {
                                editedProject.phases[jGetter[i]].endDate = dayjs(val)
                                    .endOf('month')
                                    .format('YYYY-MM-DD');
                            }
                        "
                    ></VueDatePicker>
                    <span v-else></span>
                </template>
            </div>
            <h3>Project forecast</h3>
            <div>
                <div id="forecast-line-chart" ref="forecastLineChart"></div>
                <InputTableCells
                    :cells="cells"
                    :row-headers="years"
                    :column-headers="months"
                    @change="
                        (rowIndex, columnInded, value) => {
                            cells[rowIndex][columnInded] = value;
                        }
                    "
                />
            </div>
            <div>
                <BaseButton style="margin-right: 10px" @click="router.push({ name: 'projects', query: route.query })"
                    >Back to projects</BaseButton
                >
                <BaseButton :disabled="loading" :loading="loading" accent @click="clickHandler">{{
                    newProject ? "Create Project" : "Update Project"
                }}</BaseButton>
            </div>
        </template>
        <br />
    </div>
    <div v-else class="centered"><fluent-progress-ring /></div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { computed, ref, onMounted, watch } from "vue";
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
import { phases, phasesRecord } from "@/stores/nonReactiveStore";
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
import InputTableCells from "@/components/base/InputTableCells.vue";
import * as echarts from "echarts/core";
import type { ECOption } from "@/main";
import { range } from "../utilities/main";
import dayjs from "dayjs";
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
const done = ref<boolean>(false);
const jGetter = computed<Record<number, number>>(() => {
    const rec: Record<number, number> = [];
    editedProject.value.phases.forEach((val, index) => {
        if (val.projectPhase !== undefined) {
            rec[val.projectPhase] = index;
        }
    });
    return rec;
});

if (find === undefined) {
    newProject.value = true;
    done.value = true;
} else {
    loadingInitialRequest.value = true;
    getProject(find.code).then((response) => {
        project.value = rawProjectToProjectComplete(response.data);
        editedProject.value = rawProjectToProjectComplete(response.data);
        done.value = true;
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

const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
const wholeXAxis = range(2020, 2025).flatMap((year) => {
    const monthNumbers = range(1, 13).map((i) => (i < 10 ? `0${i}` : `${i}`));
    return monthNumbers.map<string>((m) => {
        return `${m}-${year}`;
    });
});
const xAxis = computed(() => {
    const flatten = cells.value.flatMap((a) => a);
    return wholeXAxis.slice(
        flatten.findIndex((val) => val !== 0),
        flatten.findLastIndex((val) => val !== 0) + 1
    );
});

const series = computed<number[]>(() => {
    const flatten = cells.value.flatMap((a) => a);
    return flatten
        .reduce<number[]>((acc, curr, index) => {
            acc.push((acc[index - 1] || 0) + curr);
            return acc;
        }, [])
        .slice(
            flatten.findIndex((val) => val !== 0),
            flatten.findLastIndex((val) => val !== 0) + 1
        );
});
const lineChartOption = computed<ECOption>(() => {
    return {
        xAxis: {
            type: "category",
            data: xAxis.value,
        },
        yAxis: {
            type: "value",
        },
        series: [
            {
                type: "line",
                data: series.value,
            },
        ],
        tooltip: {
            trigger: "axis",
        },
    };
});

const years: string[] = ["2020", "2021", "2022", "2023", "2024"];

const forecastLineChart = ref<HTMLElement | null>(null);

const cells = ref<number[][]>(
    Array(years.length)
        .fill(0)
        .map(() => {
            return Array(months.length).fill(0);
        })
);
watch(forecastLineChart, (newValue, oldValue) => {
    if (newValue !== null && oldValue === null) {
        newValue.style.width = "1300px";
        newValue.style.height = "600px";
        const eChart = echarts.init(forecastLineChart.value);
        eChart.setOption(lineChartOption.value);
    }
});
watch(lineChartOption, () => {
    if (forecastLineChart.value !== null) {
        const eChart = echarts.getInstanceByDom(forecastLineChart.value);
        if (eChart !== undefined) {
            eChart.setOption(lineChartOption.value);
        }
    }
});
onMounted(() => {
    console.log(forecastLineChart.value);
});
</script>

<style>
.centered {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: fit-content;
}
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
    grid-template-columns: 1fr 2fr 4fr 4fr 4fr;
    grid-template-rows: repeat(8, 39px);
    grid-column-gap: 0px;
    grid-template-rows: repeat(40px, 7);
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
