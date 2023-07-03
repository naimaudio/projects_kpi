<template>
    <button class="white-button"><slot></slot></button>
</template>

<script setup lang="ts"></script>

<style scoped>
.white-button {
    background-color: white;
    color: #242424;
    border: 1px solid #d1d1d1;
    padding: 5px 12px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    cursor: pointer;
    border-radius: var(--card-border-radius);
    font-weight: 500;
    min-width: 60px;
}

.white-button:hover {
    background-color: #f5f5f5;
}
</style>
