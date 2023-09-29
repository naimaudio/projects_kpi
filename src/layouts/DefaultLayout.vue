<template>
    <div style="position: absolute; top: 0; bottom: 0; right: 0; left: 0">
        <!-- HEADER -->
        <div id="headerbar">
            <div style="display: flex; align-items: center; width: var(--sidebar-width)">
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
            <ProjectManagementSelectors
                v-if="route.name === 'KPI' || route.name === 'business_kpi' || route.name === 'data'"
                :display="{
                    cummulated: route.name === 'KPI' || route.name === 'business_kpi',
                    period: route.name === 'KPI' || route.name === 'business_kpi',
                    project: route.name === 'KPI',
                    unit: route.name === 'KPI' || route.name === 'business_kpi',
                    projects: route.name === 'data',
                }"
            />
            <div>
                <RouterLink class="avatar-container raw-container" :to="{ name: 'profile', query: route.query }">
                    <span>{{ userStore.user?.username }}</span>
                    <BaseAvatar v-if="initials !== undefined" :initials="initials" />
                </RouterLink>
            </div>
        </div>
        <div style="display: flex; height: calc(100% - var(--header-height))">
            <!-- SIDEBAR -->
            <Transition name="sidebar">
                <div v-if="showSideBar" id="sidebar">
                    <div class="base-menu" style="padding-top: 28px; overflow-y: auto">
                        <div v-for="routes in routeLinks" :key="routes.label" class="sub-menu">
                            <span class="group-link">{{ routes.label }}</span>
                            <RouterLink
                                v-for="{ label, link, secondaryLinks } in routes.subgroup"
                                :key="label"
                                class="base-links"
                                :to="{ name: link, query: route.query }"
                                :class="{
                                    'selected-link':
                                        route.name === link ||
                                        (secondaryLinks !== undefined && secondaryLinks.find((l) => l === route.name)),
                                }"
                            >
                                {{ label }}
                            </RouterLink>
                        </div>
                    </div>
                    <div>
                        <div class="divider-soft"></div>
                        <div class="base-menu" style="padding-top: 12px">
                            <div class="sub-menu">
                                <a
                                    :href="envVariableWithValidation('VITE_SUPPORT_LINK')"
                                    class="base-link-with-icon"
                                    target="_blank"
                                >
                                    <PersonFeedbackIcon />
                                    Need help?
                                </a>
                            </div>
                            <span class="sub-menu copyright">© 2024 VerVent Audio Group </span>
                        </div>
                    </div>
                </div>
            </Transition>
            <!-- MAIN -->
            <div id="main-section">
                <RouterView />
            </div>
            <!-- NOTIFICATION -->
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
import { routes_by_access } from "@/stores/nonReactiveStore";
import ProjectManagementSelectors from "@/components/ProjectManagementSelectors.vue";
import { envVariableWithValidation } from "@/utilities/main";
import PersonFeedbackIcon from "@/components/icons/PersonFeedbackIcon.vue";
const userStore = useUserStore();
const globalStore = useGlobalStore();
const initials = computed<string | undefined>(() =>
    userStore.user?.username
        ?.split(" ")
        .map((name) => name[0])
        .join("")
);
const route = useRoute();
const routeLinks = computed<
    { label: string; subgroup: { label: string; link: string; secondaryLinks?: string[] }[] }[]
>(() => {
    if (userStore.userRoleGetter !== undefined) {
        return routes_by_access[userStore.userRoleGetter];
    } else {
        return [];
    }
});

const closeNotif = async () => {
    globalStore.notification.display = false;
};
const showSideBar = ref<boolean>(true);
</script>

<style scoped>
#sidebar {
    position: static;
    min-width: var(--sidebar-width);
    max-width: var(--sidebar-width);
    background-color: white;
    border-right: 1px solid #e6e6e6;
    overflow-y: auto;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 90px;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
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
    box-shadow: rgb(15, 108, 189) 0px 0px 4px -2px;
}

#main-section {
    position: relative;
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
    gap: 6px;
}
.sub-menu {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.copyright {
    font-weight: 300;
    font-size: 12px;
    color: rgb(110, 119, 129);
}

.base-links {
    text-decoration: none;
    display: block;
    color: black;
    padding: 6px 20px 6px 20px;
    border-radius: 5px;
}

.base-link-with-icon {
    text-decoration: none;
    display: block;
    color: black;
    padding: 6px 10px 6px 10px;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    gap: 6px;
}

.group-link {
    display: block;
    color: black;
    padding: 6px 20px 6px 20px;
    font-weight: 600;
}

.base-links:hover,
.base-link-with-icon:hover,
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
