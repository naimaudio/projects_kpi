<template>
    <Teleport to=".global">
        <div class="modal">
            <div ref="target" class="modal-container">
                <DismissIcon :size="20" class="close-modal-icon" @click="close" />
                <slot> </slot>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { useRouter, type RouteLocationRaw } from "vue-router";
import { onClickOutside } from "@vueuse/core";
import { ref } from "vue";
import DismissIcon from "@/components/icons/DismissIcon.vue";
const router = useRouter();
const props = defineProps<{
    closeRoute?: RouteLocationRaw;
}>();
const emits = defineEmits<{
    (event: "close"): void;
}>();
const target = ref(null);
onClickOutside(target, () => {
    close();
});

const close = () => {
    if (props.closeRoute !== undefined) {
        router.push(props.closeRoute);
    } else {
        emits("close");
    }
};
</script>
<style>
.close-modal-icon {
    position: fixed;
    right: 20px;
    top: 20px;
    z-index: 999;
    cursor: pointer;
}

.modal {
    background-color: rgba(0, 0, 0, 0.4);
    position: absolute;
    overflow-y: auto;
    z-index: 10;

    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
}

.modal-container {
    position: relative;
    background-color: white;
    border-radius: var(--card-border-radius);
    max-width: 90%;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.12), 0 32px 64px rgba(0, 0, 0, 0.14);
    padding: 44px;
    margin: 80px 0;
    left: 50%;
    transform: translateX(-50%);
}

/* Media Query for Responsive Behavior */
@media (max-width: 768px) {
    .modal-container {
        width: 80%;
    }
}

@media (min-width: 769px) {
    .modal-container {
        width: 50%;
    }
}
</style>
