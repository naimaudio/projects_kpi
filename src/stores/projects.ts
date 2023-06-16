import { defineStore } from "pinia";
import {RawProject} from "../typing/index"
import { ref } from "vue";

export const useMainStore = defineStore('main', () => {
  const projects = ref<RawProject[]>([{
    id: "FCA",
    name: "Management",
    division: ["HOME", "MOTORITIES", "PRO"],
    sub_category: "H_CI"
  },
  {
    id: "FCA",
    name: "Management",
    division: ["HOME", "MOTORITIES", "PRO"],
    sub_category: "H_CI"
  },
  {
    id: "FH2101",
    name: "integration OUTDOOR Access",
    division: ["HOME", "MOTORITIES", "PRO"],
    sub_category: "H_CI"
  }])
  function addProject(project: RawProject){
    projects.value.push(project)
  }
  return {projects, addProject}
})