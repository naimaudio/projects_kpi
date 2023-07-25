<template>
    <button
        :disabled="!clickable"
        class="button-style-reset"
        :class="{ clickable: props.clickable, 'svg-container': !big, 'big-svg-container': big }"
    >
        <svg
            class="center"
            :width="big ? 40 : 18"
            :height="big ? 40 : 18"
            fill="none"
            viewBox="0 0 20 17"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12.8075 5.74902C12.5304 5.44121 12.0562 5.41625 11.7483 5.69328L9.24828 7.94276C9.09024 8.08496 9 8.28753 9 8.5001C9 8.71266 9.09024 8.91524 9.24827 9.05744L11.7483 11.3069C12.0562 11.584 12.5304 11.559 12.8075 11.2512C13.0846 10.9434 13.0596 10.4693 12.7517 10.1922L11.7045 9.24994H15.25C15.6642 9.24994 16 8.91423 16 8.50011C16 8.08599 15.6642 7.75028 15.25 7.75028H11.7045L12.7517 6.80797C13.0596 6.53094 13.0846 6.05683 12.8075 5.74902ZM1.90735e-06 13.7506C1.90735e-06 15.2691 1.23122 16.5 2.75 16.5L17.25 16.5C18.7688 16.5 20 15.2691 20 13.7506V3.24937C20 1.73093 18.7688 0.5 17.25 0.5H2.75C1.23122 0.5 0 1.73094 0 3.24937L1.90735e-06 13.7506ZM2.75 15.0003C2.05964 15.0003 1.5 14.4408 1.5 13.7506L1.5 3.24937C1.5 2.55917 2.05964 1.99966 2.75 1.99966L6.00415 1.99966L6.00415 15.0003H2.75ZM7.50415 15.0003L7.50415 1.99966L17.25 1.99965C17.9404 1.99965 18.5 2.55917 18.5 3.24937L18.5 13.7506C18.5 14.4408 17.9404 15.0003 17.25 15.0003L7.50415 15.0003Z"
                fill="#212121"
            ></path>
        </svg>
    </button>
</template>

<script lang="ts">
interface Props {
    clickable?: boolean;
    big?: boolean;
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<Props>(), {
    clickable: false,
    big: false,
});
</script>

<style scoped>
.clickable:hover {
    background-color: #e6e6e6;
    cursor: pointer;
}
.center {
    margin: 3px;
}
</style>
