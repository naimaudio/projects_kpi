<template>
    <div class="global">
        <RouterView v-if="done" />
        <div v-else-if="noError" class="centered"><fluent-progress-ring /></div>
        <ErrorCard v-if="!noError" @close="noError = true">Oh no, there was an error at the initialization</ErrorCard>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ErrorCard from "./components/ErrorCard.vue";
import { initialization } from "@/utilities/initialization";

const done = ref(false);
const noError = ref(true);

initialization().then(() => (done.value = true));
</script>

<style scoped>
.centered {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: fit-content;
}
</style>
