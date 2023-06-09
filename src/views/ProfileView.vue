<template>
    <div class="page-container">
        <div class="column-flex">
            <h1 class="title">Profile</h1>
            <span class="sub-title">{{ authStore.accountGetter?.name }}</span>
            <span class="icon-with-text"><EmailIcon />{{ authStore.accountGetter?.username }}</span>
            <span class="icon-with-text">
                <CalendarEmpty />
                <span>
                    joining the company on {{ dayjs(userStore.user?.firstDeclarationDay).format("YYYY/MM/DD") }}
                </span></span
            >
            <br />
            <fluent-button @click="disconnect">Disconnect</fluent-button>
            <br />
            <div class="divider"></div>
            <br />
            <span>Domain</span>
            <fluent-select v-model="userDomain">
                <fluent-option value=""><span style="font-style: italic">None</span></fluent-option>
                <fluent-option v-for="d in domains" :key="d" :value="d">{{ d }}</fluent-option>
            </fluent-select>
            <BaseButton
                accent
                :disabled="userDomain === '' || loading"
                appearance="accent"
                @click="setDomain(userDomain)"
            >
                <template v-if="loading" #start>
                    <fluent-progress-ring style="width: 14px; height: 14px; stroke: lightblue" />
                </template>
                <template #default>Validate</template></BaseButton
            >
        </div>
    </div>
</template>

<script setup lang="ts">
import EmailIcon from "@/components/icons/EmailIcon.vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import { ref } from "vue";
import type { domain } from "@/typing";
import BaseButton from "@/components/BaseButton.vue";
import { getDomain, putDomain } from "@/API/requests";
import { useUserStore } from "@/stores/userStore";
import { useGlobalStore } from "@/stores/globalStore";
import dayjs from "dayjs";
import CalendarEmpty from "@/components/icons/CalendarEmpty.vue";

const domains = ["Acoustics", "Tests", "Hardware", "Software", "Mechanics"];
const authStore = useAuthStore();
const userStore = useUserStore();
const globalStore = useGlobalStore();
const router = useRouter();
const loading = ref<boolean>(true);
const userDomain = ref<domain | "">("");
const userId = userStore.userIdGetter;
if (userId !== undefined) {
    getDomain(userId).then((domain) => {
        console.log("a", domain);
        userDomain.value = domain;
        loading.value = false;
    });
}
async function disconnect() {
    authStore.msalInstance?.logoutPopup().then(() => router.push("/"));
}

async function setDomain(domain: domain) {
    loading.value = true;
    if (userId !== undefined) {
        await putDomain(userId, domain).then((response) => {
            if (response.status === 200) {
                userDomain.value = domain;
                loading.value = false;
                globalStore.notification = { content: "Domain changed successfully", display: true, type: "SUCCESS" };
            } else {
                loading.value = false;
                globalStore.notification = {
                    content: "Oh no, an orror occured with the request. Please contact IT team.",
                    display: true,
                    type: "FAILURE",
                };
            }
        });
    }
    loading.value = false;
}
</script>
