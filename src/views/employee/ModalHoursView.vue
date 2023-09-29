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
            Project hours on
            {{ dayNumberToString(props.day, Number(route.params.week), Number(route.params.year)) }}
        </p>
        <HoursForm
            :model-value="props.dayDeclaration"
            @update:model-value="
                (key, index, value) => {
                    if (key === 'domain') {
                        onGoingDayDeclaration[index].domain = stringToDomain(value.toString());
                    } else if (key === 'hours') {
                        onGoingDayDeclaration[index].hours = Number(value);
                    }
                }
            "
        />
        <div class="footer-buttons-block">
            <BaseButton :loading="loading" accent :disabled="loading" @click="validation">
                <span> Validate</span>
            </BaseButton>
        </div>
    </ModalComponent>
</template>

<script setup lang="ts">
import HoursForm from "@/components/input_hours/HoursForm.vue";
import type { dayNb } from "@/typing";
import type { DeclarationInput } from "@/typing";
import { dayNumberToString } from "@/utilities/main";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { workDays } from "@/typing";
import { onClickOutside } from "@vueuse/core";
import { postBufferTable } from "@/API/requests";
import { useGlobalStore } from "../../stores/globalStore";
import { cloneDeep } from "lodash";
import BaseButton from "@/components/base/BaseButton.vue";
import ModalComponent from "@/components/ModalComponent.vue";
import { stringToDomain } from "@/typing/conversions";

const route = useRoute();

const globalStore = useGlobalStore();

const props = defineProps<{
    dayDeclaration: DeclarationInput[];
    userId: number;
    week: number;
    year: number;
    day: dayNb;
}>();

const emits = defineEmits<{
    (event: "change", day: dayNb, declarationIndex: number, value: number): void;
    (event: "close"): void;
}>();

const onGoingDayDeclaration = ref<DeclarationInput[]>(cloneDeep(props.dayDeclaration));
const loading = ref<boolean>(false);
const modal = ref(null);

const validation = async () => {
    loading.value = true;
    postBufferTable(props.userId, onGoingDayDeclaration.value, props.day, props.week, props.year).then((response) => {
        if (response.status !== 200) {
            globalStore.notification.content = "Your Daily Declaration can't be registered, please contact IT";
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
const close = () => emits("close");

onClickOutside(modal, () => close());
</script>
