<template>
    <Teleport to=".global">
        <div class="modal">
            <div ref="target" class="modal-container">
                <slot> </slot>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { useRouter, type RouteLocationRaw } from "vue-router";
import { onClickOutside } from "@vueuse/core";
import { ref } from "vue";
const router = useRouter();
const props = defineProps<{
    closeRoute: RouteLocationRaw;
}>();
const target = ref(null);
onClickOutside(target, () => router.push(props.closeRoute));
</script>
<style></style>
