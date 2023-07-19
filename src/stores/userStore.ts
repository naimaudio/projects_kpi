import type { Preferences, User } from "@/typing";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useUserStore = defineStore("user", () => {
    const user = ref<User | undefined>();
    function isLoggedIn() {
        return user.value !== undefined;
    }

    const preferences = ref<Preferences>({
        preferedMethod: "weekly",
    });

    const userIdGetter = computed<number | undefined>(() => (user.value === undefined ? undefined : user.value?.id));

    function setUser(newUser: User): void {
        user.value = newUser;
    }
    return { user, preferences, userIdGetter, isLoggedIn, setUser };
});
