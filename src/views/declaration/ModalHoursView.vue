<template>
    <Teleport to=".global">
        <div class="modal">
            <div
                v-clickOutside="
                    () =>
                        router.push({
                            name: 'declarationDate',
                            query: route.query,
                            params: { year: route.params.year, week: route.params.week },
                        })
                "
                class="modal-container"
            >
                <HoursForm
                    :model-value="declaration"
                    @remove="(projectId) => userStore.setFavorite(projectId, false)"
                    @update:model-value="(index, value) => (declaration[index].hours = value)"
                />
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import HoursForm from "@/components/input_hours/HoursForm.vue"
import { useUserStore } from "@/stores/user"
import type { DeclarationInput } from "@/typing"
import { useRoute, useRouter } from "vue-router"
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const declaration: DeclarationInput[] = userStore.dailyHoursSpend[route.params.day]
</script>
