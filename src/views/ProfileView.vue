<template>
    <div class="page-container">
        <div class="column-flex">
            <h1 class="title">Profile</h1>
            <span class="sub-title">{{ authStore.accountGetter?.name }}</span>
            <span class="icon-with-text"><EmailIcon />{{ authStore.accountGetter?.username }}</span>
            <br />
            <fluent-button @click="disconnect">Disconnect</fluent-button>
            <br />
            <div class="divider"></div>
            <br />
            <span>Domain</span>
            <fluent-select>
                <fluent-option v-for="domain in domains" :key="domain" :value="domain">{{ domain }}</fluent-option>
            </fluent-select>
            <fluent-button appearance="accent">Validate</fluent-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import EmailIcon from "@/components/icons/EmailIcon.vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const domains = ["Acoustics", "Tests", "Hardware", "Software", "Mechanics"];
const authStore = useAuthStore();
const router = useRouter();
async function disconnect() {
    authStore.msalInstance?.logoutPopup().then(() => router.push("/"));
}
</script>
