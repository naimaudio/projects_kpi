<template>
    <div>
        <fluent-search v-model="search" style="width: 100%"></fluent-search>
        <div class="table-headers" :style="{ 'grid-template-columns': `repeat(${headers.length}, 1fr)` }">
            <div v-if="selectable"></div>
            <div
                v-for="(header, index) in props.headers"
                :key="header.id"
                class="table-cell header-cell"
                @click="() => setSortedColumn(index)"
            >
                <span>{{ header.name }}</span>
                <ArrowUpIcon v-if="sortedColumn?.index === index && sortedColumn.value === 'ASC'" />
                <ArrowDownIcon v-else-if="sortedColumn?.index === index && sortedColumn.value === 'DESC'" />
            </div>
        </div>
        <div
            v-for="cell in displayedItems"
            :key="cell.id"
            class="table-raw"
            :style="{ 'grid-template-columns': `repeat(${headers.length}, 1fr)` }"
        >
            <div v-for="header in props.headers" :key="header.id" class="table-cell">
                <span
                    v-if="header.id == 'selected' && 'selected' in cell && typeof cell.selected === 'boolean'"
                    class="cell-text"
                >
                    <fluent-checkbox
                        :checked="cell['selected']"
                        @change="(event: ChangeEvent) => changeSelect(cell.id, event)"
                    ></fluent-checkbox>
                </span>
                <span
                    v-else-if="
                        header.id == 'favorite' && cell.favorite !== undefined && typeof cell.favorite === 'boolean'
                    "
                    class="cell-text"
                >
                    <StarOutlineIcon
                        clickable
                        :checked="cell.favorite"
                        @click="emitGlobal<'favorite'>('change', cell.id, 'favorite', !cell.favorite)"
                    />
                </span>
                <span v-else class="cell-text">
                    {{ cell[header.id as keyof T] }}
                </span>
            </div>
        </div>
        <div class="footer-pagination">
            <PaginationTable
                :current-page="currentPage"
                :page-count="pageCount"
                :items-count="sortedItems.length"
                :items-per-page-count="itemsPerPageCount"
                @page-change="(pageNumber) => (currentPage = pageNumber)"
            />
        </div>
    </div>
</template>

<script setup lang="ts" generic="T extends {id: number, favorite?: boolean, selected ?: boolean}">
import StarOutlineIcon from "@/components/icons/StarOutlineIcon.vue";
import type { ChangeEvent, Header } from "@/typing";
import ArrowUpIcon from "@/components/icons/ArrowUpIcon.vue";
import ArrowDownIcon from "@/components/icons/ArrowDownIcon.vue";
import PaginationTable from "@/components/PaginationTable.vue";
import { computed, ref } from "vue";
import { cloneDeep } from "lodash";
interface SortedColumn {
    index: number;
    value: "ASC" | "DESC";
}

const sortedColumn = ref<SortedColumn | undefined>();

const search = ref<string>("");
function setSortedColumn(index: number) {
    if (sortedColumn.value === undefined || sortedColumn.value.index !== index) {
        sortedColumn.value = {
            index: index,
            value: "ASC",
        };
    } else if (sortedColumn.value.value === "ASC") {
        sortedColumn.value.value = "DESC";
    } else {
        sortedColumn.value = undefined;
    }
}
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

const currentPage = ref(1);

const itemsPerPageCount = 10;

const pageCount = computed(() => {
    return Math.floor((sortedItems.value.length - 1) / itemsPerPageCount) + 1;
});

const sortedItems = computed(() => {
    let sortedItems = cloneDeep(props.items);
    if (sortedColumn.value !== undefined) {
        const key = props.headers[sortedColumn.value.index].id;
        if (sortedColumn.value.value === "ASC") {
            if (typeof sortedItems[0][key as keyof T] === "string") {
                sortedItems.sort((itemA, itemB) => {
                    const a = itemA[key as keyof T] as string;
                    const b = itemB[key as keyof T] as string;
                    return a.localeCompare(b);
                });
            } else if (typeof sortedItems[0][key as keyof T] === "number") {
                sortedItems.sort((itemA, itemB) => {
                    const a = itemA[key as keyof T] as number;
                    const b = itemB[key as keyof T] as number;
                    return a - b;
                });
            } else if (typeof sortedItems[0][key as keyof T] === "boolean") {
                sortedItems.sort((itemA, itemB) => {
                    const a = itemA[key as keyof T] as boolean;
                    const b = itemB[key as keyof T] as boolean;
                    return (a && b) || (!a && !b) ? 0 : a && !b ? -1 : 1;
                });
            }
        } else if (sortedColumn.value.value === "DESC") {
            if (typeof sortedItems[0][key as keyof T] === "string") {
                sortedItems.sort((itemA, itemB) => {
                    const a = itemA[key as keyof T] as string;
                    const b = itemB[key as keyof T] as string;
                    return b.localeCompare(a);
                });
            } else if (typeof sortedItems[0][key as keyof T] === "number") {
                sortedItems.sort((itemA, itemB) => {
                    const a = itemA[key as keyof T] as number;
                    const b = itemB[key as keyof T] as number;
                    return b - a;
                });
            } else if (typeof sortedItems[0][key as keyof T] === "boolean") {
                sortedItems.sort((itemA, itemB) => {
                    const a = itemA[key as keyof T] as boolean;
                    const b = itemB[key as keyof T] as boolean;
                    return (a && b) || (!a && !b) ? 0 : a && !b ? 1 : -1;
                });
            }
        }
    }
    if (search.value !== undefined && search.value !== "" && props.items.length !== 0) {
        sortedItems = sortedItems.filter((item) => {
            for (let i = 0; i < props.headers.length; i++) {
                const value = item[props.headers[i].id as keyof T];
                if (typeof value === "string" && value.includes(search.value)) {
                    return true;
                }
                if (typeof value === "number" && String(value).includes(search.value)) {
                    return true;
                }
            }
            return false;
        });
    }
    return sortedItems;
});
const displayedItems = computed<T[]>(() => {
    return sortedItems.value.slice((currentPage.value - 1) * itemsPerPageCount, currentPage.value * itemsPerPageCount);
});

function emitGlobal<K extends keyof T>(event: "change", id: number, field: K, value: T[K]) {
    return emit(event, id, field, value);
}

const changeSelect = (id: number, event: ChangeEvent) => {
    emitGlobal("change", id, "selected", event.target.currentChecked);
};
</script>

<style scoped>
.table-raw,
.table-headers {
    display: grid;
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

.header-cell:hover {
    cursor: pointer;
    user-select: none;
}

.header-cell {
    align-items: center;
    gap: 4px;
}

.table-cell {
    padding: 0px 8px;
    height: 44px;
    margin-top: auto;
    margin-bottom: auto;
    display: flex;
    overflow-y: auto;
}

.footer-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}

.cell-text {
    margin-top: auto;
    margin-bottom: auto;
}
</style>
