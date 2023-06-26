<template>
    <Teleport to=".global">
        <div class="modal">
            <div v-clickOutside="close" class="modal-container">
                <HoursForm
                    :model-value="declaration"
                    @update:model-value="(index, value) => (declaration[index].hours = value)"
                />
                <div class="footer-buttons">
                    <fluent-button
                        appearance="accent"
                        @click="
                            () => {
                                userStore.dailyHoursSpend[currentDay] = declaration;
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
import { useUserStore } from "@/stores/user";
import type { days } from "@/typing";
import type { DeclarationInput } from "@/typing";
import { stringToDay } from "@/utilities/main";
import { cloneDeep } from "lodash";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const close = () =>
    router.push({
        name: "declarationDate",
        query: route.query,
        params: { year: route.params.year, week: route.params.week },
    });
const currentDay = computed<days>(() => {
    const day = stringToDay(route.params.day);
    if (day === null) {
        throw Error("should not open the daily modal without day");
    } else {
        return day;
    }
});

const declaration: DeclarationInput[] = cloneDeep(userStore.dailyHoursSpend[currentDay.value]);
</script>
