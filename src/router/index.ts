import { createRouter, createWebHistory } from "vue-router";

// Lazy Loading Routes => https://router.vuejs.org/guide/advanced/lazy-loading.html
const DeclarationView = () => import("@/views/employee/DeclarationView.vue");
const KPIView = () => import("@/views/project_manager/KPIView.vue");
const DataView = () => import("@/views/project_manager/DataView.vue");
const ProjectsView = () => import("@/views/employee/ProjectsView.vue");
const ProfileView = () => import("@/views/ProfileView.vue");
const HistoryView = () => import("@/views/employee/HistoryView.vue");
const HoursView = () => import("@/views/employee/HoursView.vue");
const LoginView = () => import("@/views/LoginView.vue");
const ProjectView = () => import("@/views/ProjectView.vue");
const Default = () => import("@/layouts/DefaultLayout.vue");
const MonthlyReportView = () => import("@/views/business_manager/MonthlyReportView.vue");
const BusinessKPIView = () => import("@/views/business_manager/BusinessKPIView.vue");
import { msalInstance } from "@/auth_config/auth";

import type { role } from "@/typing/index";
import { useUserStore } from "../stores/userStore";
import { getUser } from "@/API/requests";
import { userFromRaw } from "../typing/conversions";

declare module "vue-router" {
    interface RouteMeta {
        minimalAccessRole?: role;
    }
}

/**
 * Routes declared.
 *
 */
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    scrollBehavior() {
        const element = document.getElementById("main-section");
        if (element !== null) {
            element.scroll(0, 0);
        }
    },
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
                },
                {
                    path: "/projects/new",
                    name: "newProject",
                    component: ProjectView,
                    meta: { minimalAccessRole: "Employee" },
                },
                {
                    path: "/projects/:projectId",
                    name: "project",
                    component: ProjectView,
                    meta: { minimalAccessRole: "Employee" },
                },
                {
                    path: "/profile",
                    name: "profile",
                    component: ProfileView,
                    meta: { minimalAccessRole: "Employee" },
                },
                {
                    path: "/performance_indicators",
                    name: "KPI",
                    component: KPIView,
                    meta: { minimalAccessRole: "Project Manager" },
                },
                {
                    path: "/data",
                    name: "data",
                    component: DataView,
                    meta: { minimalAccessRole: "Project Manager" },
                },
                {
                    path: "/business_performance_indicators",
                    name: "business_kpi",
                    component: BusinessKPIView,
                    meta: { minimalAccessRole: "Business Manager" },
                },
                {
                    path: "/monthly_report",
                    name: "montly_report",
                    component: MonthlyReportView,
                    meta: { minimalAccessRole: "Business Manager" },
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
                try {
                    await getUser().then((response) => {
                        if (response.status === 200) {
                            userStore.user = userFromRaw(response.data);
                        } else if (response.status === 401) {
                            userStore.lastRoute = to;
                            return router.push({ name: "login" });
                        }
                    });
                } catch (error) {
                    if (error instanceof TypeError && error.message === "token validation failed") {
                        localStorage.clear();
                        return router.push({ name: "login" });
                    }
                    console.error(error);
                }
            }
            const role = userStore.userRoleGetter;

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
        userStore.lastRoute = to;
        return router.push({ name: "login" });
    }
});

export default router;
