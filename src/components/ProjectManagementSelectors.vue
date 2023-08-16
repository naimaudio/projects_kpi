<template>
    <div class="selector-container">
        <div v-if="props.display.project" class="field-with-legend">
            <span>Project</span>
            <Combobox
                :model-value="projectId === undefined ? undefined : projectStore.projectCodes[projectId]"
                @update:model-value="(pId) => onProjectChange(pId)"
            >
                <ComboboxInput
                    placeholder="Choose a project"
                    autocomplete="off"
                    :model-value="projectId"
                    class="combobox-input"
                    @change="query = $event.target.value"
                />
                <ComboboxOptions class="combobox-options">
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
                            <span style="font-weight: 300">{{ project.name }}</span>
                            <span style="color: #8f8f8f; font-size: 12px; margin-left: 4px">{{ project.code }}</span>
                        </button>
                    </ComboboxOption>
                </ComboboxOptions>
            </Combobox>
        </div>
        <div v-if="props.display.period" class="field-with-legend">
            <span>Period</span>
            <VueDatePicker
                :model-value="period"
                range
                month-picker
                @update:model-value="onDateRangeChange"
            ></VueDatePicker>
        </div>
        <div v-if="props.display.unit" class="field-with-legend">
            <span>Unit</span>
            <fluent-select :value="unit" style="height: 36px" @change="onUnitChange">
                <fluent-option>hours</fluent-option>
                <fluent-option>TDE</fluent-option>
            </fluent-select>
        </div>
        <div v-if="props.display.cummulated" class="field-with-legend">
            <span>Accumulated</span>
            <fluent-select :value="cummulated" style="height: 36px" @change="onCummulateChange">
                <fluent-option>cummulated</fluent-option>
                <fluent-option>monthly</fluent-option>
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
const props = withDefaults(
    defineProps<{
        display?: {
            cummulated?: boolean;
            unit?: boolean;
            period?: boolean;
            project?: boolean;
        };
    }>(),
    {
        display: () => ({
            cummulated: false,
            unit: false,
            period: false,
            project: false,
        }),
    }
);
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

const cummulated = computed<string>(() => {
    const c = route.query.cummulated;
    if (c !== "monthly" && c !== "cummulated") {
        return "cummulated";
    } else {
        return c;
    }
});
const router = useRouter();
const route = useRoute();
const period = computed<string[] | undefined>(() => {
    const val = route.query.period;
    if (Array.isArray(val) && val.length === 2 && val.every((v) => v !== null)) {
        return [
            { month: Number(val[0]?.split("-")[0]), year: Number(val[0]?.split("-")[1]) },
            { month: Number(val[1]?.split("-")[0]), year: Number(val[1]?.split("-")[1]) },
        ];
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
function onDateRangeChange(period: { month: number; year: number }[] | null) {
    if (period !== null) {
        router.push({
            ...route,
            query: {
                ...route.query,
                period: [`${period[0].month}-${period[0].year}`, `${period[1].month}-${period[1].year}`],
            },
        });
    } else {
        router.push({
            ...route,
            query: {
                ...route.query,
                period: undefined,
            },
        });
    }
}
function onUnitChange(event: any) {
    router.push({
        name: route.name === null ? undefined : route.name,
        query: { ...route.query, unit: event.target.value },
    });
}
function onCummulateChange(event: any) {
    router.push({
        name: route.name === null ? undefined : route.name,
        query: { ...route.query, cummulated: event.target.value },
    });
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
