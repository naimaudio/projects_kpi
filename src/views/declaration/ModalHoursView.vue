<template>
    <ModalComponent
        :close-route="{
            name: 'declarationDate',
            params: { year: String(props.year), week: String(props.week) },
            query: route.query,
        }"
    >
        <p class="sub-title">{{ workDays[props.day] }}</p>
        <p>
            Hours spend on projects
            {{ dayNumberToString(props.day, Number(route.params.week), Number(route.params.year)) }}
        </p>
        <HoursForm
            :model-value="props.dayDeclaration"
            @update:model-value="(index, value) => (onGoingDayDeclaration[index].hours = value)"
        />
        <div class="footer-buttons-block">
            <BaseButton accent :disabled="loading" @click="validation">
                <template #default> <span> Validate</span> </template>
                <template v-if="loading" #start>
                    <fluent-progress-ring style="width: 14px; height: 14px; stroke: lightblue" />
                </template>
            </BaseButton>
        </div>
    </ModalComponent>
</template>

<script setup lang="ts">
import HoursForm from "@/components/input_hours/HoursForm.vue";
import type { days } from "@/typing";
import type { DeclarationInput } from "@/typing";
import { dayNumberToString } from "@/utilities/main";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { workDays } from "@/typing";
import { onClickOutside } from "@vueuse/core";
import { postBufferTable } from "@/API/requests";
import { useGlobalStore } from "../../stores/globalStore";
import { cloneDeep } from "lodash";
import BaseButton from "@/components/BaseButton.vue";
import ModalComponent from "@/components/ModalComponent.vue";
const route = useRoute();
const modal = ref(null);
const close = () => emits("close");

onClickOutside(modal, () => close());

const props = defineProps<{
    dayDeclaration: DeclarationInput[];
    userId: number;
    week: number;
    year: number;
    day: days;
}>();

const onGoingDayDeclaration = ref<DeclarationInput[]>(cloneDeep(props.dayDeclaration));
const loading = ref<boolean>(false);
const emits = defineEmits<{
    (event: "change", day: days, declarationIndex: number, value: number): void;
    (event: "close"): void;
}>();

const globalStore = useGlobalStore();
const validation = async () => {
    loading.value = true;
    console.log(props.dayDeclaration);
    postBufferTable(props.userId, onGoingDayDeclaration.value, props.day, props.week, props.year).then((response) => {
        if (response.status !== 200) {
            globalStore.notification.content = "Your daily declaration can't be registered, please contact IT";
            globalStore.notification.display = true;
            globalStore.notification.type = "FAILURE";
        } else {
            globalStore.notification.content = "Your Daily Declaration has been successfully changed";
            globalStore.notification.display = true;
            globalStore.notification.type = "SUCCESS";
            close();
        }
        loading.value = false;
    });
};
</script>
