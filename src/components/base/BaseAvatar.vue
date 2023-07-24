<template>
    <div class="avatar">
        <span class="avatar-initials">{{ props.initials }}</span>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    initials: string;
}>();
</script>

<style scoped>
.avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: lightcoral;
    overflow: hidden;
}

.avatar-initials {
    color: white;
}

.avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-initials {
    font-size: 18px;
    color: #fff;
}
</style>
