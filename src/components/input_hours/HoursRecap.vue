<template>
    <div class="declaration-inputs">
        <div class="table-raw-container table-header">
            <div></div>
            <div></div>
            <span>Hours</span>
            <span>Domain</span>
        </div>
        <div v-for="declaration in filteredDeclarations" :key="declaration.name" class="table-raw-container">
            <span class="align-center">{{ declaration.projectCode }}</span>
            <span class="align-center">{{ declaration.name }}</span>
            <div style="width: 100px">
                <span>{{ declaration.hours }}</span>
            </div>
            <span>{{ declaration.domain }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { DeclarationInput } from "@/typing";
import { computed } from "vue";

const props = defineProps<{
    modelValue: DeclarationInput[];
}>();

const filteredDeclarations = computed<DeclarationInput[]>(() => props.modelValue.filter((item) => item.hours != 0));
</script>

<style scoped>
.table-raw-container {
    display: grid;
    grid-template-columns: 1fr 2fr 2fr 1fr;
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

.prefix {
    padding-left: 12px;
}

.align-center {
    height: min-content;
    align-self: center;
}

.italic {
    font-size: small;
    font-style: italic;
    font-weight: 400;
}
</style>
