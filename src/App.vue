<template>
    <div class="global">
        <RouterView v-if="done && noError" />
        <div v-else-if="noError" class="centered"><fluent-progress-ring /></div>
        <ErrorCard v-else-if="!noError" :closable="false" @close="noError = true"
            >Oh no, there was an error at the initialization, please try to reload page, or
            <a :href="envVariableWithValidation('VITE_SUPPORT_LINK')" target="_blank"> contact IT support</a></ErrorCard
        >
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ErrorCard from "./components/ErrorCard.vue";
import { initialization } from "@/utilities/initialization";
import { envVariableWithValidation } from "@/utilities/main";

const done = ref(false);
const noError = ref(true);
initialization()
    .then(() => (done.value = true))
    .catch((error) => {
        if (error instanceof TypeError && error.message === "token validation failed") {
            localStorage.clear();
            done.value = true;
        } else {
            noError.value = false;
        }
    });
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
