<template>
    <ModalComponent @close="() => emits('close')">
        <span class="sub-title">Week {{ weekNumber }}</span>
        <p v-if="confirmation">
            Please confirm the declaration for the week {{ props.weekNumber }} of {{ props.year }}.
        </p>
        <p v-else>Declaration for the week {{ props.weekNumber }} of {{ props.year }}.</p>
        <div class="table-raw-gap" />
        <div class="declaration-container column-flex">
            <div class="declaration-inputs prefix">
                <HoursRecap deletable :model-value="props.declaration" />
                <div class="table-raw-gap" />
                <div class="divider" />
                <div class="table-raw-gap" />
                <div class="table-raw-container">
                    <span>Total</span>
                    <div></div>
                    <div>
                        <span :class="{ 'error-validation': sumProjectHours > 35 }">{{ sumProjectHours }}</span>
                        <span> / 35</span>
                    </div>
                </div>
                <div class="table-raw-gap" />
                <div v-if="props.comment !== undefined && props.comment !== ''" class="table-raw-container-2">
                    <span>Commentary</span>
                    <span> {{ props.comment }} </span>
                    <br />
                </div>
            </div>
        </div>
        <div class="table-raw-gap" />
        <p v-if="confirmation">You will not be able to update this information later.</p>
        <div v-if="confirmation" class="footer-buttons-block">
            <BaseButton
                :loading="loading"
                accent
                :disabled="sumProjectHours != 35 || loading"
                @click="validateDeclaration"
            >
                <span> Validate</span>
            </BaseButton>
        </div>
    </ModalComponent>
</template>

<script setup lang="ts">
import { hoursRegistration } from "@/API/requests";
import ModalComponent from "@/components/ModalComponent.vue";
import type { DeclarationInput } from "@/typing/index";
import { computed, ref } from "vue";
import { useGlobalStore } from "../stores/globalStore";
import { useRouter } from "vue-router";
import { initialization } from "@/utilities/initialization";
import HoursRecap from "@/components/input_hours/HoursRecap.vue";
import BaseButton from "@/components/base/BaseButton.vue";
const props = defineProps<{
    declaration: DeclarationInput[];
    comment?: string;
    userId?: number;
    weekNumber: number;
    year: number;
    confirmation: boolean;
}>();
const globalStore = useGlobalStore();
const sumProjectHours = computed<number>(() => {
    return props.declaration.reduce<number>((sum, decl) => decl.hours + sum, 0);
});

const emits = defineEmits<{
    (event: "close"): void;
}>();

const loading = ref<boolean>(false);
const router = useRouter();
async function validateDeclaration() {
    if (props.userId !== undefined) {
        loading.value = true;
        globalStore.notification.display = false;
        const response = await hoursRegistration(
            props.declaration,
            props.userId,
            props.weekNumber,
            props.year,
            props.comment
        );
        if (response.status !== 200) {
            globalStore.notification.content = "Oh no, an orror occured with the request. Please contact IT team.";
            globalStore.notification.type = "FAILURE";
            globalStore.notification.display = true;
        } else {
            globalStore.notification.content = "Declaration has been registered";
            globalStore.notification.type = "SUCCESS";
            globalStore.notification.display = true;
            router.push({ name: "declaration" });
        }
        initialization();
        loading.value = false;
    } else {
        console.warn("userId was not provided");
    }
}
</script>

<style scoped>
.declaration-container {
    border: 1px solid #d1d1d1;
    border-radius: 4px;
    background-color: white;
    padding: 14px 44px 10px 30px;

    color: #242424;
    box-shadow: 0 2px 4px #00000024, 0 0 2px #0000001f;
}

.table-raw-container {
    display: grid;
    grid-template-columns: 1fr 2fr 2fr;
    grid-template-rows: 1fr;
    grid-column-gap: 31px;
}

.table-raw-gap {
    height: 10px;
}

.table-raw-container-2 {
    display: grid;
    grid-template-columns: 1fr 4fr;
    grid-template-rows: 1fr;
    grid-column-gap: 31px;
}

.declaration-inputs {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
}

.error-validation {
    color: red;
    font-weight: 600;
}
</style>
