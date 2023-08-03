<template>
    <div class="selector-container">
        <div class="field-with-legend">
            <span>Project</span>
            <Combobox
                :model-value="projectStore.projectCodes[projectId]"
                @update:model-value="(pId) => onProjectChange(pId)"
            >
                <ComboboxInput
                    placeholder="Choose a project"
                    autocomplete="off"
                    :model-value="projectId"
                    class="combobox-input"
                    @change="query = $event.target.value"
                />
                <ComboboxOptions class="combobox-options" :unmount="false" @vnode-unmounted="console.log('end')">
                    <ComboboxOption
                        v-for="project in filteredProjects"
                        :key="project.id"
                        v-slot="{ active, selected }"
                        class="combobox-option"
                        :value="project.code"
                    >
                        <div style="position: relative; width: 0; height: 0">
                            <div
                                v-if="selected"
                                style="
                                    display: flex;
                                    position: absolute;
                                    height: 16px;
                                    width: 0;
                                    top: 6px;
                                    left: 4px;
                                    border: #036ac4 solid 2px;
                                    margin-right: 3px;
                                    z-index: 1000;
                                "
                            ></div>
                        </div>
                        <button
                            class="button-style-reset combobox-button"
                            :class="{ active: active, selected: selected }"
                        >
                            <span>{{ project.name }}</span>
                            <span style="color: #8f8f8f; font-size: 12px; margin-left: 4px">{{ project.code }}</span>
                        </button>
                    </ComboboxOption>
                </ComboboxOptions>
            </Combobox>
        </div>
        <div class="field-with-legend">
            <span>Period</span>
            <VueDatePicker
                :model-value="period"
                range
                model-type="MM-yyyy"
                month-picker
                @update:model-value="onDateRangeChange"
            ></VueDatePicker>
        </div>
        <div class="field-with-legend">
            <span>Unit</span>
            <fluent-select :value="unit" style="height: 36px" @change="onUnitChange">
                <fluent-option>hours</fluent-option>
                <fluent-option>TDE</fluent-option>
                <fluent-option>cost</fluent-option>
            </fluent-select>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useProjectStore } from "@/stores/projectStore";
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from "@headlessui/vue";
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import VueDatePicker from "@vuepic/vue-datepicker";

const projectStore = useProjectStore();
const query = ref("");

const filteredProjects = computed(() =>
    query.value === ""
        ? projectStore.projects.slice(0, 12)
        : projectStore.projects
              .filter((project) => {
                  return (
                      project.name.toLowerCase().includes(query.value.toLowerCase()) ||
                      project.code.toLowerCase().includes(query.value.toLowerCase())
                  );
              })
              .slice(0, 12)
);

const unit = computed<string>(() => {
    const u = route.query.unit;
    if (u !== "hours" && u !== "TDE" && u !== "cost") {
        return "hours";
    } else {
        return u;
    }
});
const router = useRouter();
const route = useRoute();
const period = computed<string[] | undefined>(() => {
    const val = route.query.period;
    if (Array.isArray(val) && val.length === 2 && val.every((v) => v !== null)) {
        return val as string[];
    } else {
        return undefined;
    }
});
const projectId = computed<undefined | number>(() => {
    const nb = Number(route.query.projectId);
    return isNaN(nb) ? undefined : nb;
});

function onProjectChange(pCode: string) {
    router.push({ ...route, query: { ...route.query, projectId: projectStore.projectCodeIds[pCode] } });
}
function onDateRangeChange(period: { year: number; month: number }[]) {
    router.push({ ...route, query: { ...route.query, period: period } });
}
function onUnitChange(event: any) {
    router.push({ name: route.name, query: { ...route.query, unit: event.target.value } });
}
</script>
<style scoped>
.selector-container {
    justify-content: space-between;
    display: flex;
    gap: 15px;
}
.field-with-legend {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.combobox-input {
    height: 36px;
    width: 200px;
    padding: 0px 10px;
    font-size: 16px;
    font-family: inherit;
    border: 1px solid #efefef;
    border-bottom: 1px solid #929292;
    border-radius: 3px;
    outline: none;
}

.active {
    background-color: #f5f5f5;
    outline: #797979 2px solid;
    z-index: 100;
}

.combobox-input:focus {
    border-bottom: 2px solid #036ac4;
}
.combobox-options {
    list-style: none;
    box-shadow: 0px 10px 20px 5px #c7c7c7;
    width: 300px;
    border-radius: 10px;
    border: 2px solid #efefef;
    padding: 5px;
    z-index: 10;
    background-color: white;
    position: absolute;
    top: 50px;
}

.combobox-option {
    font-family: inherit;
    background-color: white;
    color: #242424;
}

.combobox-button {
    text-align: left;
    position: relative;
    border-radius: var(--card-border-radius);
    width: 100%;
    min-height: 32px;
    padding: 5px 12px;
}

.selected {
    background-color: #f5f5f5;
}
</style>
