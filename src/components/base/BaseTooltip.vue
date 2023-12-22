<template>
    <div ref="infoIcon" style="display: inline-block" :style="props.iconStyle">
        <InfoOutlineIcon
            :svg-container-bypass="props.svgContainerBypass"
            @mouseover="mouseover = true"
            @mouseleave="mouseover = false"
        />
    </div>
    <div v-if="mouseover" ref="tooltip" :style="floatingStyles" class="tooltip">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import InfoOutlineIcon from "@/components/icons/InfoOutlineIcon.vue";
import { flip, offset, shift, useFloating } from "@floating-ui/vue";
import { ref } from "vue";
const mouseover = ref<boolean>(false);
const infoIcon = ref<Element | null>(null);
const tooltip = ref<HTMLElement | null>(null);
const { floatingStyles } = useFloating(infoIcon, tooltip, {
    placement: "bottom-end",
    middleware: [offset(0), flip(), shift()],
});
const props = withDefaults(defineProps<{ iconStyle?: string; svgContainerBypass?: boolean }>(), {
    svgContainerBypass: false,
    iconStyle: "",
});
</script>

<style scoped>
.tooltip {
    z-index: 9999;
    width: max-content;
    position: absolute;
    top: 0;
    left: 0;
    background: white;
    border: 1px;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 0px 2px 0px, rgba(0, 0, 0, 0.14) 0px 2px 4px 0px;
    color: #222;
    padding: 5px;
    border-radius: var(--button-border-radius);
    font-size: 15px;
    font-weight: 400;
    font-style: normal;
}
</style>
