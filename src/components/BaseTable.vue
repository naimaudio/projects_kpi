<template>
    <div>
        <div class="table-headers">
            <div v-if="selectable"></div>
            <div v-for="header in props.headers" :key="header.id" class="table-cell header-cell">
                <span>{{ header.name }}</span>
            </div>
        </div>
        <div v-for="(cell, index) in props.items" :key="cell.id" class="table-raw">
            <div v-for="header in props.headers" :key="header.id" class="table-cell">
                <span v-if="header.id == 'selected' && 'selected' in cell && typeof cell.selected === 'boolean'">
                    <fluent-checkbox
                        @change="(event: ChangeEvent) => emitGlobal('change', index, 'selected', event.target.currentChecked)"
                    ></fluent-checkbox>
                </span>
                <span
                    v-else-if="
                        header.id == 'favorite' && cell.favorite !== undefined && typeof cell.favorite === 'boolean'
                    "
                >
                    <StarOutline
                        clickable
                        :checked="cell.favorite"
                        @click="emitGlobal<'favorite'>('change', index, 'favorite', !cell.favorite)"
                    />
                </span>
                <span v-else>
                    {{ cell[header.id as keyof T] }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" generic="T extends {id: number, favorite?: boolean, selected ?: boolean}">
import StarOutline from "@/components/icons/StarOutline.vue";
import type { ChangeEvent, Header } from "@/typing";
const props = withDefaults(
    defineProps<{
        headers: Header[];
        items: T[];
        selectable?: boolean;
    }>(),
    {
        selectable: false,
    }
);

const emit = defineEmits<{
    (e: "change", index: number, field: keyof T, value: T[keyof T]): void;
}>();

function emitGlobal<K extends keyof T>(event: "change", index: number, field: K, value: T[K]) {
    return emit(event, index, field, value);
}
</script>

<style>
.table-raw,
.table-headers {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    border-bottom: 1px #e0e0e0 solid;
    color: #242424;
}

.table-raw:hover,
.header-cell:hover {
    background-color: #f5f5f5;
}
.table-cell {
    padding: 0 8px;
    min-height: 44px;
    display: flex;
    align-items: center;
}
</style>
