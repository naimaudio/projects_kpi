<template>
  <div class="page-container">
    
    <div class="column-container">
      <div class="flex-space-between">
        <div class="raw-container">
          <img :src="arrowPrevious" class="clickable-icon" @click="() => router.push({path: '/declare'})"/>
          <h1 class="sub-title">Declaration</h1>
        </div>
        <div style="display: flex; flex-direction: column;">
          <div style="display: flex; flex-direction: row; font-size: 12px; align-items: center;">
            <span id="input-method-label">Input method</span>
            <BaseTooltip> 
              <div style="max-width: 300px;">
                Whether input method used, the data stored will be weekly. Daily method is only a display help.
              </div>
            </BaseTooltip>
          </div>
          <fluent-select v-model="methodSelected">
            <fluent-option v-for="inputMethodKey in inputMethodKeys" :key="inputMethodKey" :value="inputMethodKey">
              {{ inputMethods[inputMethodKey] }}
            </fluent-option>
          </fluent-select>
        </div>
      </div>
      <!-- WEEKLY METHOD -->
      <div class="declaration-container column-flex" v-if="methodSelected === 'weekly'">
        <span class="prefix sub-title">Week {{ route.params.week }}</span>
        <span class="prefix">Please input your hours for {{ weekNumberToString(route.params.week, route.params.year) }} </span>
        <div class="declaration-inputs prefix">
          <HoursForm :modelValue="ongoingDeclaration" @update:modelValue="(index, value) => ongoingDeclaration[index].hours = value" @remove="(projectId, index) => {
            userStore.setFavorite(projectId, false)
            ongoingDeclaration.splice(index, 1)
          }"/>
          <div class="table-raw-gap"/>
          <div class="table-raw-container-2">
            <span class="prefix">Commentary (optional)</span>
            <fluent-text-area/>
          </div>
          <div class="table-raw-gap"/>
          <div class="footer-buttons">
            <fluent-button> Save draft</fluent-button>
            <fluent-button appearance="accent" :disabled="sumProjectHours != 35">Validate</fluent-button>
          </div>
        </div>
      </div>
      <!-- DAILY METHOD -->
      <div class="declaration-container column-flex" v-else>
        <span class="prefix sub-title">Week {{ route.params.week }}</span>
        <span class="prefix">Please input your hours for {{ weekNumberToString(route.params.week, route.params.year) }} </span>
           
        <div class="table-vertical">
          <div class="table-legend">
            <span class="table-cell"></span>
            <span class="table-cell" v-for="declaration in userStore.getElementaryDeclaration" :key="declaration.name">{{declaration.name}}</span>
          </div>
          <div class="table-column" v-for="day in workDayKeys" :key="day" @click="(event:MouseEvent) => {
            router.push({name: 'dayDeclaration', params: {...route.params, day: day}, query: route.query})
            event.stopPropagation()
          }">
            <span class="table-cell">{{workDays[day]}}</span>
            <span class="table-cell" v-for="declaration in userStore.dailyHoursSpend[day]" :key="declaration.name">
              {{ declaration.hours }}
            </span>
          </div>
        </div>
        <div class="table-raw-gap"/>
        <div class="table-raw-container-2">
          <span class="prefix">Commentary (optional)</span>
          <fluent-text-area/>
        </div>
        <div class="table-raw-gap"/>
        <div class="footer-buttons">
          <fluent-button> Save draft</fluent-button>
          <fluent-button appearance="accent" :disabled="sumProjectHours != 35">Validate</fluent-button>
        </div>
      </div>
    </div>
    <RouterView/>
        
  </div>
  
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import arrowPrevious from "@/assets/icons/arrow-previous.svg"
import { useRoute, useRouter } from "vue-router";
import HoursForm from '@/components/input_hours/HoursForm.vue';
import { weekNumberToString } from '@/utilities/main';
import BaseTooltip from '@/components/BaseTooltip.vue'
import { inputMethods, inputMethodKeys, type DeclarationInput, type InputMethod, workDayKeys, workDays } from '@/typing'
import { useProjectStore } from '@/stores/projects';
import { useUserStore } from '@/stores/user';

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()


const projectStore = useProjectStore()


const ongoingDeclaration = ref<DeclarationInput[]>(
  userStore.getElementaryDeclaration
)

const methodSelected = ref<InputMethod>( 
  inputMethodKeys.includes(route.query["method"]) ? route.query["method"] :
    userStore.$state.preferences.preferedMethod
)

watch(methodSelected, (method)=>{
  router.push({ path: route.path, query: {method: method}})
})

const sumProjectHours = computed<number>(() => {
  let total: number = 0
  ongoingDeclaration.value.forEach(declaration => {
    total += Number(declaration.hours)
  }); 
  return total
})
</script>

<style scoped>
.flex-space-between {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.clickable-icon {
  cursor: pointer;
}

.declaration-container {
  border: 1px solid #d1d1d1;
  border-radius: 4px;
  background-color: white;
  padding: 30px 44px 30px 30px;

  color: #242424;
  box-shadow: 0 2px 4px #00000024, 0 0 2px #0000001f
}

.white-button {
  background-color: white;
  color: #242424;
  border: 1px solid #d1d1d1;
  padding: 5px 12px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  border-radius: 4px;
  font-weight: 500;
  min-width: 60px;
}

.table-raw-container {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  grid-template-rows: 1fr;
  grid-column-gap: 31px;
}

.table-raw-gap {
  height: 10px;
}

.table-raw-container-2 {
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-template-rows: 1fr;
  grid-column-gap: 31px;
}

.table-header {
  font-size: 14px;
  font-weight: 400;
}
.declaration-inputs {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%
}

.align-center {
  height: min-content;
  align-self: center;
}

.footer-buttons {
  display: flex;
  align-self: flex-end;
  gap: 14px
}

.error-validation {
  color: red;
  font-weight: 600;
}

.italic {
  font-size: small;
  font-style: italic;
  font-weight: 400;
}
fluent-select {
  min-width: 100px
}

.table-vertical {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  width: 100%;
}

.table-column {
  display: flex;
  flex-direction: column;
  border-right: 1px #e0e0e0 solid;
  cursor: pointer;
}

.table-legend {
  display: flex;
  flex-direction: column;
  border-right: 1px #e0e0e0 solid;
}

.table-column:hover {
  background-color: #f5f5f5
}

.table-cell {
  padding: 0 8px;
  min-height: 44px;
  display: flex;
  align-items: center;
}
</style>