<template>
    <div class="page-container">
        <div class="column-container">
            <div class="flex-space-between">
                <div class="raw-container">
                    <ArrowPreviousIcon
                        class="clickable-icon"
                        @click="() => router.push({ name: 'declaration', query: route.query })"
                    />
                    <h1 class="sub-title">Declaration</h1>
                </div>
                <div style="display: flex; flex-direction: column">
                    <div style="display: flex; flex-direction: row; font-size: 12px; align-items: center">
                        <span id="input-method-label">Input method</span>
                        <BaseTooltip>
                            <div style="max-width: 300px">
                                Whether input method used, the data stored will be weekly. Daily method is only a
                                display help.
                            </div>
                        </BaseTooltip>
                    </div>
                    <fluent-select v-model="methodSelected">
                        <fluent-option
                            v-for="inputMethodKey in inputMethodKeys"
                            :key="inputMethodKey"
                            :value="inputMethodKey"
                        >
                            {{ inputMethods[inputMethodKey] }}
                        </fluent-option>
                    </fluent-select>
                </div>
            </div>
            <template v-if="weekNumber !== undefined && yearNumber !== undefined && valideRoute">
                <!-- WEEKLY METHOD -->
                <div v-if="methodSelected === 'weekly'" class="declaration-container column-flex">
                    <span class="prefix sub-title">Week {{ route.params.week }}</span>
                    <span class="prefix"
                        >Please input your hours for {{ weekNumberToString(weekNumber, yearNumber) }}
                    </span>
                    <div class="declaration-inputs prefix">
                        <HoursForm
                            deletable
                            :model-value="weeklyDeclaration"
                            @update:model-value="(index, value) => (weeklyDeclaration[index].hours = value)"
                            @remove="
                                (projectId, _) => {
                                    () => {
                                        const userId = userStore.userIdGetter;
                                        if (userId !== undefined) {
                                            declarationStore.setFavorite(projectId, false, userId);
                                        }
                                    };
                                }
                            "
                        />
                        <div class="icon-with-text">
                            <AddOutlineIcon
                                clickable
                                @click="
                                    (event) => {
                                        event.stopPropagation();
                                        addFavoritesModal = true;
                                    }
                                "
                            />
                            <span class="prefix align-center italic">add a project to favorites</span>
                        </div>
                        <div class="divider" />
                        <div class="table-raw-container">
                            <span class="prefix align-center">Total</span>
                            <div class="prefix">
                                <span :class="{ 'error-validation': sumProjectHours > 35 }">{{ sumProjectHours }}</span>
                                <span> / 35</span>
                            </div>
                        </div>
                        <div class="table-raw-gap" />
                        <div class="table-raw-container-2">
                            <span class="prefix">Commentary (optional)</span>
                            <fluent-text-area v-model="comment" />
                        </div>
                        <div class="table-raw-gap" />
                        <div class="footer-buttons">
                            <BaseButton
                                accent
                                :disabled="sumProjectHours != 35 || loading"
                                @click="confirmationModal = true"
                            >
                                <template #default> <span> Validate</span> </template>
                                <template v-if="loading" #start>
                                    <fluent-progress-ring style="width: 14px; height: 14px; stroke: lightblue" />
                                </template>
                            </BaseButton>
                        </div>
                    </div>
                </div>
                <!-- DAILY METHOD -->
                <div v-else class="declaration-container column-flex">
                    <span class="prefix sub-title">Week {{ weekNumber }}</span>
                    <span class="prefix"
                        >Please input your hours for {{ weekNumberToString(weekNumber, yearNumber) }}
                    </span>

                    <div class="table-vertical">
                        <div class="table-legend">
                            <span class="table-cell"></span>
                            <span
                                v-for="declaration in declarationStore.getElementaryDeclaration"
                                :key="declaration.projectId"
                                class="table-cell"
                            >
                                <DeleteOutlineIcon
                                    clickable
                                    @click="
                                        () => {
                                            const userId = userStore.userIdGetter;
                                            if (userId !== undefined) {
                                                declarationStore.setFavorite(declaration.projectId, false, userId);
                                            }
                                        }
                                    "
                                />
                                <span>{{ declaration.name }}</span></span
                            >
                        </div>
                        <div
                            v-for="day in workDayKeys"
                            :key="day"
                            class="table-column"
                            @click="(event:MouseEvent) => {
            router.push({name: 'dayDeclaration', params: {...route.params, day: day}, query: route.query})
            event.stopPropagation()
          }"
                        >
                            <span class="table-cell">{{ workDays[day] }}</span>
                            <span
                                v-for="declaration in dailyDeclarationHours[day]"
                                :key="declaration.name"
                                class="table-cell"
                            >
                                {{ declaration.hours }}
                            </span>
                        </div>
                    </div>
                    <div class="icon-with-text">
                        <AddOutlineIcon
                            clickable
                            @click="
                                (event: Event) => {
                                    event.stopPropagation();
                                    addFavoritesModal = true;
                                }
                            "
                        />
                        <span class="prefix align-center italic">add a project to favorites</span>
                    </div>
                    <div class="divider" />
                    <div class="table-raw-container">
                        <span class="prefix align-center">Total</span>
                        <div class="prefix">
                            <span :class="{ 'error-validation': sumProjectHours > 35 }">{{ sumProjectHours }}</span>
                            <span> / 35</span>
                        </div>
                    </div>
                    <div class="table-raw-gap" />
                    <div class="table-raw-container-2">
                        <span class="prefix">Commentary (optional)</span>
                        <fluent-text-area v-model="comment" />
                    </div>
                    <div class="table-raw-gap" />
                    <div class="footer-buttons">
                        <BaseButton
                            accent
                            :disabled="sumProjectHours != 35 || loading"
                            @click="confirmationModal = true"
                        >
                            <template #default> <span> Validate</span> </template>
                            <template v-if="loading" #start>
                                <fluent-progress-ring style="width: 14px; height: 14px; stroke: lightblue" />
                            </template>
                        </BaseButton>
                    </div>
                </div>
            </template>
            <template v-else>
                <div>Oh ! There is something wrong with the declaration week</div>
            </template>
        </div>
    </div>
    <ModalAddFavorites v-if="addFavoritesModal" @close="addFavoritesModal = false" />
    <DeclConfirmationModal
        v-if="yearNumber !== undefined && weekNumber !== undefined && confirmationModal"
        :comment="comment"
        :declaration="weeklyDeclaration"
        :year="yearNumber"
        :week-number="weekNumber"
        :user-id="userId"
        :close-route="route"
    />
    <ModalHoursView
        v-if="userId !== undefined && dayNumber !== undefined && yearNumber !== undefined && weekNumber !== undefined"
        :day="dayNumber"
        :year="yearNumber"
        :week="weekNumber"
        :user-id="userId"
        :day-declaration="dailyDeclarationHours[dayNumber]"
        @close="
            () => {
                refreshbufferValues(weekNumber, yearNumber, userId);
                router.push({ name: 'declarationDate', query: route.query });
            }
        "
    />
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import ArrowPreviousIcon from "@/components/icons/ArrowPreviousIcon.vue";
import { useRoute, useRouter, type RouteLocationNormalizedLoaded, type Router } from "vue-router";
import HoursForm from "@/components/input_hours/HoursForm.vue";
import { weekNumberToString } from "@/utilities/main";
import BaseTooltip from "@/components/BaseTooltip.vue";
import {
    inputMethods,
    inputMethodKeys,
    type DeclarationInput,
    type InputMethod,
    workDayKeys,
    workDays,
    type DailyDeclaration,
    type days,
} from "@/typing";
import { useUserStore } from "@/stores/userStore";
import { useDeclarationStore } from "@/stores/declarationStore";
import DeleteOutlineIcon from "@/components/icons/DeleteOutlineIcon.vue";
import AddOutlineIcon from "@/components/icons/AddOutlineIcon.vue";
import ModalAddFavorites from "@/assets/modals/ModalAddFavorites.vue";
import { hoursRegistration } from "@/API/requests";
import BaseButton from "@/components/BaseButton.vue";
import { useGlobalStore } from "@/stores/globalStore";
import { initialization } from "@/utilities/initialization";
import { getBufferTable } from "@/API/requests";
import DeclConfirmationModal from "@/components/DeclConfirmationModal.vue";
import { cloneDeep } from "lodash";
import { useProjectStore } from "../../stores/projectStore";
import { rawBuffersToDailyDeclaration } from "@/API/conversions";
import ModalHoursView from "@/views/declaration/ModalHoursView.vue";
import { dayValidation } from "../../utilities/main";

const addFavoritesModal = ref(false);
const router: Router = useRouter();
const route: RouteLocationNormalizedLoaded = useRoute();
const globalstore = useGlobalStore();
const userStore = useUserStore();
const declarationStore = useDeclarationStore();
const weekNumber = computed<number | undefined>(() => {
    return Array.isArray(route.params.week)
        ? undefined
        : Number.isNaN(Number(route.params.week))
        ? undefined
        : Number(route.params.week);
});
const yearNumber = computed<number | undefined>(() => {
    return Array.isArray(route.params.year)
        ? undefined
        : Number.isNaN(Number(route.params.year))
        ? undefined
        : Number(route.params.year);
});
const dayNumber = computed<days | undefined>(() => {
    return dayValidation(route.params.day);
});
const confirmationModal = ref<boolean>(false);
const comment = ref<string | undefined>();
const userId = userStore.userIdGetter;
if (userId === undefined) throw Error("no user Logged");

const weeklyDeclaration = ref<DeclarationInput[]>(declarationStore.getElementaryDeclaration);

const dailyDeclarationHours = ref<DailyDeclaration>([
    cloneDeep(declarationStore.getElementaryDeclaration),
    cloneDeep(declarationStore.getElementaryDeclaration),
    cloneDeep(declarationStore.getElementaryDeclaration),
    cloneDeep(declarationStore.getElementaryDeclaration),
    cloneDeep(declarationStore.getElementaryDeclaration),
]);
const projectStore = useProjectStore();
const defaultDeclaration = computed<DeclarationInput[]>(() => declarationStore.getElementaryDeclaration);
const loading = ref<boolean>(false);
function refreshbufferValues(week: number | undefined, year: number | undefined, userID: number) {
    if (week !== undefined && year !== undefined) {
        getBufferTable(userID, week, year).then((value) => {
            dailyDeclarationHours.value = rawBuffersToDailyDeclaration(
                value.data,
                dailyDeclarationHours.value,
                week,
                year
            );
        });
    }
}
refreshbufferValues(weekNumber.value, yearNumber.value, userId);
watch(defaultDeclaration, (value) => {
    const newDeclaration = value;
    newDeclaration.forEach((val) => {
        const index = weeklyDeclaration.value.findIndex((dec) => dec.projectId === val.projectId);
        if (index != -1) {
            val.hours = weeklyDeclaration.value[index].hours;
        }
    });
    weeklyDeclaration.value = newDeclaration;
});

const methodSelected = ref<InputMethod>(
    route.query.method === "weekly" ? "weekly" : route.query.method === "daily" ? "daily" : "weekly"
);

watch(methodSelected, (method) => {
    router.push({ path: route.path, query: { ...route.query, method: method } });
});

const sumProjectHours = computed<number>(() => {
    let total: number = 0;
    if (methodSelected.value === "weekly") {
        weeklyDeclaration.value.forEach((declaration) => {
            total += Number(declaration.hours);
        });
    } else if (methodSelected.value === "daily") {
        total += dailyDeclarationHours.value[0].reduce<number>((sum, declaration) => {
            return sum + declaration.hours;
        }, 0);
        total += dailyDeclarationHours.value[1].reduce<number>((sum, declaration) => {
            return sum + declaration.hours;
        }, 0);
        total += dailyDeclarationHours.value[2].reduce<number>((sum, declaration) => {
            return sum + declaration.hours;
        }, 0);
        total += dailyDeclarationHours.value[3].reduce<number>((sum, declaration) => {
            return sum + declaration.hours;
        }, 0);
        total += dailyDeclarationHours.value[4].reduce<number>((sum, declaration) => {
            return sum + declaration.hours;
        }, 0);
        return total;
    }
    return total;
});
const getDailyDeclarationToWeekly = computed<DeclarationInput[]>(() => {
    const declarationInput: DeclarationInput[] = cloneDeep(declarationStore.getElementaryDeclaration);
    dailyDeclarationHours.value[0].forEach((declaration, index) => {
        declarationInput[index].hours += declaration.hours;
    }, 0);
    dailyDeclarationHours.value[1].forEach((declaration, index) => {
        declarationInput[index].hours += declaration.hours;
    }, 0);
    dailyDeclarationHours.value[2].forEach((declaration, index) => {
        declarationInput[index].hours += declaration.hours;
    }, 0);
    dailyDeclarationHours.value[3].forEach((declaration, index) => {
        declarationInput[index].hours += declaration.hours;
    }, 0);
    dailyDeclarationHours.value[4].forEach((declaration, index) => {
        declarationInput[index].hours += declaration.hours;
    }, 0);
    return declarationInput;
});
const favorites = computed<Set<number>>(() => declarationStore.favorites);
watch(favorites.value, (newValue) => {
    projectStore.projects.forEach((project) => {
        if (newValue.has(project.id)) {
            if (dailyDeclarationHours.value[0].findIndex((decl) => decl.projectId === project.id) === -1) {
                dailyDeclarationHours.value[0].push({ hours: 0, projectId: project.id, name: project.name });
                dailyDeclarationHours.value[1].push({ hours: 0, projectId: project.id, name: project.name });
                dailyDeclarationHours.value[2].push({ hours: 0, projectId: project.id, name: project.name });
                dailyDeclarationHours.value[3].push({ hours: 0, projectId: project.id, name: project.name });
                dailyDeclarationHours.value[4].push({ hours: 0, projectId: project.id, name: project.name });
            } else {
                // throw new Error("project has not been found");
            }
        }
    });
    dailyDeclarationHours.value[0].forEach((decl, i) => {
        if (!newValue.has(decl.projectId)) {
            dailyDeclarationHours.value[0].splice(i, 1);
            dailyDeclarationHours.value[1].splice(i, 1);
            dailyDeclarationHours.value[2].splice(i, 1);
            dailyDeclarationHours.value[3].splice(i, 1);
            dailyDeclarationHours.value[4].splice(i, 1);
        }
    });
});
async function validateDeclaration() {
    loading.value = true;
    globalstore.notification.display = false;
    let sendedDeclaration: DeclarationInput[] | undefined;
    if (methodSelected.value === "daily") {
        sendedDeclaration = getDailyDeclarationToWeekly.value;
    } else if (methodSelected.value === "weekly") {
        sendedDeclaration = weeklyDeclaration.value;
    } else {
        throw Error("no input method Selected");
    }
    if (weekNumber.value !== undefined && yearNumber.value !== undefined && userStore.userIdGetter !== undefined) {
        const response = await hoursRegistration(
            sendedDeclaration,
            userStore.userIdGetter,
            weekNumber.value,
            yearNumber.value,
            comment.value
        );
        if (response.status !== 200) {
            globalstore.notification.content = "Oh no, an orror occured with the request. Please contact IT team.";
            globalstore.notification.type = "FAILURE";
            globalstore.notification.display = true;
        } else {
            globalstore.notification.content = "Declaration has been registered";
            globalstore.notification.type = "SUCCESS";
            globalstore.notification.display = true;
            router.push({ name: "declaration", query: route.query });
        }
        initialization();
    }
    loading.value = false;
}
const valideRoute = computed<boolean>(
    () =>
        declarationStore.weeksDeclared.every((week) => week.week !== weekNumber.value || week.year !== yearNumber.value) // BE CAREFULL CAN MAKE THE PAGE TOO LONG TO DISPLAY
);
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
    box-shadow: 0 2px 4px #00000024, 0 0 2px #0000001f;
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
    width: 100%;
}

.align-center {
    height: min-content;
    align-self: center;
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
    min-width: 100px;
}

.table-vertical {
    display: grid;
    grid-template-columns: 2fr repeat(5, 1fr);
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
    background-color: #f5f5f5;
}

.table-cell {
    padding: 0 8px;
    min-height: 44px;
    display: flex;
    align-items: center;
    gap: 4px;
}
</style>
