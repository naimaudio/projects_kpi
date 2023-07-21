import { createRouter, createWebHistory } from "vue-router";
const DeclarationView = () => import("@/views/DeclarationView.vue");
const KPIView = () => import("@/views/KPIView.vue");
const ForecastView = () => import("@/views/ForecastView.vue");
const DataView = () => import("@/views/DataView.vue");
const ProjectsView = () => import("@/views/ProjectsView.vue");
const ProfileView = () => import("@/views/ProfileView.vue");
const HistoryView = () => import("@/views/HistoryView.vue");
const HoursView = () => import("@/views/declaration/HoursView.vue");
const LoginView = () => import("@/views/LoginView.vue");
const ProjectView = () => import("@/views/ProjectView.vue");
const Default = () => import("@/layouts/DefaultLayout.vue");
const DeclarationChangeView = () => import("@/views/DeclarationChangeView.vue");
import { msalInstance } from "@/auth_config/auth";

import type { role } from "@/typing/index";
import { useUserStore } from "../stores/userStore";
import { getUser } from "@/API/requests";
import { userFromRaw } from "../API/conversions";

declare module "vue-router" {
    interface RouteMeta {
        minimalAccessRole?: role;
    }
}

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
                    meta: { minimalAccessRole: "Employee" },
                },
                {
                    path: "/declare/:week/:year/:day",
                    name: "dayDeclaration",
                    component: HoursView,
                    meta: { minimalAccessRole: "Employee" },
                },
                {
                    path: "/declare/:week/:year",
                    name: "declarationDate",
                    component: HoursView,
                    meta: { minimalAccessRole: "Employee" },
                },
                {
                    path: "/history",
                    name: "history",
                    component: HistoryView,
                    meta: { minimalAccessRole: "Employee" },
                },
                {
                    path: "/projects",
                    name: "projects",
                    component: ProjectsView,
                    meta: { minimalAccessRole: "Employee" },
                    children: [
                        {
                            path: ":projectId",
                            name: "project",
                            component: ProjectView,
                            meta: { minimalAccessRole: "Employee" },
                        },
                    ],
                },
                {
                    path: "/profile",
                    name: "profile",
                    component: ProfileView,
                    meta: { minimalAccessRole: "Employee" },
                },

                {
                    path: "/declaration_change",
                    name: "change",
                    component: DeclarationChangeView,
                    meta: { minimalAccessRole: "Project Manager" },
                },
                {
                    path: "/performance_indicators",
                    name: "KPI",
                    component: KPIView,
                    meta: { minimalAccessRole: "Project Manager" },
                },
                {
                    path: "/forecast",
                    name: "forecast",
                    component: ForecastView,
                    meta: { minimalAccessRole: "Project Manager" },
                },
                {
                    path: "/data",
                    name: "data",
                    component: DataView,
                    meta: { minimalAccessRole: "Project Manager" },
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

router.beforeEach(async (to) => {
    const userStore = useUserStore();
    if (to.name !== "login") {
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
            if (userStore.user === undefined) {
                await getUser().then((response) => {
                    if (response.status === 200) {
                        userStore.user = userFromRaw(response.data);
                    }
                });
            }
            const role = userStore.userRoleGetter;
            console.log(role);

            if (role === undefined) {
                throw Error("Can't happen");
            } else if (
                role === "Employee" &&
                (to.meta.minimalAccessRole === "Business Manager" || to.meta.minimalAccessRole === "Project Manager")
            ) {
                return router.push({ name: "declaration" });
            } else if (role === "Project Manager" && to.meta.minimalAccessRole === "Business Manager") {
                return router.push({ name: "declaration" });
            } else {
                return;
            }
        }
        return router.push({ name: "login" });
    }
});

export default router;
