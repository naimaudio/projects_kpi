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
            <div style="background-color: white" class="header-cell-bottomless table-cell">
                <span style="margin: auto; transform: rotate(-30deg)">Capitalizable</span>
            </div>
            <div style="position: sticky; top: 0px; left: -1px; background-color: white" class="header-cell table-cell">
                <span> Project Code</span>
            </div>
            <div style="background-color: white" class="header-cell table-cell">
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
            <div style="background-color: white" class="table-cell-select">
                <fluent-select
                    ref="capitalizables"
                    :value="rowHeader.capitalizable === undefined ? 'N/A' : rowHeader.capitalizable ? 'Yes' : 'No'"
                    style="
                        min-width: 30px !important;
                        width: 100%;
                        height: 100%;
                        border-radius: 0px;
                        background-color: var(--border-color);
                    "
                    @change="
                        (event: Event) => {
                            (event.target as HTMLInputElement).value
                        }
                    "
                >
                    <fluent-option v-for="label in Object.keys(capitalizableOptionToValue)" :key="label">
                        {{ label }}
                    </fluent-option>
                    <span slot="selected-value">{{
                        rowHeader.capitalizable === undefined ? "N/A" : rowHeader.capitalizable ? "Yes" : "No"
                    }}</span>
                </fluent-select>
            </div>
            <div style="position: sticky; left: -1px; background-color: white" class="table-cell">
                <span style="margin-left: 15px; margin-top: auto; margin-bottom: auto">
                    {{ rowHeader.code }}
                </span>
            </div>
            <div style="background-color: white" class="table-cell">
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
                        'modified-cell': modifiedCells[i][j],
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
        <div
            class="table-raw"
            :style="{
                'grid-template-columns': cssGridTemplateColumns,
            }"
            style="height: 75px"
        >
            <span style="position: sticky; left: -1px; background-color: white" class="total-table-cell">Total</span>
            <span class="total-table-cell"></span>
            <span class="total-table-cell"></span>
            <span class="total-table-cell"></span>
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
import SnowIcon from "@/components/icons/SnowIcon.vue";
import ArchiveIcon from "@/components/icons/ArchiveIcon.vue";
import type { ProjectMatrixHeader } from "@/typing/project";

const firstColumnWidth: string = "200px";
const columnWidths: string = "90px";

const capitalizableOptionToValue: Record<string, boolean | undefined> = {
    "N/A": undefined,
    Yes: true,
    No: false,
} as const;

const props = withDefaults(
    defineProps<{
        columnHeaders: MatrixHeaderExtended[];
        rowHeaders: ProjectMatrixHeader[];
        items: InputItem[];
        modifiedItems?: InputItem[];
        modifiedRawItems?: { project_id: number; type: "capitalizable"; value: boolean | undefined }[];
        disabled: boolean;
    }>(),
    { modifiedItems: () => [], modifiedRawItems: () => [] }
);
const emit = defineEmits<{
    (e: "change", rowId: number, columnId: number, index: number, value: number): void;
    (e: "change-row", rowId: number, index: number, capitalizable: boolean | undefined): void;
    (e: "remove", index: number): void;
}>();

const focused = ref<number>(0);
watch(focused, (cellFocused) => {
    if (cellFocused !== undefined && document.activeElement !== inputs.value[cellFocused]) {
        inputs.value[cellFocused].focus();
    }
});

watch(props.modifiedRawItems, (mri) => {
    mri.forEach((mr) => console.log(mr));
});

const cssGridTemplateColumns = computed<string>(() => {
    return props.columnHeaders.reduce((str, header) => {
        return `${str} ${columnWidths}`;
    }, `${columnWidths} ${columnWidths} ${columnWidths} ${firstColumnWidth}`);
});
const inputs = ref<HTMLElement[]>([]);
const capitalizables = ref<HTMLElement[]>([]);

// watch(capitalizables, () => {
//     const item = capitalizables.value[0].querySelector(".control") as HTMLElement | null;
//     console.log("dododo");
//     if (item !== null) {
//         item.style.background = "blue";
//     } else {
//         console.log("nanana");
//     }
// });

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
    const item = capitalizables.value[0].shadowRoot?.querySelector(".control") as HTMLElement | null;
    if (item !== null) {
        item.style.background = "blue";
    } else {
        console.log("nanana");
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

const modifiedRowIndexGetter = computed<Record<string, number>>(() => {
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
</script>

<style scoped>
.table {
    display: grid;
    width: fit-content;
}

fluent-select::part(control) {
    border-radius: 0;
    /* background: var(--modified-cell-color); */
    border: 1px var(--border-color) solid;
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
