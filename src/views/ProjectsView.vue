<template>
  <div class="page-container">
    <h1 class="title">Projects</h1>
    <div class="divider"></div>
    <div>
      <BaseTable :headers="headers" :items="items" @change="change"/>
    </div>
  </div>
</template>


<script lang="ts">
interface Project {
  id: string
  name: string
  manager: string
  time_spend: number
  favorite: boolean  
}
</script>

<script setup lang="ts">
import BaseTable from '@/components/BaseTable.vue';
import { ref } from 'vue';

const headers: Header[] = [{name: 'Id', id: 'id', filterable: false},
  {name: 'Name', id: 'name', filterable: false},
  {name: 'Manager', id: 'manager', filterable: false},
  {name: 'Time spend(hours)', id: 'time_spend', filterable: false},
  {name: 'Fav', id: 'favorite', filterable: false}]

const items = ref<Project[]>([{
  id: 'p1',
  name: 'P1',
  manager: "Beatrice Franz",
  time_spend: 43,
  favorite: true
}, {
  id: 'p2',
  name: 'P2',
  manager: "Arnold ResteJeune",
  time_spend: 32,
  favorite: true
}])
function change<K extends keyof Project>(index: number, field: K, value: Project[K]){
  items.value[index][field] = value
} 
</script>