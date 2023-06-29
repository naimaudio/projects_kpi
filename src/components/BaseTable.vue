<template>
    <div>
        <div class="table-headers">
            <div v-if="selectable"></div>
            <div v-for="header in props.headers" :key="header.id" class="table-cell header-cell">
                <span>{{ header.name }}</span>
            </div>
        </div>
        <div v-for="(cell, index) in displayedItems" :key="cell.id" class="table-raw">
            <div v-for="header in props.headers" :key="header.id" class="table-cell">
                <span v-if="header.id == 'selected' && 'selected' in cell && typeof cell.selected === 'boolean'">
                    <fluent-checkbox
                        :checked="cell['selected']"
                        @change="(event: ChangeEvent) => changeSelect(index, event)"
                    ></fluent-checkbox>
                </span>
                <span
                    v-else-if="
                        header.id == 'favorite' && cell.favorite !== undefined && typeof cell.favorite === 'boolean'
                    "
                >
                    <StarOutlineIcon
                        clickable
                        :checked="cell.favorite"
                        @click="
                            emitGlobal<'favorite'>(
                                'change',
                                index + (currentPage - 1) * itemsPerPageCount,
                                'favorite',
                                !cell.favorite
                            )
                        "
                    />
                </span>
                <span v-else>
                    {{ cell[header.id as keyof T] }}
                </span>
            </div>
        </div>
        <div class="footer-pagination">
            <PaginationTable
                :current-page="currentPage"
                :page-count="pageCount"
                :items-count="items.length"
                :items-per-page-count="itemsPerPageCount"
                @page-change="(pageNumber) => (currentPage = pageNumber)"
            />
        </div>
    </div>
</template>

<script setup lang="ts" generic="T extends {id: number, favorite?: boolean, selected ?: boolean}">
import StarOutlineIcon from "@/components/icons/StarOutlineIcon.vue";
import type { ChangeEvent, Header } from "@/typing";
import PaginationTable from "@/components/PaginationTable.vue";
import { computed, ref } from "vue";

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
    return Math.floor((props.items.length - 1) / itemsPerPageCount) + 1;
});

const displayedItems = computed<T[]>(() => {
    return props.items.slice((currentPage.value - 1) * itemsPerPageCount, currentPage.value * itemsPerPageCount);
});

function emitGlobal<K extends keyof T>(event: "change", index: number, field: K, value: T[K]) {
    return emit(event, index, field, value);
}

const changeSelect = (index: number, event: ChangeEvent) => {
    console.log(index + (currentPage.value - 1) * itemsPerPageCount, event.target.currentChecked);
    emitGlobal("change", index + (currentPage.value - 1) * itemsPerPageCount, "selected", event.target.currentChecked);
};
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

.footer-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}
</style>
