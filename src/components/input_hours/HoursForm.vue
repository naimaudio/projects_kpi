<template>
    <div class="declaration-inputs">
        <div
            class="table-header"
            :class="{ 'table-raw-container-delete': deletable, 'table-raw-container': !deletable }"
        >
            <span v-if="deletable"></span>
            <span>Project Code</span>
            <span>Project Name</span>
            <span>Hours</span>
        </div>
        <br />
        <div
            v-for="(declaration, index) in props.modelValue"
            :key="declaration.name"
            :class="{ 'table-raw-container-delete': deletable, 'table-raw-container': !deletable }"
        >
            <DeleteOutlineIcon
                v-if="deletable && declaration.projectCode !== 'ABS'"
                style="display: inline-block"
                clickable
                @click="emits('remove', declaration.projectId, index)"
            />
            <div v-else-if="declaration.projectCode === 'ABS' && deletable"></div>
            <span>{{ declaration.projectCode }}</span>
            <span>{{ declaration.name }}</span>
            <div style="width: 100%">
                <fluent-number-field
                    :value="String(declaration.hours)"
                    :min="0"
                    :max="35"
                    style="width: 100%"
                    @change="(event: ChangeEvent) => emits('update:modelValue', index, Number(event.target.value))"
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

const emits = defineEmits<{
    (e: "update:modelValue", index: number, value: number): void;
    (e: "remove", projectId: number, index: number): void;
}>();
</script>

<style scoped>
.table-raw-container-delete {
    display: grid;
    grid-template-columns: 20px 1fr 2fr 6fr;
    grid-template-rows: 1fr;
    grid-column-gap: 31px;
}
.table-raw-container {
    display: grid;
    grid-template-columns: 1fr 2fr 6fr;
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

.italic {
    font-size: small;
    font-style: italic;
    font-weight: 400;
}
</style>
