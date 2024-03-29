<template>
    <div class="pagination-container">
        <div class="inline-pagination">
            <PreviousIcon clickable :disabled="props.currentPage === 1" @click="emit('pageChange', 1)" />
            <CarretLeftSolidIcon
                clickable
                :disabled="props.currentPage === 1"
                @click="emit('pageChange', props.currentPage - 1)"
            />
            <button
                v-for="i in buttonCount"
                :key="i"
                :class="{
                    'selected-button': i + PagesHiddenLeftCount === props.currentPage,
                    'pagination-button': i + PagesHiddenLeftCount !== props.currentPage,
                }"
                class="no-selection"
                @click="
                    () => {
                        if (i + PagesHiddenLeftCount !== props.currentPage) {
                            emit('pageChange', i + PagesHiddenLeftCount);
                        }
                    }
                "
            >
                {{ i + PagesHiddenLeftCount }}
            </button>
            <CarretRightSolidIcon
                clickable
                :disabled="props.currentPage === props.pageCount"
                @click="emit('pageChange', props.currentPage + 1)"
            />
            <NextIcon
                clickable
                :disabled="props.currentPage === props.pageCount"
                @click="emit('pageChange', props.pageCount)"
            />
        </div>
        <span class="pagination-text"
            >{{ (currentPage - 1) * itemsPerPageCount + 1 }} -
            {{ Math.min(currentPage * itemsPerPageCount, itemsCount) }} of
            {{ itemsCount }}
        </span>
    </div>
</template>

<script setup lang="ts">
import NextIcon from "@/components/icons/NextIcon.vue";
import PreviousIcon from "./icons/PreviousIcon.vue";
import CarretLeftSolidIcon from "./icons/CarretLeftSolidIcon.vue";
import CarretRightSolidIcon from "./icons/CarretRightSolidIcon.vue";
import { computed } from "vue";

const props = defineProps<{
    currentPage: number;
    pageCount: number;
    itemsCount: number;
    itemsPerPageCount: number;
}>();

const emit = defineEmits<{
    (event: "pageChange", pageNumber: number): void;
}>();

const PagesHiddenLeftCount = computed<number>(() => {
    return Math.min(Math.max(0, props.currentPage - 3), Math.max(props.pageCount, 5) - 5);
});

const buttonCount = computed<number>(() => {
    return Math.min(5, props.pageCount);
});
</script>

<style scoped>
.inline-pagination {
    display: flex;
    gap: 0;
    flex-direction: row;
}

.pagination-button:hover {
    background-color: #f5f5f5;
}

.pagination-button {
    color: #242424;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    cursor: pointer;
    border-radius: 0px;
    border: none;
    font-weight: 500;
    width: 48px;
    background-color: white;
}

.selected-button {
    color: #0078d4;
    text-decoration: underline;
    text-align: center;
    text-decoration: underline;
    border-radius: 0px;
    border: none;
    width: 48px;
    height: 32px;
    font-weight: 500;
    background-color: white;
}

.pagination-text {
    color: #605e5c;
    size: 14px;
    font-weight: 400;
}

.pagination-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
