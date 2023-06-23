import { defineStore } from "pinia";
import type { RawProject } from "../typing/project"
import { ref } from "vue";

export const useProjectStore = defineStore('project', () => {
  const projects = ref<RawProject[]>([{
    id: 38,
    name: "Management",
    division: ["HOME", "MOTORITIES", "PRO"],
    manager: "Beatrice",
    sub_category: "ETC"
  },
  {
    id: 41,
    name: "Conformity",
    division: ["HOME", "MOTORITIES", "PRO"],
    sub_category: "ETC"
  },
  {
    id: 2,
    name: "integration OUTDOOR Access",
    division: ["HOME"],
    sub_category: "H_CI"
  }])
  function addProject(project: RawProject){
    projects.value.push(project)
  }

  return {projects, addProject}
})