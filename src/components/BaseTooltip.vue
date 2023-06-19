<template>
  <InfoOutline ref="infoIcon" @mouseover="mouseover = true" @mouseleave="mouseover=false"/>
  <div ref="tooltip" :style="floatingStyles" class="tooltip" v-if="mouseover">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import InfoOutline from '@/components/icons/InfoOutline.vue'
import {useFloating} from '@floating-ui/vue';
import { ref } from 'vue';
const mouseover = ref<boolean>(false)
const infoIcon =ref<Element|null>(null)
const tooltip = ref<HTMLElement|null>( null)
const {floatingStyles} = useFloating(infoIcon, tooltip, {
  placement: 'bottom-end',

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
    border-radius: 4px;
    font-size: 90%;
}

</style>