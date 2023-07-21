<template>
    <button
        class="button"
        :disabled="props.disabled"
        :class="{ 'white-button': !props.accent, 'blue-button': props.accent, disabled: props.disabled }"
    >
        <div class="button-inside">
            <slot name="start">
                <fluent-progress-ring v-if="props.loading" style="width: 14px; height: 14px; stroke: lightblue" />
            </slot>
            <slot name="default"></slot>
        </div>
    </button>
</template>

<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        disabled?: boolean;
        accent?: boolean;
        loading?: boolean;
    }>(),
    {
        accent: false,
        disabled: false,
        loading: false,
    }
);
</script>

<style scoped>
.button-inside {
    text-align: center;
    align-items: center;
    text-decoration: none;
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 6px;
    font-weight: 500;
    flex-wrap: nowrap;
}

.button {
    padding: 5px 12px;
    border-radius: var(--card-border-radius);
    cursor: pointer;
    min-height: 32px;
}
.white-button {
    background-color: white;
    color: #242424;
    border: 1px solid #d1d1d1;
}

.white-button:hover:not(.disabled) {
    background-color: #f5f5f5;
}

.blue-button {
    background-color: #036ac4;
    color: #fff;
    border: 1px solid #d1d1d1;
}

.blue-button:hover:not(.disabled) {
    background-color: #0473ce;
}

.disabled {
    opacity: 0.3;
    pointer-events: none;
}
/* .disabled:hover {
    cursor: not-allowed;
} */
</style>
