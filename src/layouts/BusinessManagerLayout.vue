<template>
    <div style="position: absolute; top: 0; bottom: 0; right: 0; left: 0">
        <div id="headerbar">
            <div style="display: flex; align-items: center">
                <PanelExpendIcon v-if="!showSideBar" style="margin-left: 25px" clickable @click="showSideBar = true" />
                <PanelContractIcon
                    v-if="showSideBar"
                    style="margin-left: 25px"
                    clickable
                    @click="showSideBar = false"
                />
                <img
                    src="@/assets/userportal_logo.png"
                    style="image-rendering: high-quality; margin-left: 10px; height: 100%"
                />
            </div>
            <div>
                <RouterLink class="avatar-container raw-container" to="/profile">
                    <span>{{ userStore.user?.username }}</span>
                    <BaseAvatar v-if="initials !== undefined" :initials="initials" />
                </RouterLink>
            </div>
        </div>
        <div style="display: flex; height: calc(100% - var(--header-height))">
            <Transition name="sidebar">
                <div v-if="showSideBar" id="sidebar">
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
                        <br />
                    </div>
                </div>
            </Transition>
            <div id="main-section">
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
        </div>
    </div>
</template>

<script setup lang="ts">
import BaseAvatar from "@/components/base/BaseAvatar.vue";
import { useUserStore } from "@/stores/userStore";
import { computed, ref } from "vue";
import NotificationCard from "@/components/NotificationCard.vue";
import { useGlobalStore } from "@/stores/globalStore";
import { useRoute } from "vue-router";
import PanelExpendIcon from "@/components/icons/PanelExpendIcon.vue";
import PanelContractIcon from "@/components/icons/PanelContractIcon.vue";
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
        ],
    },
    {
        label: "Business management",
        subgroup: [
            {
                label: "Monthly report",
                link: "/monthly_report",
            },
            {
                label: "Business KPI",
                link: "/business_performance_indicators",
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

const showSideBar = ref<boolean>(true);
</script>

<style scoped>
.button-style-reset:hover {
    cursor: pointer;
}

#sidebar {
    position: relative;
    width: 280px;
    background-color: white;
    border-right: 1px solid #e6e6e6;
    overflow-y: auto;
}

#headerbar {
    justify-content: space-between;
    display: flex;
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
    height: var(--header-height);
    background-color: white;
    border-right: 1px solid #e6e6e6;
    box-shadow: rgb(15, 108, 189) 0px 0px 4px -2px;
}

#main-section {
    position: static;
    width: 100%;
    overflow-y: auto;
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

.sidebar-enter-active {
    transition: all 0.5s;
}
.sidebar-leave-active {
    transition: all 0.5s;
}

.sidebar-enter-from {
    transform: translate(-100%, 0);
}

.sidebar-leave-to {
    transform: translate(-100%, 0);
}

.selected-link {
    background-color: #fad6dc;
    font-weight: 600;
    color: #a63f50;
}
</style>
