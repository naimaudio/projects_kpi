<template>
    <div class="page-container">
        <div class="column-flex">
            <h1 class="title">Declaration</h1>
            <span>Please fill in the schedules for the week :</span>
            <div class="column-container">
                <div v-for="week in weeks" :key="week.number" class="raw-container">
                    <BaseButton @click="() => router.push({ path: `/declare/${week.number}/2023` })">{{
                        week.number
                    }}</BaseButton>
                    <span> {{ weekNumberToString(week.number, 2023) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { weekNumberToString } from "@/utilities/main";
import { useRouter } from "vue-router";
import BaseButton from "@/components/BaseButton.vue";
const router = useRouter();

interface Week {
    number: number;
}

const weeks: Week[] = [
    {
        number: 34,
    },
    {
        number: 35,
    },
];
</script>

<style scoped>
.block {
    display: block;
}

.column-container {
    display: flex;
    flex-direction: column;
    margin: 28px 14px 14px 14px;
    gap: 14px;
}
</style>
