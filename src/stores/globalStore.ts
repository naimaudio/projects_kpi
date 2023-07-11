import { defineStore } from "pinia";
import { ref } from "vue";

export const useGlobalStore = defineStore("global", () => {
    const notification = ref<{ display: boolean; content: string; type: "SUCCESS" | "FAILURE" }>({
        display: false,
        content: "",
        type: "SUCCESS",
    });

    return { notification };
});
