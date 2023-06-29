<template>
    <div
        :class="{ clickable: props.clickable && !props.disabled, disabled: props.disabled }"
        class="square-svg-container"
    >
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M9 17.898c0 1.074 1.265 1.648 2.073.941l6.31-5.522a1.75 1.75 0 0 0 0-2.634l-6.31-5.522C10.265 4.454 9 5.028 9 6.102v11.796Z"
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
