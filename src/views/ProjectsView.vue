<template>
  <div class="page-container">
    <h1 class="title">Projects</h1>
    <div class="divider"></div>
    <div>
      <BaseTable :headers="headers" :items="projectStore.displayableProjects" @change="change"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseTable from '@/components/BaseTable.vue';
import { computed } from 'vue';
import { useProjectStore } from "@/stores/projects"
import type { Header } from '@/typing';
import type { Project } from '@/typing/project';

const headers: Header[] = [{name: 'Id', id: 'id', filterable: false},
  {name: 'Name', id: 'name', filterable: false},
  {name: 'Manager', id: 'manager', filterable: false},
  {name: 'Time spend(hours)', id: 'time_spend', filterable: false},
  {name: 'Fav', id: 'favorite', filterable: false}]


const projectStore = useProjectStore()

function change<K extends keyof Project>(index: number, field: K, value: Project[K]){
  projectStore.displayableProjects[index][field] = value
}
</script>