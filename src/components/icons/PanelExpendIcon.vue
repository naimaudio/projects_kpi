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
                d="M12.1925 11.2512C12.4696 11.559 12.9438 11.584 13.2517 11.307L15.7517 9.05749C15.9098 8.91529 16 8.71271 16 8.50014C16 8.28758 15.9098 8.085 15.7517 7.9428L13.2517 5.69331C12.9438 5.41628 12.4696 5.44123 12.1925 5.74904C11.9154 6.05686 11.9404 6.53096 12.2483 6.80799L13.2955 7.75031L9.75 7.75031C9.33579 7.75031 9 8.08602 9 8.50013C9 8.91425 9.33579 9.24996 9.75 9.24996H13.2955L12.2483 10.1923C11.9404 10.4693 11.9154 10.9434 12.1925 11.2512ZM0 3.25C0 1.73122 1.23122 0.5 2.75 0.5H17.25C18.7688 0.5 20 1.73122 20 3.25V13.75C20 15.2688 18.7688 16.5 17.25 16.5H2.75C1.23122 16.5 0 15.2688 0 13.75V3.25ZM2.75 2C2.05964 2 1.5 2.55964 1.5 3.25V13.75C1.5 14.4404 2.05964 15 2.75 15H6.00427V2H2.75ZM7.50427 2V15H17.25C17.9404 15 18.5 14.4404 18.5 13.75V3.25C18.5 2.55964 17.9404 2 17.25 2H7.50427Z"
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
