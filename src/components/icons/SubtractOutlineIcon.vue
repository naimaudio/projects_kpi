<template>
    <div :class="{ clickable: props.clickable }" class="svg-container" style="display: inline-block">
        <svg class="center" width="18" height="18" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.997 13H20a1 1 0 1 0 0-2H3.997a1 1 0 1 0 0 2Z" fill="#212121" />
        </svg>
    </div>
</template>
<script lang="ts">
interface Props {
    clickable: boolean;
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<Props>(), {
    clickable: false,
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
