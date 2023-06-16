<template>
  <div>
    <div class="table-headers">
      <div class="table-cell header-cell" v-for="header in props.headers" :key="header.id">
        <span>{{ header.name }}</span>
      </div>
    </div>
    <div class="table-raw" v-for="(cell, index) in props.items" :key="cell.id">
      <div class="table-cell" v-for="header in props.headers" :key="header.id">
        <span v-if="header.id== 'favorite' && 'favorite' in cell && typeof cell.favorite === 'boolean'">
          <StarOutline clickable @click="emitGlobal<'favorite'>('change', index, 'favorite', !cell.favorite)" :checked="cell.favorite"/>
        </span>
        <span v-else>
          {{ cell[header.id as keyof T] }}
        </span>
      </div>
    </div>
  </div>
</template>

  
<script setup lang="ts" generic="T extends {id: string | number; favorite: boolean}">
import { computed } from 'vue';
import StarOutline from '@/components/icons/StarOutline.vue'
const props = defineProps<{
    headers: Header[]
    items: T[]
  }>()

const emit = defineEmits<{
    (e: 'change', index: number, field: keyof T, value: T[keyof T]): void
  }>()

function emitGlobal<K extends keyof T>(event: 'change', index: number, field: K, value: T[K]){
  return emit(event, index, field, value)
}


const tableSize = computed(()=> {
  return props.headers.length
})

</script>

<style>
.table-raw, .table-headers {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  border-bottom: 1px #e0e0e0 solid;
  color: #242424;
}

.table-raw:hover, .header-cell:hover {
  background-color: #f5f5f5
}
.table-cell {
  padding: 0 8px;
  min-height: 44px;
  display: flex;
  align-items: center;
}
</style>