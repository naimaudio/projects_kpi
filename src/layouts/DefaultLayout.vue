<template>
    <EmployeeLayout v-if="userStore.user?.role === 'Employee'" />
    <ProjectManagerLayout v-if="userStore.user?.role === 'Project Manager'" />
    <BusinessManagerLayout v-if="userStore.user?.role === 'Business Manager'" />
</template>

<script setup lang="ts">
import EmployeeLayout from "./EmployeeLayout.vue";
import ProjectManagerLayout from "./ProjectManagerLayout.vue";
import BusinessManagerLayout from "./BusinessManagerLayout.vue";
import { useUserStore } from "@/stores/userStore";
const userStore = useUserStore();
</script>
