<template>
    <div class="page-container">
        <div class="column-flex">
            <span class="title">Profile</span>
            <fluent-text-field value="Franz" disabled>Name</fluent-text-field>
            <fluent-text-field value="Beatrice" disabled>Firstname</fluent-text-field>
            <span>Domain</span>
            <fluent-select>
                <fluent-option v-for="domain in domains" :key="domain" :value="domain">{{ domain }}</fluent-option>
            </fluent-select>
        </div>
    </div>
</template>

<script setup lang="ts">
const domains = ["Acoustics", "Tests", "Hardware", "Software", "Mechanics"];
</script>
