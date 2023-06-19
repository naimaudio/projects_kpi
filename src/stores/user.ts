import { defineStore } from "pinia";
import type { Preferences } from "../typing/index"
import { ref } from "vue";

export const useMainStore = defineStore('main', () => {
  const preferences = ref<Preferences>({
    preferedMethod: "daily"
  })
  const favorites = ref<string[]>(["FH2101"])
  return {preferences, favorites}
})
