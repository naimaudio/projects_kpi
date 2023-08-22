<template>
    <div class="page-container">
        <div class="column-flex">
            <h1 class="title">Declaration</h1>
            <BaseButton v-if="currentMode === 'IN_ADVANCE'" @click="changeWeeks('LATE')">
                <ArrowPreviousIcon size="small" color="#000" />
                <span>Declare hours of current week</span>
            </BaseButton>
            <span v-if="currentMode === 'LATE' && weeks.length !== 0" style="font-size: large"
                >Please fill in the schedules for the week :</span
            >
            <span v-else-if="currentMode === 'IN_ADVANCE' && weeks.length !== 0" style="font-size: large"
                >You can fill in the schedules in advance :</span
            >
            <span v-else class="icon-with-text" style="font-size: large">
                Oh, you've already sent in your declarations !
                <img
                    src="@/assets/icons/slightly-smiling-face.png"
                    alt="Slightly Smiling Face"
                    width="30"
                    height="30"
                />
            </span>
            <div v-if="weeks.length !== 0" class="column-container">
                <span v-for="week in weeks" :key="week.week" class="icon-with-text" style="align-items: center">
                    <BaseButton
                        style="width: 90px; display: inline"
                        @click="
                            () =>
                                router.push({
                                    name: 'declarationDate',
                                    params: { week: week.week, year: week.year },
                                    query: route.query,
                                })
                        "
                        >Week {{ week.week }}
                    </BaseButton>
                    <div
                        :class="{
                            'warning-color': week.label === 'error',
                            'success-color': week.label === 'success',
                        }"
                        class="icon-with-text"
                        style="margin-left: 10px"
                    >
                        <ErrorIcon v-if="week.label === 'error'" style="vertical-align: middle" />
                        <CheckmarkIcon v-else-if="week.label === 'success'" style="vertical-align: middle" />
                        {{ weekNumberToString(week.week, week.year) }}
                    </div>
                </span>
            </div>
            <span v-if="weeks.length !== 0 && currentMode === 'LATE'" style="font-size: large">Or</span>
            <span v-else-if="currentMode === 'LATE'" style="font-size: large">You can</span>
            <div class="column-container">
                <BaseButton v-if="currentMode === 'LATE'" @click="changeWeeks('IN_ADVANCE')"
                    >Declare hours in advance</BaseButton
                >
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

import { range, weekNumberToString } from "@/utilities/main";
import { useRoute, useRouter } from "vue-router";
import BaseButton from "@/components/base/BaseButton.vue";
import type { WeekInYear, WeekInYearLabeled } from "@/typing/project";
import { useDeclarationStore } from "@/stores/declarationStore";
import ErrorIcon from "@/components/icons/ErrorIcon.vue";
import { ref, watch, computed } from "vue";
import { useUserStore } from "@/stores/userStore";
import ArrowPreviousIcon from "@/components/icons/ArrowPreviousIcon.vue";
import CheckmarkIcon from "@/components/icons/CheckmarkIcon.vue";
const router = useRouter();
const route = useRoute();
const declarationStore = useDeclarationStore();
const userStore = useUserStore();
// Les flows :
// 1 date de début => Toutes les semaines d'après doivent être renseignées
// 1 date de début => si à la    fin du mois non renseignée, sert plus à rien de le renseigner.

const now = dayjs(new Date());
const currentWeek: WeekInYear = { week: now.week(), year: now.get("year") };
function buildDeclarations(
    weeksDeclared: WeekInYear[],
    firstWeekToDeclare: WeekInYear,
    lastWeekToDeclare: WeekInYear
): WeekInYearLabeled[] {
    const years = range(firstWeekToDeclare.year, lastWeekToDeclare.year + 1, "number");
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
    const declarationsToInput: WeekInYearLabeled[] = [];
    // j is the position of index in weeks declared
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
                if (currentWeek.year === year ? currentWeek.week > i : currentWeek.year > year) {
                    j++;
                } else {
                    declarationsToInput.push({ week: i, year: year, label: "success" });
                    j++;
                }
            } else if (currentWeek.year === year ? currentWeek.week > i : currentWeek.year > year) {
                declarationsToInput.push({ week: i, year: year, label: "error" });
            } else {
                declarationsToInput.push({ week: i, year: year });
            }
        }
    });
    return declarationsToInput;
}
const weeksDeclared = computed<WeekInYear[]>(() => {
    return declarationStore.weeksDeclared;
});
const currentMode = ref<"IN_ADVANCE" | "LATE">("LATE");
watch(currentMode, (value) => {
    updateWeeks(value);
});
watch(weeksDeclared, () => {
    updateWeeks(currentMode.value);
});
function updateWeeks(value: "IN_ADVANCE" | "LATE") {
    if (value === "LATE") {
        weeks.value = buildDeclarations(
            declarationStore.weeksDeclared,
            {
                year: dayjs(userStore.user?.firstDeclarationDay).get("year"),
                week: dayjs(userStore.user?.firstDeclarationDay).week(),
            },
            currentWeek
        );
    } else if (value === "IN_ADVANCE") {
        weeks.value = buildDeclarations(
            declarationStore.weeksDeclared,
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
}

const weeks = ref<WeekInYearLabeled[]>(
    buildDeclarations(
        declarationStore.weeksDeclared,
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
    margin: 14px 14px 14px 14px;
    gap: 14px;
}

.warning-color {
    color: #797673;
}

.success-color {
    color: #248344;
}
</style>
