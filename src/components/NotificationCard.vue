<template>
    <div class="notification-container">
        <ErrorIcon v-if="props.type === 'FAILURE'" />
        <CheckmarkIcon v-if="props.type === 'SUCCESS'" />
        <DismissIcon class="close" @click="emits('close')" />
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import DismissIcon from "@/components/icons/DismissIcon.vue";
import ErrorIcon from "@/components/icons/ErrorIcon.vue";
import CheckmarkIcon from "./icons/CheckmarkIcon.vue";

const props = withDefaults(
    defineProps<{
        /**
         * Define the icon at the start of the box
         */
        type: "SUCCESS" | "FAILURE";
        /**
         * Display time in second of the notification
         */
        lifetime?: number;
    }>(),
    {
        lifetime: 0,
    }
);

const emits = defineEmits<{ (event: "close"): void }>();

if (props.lifetime > 0) {
    setTimeout(() => emits("close"), props.lifetime * 1000);
}
</script>

<style scoped>
.notification-container {
    z-index: 100;
    display: flex;
    background-color: #f6f6f6;
    padding: 24px;
    align-items: center;
    gap: var(--gap-inline);
    border-radius: var(--card-border-radius);
    width: fit-content;
    position: absolute;
    right: 25px;
    top: 90px;
    box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.1);
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
