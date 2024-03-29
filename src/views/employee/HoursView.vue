<template>
    <div class="page-container">
        <div class="column-container">
            <div class="flex-space-between">
                <span>
                    <ArrowPreviousIcon
                        class="clickable-icon"
                        style="vertical-align: middle"
                        @click="() => router.push({ name: 'declaration', query: route.query })"
                    />
                    <span class="sub-title" style="vertical-align: middle; margin-left: 10px">Declaration</span>
                </span>
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
                            @update:model-value="
                                (key, index, value) => {
                                    if (key === 'domain') {
                                        weeklyDeclaration[index].domain = stringToDomain(value.toString());
                                    } else if (key === 'hours') {
                                        weeklyDeclaration[index].hours = Number(value);
                                    }
                                }
                            "
                            @remove="
                                (projectId, _) => {
                                    const userId = userStore.userIdGetter;
                                    if (userId !== undefined) {
                                        declarationStore.setFavorite(projectId, false, userId);
                                    }
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
                                <span>{{ sumProjectHours }}</span>
                            </div>
                        </div>
                        <div class="table-raw-gap" />
                        <div class="table-raw-container-2">
                            <span class="prefix">Comment (optional)</span>
                            <fluent-text-area v-model="comment" />
                        </div>
                        <div class="table-raw-gap" />
                        <div class="footer-buttons">
                            <BaseButton accent @click="confirmationModal = true">
                                <span> {{ isNewDeclaration ? "Validate" : "Change declaration" }}</span>
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
                            <span class="table-cell-left"></span>
                            <span
                                v-for="declaration in declarationStore.elementaryDeclarationGetter"
                                :key="declaration.projectId"
                                class="table-cell-left"
                            >
                                <DeleteOutlineIcon
                                    v-if="declaration.projectId !== 186"
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
                                <span>{{ declaration.name }} </span></span
                            >
                        </div>
                        <div
                            v-for="day in dayNumbers"
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
                                {{ declaration.hours === 0 ? "" : declaration.hours }}
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
                            <span>{{ sumProjectHours }}</span>
                        </div>
                    </div>
                    <div class="table-raw-gap" />
                    <div class="table-raw-container-2">
                        <span class="prefix">Comment (optional)</span>
                        <fluent-text-area v-model="comment" />
                    </div>
                    <div class="table-raw-gap" />
                    <div class="footer-buttons">
                        <BaseButton accent @click="confirmationModal = true">
                            <span> {{ isNewDeclaration ? "Validate" : "Change declaration" }}</span>
                        </BaseButton>
                    </div>
                </div>
            </template>
            <template v-else>
                <p>There is a problem with this declaration date.</p>
                <img
                    src="@/assets/icons/neutral-face.png"
                    alt="Neutral Face"
                    width="60"
                    height="60"
                    style="margin-left: 130px"
                />
            </template>
        </div>
    </div>
    <ModalAddFavorites v-if="addFavoritesModal" @close="addFavoritesModal = false" />
    <DeclConfirmationModal
        v-if="yearNumber !== undefined && weekNumber !== undefined && confirmationModal"
        :comment="comment"
        :declaration="currentDeclaration"
        :year="yearNumber"
        :week-number="weekNumber"
        :close-route="route"
        :confirmation="true"
        :loading="loading"
        @close="confirmationModal = false"
        @confirm="validateDeclaration"
    />
    <ModalHoursView
        v-if="
            userId !== undefined &&
            dayNumber !== undefined &&
            yearNumber !== undefined &&
            weekNumber !== undefined &&
            valideRoute
        "
        :day="dayNumber"
        :year="yearNumber"
        :week="weekNumber"
        :user-id="userId"
        :day-declaration="dailyDeclarationHours[dayNumber]"
        @close="
            () => {
                refreshBufferValues(weekNumber, yearNumber, userId);
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
import BaseTooltip from "@/components/base/BaseTooltip.vue";
import {
    inputMethods,
    inputMethodKeys,
    type DeclarationInput,
    type InputMethod,
    dayNumbers,
    workDays,
    type DailyDeclaration,
    type dayNb,
    type SimplifiedResponse,
} from "@/typing";
import { useUserStore } from "@/stores/userStore";
import { useDeclarationStore } from "@/stores/declarationStore";
import DeleteOutlineIcon from "@/components/icons/DeleteOutlineIcon.vue";
import AddOutlineIcon from "@/components/icons/AddOutlineIcon.vue";
import ModalAddFavorites from "@/assets/modals/ModalAddFavorites.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import { getBufferTable, hoursRegistration, hoursModification } from "@/API/requests";
import DeclConfirmationModal from "@/components/modals/DeclConfirmationModal.vue";
import { cloneDeep } from "lodash";
import { rawBuffersToDailyDeclaration, stringToDomain } from "@/typing/conversions";
import ModalHoursView from "@/views/employee/ModalHoursView.vue";
import { dayValidation } from "../../utilities/main";
import dayjs from "dayjs";
import { useGlobalStore } from "@/stores/globalStore";
import { initialization } from "@/utilities/initialization";

const router: Router = useRouter();
const route: RouteLocationNormalizedLoaded = useRoute();

const globalStore = useGlobalStore();
const declarationStore = useDeclarationStore();

const addFavoritesModal = ref(false);
const userStore = useUserStore();
const isNewDeclaration = computed(() => {
    return !declarationStore.weeksDeclared.some(
        (week) => week.week === weekNumber.value && week.year === yearNumber.value
    );
});

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
const dayNumber = computed<dayNb | undefined>(() => {
    return dayValidation(route.params.day);
});

const confirmationModal = ref<boolean>(false);
const comment = ref<string | undefined>();
const weeklyDeclaration = ref<DeclarationInput[]>(cloneDeep(declarationStore.elementaryDeclarationGetter));

const userId = userStore.userIdGetter;
if (userId === undefined) throw Error("no user Logged");

if (
    !isNewDeclaration.value &&
    weekNumber.value !== undefined &&
    yearNumber.value !== undefined &&
    userStore.userIdGetter !== undefined
) {
    declarationStore
        .getDeclaration(yearNumber.value, weekNumber.value, userStore.userIdGetter)
        .then((resp) => (weeklyDeclaration.value = resp));
}
const currentDeclaration = computed<DeclarationInput[]>(() => {
    let declaration: DeclarationInput[] = [];
    if (methodSelected.value === "daily") {
        dailyDeclarationHours.value[0].forEach((decl, index) =>
            declaration.push({
                hours:
                    dailyDeclarationHours.value[0][index].hours +
                    dailyDeclarationHours.value[1][index].hours +
                    dailyDeclarationHours.value[2][index].hours +
                    dailyDeclarationHours.value[3][index].hours +
                    dailyDeclarationHours.value[4][index].hours,
                name: decl.name,
                projectId: decl.projectId,
                projectCode: decl.projectCode,
                domain: decl.domain,
            })
        );
    } else if (methodSelected.value === "weekly") {
        declaration = weeklyDeclaration.value;
    }
    return declaration;
});
const valideRoute = computed(() => {
    const dayjsDate = dayjs(userStore.user?.firstDeclarationDay);
    return (
        (yearNumber.value !== undefined && dayjsDate.get("year") < yearNumber.value) ||
        (weekNumber.value !== undefined &&
            dayjsDate.get("year") === yearNumber.value &&
            dayjsDate.week() <= weekNumber.value)
    );
});

const dailyDeclarationHours = ref<DailyDeclaration>([
    cloneDeep(declarationStore.elementaryDeclarationGetter),
    cloneDeep(declarationStore.elementaryDeclarationGetter),
    cloneDeep(declarationStore.elementaryDeclarationGetter),
    cloneDeep(declarationStore.elementaryDeclarationGetter),
    cloneDeep(declarationStore.elementaryDeclarationGetter),
]);
const defaultDeclarationHours = computed<DailyDeclaration>(() => [
    cloneDeep(declarationStore.elementaryDeclarationGetter),
    cloneDeep(declarationStore.elementaryDeclarationGetter),
    cloneDeep(declarationStore.elementaryDeclarationGetter),
    cloneDeep(declarationStore.elementaryDeclarationGetter),
    cloneDeep(declarationStore.elementaryDeclarationGetter),
]);
const defaultDeclaration = computed<DeclarationInput[]>(() => cloneDeep(declarationStore.elementaryDeclarationGetter));
const loading = ref<boolean>(false);
function refreshBufferValues(week: number | undefined, year: number | undefined, userID: number) {
    if (week !== undefined && year !== undefined) {
        getBufferTable(userID, week, year).then((value) => {
            dailyDeclarationHours.value = rawBuffersToDailyDeclaration(
                value.data,
                defaultDeclarationHours.value,
                week,
                year
            );
        });
    }
}
refreshBufferValues(weekNumber.value, yearNumber.value, userId);
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

const favorites = computed<Set<number>>(() => declarationStore.favorites);
watch(favorites.value, () => {
    refreshBufferValues(weekNumber.value, yearNumber.value, userId);
});

async function validateDeclaration() {
    if (userId !== undefined && weekNumber.value !== undefined && yearNumber.value !== undefined) {
        loading.value = true;
        globalStore.notification.display = false;
        let response: SimplifiedResponse<any>;
        if (isNewDeclaration.value === true) {
            response = await hoursRegistration(
                currentDeclaration.value,
                userId,
                weekNumber.value,
                yearNumber.value,
                comment.value
            );
        } else {
            response = await hoursModification(
                currentDeclaration.value,
                userId,
                weekNumber.value,
                yearNumber.value,
                comment.value
            );
        }
        if (response.status !== 200) {
            globalStore.notification.content = "Oh no, an orror occured with the request. Please contact IT team.";
            globalStore.notification.type = "FAILURE";
            globalStore.notification.display = true;
        } else {
            globalStore.notification.content = "Declaration has been registered";
            globalStore.notification.type = "SUCCESS";
            globalStore.notification.display = true;
            router.push({ name: "declaration" });
        }
        initialization();
        loading.value = false;
    } else {
        console.warn("userId was not provided");
    }
}
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
    margin-top: 10px;
    border: 1px solid #d1d1d1;
    border-radius: 4px;
    background-color: white;
    padding: 14px 44px 20px 30px;

    color: #242424;
    box-shadow: 0 2px 4px #00000024, 0 0 2px #0000001f;
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
    width: 100%;
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

.table-cell-left {
    padding: 0 8px;
    min-height: 44px;
    display: flex;
    align-items: center;
    gap: 4px;
}

.table-cell {
    min-height: 44px;
    display: flex;
    align-items: center;
    gap: 4px;
    margin: 0 auto;
}
</style>
