<template>
    <div class="declaration-inputs">
        <div class="table-raw-container table-header">
            <div></div>
            <span>Hours</span>
        </div>
        <div v-for="(declaration, index) in props.modelValue" :key="declaration.name" class="table-raw-container">
            <div class="raw-container">
                <DeleteOutlineIcon v-if="deletable" clickable @click="emit('remove', declaration.projectId, index)" />
                <span class="prefix align-center">{{ declaration.name }}</span>
            </div>
            <div style="width: 100px">
                <fluent-number-field
                    :value="String(declaration.hours)"
                    :min="0"
                    :max="35"
                    @change="(event: ChangeEvent) => emit('update:modelValue', index, Number(event.target.value))"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ChangeEvent, DeclarationInput } from "@/typing";
import DeleteOutlineIcon from "@/components/icons/DeleteOutlineIcon.vue";

const props = withDefaults(
    defineProps<{
        modelValue: DeclarationInput[];
        deletable?: boolean;
    }>(),
    {
        deletable: false,
    }
);

const emit = defineEmits<{
    (e: "update:modelValue", index: number, value: number): void;
    (e: "remove", projectId: number, index: number): void;
}>();
</script>

<style scoped>
.table-raw-container {
    display: grid;
    grid-template-columns: 1fr 1fr 2fr;
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
