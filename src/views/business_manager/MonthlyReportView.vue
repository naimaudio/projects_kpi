import VueDatePicker from '@vuepic/vue-datepicker';
<template>
    <div class="page-container">
        <!-- HEADER -->

        <h1 class="title">
            Monthly Report
            <BaseTooltip>
                <div style="max-width: 300px">
                    The shaded cells are those where the number of hours has been modified. These changes need to be
                    validated in order to save them, and to ensure an effect on the business KPIs.
                </div>
            </BaseTooltip>
        </h1>

        <!-- BUTTONS -->

        <br />
        <div style="display: flex; flex-direction: row; width: 100%; justify-content: space-between">
            <div style="display: flex; flex-direction: row; align-items: center">
                <VueDatePicker
                    v-model="selectedDate"
                    month-picker
                    style="width: 300px"
                    format="MMMM yyyy"
                    :clearable="false"
                    @update:model-value="(month: MonthInYear) => { 
                        router.push({...route,
                                query: {
                                    reportDate: month.month === getWednesdayOfCurrentDate().getMonth() && month.year === getWednesdayOfCurrentDate().getFullYear() 
                                        ? undefined
                                        : `${month.month}-${month.year}`}})
                        }"
                ></VueDatePicker>
                <span v-if="currentMonthlyReport?.closed" style="font-style: italic; margin-left: 10px">
                    <div class="icon-with-text" style="align-items: center">
                        <MultipleLockIcon />
                        <span>closed</span>
                    </div>
                </span>
                <span v-else style="font-style: italic; margin-left: 10px">
                    {{
                        currentMonthlyReport?.sync_date
                            ? `last sync : ${dayjs(currentMonthlyReport?.sync_date).format("MMMM D, YYYY h:mm A")}`
                            : ""
                    }}</span
                >
            </div>
            <BaseButton style="margin-left: 15px" accent @click="closeReportModal = true">
                <div class="icon-with-text" style="align-items: center">
                    <UnlockIcon v-if="currentMonthlyReport?.closed" color="white" />
                    <MultipleLockIcon v-else color="white" />
                    <span> {{ currentMonthlyReport?.closed ? "Reopen report" : "Close report" }}</span>
                </div>
            </BaseButton>
        </div>
        <br />
        <span v-if="firstWednesday !== undefined && lastWednesday !== undefined"
            >From
            {{ firstWednesday.format("dddd, MMMM D, YYYY") }}
            to
            {{ lastWednesday.format("dddd, MMMM D, YYYY") }}. (
            {{ countWeeksBetween(firstWednesday, lastWednesday) }} weeks )
        </span>
        <br />
        <br />
        <BaseButton
            v-if="selectedDate !== undefined"
            :disabled="currentMonthlyReport?.closed"
            @click="refreshConfirmation = true"
            >Refresh/reset to declared data</BaseButton
        >
        <BaseButton style="margin-left: 15px" @click="exportsModal = true">Exports</BaseButton>
        <BaseButton style="margin-left: 15px" @click="changeRowsModal = true">Projects display</BaseButton>
        <BaseButton style="margin-left: 15px" @click="changeColumnsModal = true">Users display</BaseButton>

        <!-- MODALS -->

        <MonthlyReportRowModal
            v-if="changeRowsModal"
            :selected-rows="
                rowHeaders.map((row) => {
                    return row.id;
                })
            "
            @close="changeRowsModal = false"
            @change="changeRows"
        />
        <MonthlyReportColumnModal
            v-if="changeColumnsModal"
            :selected-columns="
                columnHeaders.map((column) => {
                    return column.id;
                })
            "
            :users="users"
            @close="changeColumnsModal = false"
            @change="changeColumns"
        />
        <ModalComponent v-if="exportsModal" @close="exportsModal = false">
            <h2>Which exports ?</h2>
            <div style="display: flex; gap: 20px">
                <BaseButton :loading="loadingExportMonthly" @click="exportMonthly">All records</BaseButton>
                <BaseButton :loading="loadingExportMonthlyReview" @click="exportMonthlyReview"
                    >Overall review of the month</BaseButton
                >
            </div>
        </ModalComponent>
        <ModalComponent v-if="refreshConfirmation && selectedDate !== undefined" @close="refreshConfirmation = false">
            <p>
                This action will enable data from new declarations to be included in the
                {{ dayjs((selectedDate.month + 1).toString(), "M").format("MMMM") }} {{ selectedDate.year }} report. It
                can take some time.
            </p>
            <p>This will erase your previous modifications, are you sure ?</p>
            <BaseButton
                :loading="loading"
                :disabled="loading"
                accent
                style="margin-left: auto; display: block"
                @click="refreshValues"
                >Confirm</BaseButton
            >
        </ModalComponent>
        <ModalComponent v-if="closeReportModal && selectedDate !== undefined" @close="closeReportModal = false">
            <p>
                This action will enable data from new declarations to be included in the
                {{ dayjs((selectedDate.month + 1).toString(), "M").format("MMMM") }} {{ selectedDate.year }} report. It
                can take some time.
            </p>
            <p>Closing a monthly report assure you there will be no unwanted modifications.</p>
            <BaseButton
                accent
                style="margin-left: auto; display: block"
                @click="closeMonthlyReport(!!!currentMonthlyReport?.closed)"
            >
                <div class="icon-with-text" style="align-items: center">
                    <UnlockIcon v-if="currentMonthlyReport?.closed" color="white" />
                    <MultipleLockIcon v-else color="white" />
                    <span> {{ currentMonthlyReport?.closed ? "Reopen report" : "Close monthly report" }}</span>
                </div>
            </BaseButton>
        </ModalComponent>
        <ModalComponent v-if="modifyConfirmation && selectedDate !== undefined" @close="modifyConfirmation = false">
            <p>Are you sure of your modifications ?</p>
            <p>Keep in mind changing hours will have no effect in project management KPIs</p>
            <BaseButton accent style="margin-left: auto; display: block" @click="modifyHours">Confirm</BaseButton>
        </ModalComponent>

        <!-- TABLE -->

        <InputTableProjectHours
            :key="inputTableKey"
            :items="
                items.map((i) => {
                    return {
                        value: i.hours,
                        column_id: i.user_id,
                        row_id: i.project_id,
                    };
                })
            "
            :disabled="currentMonthlyReport === undefined || currentMonthlyReport.closed"
            :modified-items="
                modifiedItems.map((i) => {
                    return {
                        value: i.hours,
                        column_id: i.user_id,
                        row_id: i.project_id,
                    };
                })
            "
            :column-headers="columnHeaders"
            :row-headers="rowHeaders"
            :modified-row-items="modifiedRowItems"
            :threshold="currentMonthlyReport?.overtime_threshold || 1000"
            :modified-threshold="modifiedThreshold"
            @change-threshold="(thresholdValue) => (modifiedThreshold = thresholdValue)"
            @change="
                (rowId, columnId, index, value) => {
                    if (index !== undefined) {
                        modifiedItems[index] = {
                            hours: value,
                            project_id: rowId,
                            user_id: columnId,
                            domain:
                                items.find((item) => item.user_id === columnId)?.domain ||
                                users.find((user) => user.id === columnId)?.domain ||
                                'General',
                        };
                    } else {
                        modifiedItems.push({
                            hours: value,
                            project_id: rowId,
                            user_id: columnId,
                            domain:
                                items.find((item) => item.user_id === columnId)?.domain ||
                                users.find((user) => user.id === columnId)?.domain ||
                                'General',
                        });
                    }
                }
            "
            @change-row="
                (rowId, index, capitalizable) => {
                    if (index !== undefined) {
                        modifiedRowItems[index] = {
                            project_id: rowId,
                            capitalizable: capitalizable,
                        };
                    } else {
                        modifiedRowItems.push({
                            project_id: rowId,
                            capitalizable: capitalizable,
                        });
                    }
                }
            "
            @remove="
                (index) => {
                    modifiedItems.splice(index, 1);
                }
            "
            @remove-row="
                (index) => {
                    modifiedRowItems.splice(index, 1);
                }
            "
        />
        <div v-if="columnHeaders.length === 0 && rowHeaders.length === 0 && !loading">
            <p class="big" style="display: flex">
                No declared or modified hours for this month have been saved. You can try to refresh the data !
                <img
                    src="@/assets/icons/thinking_face_3d.png"
                    style="margin-left: 15px"
                    alt="Slightly Smiling Face"
                    width="60"
                    height="60"
                />
            </p>
        </div>
    </div>

    <!-- CONFIRMATION BUTTON -->

    <Teleport to=".global">
        <BaseButton
            v-if="
                modifiedItems.length >= 1 ||
                modifiedRowItems.length >= 1 ||
                modifiedThreshold !== currentMonthlyReport?.overtime_threshold
            "
            accent
            style="position: absolute; right: 50px; bottom: 50px; z-index: 13"
            @click="modifyConfirmation = true"
        >
            <div class="icon-with-text" style="align-items: center">
                <CheckmarkLineIcon color="white" />
                <span> Validate</span>
            </div>
        </BaseButton>
    </Teleport>
</template>
<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import BaseButton from "@/components/base/BaseButton.vue";
import CheckmarkLineIcon from "@/components/icons/CheckmarkLineIcon.vue";
import { ref, watch, onMounted, computed } from "vue";
import InputTableProjectHours from "@/components/base/InputTableProjectHours.vue";
import {
    getMonthlyHours,
    putMonthlyHours,
    postMonthlyHours,
    getUsers,
    getExportMonthlyHours,
    getExportMonthlyOverallReview,
    getMonthlyReport,
    postMonthlyReport,
    closeOrOpenMonthlyReport,
    getProjectMonthlyInfo,
} from "@/API/requests";
import type { MonthlyHoursItem, MonthlyReport, Person, MatrixHeaderExtended } from "@/typing";
import { useProjectStore } from "@/stores/projectStore";
import ModalComponent from "@/components/ModalComponent.vue";
import MonthlyReportRowModal from "@/components/modals/MonthlyReportRowModal.vue";
import dayjs from "dayjs";
import BaseTooltip from "@/components/base/BaseTooltip.vue";
import MonthlyReportColumnModal from "@/components/modals/MonthlyReportColumnModal.vue";
import { useGlobalStore } from "@/stores/globalStore";
import MultipleLockIcon from "@/components/icons/MultipleLockIcon.vue";
import UnlockIcon from "@/components/icons/UnlockIcon.vue";
import type { MonthInYear, ProjectMatrixHeader, ProjectMonthlyInformationItem } from "@/typing/project";
import {
    countWeeksBetween,
    getFirstWednesdayOfMonth,
    getLastWednesdayOfMonth,
    getWednesdayOfCurrentDate,
} from "@/utilities/main";
import { useRouter, useRoute } from "vue-router";

const route = useRoute();
const router = useRouter();
const selectedDate = ref<MonthInYear>();
const loading = ref<boolean>(false);
const changeRowsModal = ref<boolean>(false);
const changeColumnsModal = ref<boolean>(false);
const closeReportModal = ref<boolean>(false);
const exportsModal = ref<boolean>(false);
const refreshConfirmation = ref<boolean>(false);
const modifyConfirmation = ref<boolean>(false);
const users = ref<Person[]>([]);
const items = ref<MonthlyHoursItem[]>([]);
const modifiedItems = ref<MonthlyHoursItem[]>([]);
const columnHeaders = ref<MatrixHeaderExtended[]>([]);
const rowHeaders = ref<ProjectMatrixHeader[]>([]);
const loadingExportMonthlyReview = ref<boolean>(false);
const loadingExportMonthly = ref<boolean>(false);
const projectStore = useProjectStore();
const globalStore = useGlobalStore();
const inputTableKey = ref(9942154);
const modifiedRowItems = ref<{ project_id: number; capitalizable: boolean | undefined }[]>([]);
const currentMonthlyReport = ref<MonthlyReport | undefined>(undefined);
const monthlyInfoFromId = ref<Record<number, ProjectMonthlyInformationItem>>({});
const firstWednesday = computed(() =>
    selectedDate.value !== undefined
        ? getFirstWednesdayOfMonth(selectedDate.value.year, selectedDate.value.month + 1).subtract(2, "day")
        : undefined
);
const lastWednesday = computed(() =>
    selectedDate.value
        ? getLastWednesdayOfMonth(selectedDate.value.year, selectedDate.value.month + 1).add(2, "day")
        : undefined
);
const modifiedThreshold = ref(1000);
watch(selectedDate, (date) => {
    updateReportMonth(date);
});

/**
 * Methods
 */

async function exportMonthly() {
    if (selectedDate.value !== undefined) {
        loadingExportMonthly.value = true;

        getExportMonthlyHours(selectedDate.value).then((response) => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(response.data);
            link.download = "declaration export";
            link.click();
            loadingExportMonthly.value = false;
        });
    }
}

async function exportMonthlyReview() {
    if (selectedDate.value !== undefined) {
        loadingExportMonthlyReview.value = true;
        getExportMonthlyOverallReview(selectedDate.value).then((response) => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(response.data);
            link.download = "declaration export";
            link.click();
            loadingExportMonthlyReview.value = false;
        });
    }
}

function modifyHours() {
    if (selectedDate.value !== undefined) {
        putMonthlyHours(selectedDate.value, modifiedItems.value, modifiedRowItems.value).then((response) => {
            if (response.status === 200) {
                updateReportMonth(selectedDate.value);
                globalStore.notification = {
                    content: "Hours succesfully modified",
                    display: true,
                    type: "SUCCESS",
                };
            } else {
                globalStore.notification = {
                    content: "Server Error",
                    display: true,
                    type: "FAILURE",
                };
            }
        });
        modifyConfirmation.value = false;
    }
}

function refreshValues() {
    loading.value = true;
    if (selectedDate.value !== undefined) {
        postMonthlyHours(selectedDate.value).then(() => {
            updateReportMonth(selectedDate.value).then(() => {
                loading.value = false;
                refreshConfirmation.value = false;
            });
        });
    }
}
async function closeMonthlyReport(close: boolean) {
    if (selectedDate.value !== undefined) {
        await closeOrOpenMonthlyReport(selectedDate.value, close);
        closeReportModal.value = false;
        updateReportMonth(selectedDate.value);
    }
}

async function updateReportMonth(date: { month: number; year: number } | undefined) {
    items.value.splice(0);
    columnHeaders.value.splice(0);
    rowHeaders.value.splice(0);
    if (date !== undefined) {
        loading.value = true;
        let resp = await getMonthlyReport(date);
        if (resp.status === 404) {
            let resp2 = await postMonthlyReport({
                closed: false,
                month: date,
                overtime_threshold: modifiedThreshold.value,
            });
            if (resp2.status === 200) {
                await updateReportMonth(date);
                return;
            }
        } else {
            currentMonthlyReport.value = resp.data;
            modifiedThreshold.value = resp.data.overtime_threshold;
        }
        let response = await getMonthlyHours(date);
        const now = dayjs();
        const projectIds = new Set<number>();
        const l = response.data.length;
        for (let i = 0; i < l; i++) {
            for (let j = 0; j < response.data[i].hours.length; j++) {
                projectIds.add(response.data[i].hours[j].project_id);
            }
        }
        const userCount = response.data.length;
        if (
            currentMonthlyReport.value?.closed ||
            date.year < now.get("year") ||
            (date.year === now.get("year") && date.month < now.get("month"))
        ) {
            for (let i = 0; i < userCount; i++) {
                columnHeaders.value.push({
                    name: response.data[i].user_name || "",
                    id: response.data[i].user_id,
                });
            }
        }
        items.value.push(
            ...response.data.flatMap<MonthlyHoursItem>((value) => {
                return value.hours.map<MonthlyHoursItem>((val) => {
                    return {
                        hours: val.hours,
                        project_id: val.project_id,
                        name: value.user_name,
                        user_id: value.user_id,
                        domain: val.domain,
                        user_name: value.user_name,
                    };
                });
            })
        );

        loading.value = false;
        let response2 = await getProjectMonthlyInfo(date);
        response2.data.forEach((infos) => {
            if (infos.project_id !== undefined) {
                monthlyInfoFromId.value[infos.project_id] = {
                    month: infos.month,
                    year: infos.year,
                    capitalizable: infos.capitalizable,
                    forecast_hours: infos.forecast_hours,
                    project_id: infos.project_id,
                };
            }
        });

        projectStore.projects.forEach((project) => {
            if (projectIds.has(project.id)) {
                rowHeaders.value.push({
                    name: project.name,
                    id: project.id,
                    code: project.code,
                    capitalizable:
                        monthlyInfoFromId.value[project.id]?.capitalizable === null
                            ? undefined
                            : monthlyInfoFromId.value[project.id]?.capitalizable,
                    status: project.status,
                });
            }
        });

        let response3 = await getUsers();
        users.value = response3.data;
        if (
            date !== undefined &&
            currentMonthlyReport.value !== undefined &&
            !currentMonthlyReport.value.closed &&
            (date.year > now.get("year") || (date.year === now.get("year") && date.month >= now.get("month")))
        ) {
            users.value.forEach((user) => {
                if (user.status === "Active") {
                    columnHeaders.value.push({
                        name: user.name,
                        id: user.id,
                    });
                }
            });
        }
        modifiedItems.value.splice(0);
        modifiedRowItems.value.splice(0);
    }
}

const changeRows = (projectIds: number[]) => {
    const projectIdSet = new Set<number>(projectIds);
    modifiedItems.value = modifiedItems.value.filter((item) => {
        return projectIdSet.has(item.project_id);
    });
    rowHeaders.value.splice(0);
    projectStore.projects.forEach((p) => {
        if (projectIdSet.has(p.id)) {
            rowHeaders.value.push({
                id: p.id,
                name: p.name,
                code: p.code,
                status: p.status,
                capitalizable:
                    monthlyInfoFromId.value[p.id]?.capitalizable === null
                        ? undefined
                        : monthlyInfoFromId.value[p.id]?.capitalizable,
            });
        }
    });
    // update the report
    inputTableKey.value += 1;
};

const changeColumns = (userIds: number[]) => {
    const userIdSet = new Set<number>(userIds);
    modifiedItems.value = modifiedItems.value.filter((item) => {
        return userIdSet.has(item.user_id);
    });
    columnHeaders.value.splice(0);
    users.value.forEach((user) => {
        if (userIdSet.has(user.id)) {
            columnHeaders.value.push({
                id: user.id,
                name: user.name,
            });
        }
    });
    // Update the table of user
    inputTableKey.value += 1;
};

/**
 * Initialization
 */
onMounted(() => {
    const date = route.query.reportDate;
    selectedDate.value =
        !Array.isArray(date) && date !== null && date !== undefined
            ? { month: Number(date?.split("-")[0]), year: Number(date?.split("-")[1]) }
            : {
                  month: getWednesdayOfCurrentDate().getMonth(),
                  year: getWednesdayOfCurrentDate().getFullYear(),
              };
});
</script>
