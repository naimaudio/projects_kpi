<template>
    <div class="page-container">
        <div class="column-flex">
            <h1 class="title">Profile</h1>
            <span class="sub-title">{{ userStore.user?.username }}</span>
            <span class="icon-with-text"><EmailIcon />{{ userStore.user?.email }}</span>
            <span class="icon-with-text">
                <CalendarEmpty />
                <span>
                    First declaration registred on {{ dayjs(userStore.user?.firstDeclarationDay).format("YYYY/MM/DD") }}
                </span>
            </span>
            <br />
            <fluent-button @click="disconnect">Disconnect</fluent-button>
            <br />
            <div class="divider"></div>
            <br />
            <span>Default domain</span>
            <fluent-select v-model="userDomain">
                <fluent-option v-for="d in domains" :key="d" :value="d">{{ d }}</fluent-option>
            </fluent-select>
            <BaseButton
                accent
                :loading="loading"
                :disabled="userDomain === '' || loading"
                appearance="accent"
                @click="setDomain(userDomain)"
            >
                Validate
            </BaseButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import EmailIcon from "@/components/icons/EmailIcon.vue";
import CalendarEmpty from "@/components/icons/CalendarEmpty.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import { useRouter } from "vue-router";
import type { domain } from "@/typing";
import { domains } from "@/typing";
import { ref } from "vue";
import { getDomain, putDomain } from "@/API/requests";
import { useUserStore } from "@/stores/userStore";
import { useGlobalStore } from "@/stores/globalStore";
import dayjs from "dayjs";
import { msalInstance } from "@/auth_config/auth";
import { useDeclarationStore } from "@/stores/declarationStore";

const userStore = useUserStore();
const globalStore = useGlobalStore();
const declarationStore = useDeclarationStore();
const router = useRouter();

const userId = userStore.userIdGetter;

const loading = ref<boolean>(true);
const userDomain = ref<domain | "">("");

if (userId !== undefined) {
    getDomain(userId).then((domain) => {
        userDomain.value = domain.data;
        loading.value = false;
    });
}
async function disconnect() {
    msalInstance.logoutPopup().then(() => router.push("/"));
}

async function setDomain(domain: domain | "") {
    loading.value = true;
    if (userId !== undefined && domain !== "") {
        await putDomain(userId, domain).then((response) => {
            if (response.status === 200) {
                userDomain.value = domain;
                loading.value = false;
                declarationStore.userDomain = domain;
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
