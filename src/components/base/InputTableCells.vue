<template>
    <div
        v-if="props.columnHeaders.length !== 0"
        class="table"
        @keydown.right="handleFocus('right')"
        @keydown.left="handleFocus('left')"
        @keydown.down="handleFocus('down')"
        @keydown.up="handleFocus('up')"
    >
        <div
            class="table-raw"
            :style="{
                'grid-template-columns': props.columnHeaders.reduce((str, header) => {
                    return `${str} 100px`;
                }, '100px '),
            }"
            style="position: sticky; top: 0px; padding-top: 10px; background-color: white; z-index: 10"
        >
            <div style="position: sticky; top: 0px; left: -1px; background-color: white" class="table-cell"></div>
            <div v-for="(header, index) in props.columnHeaders" :key="index" class="table-cell header-cell">
                <span style="margin-left: 8px">{{ header }}</span>
            </div>
        </div>
        <div
            v-for="(rowHeader, i) in props.rowHeaders"
            :key="i"
            class="table-raw"
            :style="{
                'grid-template-columns': props.columnHeaders.reduce((str, header) => {
                    return `${str} 100px`;
                }, '100px'),
            }"
        >
            <div style="position: sticky; left: -1px; padding-left: 10px; background-color: white" class="table-cell">
                {{ rowHeader }}
            </div>
            <div v-for="(header, j) in props.columnHeaders" :key="j" class="table-cell">
                <input
                    ref="inputs"
                    :value="cells[i][j]"
                    type="number"
                    class="input-cell"
                    min="0"
                    style="background-color: white; padding-left: 8px"
                    @change="
                        (e) => {
                            emit('change', i, j, Number(e.target?.value));
                        }
                    "
                    @keydown.up="(e: KeyboardEvent) => {e.preventDefault()}"
                    @keydown.right="(e: KeyboardEvent) => {e.preventDefault()}"
                    @keydown.down="(e: KeyboardEvent) => {e.preventDefault()}"
                    @keydown.left="(e: KeyboardEvent) => {e.preventDefault()}"
                    @keydown.enter="handleFocus('down')"
                    @click="
                        () => {
                            focused = i * columnHeaders.length + j;
                        }
                    "
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = withDefaults(
    defineProps<{
        columnHeaders: string[];
        rowHeaders: string[];
        cells: number[][];
    }>(),
    {}
);
const emit = defineEmits<{
    (e: "change", rowInded: number, columnIndex: number, value: number): void;
    (e: "remove", index: number): void;
}>();

const focused = ref<number>(0);
watch(focused, (cellFocused) => {
    if (cellFocused !== undefined && document.activeElement !== inputs.value[cellFocused]) {
        inputs.value[cellFocused].focus();
    }
});

const inputs = ref<HTMLElement[]>([]);
function handleFocus(direction: "left" | "right" | "up" | "down") {
    if (direction === "left") {
        if (focused.value % props.columnHeaders.length !== 0) {
            focused.value = focused.value - 1;
        }
    }
    if (direction === "right") {
        if (focused.value % props.columnHeaders.length !== props.columnHeaders.length - 1) {
            focused.value = focused.value + 1;
        }
    }
    if (direction === "down") {
        if (focused.value + props.columnHeaders.length < props.rowHeaders.length * props.columnHeaders.length) {
            focused.value = focused.value + props.columnHeaders.length;
        }
    }
    if (direction === "up") {
        if (focused.value - props.columnHeaders.length >= 0) {
            focused.value = focused.value - props.columnHeaders.length;
        }
    }
}
</script>

<style scoped>
.table {
    display: grid;
    width: fit-content;
}

.table-raw {
    display: grid;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    color: #242424;
}

.header-cell {
    align-items: center;
    gap: 4px;
}

.table-cell {
    padding: 0px 0px;
    height: 44px;
    margin-top: auto;
    margin-bottom: auto;
    display: flex;
    overflow-y: auto;
    border-right: 1px #e0e0e0 solid;
    border-bottom: 1px #e0e0e0 solid;
}

.input-cell {
    width: 100%;
    line-height: 30px;
    border: none;
}
</style>
