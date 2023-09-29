<template>
    <div class="notification-container">
        <div class="with-icon">
            <ErrorIcon v-if="props.type === 'FAILURE'" />
            <CheckmarkIcon v-if="props.type === 'SUCCESS'" />
            <DismissIcon class="close" @click="emits('close')" />
            <span>
                <slot></slot>
            </span>
        </div>
        <div v-if="props.type === 'FAILURE'" class="with-icon">
            <a :href="envVariableWithValidation('VITE_SUPPORT_LINK')" target="_blank">
                Please contact us if the problem persists
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
import DismissIcon from "@/components/icons/DismissIcon.vue";
import ErrorIcon from "@/components/icons/ErrorIcon.vue";
import CheckmarkIcon from "./icons/CheckmarkIcon.vue";
import { envVariableWithValidation } from "@/utilities/main";

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
    flex-direction: column;
    background-color: #f6f6f6;
    border-radius: var(--card-border-radius);
    width: fit-content;
    position: absolute;
    padding: 24px;
    right: 25px;
    top: 90px;
    gap: 3px;
    box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.1);
}

.with-icon {
    display: flex;
    align-items: center;
    gap: var(--gap-inline);
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
