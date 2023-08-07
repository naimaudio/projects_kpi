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
                    return `${str} 150px`;
                }, '250px '),
            }"
            style="position: sticky; top: 0px; padding-top: 10px; background-color: white; z-index: 100"
        >
            <div
                style="border-right: 1px #e0e0e0 solid; position: sticky; top: 0px; left: -1px; background-color: white"
            ></div>
            <div v-for="header in props.columnHeaders" :key="header.id" class="table-cell header-cell">
                <span style="margin-left: 8px">{{ header.name }}</span>
            </div>
        </div>
        <div
            v-for="(rowHeader, i) in props.rowHeaders"
            :key="rowHeader.id"
            class="table-raw"
            :style="{
                'grid-template-columns': props.columnHeaders.reduce((str, header) => {
                    return `${str} 150px`;
                }, '250px'),
            }"
        >
            <div
                style="
                    position: sticky;
                    left: -1px;
                    padding-left: 10px;
                    background-color: white;
                    border-right: 1px #e0e0e0 solid;
                "
            >
                {{ rowHeader.name }}
            </div>
            <div v-for="(header, j) in props.columnHeaders" :key="header.id" class="table-cell">
                <input
                    ref="inputs"
                    type="number"
                    :value="cells.length === props.rowHeaders.length ? (cells[i][j] === 0 ? null : cells[i][j]) : null"
                    class="input-cell"
                    min="0"
                    style="background-color: #f6f6f6; padding-left: 8px"
                    :style="{ 'background-color': initialCells[i][j] !== cells[i][j] ? '#f6f6f6' : 'white' }"
                    @change="(e) => (cells[i][j] = Number(e.target.value))"
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
        <div
            class="table-raw"
            :style="{
                'grid-template-columns': props.columnHeaders.reduce((str, header) => {
                    return `${str} 150px`;
                }, '250px'),
            }"
            style="height: 75px"
        >
            <span
                style="
                    position: sticky;
                    left: -1px;
                    padding-left: 10px;
                    background-color: white;
                    border-right: 1px #e0e0e0 solid;
                "
                >Total</span
            >
            <div v-for="(header, j) in props.columnHeaders" :key="header.id" class="table-cell">
                <span>{{ cells.reduce((cel, sum) => Number(sum[j]) + cel, 0) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" generic="T extends {id: number, favorite?: boolean, selected ?: boolean, code ?: string}">
import type { MatrixHeader, MonthlyHours } from "@/typing";
import { computed, ref, watch } from "vue";
import { cloneDeep } from "lodash";

const props = withDefaults(
    defineProps<{
        columnHeaders: MatrixHeader[];
        rowHeaders: MatrixHeader[];
        items: MonthlyHours[];
        selectable?: boolean;
        clickableRow?: boolean;
    }>(),
    {
        selectable: false,
        clickableRow: false,
    }
);
const emit = defineEmits<{
    (e: "change", index: number, field: keyof T, value: T[keyof T]): void;
    (e: "rawClick", rowId: number): void;
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
const columnIndexgetter = computed<Record<number, number>>(() => {
    const rec: Record<number, number> = {};
    props.columnHeaders.forEach((col, i) => {
        rec[col.id] = i;
    });
    return rec;
});
const rowIndexgetter = computed<Record<number, number>>(() => {
    const rec: Record<number, number> = {};
    props.rowHeaders.forEach((col, i) => {
        rec[col.id] = i;
    });
    return rec;
});
watch([props.columnHeaders, props.rowHeaders], ([ch, rh]) => {
    cells.value = Array(rh.length)
        .fill(0)
        .map(() => {
            return Array(ch.length).fill(0);
        });
});

watch(
    props.items,
    (newItems) => {
        newItems.forEach((item) => {
            item.hours.forEach((hour) => {
                cells.value[rowIndexgetter.value[hour.project_id]][columnIndexgetter.value[item.user_id]] = hour.hours;
            });
        });
        initialCells.value = cloneDeep(cells.value);
    },
    { deep: true }
);
const cells = ref<number[][]>([]);
const initialCells = ref<number[][]>([]);
function emitGlobal<K extends keyof T>(event: "change", id: number, field: K, value: T[K]) {
    return emit(event, id, field, value);
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
    border-bottom: 1px #e0e0e0 solid;
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
}

.input-cell {
    width: 100%;
    line-height: 30px;
    border: none;
}
</style>
