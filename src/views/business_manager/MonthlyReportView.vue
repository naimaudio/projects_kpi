import VueDatePicker from '@vuepic/vue-datepicker';
<template>
    <div class="page-container">
        <h1 class="title">
            Monthly Report
            <BaseTooltip>
                <div style="max-width: 300px">Cells with</div>
            </BaseTooltip>
        </h1>

        <br />
        <VueDatePicker
            v-model="selectedDate"
            month-picker
            style="width: 300px"
            format="MMMM yyyy"
            :clearable="false"
        ></VueDatePicker>

        <br />
        <BaseButton v-if="selectedDate !== undefined" @click="refreshConfirmation = true">Refresh values</BaseButton>
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
        <BaseButton style="margin-left: 15px" @click="changeRowsModal = true">Change rows</BaseButton>
        <BaseButton disabled style="margin-left: 15px">Change columns</BaseButton>
        <ModalComponent v-if="refreshConfirmation && selectedDate !== undefined" @close="refreshConfirmation = false">
            <p>
                This action will enable data from new declarations to be included in the
                {{ dayjs((selectedDate.month + 1).toString(), "M").format("MMMM") }} {{ selectedDate.year }} report.
            </p>
            <p>This will erase your previous modifications, are you sure ?</p>
            <BaseButton accent style="margin-left: auto; display: block" @click="refreshValues">Confirm</BaseButton>
        </ModalComponent>
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
                    console.log(rowId, columnId, index, value);
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
        <ModalComponent v-if="modifyConfirmation && selectedDate !== undefined" @close="modifyConfirmation = false">
            <p>Keep in mind changing hours will have no effect in project managemnt KPIs</p>
            <BaseButton accent style="margin-left: auto; display: block" @click="modifyHours">Confirm</BaseButton>
        </ModalComponent>
        <BaseButton style="margin-right: 10px" @click="modifyConfirmation = true">Modify hours</BaseButton>
    </div>
</template>
<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import BaseButton from "@/components/base/BaseButton.vue";
import { ref, watch, onMounted } from "vue";
import InputTableItems from "@/components/base/InputTableItems.vue";
import { getMonthlyHours, putMonthlyHours, postMonthlyHours } from "@/API/requests";
import type { MonthlyHoursItem } from "@/typing";
import { useProjectStore } from "../../stores/projectStore";
import type { MatrixHeader } from "@/typing";
import ModalComponent from "@/components/ModalComponent.vue";
import MonthlyReportRowModal from "@/components/modals/MonthlyReportRowModal.vue";
import dayjs from "dayjs";
import BaseTooltip from "@/components/base/BaseTooltip.vue";
const selectedDate = ref<{ month: number; year: number }>();
const projectStore = useProjectStore();
onMounted(() => {
    selectedDate.value = {
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    };
});

const changeRowsModal = ref<boolean>(false);
const refreshConfirmation = ref<boolean>(false);
const modifyConfirmation = ref<boolean>(false);

watch(selectedDate, (date) => {
    updateReportMonth(date);
});

function modifyHours() {
    if (selectedDate.value !== undefined) {
        putMonthlyHours(selectedDate.value, modifiedItems.value).then(() => {
            updateReportMonth(selectedDate.value);
            modifiedItems.value.splice(0);
        });
        modifyConfirmation.value = false;
    }
}

function refreshValues() {
    if (selectedDate.value !== undefined) {
        postMonthlyHours(selectedDate.value).then(() => {
            updateReportMonth(selectedDate.value).then(() => {
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
                columnHeaders.value.push({ name: response.data[i].user_name || "", id: response.data[i].user_id });
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
        });
    }
}

const items = ref<MonthlyHoursItem[]>([]);
const modifiedItems = ref<MonthlyHoursItem[]>([]);
const columnHeaders = ref<MatrixHeader[]>([]);
const rowHeaders = ref<MatrixHeader[]>([]);
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
                    console.log(p.id);
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
</script>
