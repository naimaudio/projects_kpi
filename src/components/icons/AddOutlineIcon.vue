<template>
    <div :class="{ clickable: props.clickable, 'svg-container': !big, 'big-svg-container': big }">
        <svg
            class="center"
            :width="big ? 40 : 18"
            :height="big ? 40 : 18"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M11.75 3a.75.75 0 0 1 .743.648l.007.102.001 7.25h7.253a.75.75 0 0 1 .102 1.493l-.102.007h-7.253l.002 7.25a.75.75 0 0 1-1.493.101l-.007-.102-.002-7.249H3.752a.75.75 0 0 1-.102-1.493L3.752 11h7.25L11 3.75a.75.75 0 0 1 .75-.75Z"
                fill="#212121"
            />
        </svg>
    </div>
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
