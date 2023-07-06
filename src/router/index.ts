import { createRouter, createWebHistory } from "vue-router";
const DeclarationView = () => import("@/views/DeclarationView.vue");
const ProjectsView = () => import("@/views/ProjectsView.vue");
const ProfileView = () => import("@/views/ProfileView.vue");
const HistoryView = () => import("@/views/HistoryView.vue");
const ModalHoursView = () => import("@/views/declaration/ModalHoursView.vue");
const HoursView = () => import("@/views/declaration/HoursView.vue");
const LoginView = () => import("@/views/LoginView.vue");
const Default = () => import("@/layouts/DefaultLayout.vue");
import { useAuthStore } from "../stores/authStore";

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
                    path: "/declare/:week/:year",
                    name: "declarationDate",
                    component: HoursView,
                    children: [
                        {
                            path: ":day",
                            name: "dayDeclaration",
                            component: ModalHoursView,
                        },
                    ],
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
