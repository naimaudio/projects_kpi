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
        <VueDatePicker
            v-model="selectedDate"
            month-picker
            style="width: 300px"
            format="MMMM yyyy"
            :clearable="false"
        ></VueDatePicker>

        <br />
        <BaseButton v-if="selectedDate !== undefined" @click="refreshConfirmation = true"
            >Refresh/reset values</BaseButton
        >
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
        <BaseButton style="margin-left: 15px" @click="changeRowsModal = true">Change rows</BaseButton>
        <BaseButton style="margin-left: 15px" @click="changeColumnsModal = true">Change columns</BaseButton>
        <BaseButton style="margin-left: 15px" disabled>Exports</BaseButton>

        <!-- MODALS -->

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
        <ModalComponent v-if="modifyConfirmation && selectedDate !== undefined" @close="modifyConfirmation = false">
            <p>Are you sure of your modifications ?</p>
            <p>Keep in mind changing hours will have no effect in project management KPIs</p>
            <BaseButton accent style="margin-left: auto; display: block" @click="modifyHours">Confirm</BaseButton>
        </ModalComponent>

        <!-- TABLE -->

        <InputTableItems
            :items="
                items.map((i) => {
                    return {
                        value: i.hours,
                        column_id: i.user_id,
                        row_id: i.project_id,
                    };
                })
            "
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
            @change="
                (rowId, columnId, index, value) => {
                    if (index !== undefined) {
                        modifiedItems[index] = {
                            hours: value,
                            project_id: rowId,
                            user_id: columnId,
                        };
                    } else {
                        modifiedItems.push({
                            hours: value,
                            project_id: rowId,
                            user_id: columnId,
                        });
                    }
                }
            "
            @remove="
                (index) => {
                    modifiedItems.splice(index, 1);
                }
            "
        />
        <div v-if="columnHeaders.length === 0 && rowHeaders.length === 0 && !loading">
            <p class="big" style="display: flex">
                No declared or modified hours for this month have been saved.
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
            v-if="modifiedItems.length >= 1"
            accent
            style="position: absolute; right: 50px; bottom: 50px; z-index: 13"
            @click="modifyConfirmation = true"
        >
            <div class="icon-with-text" style="align-items: center">
                <CheckmarkLineIcon />
                <span> Validate modified hours</span>
            </div>
        </BaseButton>
    </Teleport>
</template>
<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import BaseButton from "@/components/base/BaseButton.vue";
import CheckmarkLineIcon from "@/components/icons/CheckmarkLineIcon.vue";
import { ref, watch, onMounted } from "vue";
import InputTableItems from "@/components/base/InputTableItems.vue";
import { getMonthlyHours, putMonthlyHours, postMonthlyHours, getUsers } from "@/API/requests";
import type { MonthlyHoursItem, Person } from "@/typing";
import { useProjectStore } from "../../stores/projectStore";
import type { MatrixHeader, MatrixHeaderExtended } from "@/typing";
import ModalComponent from "@/components/ModalComponent.vue";
import MonthlyReportRowModal from "@/components/modals/MonthlyReportRowModal.vue";
import dayjs from "dayjs";
import BaseTooltip from "@/components/base/BaseTooltip.vue";
import MonthlyReportColumnModal from "@/components/modals/MonthlyReportColumnModal.vue";
import { useGlobalStore } from "@/stores/globalStore";

const selectedDate = ref<{ month: number; year: number }>();
const loading = ref<boolean>(false);
const changeRowsModal = ref<boolean>(false);
const changeColumnsModal = ref<boolean>(false);
const refreshConfirmation = ref<boolean>(false);
const modifyConfirmation = ref<boolean>(false);
const users = ref<Person[]>([]);
const items = ref<MonthlyHoursItem[]>([]);
const modifiedItems = ref<MonthlyHoursItem[]>([]);
const columnHeaders = ref<MatrixHeaderExtended[]>([]);
const rowHeaders = ref<MatrixHeader[]>([]);

const projectStore = useProjectStore();
const globalStore = useGlobalStore();

watch(selectedDate, (date) => {
    updateReportMonth(date);
});

/**
 * Methods
 */

function modifyHours() {
    if (selectedDate.value !== undefined) {
        putMonthlyHours(selectedDate.value, modifiedItems.value).then((response) => {
            if (response.status === 200) {
                updateReportMonth(selectedDate.value);
                modifiedItems.value.splice(0);
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

async function updateReportMonth(date: { month: number; year: number } | undefined) {
    items.value.splice(0);
    columnHeaders.value.splice(0);
    rowHeaders.value.splice(0);
    if (date !== undefined) {
        loading.value = true;
        await getMonthlyHours(date).then((response) => {
            const projectIds = new Set<number>();
            const l = response.data.length;
            for (let i = 0; i < l; i++) {
                for (let j = 0; j < response.data[i].hours.length; j++) {
                    projectIds.add(response.data[i].hours[j].project_id);
                }
            }
            projectStore.projects.forEach((project) => {
                if (projectIds.has(project.id)) {
                    rowHeaders.value.push({ name: project.name, id: project.id });
                }
            });

            const userCount = response.data.length;
            for (let i = 0; i < userCount; i++) {
                columnHeaders.value.push({
                    name: response.data[i].user_name || "",
                    desc: response.data[i].domain || "",
                    id: response.data[i].user_id,
                });
            }
            items.value.push(
                ...response.data.flatMap<MonthlyHoursItem>((value) => {
                    return value.hours.map<MonthlyHoursItem>((val) => {
                        return {
                            hours: val.hours,
                            project_id: val.project_id,
                            name: value.user_name,
                            user_id: value.user_id,
                        };
                    });
                })
            );
            loading.value = false;
        });
    }
}

const changeRows = (projectIds: number[]) => {
    const projectIdSet = new Set<number>(projectIds);
    const projectIdSetComplete = new Set<number>(projectIds);
    modifiedItems.value = modifiedItems.value.filter((item) => {
        return projectIdSet.has(item.project_id);
    });
    rowHeaders.value.forEach((p) => {
        if (!projectIdSet.has(p.id)) {
            modifiedItems.value.push(
                ...columnHeaders.value.map<MonthlyHoursItem>((user) => {
                    return {
                        hours: 0,
                        project_id: p.id,
                        user_id: user.id,
                        user_name: user.name,
                    };
                })
            );
            projectIdSetComplete.add(p.id);
        }
    });
    rowHeaders.value.splice(0);
    projectStore.projects.forEach((p) => {
        if (projectIdSetComplete.has(p.id)) {
            rowHeaders.value.push({
                id: p.id,
                name: p.name,
            });
        }
    });
    Array.from(projectIdSet).forEach((projectId) => {
        return projectId;
    });
};

const changeColumns = (userIds: number[]) => {
    const userIdSet = new Set<number>(userIds);
    const userIdSetComplete = new Set<number>(userIds);
    modifiedItems.value = modifiedItems.value.filter((item) => {
        return userIdSet.has(item.user_id);
    });
    columnHeaders.value.forEach((u) => {
        if (!userIdSet.has(u.id)) {
            modifiedItems.value.push(
                ...rowHeaders.value.map<MonthlyHoursItem>((project) => {
                    return {
                        hours: 0,
                        project_id: project.id,
                        user_id: u.id,
                        user_name: u.name,
                    };
                })
            );
            userIdSetComplete.add(u.id);
        }
    });
    columnHeaders.value.splice(0);
    users.value.forEach((user) => {
        if (userIdSetComplete.has(user.id)) {
            columnHeaders.value.push({
                id: user.id,
                desc: "",
                name: user.name,
            });
        }
    });
    Array.from(userIdSet).forEach((userId) => {
        return userId;
    });
};

/**
 * Initialization
 */
onMounted(() => {
    selectedDate.value = {
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    };
});

getUsers().then((response) => {
    users.value = response.data;
});
</script>
