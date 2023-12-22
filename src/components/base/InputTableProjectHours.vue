<!-- eslint-disable vue/no-deprecated-slot-attribute -->
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
            <div style="background-color: white" class="header-cell table-cell">
                <span>Current Project Status</span>
            </div>
            <div style="background-color: white" class="header-cell table-cell">
                <span style="transform: rotate(-30deg)">Capitalizable</span>
            </div>
            <div style="position: sticky; top: 0px; left: -1px; background-color: white" class="header-cell table-cell">
                <span> Project Code</span>
            </div>
            <div style="position: sticky; top: 0px; left: 89px; background-color: white" class="header-cell table-cell">
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
            <div style="background-color: white" class="table-cell">
                <SnowIcon v-if="rowHeader.status === 'Frozen'" style="margin: auto" />
                <ArchiveIcon v-else-if="rowHeader.status === 'Closed'" style="margin: auto" />
            </div>
            <div class="table-cell-select">
                <fluent-select
                    :value="projectCells[i]"
                    style="min-width: 30px !important; width: 100%; height: 100%"
                    :disabled="props.disabled"
                    :class="{ modified: whichProjectCellsAreModified[i], 'disabled-select': props.disabled }"
                    @change="
                        (event: Event) => {
                            if ((event.target as HTMLInputElement).value === initialProjectCells[i]) {
                                emit('remove-row', modifiedProjectIndexGetter[rowHeader.id]);
                            } else {
                             emit('change-row', rowHeader.id, modifiedProjectIndexGetter[rowHeader.id], capitalizableOptionToValue[(event.target as HTMLInputElement).value as capitalizableLiteral])
                        }}"
                >
                    <fluent-option v-for="label in Object.keys(capitalizableOptionToValue)" :key="label">
                        {{ label }}
                    </fluent-option>
                    <span slot="selected-value">
                        <div class="icon-with-text">
                            <CheckmarkLineIcon v-if="projectCells[i] == 'Yes'" color="black" :size="16" />
                            <div v-else color="black" style="width: 16px"></div>
                            <span style="color: var(--option-secondary-color)">{{ projectCells[i] }}</span>
                        </div>
                    </span>
                </fluent-select>
            </div>
            <div style="position: sticky; left: -1px; background-color: white" class="table-cell">
                <span style="margin-left: 15px; margin-top: auto; margin-bottom: auto">
                    {{ rowHeader.code }}
                </span>
            </div>
            <div style="position: sticky; left: 89px; background-color: white" class="table-cell">
                <span style="margin-left: 10px; margin-top: auto; margin-bottom: auto">
                    {{ rowHeader.name }}
                </span>
            </div>
            <div v-for="(header, j) in props.columnHeaders" :key="header.id" class="table-cell">
                <input
                    ref="inputs"
                    :value="cells[i][j] || undefined"
                    type="number"
                    class="input-cell"
                    :class="{
                        'modified-cell': whichCellsAreModified[i][j],
                        'disabled-cell': props.disabled,
                    }"
                    min="0"
                    :disabled="props.disabled"
                    style="padding-left: 8px"
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
        <div class="table-raw" style="grid-template-columns: 1fr">
            <span class="table-line-break"></span>
        </div>
        <div
            class="table-raw"
            :style="{
                'grid-template-columns': cssGridTemplateColumns,
            }"
        >
            <span class="total-table-cell"></span>
            <span class="total-table-cell"></span>
            <span style="position: sticky; left: -1px; background-color: white" class="total-table-cell"></span>
            <div style="position: sticky; left: 89px; background-color: white" class="total-table-cell">
                <span style="padding-left: 8px; margin-top: auto; margin-bottom: auto">Total</span>
            </div>
            <div v-for="(header, j) in props.columnHeaders" :key="header.id" class="total-table-cell">
                <span style="padding-left: 8px; margin-top: auto; margin-bottom: auto">{{ totals[j] }}</span>
            </div>
        </div>
        <div
            class="table-raw"
            :style="{
                'grid-template-columns': cssGridTemplateColumns,
            }"
        >
            <span style="position: sticky; left: -1px; background-color: white" class="total-table-cell"></span>
            <div class="total-table-cell">
                <span style="padding-left: 8px; margin-top: auto; margin-bottom: auto">Threshold</span>
            </div>
            <span class="total-table-cell">
                <input
                    type="number"
                    class="input-cell"
                    :value="props.modifiedThreshold"
                    :class="{
                        'modified-cell': props.threshold != props.modifiedThreshold,
                        'disabled-cell': props.disabled,
                    }"
                    min="0"
                    :disabled="props.disabled"
                    style="padding-left: 8px"
                    @change="
                        (e:Event) => {
                                emit(
                                    'change-threshold',
                                    Number((e.target as HTMLInputElement).value)
                                );
                        }
                    "
                />
            </span>
            <div class="total-table-cell" style="position: sticky; left: 89px; background-color: white">
                <span style="padding-left: 8px; margin-top: auto; margin-bottom: auto">Overtime</span>
            </div>
            <div v-for="(header, j) in props.columnHeaders" :key="header.id" class="total-table-cell">
                <span style="padding-left: 8px; margin-top: auto; margin-bottom: auto">{{ overtimes[j] }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { InputItem, MatrixHeaderExtended } from "@/typing";
import { computed, ref, watch } from "vue";
import { cloneDeep } from "lodash";
import SnowIcon from "@/components/icons/SnowIcon.vue";
import ArchiveIcon from "@/components/icons/ArchiveIcon.vue";
import { type ProjectMatrixHeader, capitalizableOptionToValue, type capitalizableLiteral } from "@/typing/project";
import CheckmarkLineIcon from "@/components/icons/CheckmarkLineIcon.vue";

const firstColumnWidth: string = "200px";
const columnWidths: string = "90px";

const props = withDefaults(
    defineProps<{
        columnHeaders: MatrixHeaderExtended[];
        rowHeaders: ProjectMatrixHeader[];
        items: InputItem[];
        modifiedItems?: InputItem[];
        modifiedRowItems?: { project_id: number; capitalizable: boolean | undefined }[];
        disabled: boolean;
        threshold: number;
        modifiedThreshold: number;
    }>(),
    { modifiedItems: () => [], modifiedRowItems: () => [] }
);
const emit = defineEmits<{
    (e: "change", rowId: number, columnId: number, index: number, value: number): void;
    (e: "change-row", rowId: number, index: number, capitalizable: boolean | undefined): void;
    (e: "remove", index: number): void;
    (e: "remove-row", index: number): void;
    (e: "change-threshold", threshold: number): void;
}>();

const focused = ref<number>(0);

/**
 *  WATCHERS
 */

watch(focused, (cellFocused) => {
    if (cellFocused !== undefined && document.activeElement !== inputs.value[cellFocused]) {
        inputs.value[cellFocused].focus();
    }
});

watch(props.modifiedRowItems, (mri) => {
    mri.forEach((mr) => console.log(mr));
});

/**
 *  METHODS
 */
const cssGridTemplateColumns = computed<string>(() => {
    return props.columnHeaders.reduce((str) => {
        return `${str} ${columnWidths}`;
    }, `${columnWidths} ${columnWidths} ${columnWidths} ${firstColumnWidth}`);
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

const rowIndexGetter = computed<Record<number, number>>(() => {
    const rec: Record<number, number> = {};
    props.rowHeaders.forEach((col, i) => {
        rec[col.id] = i;
    });
    return rec;
});

/**
 *  Computed values for hours modification
 */

const modifiedItemsIndexGetter = computed<Record<string, number>>(() => {
    const rec: Record<string, number> = {};
    props.modifiedItems.forEach((item, i) => {
        rec[`${item.row_id}_${item.column_id}`] = i;
    });
    return rec;
});

const initialCells = computed<number[][]>(() => {
    const a = Array(props.rowHeaders.length)
        .fill(0)
        .map(() => {
            return Array(props.columnHeaders.length).fill(0);
        });
    if (a.length !== 0) {
        props.items
            .filter(
                (val) =>
                    rowIndexGetter.value[val.row_id] < a.length && columnIndexGetter.value[val.column_id] < a[0].length
            )
            .forEach((val) => {
                a[rowIndexGetter.value[val.row_id]][columnIndexGetter.value[val.column_id]] += val.value;
            });
    }
    return a;
});

const cells = computed<number[][]>(() => {
    const a = cloneDeep(initialCells.value);
    props.modifiedItems.forEach((val) => {
        a[rowIndexGetter.value[val.row_id]][columnIndexGetter.value[val.column_id]] = val.value;
    });
    return a;
});

// used to color cells
const whichCellsAreModified = computed<boolean[][]>(() => {
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
/**
 * COMPUTED
 */

const totals = computed(() => {
    return Array.from(props.columnHeaders, (_v, j) => {
        return cells.value.reduce((sum, cel) => Number(cel[j]) + sum, 0);
    });
});

const overtimes = computed(() => {
    return Array.from(totals.value, (total) => {
        return Math.max(total - props.modifiedThreshold, 0);
    });
});

/**
 *  Computed values for Project informations modification
 */

const modifiedProjectIndexGetter = computed<Record<number, number>>(() => {
    const rec: Record<string, number> = {};
    props.modifiedRowItems.forEach((item, i) => {
        rec[item.project_id] = i;
    });
    return rec;
});

function capitalizableValueToOption(val: boolean | undefined) {
    return val === undefined ? "N/A" : val ? "Yes" : "No";
}

const initialProjectCells = computed<capitalizableLiteral[]>(() => {
    const a = Array(props.rowHeaders.length).fill("N/A");
    if (a.length !== 0) {
        props.rowHeaders.map((rowHeader) => {
            a[rowIndexGetter.value[rowHeader.id]] = capitalizableValueToOption(rowHeader.capitalizable);
        });
    }
    return a;
});

const projectCells = computed<capitalizableLiteral[]>(() => {
    const a = cloneDeep(initialProjectCells.value);
    props.modifiedRowItems.forEach((val) => {
        a[rowIndexGetter.value[val.project_id]] = capitalizableValueToOption(val.capitalizable);
    });
    return a;
});

// used to color cells
const whichProjectCellsAreModified = computed<boolean[]>(() => {
    const a = Array(props.rowHeaders.length).fill(false);
    props.modifiedRowItems.forEach((val) => {
        a[rowIndexGetter.value[val.project_id]] = true;
    });
    return a;
});
</script>

<style scoped>
.table {
    display: grid;
    width: fit-content;
}

fluent-select::part(control) {
    border-radius: 0px;
}

.modified::part(control) {
    border-radius: 0;
    background: var(--modified-cell-color);
    border: 1px var(--border-color) solid;
}

.disabled-select {
    background: var(--disabled-cell-color);
}

.disabled-cell {
    background-color: var(--disabled-cell-color);
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
.header-cell-bottomless {
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
.table-cell-bottomless {
    padding: 0px 0px;
    margin-top: auto;
    margin-bottom: auto;
    display: flex;
    border-right: 1px #e0e0e0 solid;
}
.table-cell-select {
    padding: 0px 0px;
    height: 45px;
    display: flex;
    border-right: 1px #e0e0e0 solid;
}

.modified-cell {
    background-color: var(--modified-cell-color);
}

.table-line-break {
    border-right: 1px #e0e0e0 solid;
    border-bottom: 1px #e0e0e0 solid;
    height: 15px;
}
.total-table-cell {
    padding: 0px 0px;
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
