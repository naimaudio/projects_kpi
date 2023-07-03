<template>
    <InfoOutlineIcon ref="infoIcon" @mouseover="mouseover = true" @mouseleave="mouseover = false" />
    <div v-if="mouseover" ref="tooltip" :style="floatingStyles" class="tooltip">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import InfoOutlineIcon from "@/components/icons/InfoOutlineIcon.vue";
import { useFloating } from "@floating-ui/vue";
import { ref } from "vue";
const mouseover = ref<boolean>(false);
const infoIcon = ref<Element | null>(null);
const tooltip = ref<HTMLElement | null>(null);
const { floatingStyles } = useFloating(infoIcon, tooltip, {
    placement: "bottom-end",
});
</script>

<style scoped>
.tooltip {
    z-index: 9999;
    width: max-content;
    position: absolute;
    top: 0;
    left: 0;
    background: #222;
    color: white;
    padding: 5px;
    border-radius: var(--button-border-radius);
    font-size: 90%;
}
</style>
