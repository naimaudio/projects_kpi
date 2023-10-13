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
                'grid-template-columns': cssGridTemplateColumns,
            }"
            style="position: sticky; top: 0px; padding-top: 10px; background-color: white; z-index: 10"
        >
            <div style="position: sticky; top: 0px; left: -1px; background-color: white" class="header-cell table-cell">
                <span> Project Code</span>
            </div>
            <div style="position: sticky; top: 0px; background-color: white" class="header-cell table-cell">
                <span :style="{ width: firstColumnWidth, display: 'inline-block' }">Project Name</span>
            </div>
            <div v-for="header in props.columnHeaders" :key="header.id" class="header-cell table-cell">
                <span style="margin-left: 5px; margin-right: 5px; overflow: hidden; text-overflow: ellipsis">{{
                    header.name
                }}</span>
            </div>
        </div>
        <div
            v-for="(rowHeader, i) in props.rowHeaders"
            :key="rowHeader.id"
            class="table-raw"
            :style="{
                'grid-template-columns': cssGridTemplateColumns,
            }"
        >
            <div style="position: sticky; left: -1px; padding-left: 10px; background-color: white" class="table-cell">
                {{ rowHeader.code }}
            </div>
            <div style="position: sticky; left: -1px; padding-left: 10px; background-color: white" class="table-cell">
                {{ rowHeader.name }}
            </div>
            <div v-for="(header, j) in props.columnHeaders" :key="header.id" class="table-cell">
                <input
                    ref="inputs"
                    :value="cells[i][j] || undefined"
                    type="number"
                    class="input-cell"
                    min="0"
                    style="background-color: #f6f6f6; padding-left: 8px"
                    :style="{ 'background-color': modifiedCells[i][j] ? '#f6f6f6' : 'white' }"
                    @change="
                        (e:Event) => {
                            if (Number((e.target as HTMLInputElement).value) === initialCells[i][j]) {
                                emit('remove', modifiedItemsIndexGetter[`${rowHeader.id}_${header.id}`]);
                            } else {
                                emit(
                                    'change',
                                    rowHeader.id,
                                    header.id,
                                    modifiedItemsIndexGetter[`${rowHeader.id}_${header.id}`],
                                    Number((e.target as HTMLInputElement).value)
                                );
                            }
                        }
                    "
                    @keydown.up="(e: KeyboardEvent) => {e.preventDefault()}"
                    @keydown.right="(e: KeyboardEvent) => {e.preventDefault()}"
                    @keydown.down="(e: KeyboardEvent) => {e.preventDefault()}"
                    @keydown.left="(e: KeyboardEvent) => {e.preventDefault()}"
                    @keydown.enter="handleFocus('down')"
                    @click="
                        () => {
                            focused = i * props.columnHeaders.length + j;
                        }
                    "
                />
            </div>
        </div>
        <div
            class="table-raw"
            :style="{
                'grid-template-columns': cssGridTemplateColumns,
            }"
            style="height: 75px"
        >
            <span style="position: sticky; left: -1px; background-color: white" class="total-table-cell">Total</span>
            <span style="position: sticky; left: -1px; background-color: white" class="total-table-cell"></span>
            <div v-for="(header, j) in props.columnHeaders" :key="header.id" class="total-table-cell">
                <span>{{ cells.reduce((cel, sum) => Number(sum[j]) + cel, 0) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { InputItem, MatrixHeaderExtended } from "@/typing";
import { computed, ref, watch } from "vue";
import { cloneDeep } from "lodash";

const firstColumnWidth: string = "200px";
const columnWidths: string = "90px";

const props = withDefaults(
    defineProps<{
        columnHeaders: MatrixHeaderExtended[];
        rowHeaders: MatrixHeaderExtended[];
        items: InputItem[];
        modifiedItems?: InputItem[];
    }>(),
    { modifiedItems: () => [] }
);
const emit = defineEmits<{
    (e: "change", rowId: number, columnId: number, index: number, value: number): void;
    (e: "remove", index: number): void;
}>();

const focused = ref<number>(0);
watch(focused, (cellFocused) => {
    if (cellFocused !== undefined && document.activeElement !== inputs.value[cellFocused]) {
        inputs.value[cellFocused].focus();
    }
});
const cssGridTemplateColumns = computed<string>(() => {
    return props.columnHeaders.reduce((str, header) => {
        return `${str} ${columnWidths}`;
    }, `${columnWidths} ${firstColumnWidth}`);
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
const columnIndexGetter = computed<Record<number, number>>(() => {
    const rec: Record<number, number> = {};
    props.columnHeaders.forEach((col, i) => {
        rec[col.id] = i;
    });
    return rec;
});
const modifiedItemsIndexGetter = computed<Record<string, number>>(() => {
    const rec: Record<string, number> = {};
    props.modifiedItems.forEach((item, i) => {
        rec[`${item.row_id}_${item.column_id}`] = i;
    });
    return rec;
});

const rowIndexGetter = computed<Record<number, number>>(() => {
    const rec: Record<number, number> = {};
    props.rowHeaders.forEach((col, i) => {
        rec[col.id] = i;
    });
    return rec;
});

const cells = computed<number[][]>(() => {
    const a = cloneDeep(initialCells.value);
    props.modifiedItems.forEach((val) => {
        a[rowIndexGetter.value[val.row_id]][columnIndexGetter.value[val.column_id]] = val.value;
    });
    return a;
});

const modifiedCells = computed<boolean[][]>(() => {
    const a = Array(props.rowHeaders.length)
        .fill(false)
        .map(() => {
            return Array(props.columnHeaders.length).fill(false);
        });
    props.modifiedItems.forEach((val) => {
        a[rowIndexGetter.value[val.row_id]][columnIndexGetter.value[val.column_id]] = true;
    });
    return a;
});

const initialCells = computed<number[][]>(() => {
    const a = Array(props.rowHeaders.length)
        .fill(0)
        .map(() => {
            return Array(props.columnHeaders.length).fill(0);
        });
    props.items.forEach((val) => {
        a[rowIndexGetter.value[val.row_id]][columnIndexGetter.value[val.column_id]] =
            val.value + (a[rowIndexGetter.value[val.row_id]][columnIndexGetter.value[val.column_id]] | 0);
    });
    return a;
});
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
    text-align: center;
    height: 66px !important;
    overflow: hidden;
    background-color: white;
}

.header-cell:hover {
    min-width: fit-content;
    overflow: visible;
    z-index: 1;
}
.table-cell {
    padding: 0px 0px;
    height: 44px;
    margin-top: auto;
    margin-bottom: auto;
    display: flex;
    border-right: 1px #e0e0e0 solid;
    border-bottom: 1px #e0e0e0 solid;
}

.total-table-cell {
    padding: 8px 8px;
    height: 50px;
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
