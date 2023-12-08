<template>
    <ModalComponent @close="() => emits('close')">
        <span class="sub-title">Week {{ props.weekNumber }} of {{ props.year }}</span>
        <p v-if="confirmation">
            Please confirm the declaration for {{ weekNumberToString(props.weekNumber, props.year) }}.
        </p>
        <p v-else>Declaration for {{ weekNumberToString(props.weekNumber, props.year) }}.</p>
        <div class="table-raw-gap" />
        <div class="declaration-container column-flex">
            <div class="declaration-inputs prefix">
                <HoursRecap :model-value="props.declaration" />
                <div class="table-raw-gap" />
                <div class="divider" />
                <div class="table-raw-gap" />
                <div class="table-raw-container">
                    <span>Total</span>
                    <div></div>
                    <div>
                        <span>{{ sumProjectHours }} </span>
                    </div>
                </div>
                <div class="table-raw-gap" />
                <div v-if="props.comment !== undefined && props.comment !== ''" class="table-raw-container-2">
                    <span>Comment</span>
                    <span> {{ props.comment }} </span>
                    <br />
                </div>
            </div>
        </div>
        <div class="table-raw-gap" />
        <div v-if="confirmation" class="footer-buttons-block">
            <BaseButton :loading="loading" accent :disabled="loading" @click="emits('confirm')">
                <span> Validate</span>
            </BaseButton>
        </div>
    </ModalComponent>
</template>

<script setup lang="ts">
import ModalComponent from "@/components/ModalComponent.vue";
import type { DeclarationInput } from "@/typing/index";
import { computed } from "vue";

import HoursRecap from "@/components/input_hours/HoursRecap.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import { weekNumberToString } from "@/utilities/main";
const props = withDefaults(
    defineProps<{
        declaration: DeclarationInput[];
        comment?: string;
        weekNumber: number;
        year: number;
        confirmation: boolean;
        loading?: boolean;
    }>(),
    { loading: false, comment: "" }
);
const sumProjectHours = computed<number>(() => {
    return props.declaration.reduce<number>((sum, decl) => decl.hours + sum, 0);
});

const emits = defineEmits<{
    (event: "close"): void;
    (event: "confirm"): void;
}>();
</script>

<style scoped>
.declaration-container {
    border: 1px solid #d1d1d1;
    border-radius: 4px;
    background-color: white;
    padding: 14px 44px 10px 30px;

    color: #242424;
    box-shadow: 0 2px 4px #00000024, 0 0 2px #0000001f;
}

.table-raw-container {
    display: grid;
    grid-template-columns: 1fr 2fr 2fr;
    grid-template-rows: 1fr;
    grid-column-gap: 31px;
}

.table-raw-gap {
    height: 10px;
}

.table-raw-container-2 {
    display: grid;
    grid-template-columns: 1fr 4fr;
    grid-template-rows: 1fr;
    grid-column-gap: 31px;
}

.declaration-inputs {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
}
</style>
