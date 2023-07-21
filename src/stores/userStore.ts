import type { Preferences, User } from "@/typing";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { role } from "@/typing/index";

export const useUserStore = defineStore("user", () => {
    const user = ref<User | undefined>(undefined);
    function isLoggedIn() {
        return user.value !== undefined;
    }

    const preferences = ref<Preferences>({
        preferedMethod: "weekly",
    });

    const userIdGetter = computed<number | undefined>(() => (user.value === undefined ? undefined : user.value?.id));
    const userRoleGetter = computed<role | undefined>(() => (user.value === undefined ? undefined : user.value?.role));
    const appInitialization = ref<boolean>(true);
    function setUser(newUser: User): void {
        user.value = newUser;
    }
    return { user, preferences, appInitialization, userIdGetter, userRoleGetter, isLoggedIn, setUser };
});
