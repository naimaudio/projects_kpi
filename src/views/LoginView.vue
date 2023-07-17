<template>
    <div class="card-support">
        <div class="card">
            <span class="sub-title">Login</span>
            <button class="microsoft-connect" @click="signIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">
                    <title>MS-SymbolLockup</title>
                    <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                    <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                    <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                    <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                </svg>
                Sign in with Microsoft
            </button>

            <div class="divider-soft" />
            <fluent-text-field>Username</fluent-text-field>
            <fluent-text-field>Password</fluent-text-field>
            <div class="footer-buttons">
                <fluent-button class="larger-button" appearance="accent">Connect</fluent-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { BrowserAuthError } from "@azure/msal-browser";
import { useAuthStore } from "@/stores/authStore";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { initialization } from "@/utilities/initialization";
import { useGlobalStore } from "@/stores/globalStore";

const authStore = useAuthStore();
const globalStore = useGlobalStore();
const router = useRouter();
onMounted(() => {
    if (authStore.msalInstance !== undefined) {
        const accounts = authStore.msalInstance.getAllAccounts();
        if (accounts.length === 0) {
            return;
        } else if (accounts.length > 1) {
            // Add choose account code here
            console.warn("Multiple accounts detected.");
        } else {
            authStore.setAccount(accounts[0]);
        }
    }
});

async function signIn() {
    if (authStore.msalInstance !== undefined) {
        await authStore.msalInstance
            .loginPopup({ scopes: ["User.Read"] })
            .then((response) => {
                if (response !== null && authStore.msalInstance !== undefined) {
                    const myAccounts = authStore.msalInstance.getAllAccounts();
                    authStore.setAccount(myAccounts[0]);
                }
            })
            .then(() => initialization())
            .then(() => router.push({ name: "declaration" }))
            .catch((browserAuthError: BrowserAuthError) => {
                console.log(browserAuthError);
                globalStore.notification = {
                    content:
                        "Oh ! There is an error with is authentification provider, please contact IT to solve issue",
                    display: true,
                    type: "FAILURE",
                };
            });
    }
}
</script>

<style>
.microsoft-connect {
    display: flex;
    gap: 12px;
    padding: 0px 12px;
    height: 41px;
    border-radius: 4px;

    flex-wrap: nowrap;
    align-items: center;
    background-color: #ffffff;
    border-width: 1px;
    border-color: #8c8c8c;
    margin-left: auto;
    margin-right: auto;
    color: #5e5e5e;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
}

.microsoft-connect:hover {
    background-color: #f3f3f3;
}
.card {
    background-color: #fff;
    padding: 44px;
    margin-bottom: 28px;
    width: 340px;
    margin-left: auto;
    margin-right: auto;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    gap: 15px;
}
.card-support {
    position: fixed;
    right: 0;
    left: 0;
    bottom: 0;
    top: 0;
    background-image: url("https://aadcdn.msftauth.net/shared/1.0/content/images/backgrounds/2_11d9e3bcdfede9ce5ce5ace2d129f1c4.svg");
    background-color: #f2f2f2;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.larger-button {
    width: 100px;
    font-size: 15px;
}

.microsoft-signin-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    background-color: #fff;
    color: #8c8c8c;
    border: none;
    font-size: 16px;
    cursor: pointer;
    border: 1px solid #333;
}
</style>
