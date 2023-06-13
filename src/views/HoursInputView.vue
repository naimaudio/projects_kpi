<template>
  <div class="page-container">
    <div class="column-container">
      <div class="raw-container">
        <img :src="arrowPrevious" class="clickable-icon" @click="() => router.push({path: '/declare'})"/>
        <h1 class="sub-title">Declaration</h1>
      </div>
      <div class="raw-container">
        <span>you projects</span>
        <span>hours</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import arrowPrevious from "@/assets/icons/arrow-previous.svg"
import { useRouter } from "vue-router";
const router = useRouter()
</script>

<style scoped>
.clickable-icon {
  cursor: pointer;
}
</style>