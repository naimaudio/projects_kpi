import { createRouter, createWebHistory } from "vue-router";
import DeclarationView from "@/views/DeclarationView.vue";
import ProjectsView from "@/views/ProjectsView.vue";
import ProfileView from "@/views/ProfileView.vue";
import HistoryView from "@/views/HistoryView.vue";
import ModalHoursView from "@/views/declaration/ModalHoursView.vue";
import HoursView from "@/views/declaration/HoursView.vue";
import LoginView from "@/views/LoginView.vue";
import Default from "@/layouts/DefaultLayout.vue";

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
    if (to.name !== "login" && !localStorage.getItem("msal.account.keys")) {
        return router.push({ name: "login" });
    }
    // msalInstance.handleRedirectPromise().then((response) => console.log("cio", response));
});

export default router;
