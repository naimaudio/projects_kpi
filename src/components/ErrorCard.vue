<template>
    <div class="error-container">
        <ErrorIcon />
        <slot></slot>
        <DismissIcon class="close" @click="emits('close')" />
    </div>
</template>

<script setup lang="ts">
import DismissIcon from "@/components/icons/DismissIcon.vue";

import ErrorIcon from "@/components/icons/ErrorIcon.vue";
const emits = defineEmits<{ (event: "close"): void }>();
</script>

<style scoped>
.error-container {
    display: flex;
    background-color: #f6f6f6;
    padding: 24px;
    align-items: center;
    gap: var(--gap-inline);
    border-radius: var(--card-border-radius);
    width: fit-content;
    position: relative;
}
.close {
    position: absolute;
    right: 4px;
    top: 4px;
}

.close:hover {
    cursor: pointer;
}
</style>
