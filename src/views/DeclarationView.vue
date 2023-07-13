<template>
    <div class="page-container">
        <div class="column-flex">
            <h1 class="title">Declaration</h1>
            <span v-if="currentMode === 'LATE'">Please fill in the schedules for the week :</span>
            <span v-else-if="currentMode === 'IN_ADVANCE'">You can fill in the schedules in advance :</span>
            <div class="column-container">
                <div v-for="week in weeks" :key="week.week" class="raw-container">
                    <BaseButton
                        style="width: 41px"
                        @click="() => router.push({ path: `/declare/${week.week}/${week.year}` })"
                        >{{ week.week }}
                    </BaseButton>
                    <span
                        class="text"
                        :class="{
                            'warning-color':
                                currentWeek.year === week.year
                                    ? currentWeek.week > week.week
                                    : currentWeek.year > week.year,
                        }"
                    >
                        <ErrorIcon
                            v-if="
                                currentWeek.year === week.year
                                    ? currentWeek.week > week.week
                                    : currentWeek.year > week.year
                            "
                        />
                        {{ weekNumberToString(week.week, week.year) }}</span
                    >
                </div>
            </div>
            <span>Or</span>
            <div class="column-container">
                <BaseButton v-if="currentMode === 'LATE'" @click="changeWeeks('IN_ADVANCE')"
                    >Declare hours in advance</BaseButton
                >
                <BaseButton v-else-if="currentMode === 'IN_ADVANCE'" @click="changeWeeks('LATE')"
                    >Declare hours of current week</BaseButton
                >
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
import ErrorIcon from "@/components/icons/ErrorIcon.vue";
import { ref, watch } from "vue";
const router = useRouter();
const userStore = useUserStore();
// Les flows :
// 1 date de début => Toutes les semaines d'après doivent être renseignées
// 1 date de début => si à la fin du mois non renseignée, sert plus à rien de le renseigner.

const now = dayjs(new Date());
const currentWeek: WeekInYear = { week: now.week(), year: now.get("year") };

function buildDeclarations(
    weeksDeclared: WeekInYear[],
    firstWeekToDeclare: WeekInYear,
    lastWeekToDeclare: WeekInYear
): WeekInYear[] {
    const years = range(firstWeekToDeclare.year, lastWeekToDeclare.year + 1);
    const sortedWeeksDeclared = weeksDeclared
        .sort((weekInYear, weekInYear2) =>
            weekInYear2.year !== weekInYear.year
                ? weekInYear.year - weekInYear2.year
                : weekInYear.week - weekInYear2.week
        )
        .filter(
            (weekInYear) =>
                (weekInYear.year > firstWeekToDeclare.year ||
                    (weekInYear.year === firstWeekToDeclare.year && weekInYear.week >= firstWeekToDeclare.week)) &&
                (weekInYear.year < lastWeekToDeclare.year ||
                    (weekInYear.year === lastWeekToDeclare.year && weekInYear.week <= lastWeekToDeclare.week))
        );
    const declarationsToInput: WeekInYear[] = [];
    let j = 0;
    const lengthOfWeeksDeclared = sortedWeeksDeclared.length;
    years.forEach((year) => {
        const weeksInYear =
            lastWeekToDeclare.year === year ? lastWeekToDeclare.week : dayjs(`${year}-01-01`).isoWeeksInYear();
        for (let i = firstWeekToDeclare.year === year ? firstWeekToDeclare.week : 1; i <= weeksInYear; i++) {
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
const currentMode = ref<"IN_ADVANCE" | "LATE">("LATE");
watch(currentMode, (value) => {
    if (value === "LATE") {
        weeks.value = buildDeclarations(
            userStore.weeksDeclared,
            {
                year: dayjs(userStore.user?.firstDeclarationDay).get("year"),
                week: dayjs(userStore.user?.firstDeclarationDay).week(),
            },
            currentWeek
        );
    } else if (value === "IN_ADVANCE") {
        weeks.value = buildDeclarations(
            userStore.weeksDeclared,
            {
                year: currentWeek.year,
                week: currentWeek.week + 1,
            },
            {
                year: currentWeek.year + 1,
                week: currentWeek.week,
            }
        );
    }
});
const weeks = ref<WeekInYear[]>(
    buildDeclarations(
        userStore.weeksDeclared,
        {
            year: dayjs(userStore.user?.firstDeclarationDay).get("year"),
            week: dayjs(userStore.user?.firstDeclarationDay).week(),
        },
        currentWeek
    )
);

const changeWeeks = (mode: "IN_ADVANCE" | "LATE") => {
    currentMode.value = mode;
};
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

.warning-color {
    color: #797673;
}

.text {
    display: flex;
    gap: var(--gap-inline);
}
</style>
