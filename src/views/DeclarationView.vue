<template>
    <div class="page-container">
        <div class="column-flex">
            <h1 class="title">Declaration</h1>
            <span>Please fill in the schedules for the week :</span>
            <div class="column-container">
                <div v-for="week in weeks" :key="week.week" class="raw-container">
                    <BaseButton
                        style="width: 41px"
                        @click="() => router.push({ path: `/declare/${week.week}/${week.year}` })"
                        >{{ week.week }}</BaseButton
                    >
                    <span> {{ weekNumberToString(week.week, week.year) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

import { range, weekNumberToString } from "@/utilities/main";
import { useRouter } from "vue-router";
import BaseButton from "@/components/BaseButton.vue";
import type { WeekInYear } from "@/typing/project";
import { useUserStore } from "@/stores/userStore";
const router = useRouter();
const userStore = useUserStore();
// Les flows :
// 1 date de début => Toutes les semaines d'après doivent être renseignées
// 1 date de début => si à la fin du mois non renseignée, sert plus à rien de le renseigner.

function buildDeclarations(weeksDeclared: WeekInYear[], firstWeekToDeclare: WeekInYear): WeekInYear[] {
    const now = dayjs(new Date());
    const currentWeek: WeekInYear = { week: now.week(), year: now.get("year") };
    const years = range(firstWeekToDeclare.year, now.get("year") + 1);
    const sortedWeeksDeclared = weeksDeclared.sort((weekInYear, weekInYear2) =>
        weekInYear2.year !== weekInYear.year ? weekInYear.year - weekInYear2.year : weekInYear.week - weekInYear2.week
    );
    const declarationsToInput: WeekInYear[] = [];
    let j = 0;
    const lengthOfWeeksDeclared = sortedWeeksDeclared.length;
    years.forEach((year) => {
        const weeksInYear = currentWeek.year === year ? currentWeek.week : dayjs(`${year}-01-01`).isoWeeksInYear();
        for (let i = 1; i <= weeksInYear; i++) {
            if (
                j < lengthOfWeeksDeclared &&
                sortedWeeksDeclared[j].week === i &&
                sortedWeeksDeclared[j].year === year
            ) {
                j += 1;
            } else {
                declarationsToInput.push({ week: i, year: year });
            }
        }
    });
    return declarationsToInput;
}
const weeks = buildDeclarations(userStore.weeksDeclared, { year: 2023, week: 2 });
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
