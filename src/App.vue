<template>
    <div class="global">
        <div id="sidebar">
            <div class="avatar-container raw-container">
                <BaseAvatar />
                <span>Beatrice Franz</span>
            </div>
            <div class="divider-soft" />
            <div class="base-menu">
                <RouterLink v-for="[name, link] in names" :key="name" class="base-links" :to="link">
                    {{ name }}
                </RouterLink>
            </div>
        </div>
        <div id="main-section">
            <RouterView />
        </div>
    </div>
</template>

<script setup lang="ts">
import BaseAvatar from "./components/BaseAvatar.vue";

const names: [string, string][] = [
    ["Declare hours", "/declare"],
    ["Declaration history", "/history"],
    ["Projects", "/projects"],
];
</script>

<style scoped>
#sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 280px;
    background-color: white;
    border-right: 1px solid #e6e6e6;
}

#main-section {
    position: fixed;
    left: 282px;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: white;
    overflow-y: scroll;
}

.avatar-container {
    display: flex;
    justify-content: center;
    margin: 20px 0;
}

.base-menu {
    display: flex;
    flex-direction: column;
    padding-left: 32px;
    padding-right: 28px;
    padding-top: 28px;
    gap: 10px;
}

.base-links {
    text-decoration: none;
    display: block;
    color: black;
    padding: 6px 36px 6px 36px;
    border-radius: 5px;
}

.base-links:hover {
    background-color: rgba(138, 153, 168, 0.2);
}
</style>
