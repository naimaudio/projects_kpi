import { createRouter, createWebHistory } from "vue-router"
import DeclarationView from "@/views/DeclarationView.vue"
import ProjectsView from "@/views/ProjectsView.vue"
import HistoryView from "@/views/HistoryView.vue"
import ModalHoursView from "@/views/declaration/ModalHoursView.vue"
import HoursView from "@/views/declaration/HoursView.vue"

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
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
    ],
})

export default router
