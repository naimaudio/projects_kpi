import { createRouter, createWebHistory } from "vue-router";
const DeclarationView = () => import("@/views/DeclarationView.vue");
const ProjectsView = () => import("@/views/ProjectsView.vue");
const ProfileView = () => import("@/views/ProfileView.vue");
const HistoryView = () => import("@/views/HistoryView.vue");
const HoursView = () => import("@/views/declaration/HoursView.vue");
const LoginView = () => import("@/views/LoginView.vue");
const ProjectView = () => import("@/views/ProjectView.vue");
const Default = () => import("@/layouts/DefaultLayout.vue");

import { useAuthStore } from "@/stores/authStore";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            redirect: { name: "declaration" },
        },
        {
            path: "/undefinedshouldnotgothere",
            name: "sidebar",
            component: Default,
            children: [
                {
                    path: "/declare",
                    name: "declaration",
                    component: DeclarationView,
                },
                {
                    path: "/declare/:week/:year/:day",
                    name: "dayDeclaration",
                    component: HoursView,
                },
                {
                    path: "/declare/:week/:year",
                    name: "declarationDate",
                    component: HoursView,
                },
                {
                    path: "/history",
                    name: "history",
                    component: HistoryView,
                },
                {
                    path: "/projects",
                    name: "projects",
                    component: ProjectsView,
                    children: [
                        {
                            path: ":projectId",
                            name: "project",
                            component: ProjectView,
                        },
                    ],
                },
                {
                    path: "/profile",
                    name: "profile",
                    component: ProfileView,
                },
            ],
        },
        {
            path: "/login",
            name: "login",
            component: LoginView,
        },
    ],
});

router.beforeEach((to) => {
    const authStore = useAuthStore();

    if (to.name !== "login" && authStore.msalInstance?.getAllAccounts().length === 0) {
        return router.push({ name: "login" });
    }
});

export default router;
