<template>
    <ModalComponent>
        <div class="declaration-container column-flex">
            <span class="prefix sub-title">Week {{ weekNumber }}</span>
            <span class="prefix">Please input your hours for {{ weekNumberToString(weekNumber, year) }} </span>
            <div class="declaration-inputs prefix">
                <HoursForm deletable :model-value="props.declaration" />
                <div class="divider" />
                <div class="table-raw-container">
                    <span class="prefix align-center">Total</span>
                    <div class="prefix">
                        <span :class="{ 'error-validation': sumProjectHours > 35 }">{{ sumProjectHours }}</span>
                        <span> / 35</span>
                    </div>
                </div>
                <div class="table-raw-gap" />
                <div class="table-raw-container-2">
                    <span class="prefix">Commentary (optional)</span>
                    <span> {{ props.comment }} </span>
                </div>
                <span>You will not be able to update it latter</span>
                <div class="table-raw-gap" />
                <div class="footer-buttons">
                    <fluent-button disabled> Save draft</fluent-button>
                    <BaseButton accent :disabled="sumProjectHours != 35 || loading" @click="validateDeclaration">
                        <template #default> <span> Validate</span> </template>
                        <template v-if="loading" #start>
                            <fluent-progress-ring style="width: 14px; height: 14px; stroke: lightblue" />
                        </template>
                    </BaseButton>
                </div>
            </div>
        </div>
    </ModalComponent>
</template>

<script setup lang="ts">
import ModalComponent from "@/components/ModalComponent.vue";
import type { DailyDeclaration } from "@/typing/index";
import { weekNumberToString } from "@/utilities/main";
import { computed } from "vue";
const props = defineProps<{
    declaration: DailyDeclaration;
    comment: string;
    userId: number;
    weekNumber: number;
    year: number;
}>();

const sumProjectHours = computed<number>(() => {
    let total = 0;
    total += props.declaration[0].reduce<number>((sum, declaration) => {
        return sum + declaration.hours;
    }, 0);
    total += props.declaration[1].reduce<number>((sum, declaration) => {
        return sum + declaration.hours;
    }, 0);
    total += props.declaration[2].reduce<number>((sum, declaration) => {
        return sum + declaration.hours;
    }, 0);
    total += props.declaration[3].reduce<number>((sum, declaration) => {
        return sum + declaration.hours;
    }, 0);
    total += props.declaration[4].reduce<number>((sum, declaration) => {
        return sum + declaration.hours;
    }, 0);
    return total;
});
</script>

<style scoped>
.flex-space-between {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.clickable-icon {
    cursor: pointer;
}

.declaration-container {
    border: 1px solid #d1d1d1;
    border-radius: 4px;
    background-color: white;
    padding: 30px 44px 30px 30px;

    color: #242424;
    box-shadow: 0 2px 4px #00000024, 0 0 2px #0000001f;
}

.white-button {
    background-color: white;
    color: #242424;
    border: 1px solid #d1d1d1;
    padding: 5px 12px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    cursor: pointer;
    border-radius: 4px;
    font-weight: 500;
    min-width: 60px;
}

.table-raw-container {
    display: grid;
    grid-template-columns: 1fr 1fr 2fr;
    grid-template-rows: 1fr;
    grid-column-gap: 31px;
}

.table-raw-gap {
    height: 10px;
}

.table-raw-container-2 {
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: 1fr;
    grid-column-gap: 31px;
}

.table-header {
    font-size: 14px;
    font-weight: 400;
}
.declaration-inputs {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
}

.align-center {
    height: min-content;
    align-self: center;
}

.error-validation {
    color: red;
    font-weight: 600;
}

.italic {
    font-size: small;
    font-style: italic;
    font-weight: 400;
}
fluent-select {
    min-width: 100px;
}

.table-vertical {
    display: grid;
    grid-template-columns: 2fr repeat(5, 1fr);
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    width: 100%;
}

.table-column {
    display: flex;
    flex-direction: column;
    border-right: 1px #e0e0e0 solid;
    cursor: pointer;
}

.table-legend {
    display: flex;
    flex-direction: column;
    border-right: 1px #e0e0e0 solid;
}

.table-column:hover {
    background-color: #f5f5f5;
}

.table-cell {
    padding: 0 8px;
    min-height: 44px;
    display: flex;
    align-items: center;
    gap: 4px;
}
</style>
