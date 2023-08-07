import VueDatePicker from '@vuepic/vue-datepicker';
<template>
    <div class="page-container">
        <h1 class="title">Monthly report</h1>
        <VueDatePicker v-model="selectedDate" month-picker style="width: 300px" format="MMMM yyyy"></VueDatePicker>
        <InputTable :items="items" :column-headers="columnHeaders" :row-headers="rowHeaders" />
    </div>
</template>
<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import { ref, watch } from "vue";
import InputTable from "@/components/base/InputTable.vue";
import { getMonthlyHours } from "@/API/requests";
import type { MonthlyHours } from "@/typing";
import { useProjectStore } from "../../stores/projectStore";
import type { MatrixHeader } from "@/typing";
const selectedDate = ref<{ month: number; year: number }>();
const projectStore = useProjectStore();
watch(selectedDate, (date) => {
    items.value.splice(0);
    columnHeaders.value.splice(0);
    rowHeaders.value.splice(0);
    if (date !== undefined) {
        getMonthlyHours(date).then((response) => {
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
                columnHeaders.value.push({ name: response.data[i].user_name, id: response.data[i].user_id });
            }
            items.value.push(...response.data);
        });
    }
});

const items = ref<MonthlyHours[]>([]);
const columnHeaders = ref<MatrixHeader[]>([]);
const rowHeaders = ref<MatrixHeader[]>([]);
</script>
