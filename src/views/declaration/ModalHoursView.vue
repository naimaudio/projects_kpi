<template>
    <Teleport to=".global">
        <div class="modal">
            <div ref="modal" class="modal-container column-flex">
                <span class="sub-title">{{ workDays[currentDay] }}</span>
                <span
                    >Hours spend on projects
                    {{ dayNumberToString(currentDay, Number(route.params.week), Number(route.params.year)) }}</span
                >
                <HoursForm
                    :model-value="declaration"
                    @update:model-value="(index, value) => (declaration[index].hours = value)"
                />
                <div class="footer-buttons">
                    <fluent-button
                        appearance="accent"
                        @click="
                            () => {
                                declarationStore.dailyHoursSpend[currentDay] = declaration;
                                close();
                            }
                        "
                        >Validate</fluent-button
                    >
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import HoursForm from "@/components/input_hours/HoursForm.vue";
import { useDeclarationStore } from "@/stores/declarationStore";
import type { days } from "@/typing";
import type { DeclarationInput } from "@/typing";
import { dayNumberToString, dayValidation } from "@/utilities/main";
import { cloneDeep } from "lodash";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { workDays } from "@/typing";
import { onClickOutside } from "@vueuse/core";
const declarationStore = useDeclarationStore();
const router = useRouter();
const route = useRoute();
const modal = ref(null);
const close = () =>
    router.push({
        name: "declarationDate",
        query: route.query,
        params: { year: route.params.year, week: route.params.week },
    });

onClickOutside(modal, () => close());
const currentDay = computed<days>(() => {
    const day = dayValidation(route.params.day);
    if (day === null) {
        throw Error("should not open the daily modal without correct day");
    } else {
        return day;
    }
});

const declaration: DeclarationInput[] = cloneDeep(declarationStore.dailyHoursSpend[currentDay.value]);
</script>
