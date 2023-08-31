<template>
    <div class="page-container">
        <h1 class="title">Data</h1>
        <BaseButton @click="exportCSV">Export Data</BaseButton>
        <BaseButton style="margin-left: 10px" @click="importModal = true">Import Data</BaseButton>
        <br /><br />
        <BaseTable :headers="headers" :items="items" />
        <ImportModal v-if="importModal" @close="importModal = false"></ImportModal>
    </div>
</template>
<script setup lang="ts">
import { getCSVFile, getDeclarationData } from "@/API/requests";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseTable from "@/components/base/BaseTable.vue";
import ImportModal from "@/components/modals/ImportModal.vue";
import type { Header, RawDeclarationMinified } from "@/typing";
import { ref } from "vue";

async function exportCSV() {
    const response = await getCSVFile();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(response.data);
    link.download = "declaration export";
    link.click();
}

const headers: Header[] = [
    {
        id: "project_code",
        name: "Project Code",
    },
    {
        id: "name",
        name: "Employee",
    },
    {
        id: "week",
        name: "Week",
    },
    {
        id: "year",
        name: "Year",
    },
    {
        id: "hours",
        name: "Hours",
    },
];

const items = ref<RawDeclarationMinified[]>([]);
getDeclarationData([]).then((response) => {
    items.value = response.data;
});
const importModal = ref<boolean>(false);
</script>
