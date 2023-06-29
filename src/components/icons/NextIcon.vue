<template>
    <div
        :class="{ clickable: props.clickable && !props.disabled, disabled: props.disabled }"
        class="square-svg-container"
    >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M21 3.75a.75.75 0 0 0-1.5 0v16.5a.75.75 0 0 0 1.5 0V3.75ZM5.77 3.525C4.612 2.695 3 3.523 3 4.947V19.17c0 1.384 1.53 2.22 2.695 1.473l10.47-6.716a1.75 1.75 0 0 0 .074-2.895L5.77 3.525ZM4.5 4.947a.25.25 0 0 1 .396-.203l10.47 7.507a.25.25 0 0 1-.011.413l-10.47 6.717a.25.25 0 0 1-.385-.21V4.946Z"
                :fill="fillColor"
            />
        </svg>
    </div>
</template>

<script lang="ts">
interface Props {
    clickable?: boolean;
    disabled?: boolean;
}
</script>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(defineProps<Props>(), {
    clickable: false,
    disabled: false,
});

const fillColor = computed(() => (props.clickable && !props.disabled ? "#0078d4" : "#a19f9d"));
</script>

<style scoped>
.clickable:hover {
    background-color: #e6e6e6;
    cursor: pointer;
}

.disabled {
    pointer-events: none;
}
</style>
