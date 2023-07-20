<template>
    <div id="sidebar">
        <div class="base-menu">
            <RouterLink
                v-for="[name, link] in names"
                :key="name"
                class="base-links"
                :to="link"
                :class="{ 'selected-link': link.includes(currentRoute) }"
            >
                {{ name }}
            </RouterLink>
        </div>
    </div>
    <div id="main-section">
        <div id="headerbar">
            <img src="@/assets/userportal_logo.png" style="image-rendering: high-quality; margin-left: 20px" />
            <div>
                <RouterLink class="avatar-container raw-container" to="/profile">
                    <span>{{ authStore.accountGetter?.name }}</span>
                    <BaseAvatar v-if="initials !== undefined" :initials="initials" />
                </RouterLink>
            </div>
        </div>
        <RouterView />
    </div>
    <Transition name="fade">
        <NotificationCard
            v-if="globalStore.notification.display"
            :type="globalStore.notification.type"
            :lifetime="7"
            @close="closeNotif"
        >
            {{ globalStore.notification.content }}
        </NotificationCard>
    </Transition>
</template>

<script setup lang="ts">
import BaseAvatar from "@/components/BaseAvatar.vue";
import { useAuthStore } from "@/stores/authStore";
import { computed } from "vue";
import NotificationCard from "@/components/NotificationCard.vue";
import { useGlobalStore } from "@/stores/globalStore";
import { useRoute } from "vue-router";

const names: [string, string][] = [
    ["Declare hours", "/declare"],
    ["History", "/history"],
    ["Projects", "/projects"],
];

const authStore = useAuthStore();
const globalStore = useGlobalStore();
const initials = computed<string | undefined>(() =>
    authStore.accountGetter?.name
        ?.split(" ")
        .map((name) => name[0])
        .join("")
);
const route = useRoute();
const currentRoute = computed<string>(() => route.path);
const closeNotif = async () => {
    globalStore.notification.display = false;
};
</script>

<style scoped>
#sidebar {
    position: fixed;
    top: var(--header-height);
    left: 0;
    bottom: 0;
    width: 200px;
    background-color: white;
    border-right: 1px solid #e6e6e6;
}

#headerbar {
    justify-content: space-between;
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: var(--header-height);
    background-color: white;
    border-right: 1px solid #e6e6e6;
    box-shadow: rgb(15, 108, 189) 0px 0px 4px -2px;
}

#main-section {
    position: fixed;
    left: 202px;
    top: var(--header-height);
    bottom: 0;
    right: 0;
    background-color: white;
    overflow-y: scroll;
}

.connect-button {
    color: black;
    text-decoration: none;
}
.connect-button:hover {
    text-decoration: underline;
}

.avatar-container {
    display: flex;
    justify-content: center;
    height: var(--header-height);
    padding: 0 15px;
    text-decoration: none;
    color: black;
}

.base-menu {
    display: flex;
    flex-direction: column;
    padding-left: 32px;
    padding-right: 28px;
    padding-top: 28px;
    gap: 10px;
}

.base-links {
    text-decoration: none;
    display: block;
    color: black;
    padding: 6px 20px 6px 20px;
    border-radius: 5px;
}

.base-links:hover,
.avatar-container:hover {
    background-color: rgba(138, 153, 168, 0.2);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.7s ease;
}

.fade-leave-from {
    opacity: 1;
}
.fade-leave-to {
    opacity: 0;
}
.selected-link {
    background-color: #fad6dc;
    font-weight: 600;
    color: #a63f50;
}
</style>
