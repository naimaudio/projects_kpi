import { createRouter, createWebHistory } from 'vue-router'
import DeclarationView from "@/views/declaration/DeclarationView.vue"
import ProjectsView from "@/views/ProjectsView.vue"
import HistoryView from "@/views/HistoryView.vue"
import TestView from "@/views/testView.vue"
import HoursInputView from '@/views/declaration/HoursInputView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/declare',
      name: 'declaration',
      component: DeclarationView,
    },
    {
      path: '/declare/:week/:year',
      name: 'declarationDate',
      component: HoursInputView,
    },
    {
      path: '/history',
      name: 'history',
      component: HistoryView
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsView
    },
    {
      path: '/test',
      name: 'test',
      component: TestView
    },
  ]
})

export default router
