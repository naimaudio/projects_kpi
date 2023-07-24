<template>
    <div id="sidebar">
        <div class="base-menu">
            <div v-for="routes in routeLinks" :key="routes.label" class="sub-menu">
                <span class="group-link">{{ routes.label }}</span>
                <RouterLink
                    v-for="{ label, link } in routes.subgroup"
                    :key="label"
                    class="base-links"
                    :to="link"
                    :class="{ 'selected-link': link.includes(currentRoute) }"
                >
                    {{ label }}
                </RouterLink>
            </div>
        </div>
    </div>
    <div id="main-section">
        <div id="headerbar">
            <img src="@/assets/userportal_logo.png" style="image-rendering: high-quality; margin-left: 20px" />
            <div>
                <RouterLink class="avatar-container raw-container" to="/profile">
                    <span>{{ userStore.user?.username }}</span>
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
import BaseAvatar from "@/components/base/BaseAvatar.vue";
import { useUserStore } from "@/stores/userStore";
import { computed } from "vue";
import NotificationCard from "@/components/NotificationCard.vue";
import { useGlobalStore } from "@/stores/globalStore";
import { useRoute } from "vue-router";

const routeLinks: { label: string; subgroup: { label: string; link: string }[] }[] = [
    {
        label: "Declaration",
        subgroup: [
            {
                label: "Declare hours",
                link: "/declare",
            },
            {
                label: " History",
                link: "/history",
            },
            {
                label: " Change",
                link: "/declaration_change",
            },
        ],
    },
    {
        label: "Project management",
        subgroup: [
            {
                label: "KPI",
                link: "/performance_indicators",
            },
            {
                label: "Forecast",
                link: "/forecast",
            },
            {
                label: "Data",
                link: "/data",
            },
            {
                label: "Projects",
                link: "/projects",
            },
        ],
    },
];

const userStore = useUserStore();
const globalStore = useGlobalStore();
const initials = computed<string | undefined>(() =>
    userStore.user?.username
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
    width: 280px;
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
    left: 282px;
    top: var(--header-height);
    bottom: 0;
    right: 0;
    background-color: white;
    overflow-y: scroll;
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
.sub-menu {
    display: flex;
    flex-direction: column;

    gap: 10px;
}
.base-links {
    text-decoration: none;
    display: block;
    color: black;
    padding: 6px 20px 6px 20px;
    border-radius: 5px;
}

.group-link {
    display: block;
    color: black;
    padding: 6px 20px 6px 20px;
    font-weight: 600;
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
