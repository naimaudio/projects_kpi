import BaseButton from '@/components/BaseButton.vue';
<template>
    <div class="page-container">
        <h1 class="title">Data</h1>
        <BaseButton @click="exportCSV">Export Data</BaseButton>
    </div>
</template>
<script setup lang="ts">
import { getCSVFile } from "@/API/requests";
import BaseButton from "@/components/BaseButton.vue";

async function exportCSV() {
    const response = await getCSVFile();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(response.data);
    link.download = "tartiflou";
    link.click();
}
</script>
