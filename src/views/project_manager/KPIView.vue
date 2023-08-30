<template>
    <div class="page-container">
        <h1 class="title">KPI</h1>
        <h2 v-if="project !== undefined">
            <RouterLink
                class="project-link"
                :to="{ name: 'project', query: route.query, params: { projectId: projectId } }"
            >
                <span>{{ project.name }}</span>
                <span style="font-weight: 400; margin-left: 15px">{{ project.code }}</span>
            </RouterLink>
        </h2>
        <div v-else style="display: flex; align-items: center; gap: 13px">
            <span
                >To display performance indicators for the project of your choice, please select it at the top of the
                window.</span
            >
            <img src="@/assets/icons/slightly-smiling-face.png" alt="Slightly Smiling Face" width="60" height="60" />
        </div>
        <br />
        <div style="display: flex; gap: 15px; flex-wrap: wrap; margin-top: 20px">
            <div v-for="(graph, index) in graphsInfo" :key="graph.id">
                <div
                    v-show="projectId !== undefined"
                    :id="graph.id"
                    class="graph-container"
                    :style="{ minWidth: graph.minWidth, minHeight: graph.minHeight }"
                    @drop="(event) => onDropHandler(event, index)"
                >
                    <DragIcon
                        style="position: absolute; bottom: 5px; left: 10px; z-index: 1"
                        draggable="true"
                        class="drag"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import * as echarts from "echarts/core";
import { computed, ref, watch, onMounted } from "vue";
import { cloneDeep } from "lodash";
import { type chartType } from "@/typing";
import { getKPI } from "@/API/kpi_requests";
import { useRoute } from "vue-router";
import { type Project } from "@/typing/project";
import { useProjectStore } from "../../stores/projectStore";
import type { ECOption } from "@/main";
import DragIcon from "@/components/icons/DragIcon.vue";

const route = useRoute();
const projectStore = useProjectStore();

const options = ref<Record<string, ECOption>>({
    barOption: {
        xAxis: {},
        yAxis: {
            data: ["Time spent"],
        },
        toolbox: {
            feature: {
                saveAsImage: {},
                dataView: {},
            },
        },
        tooltip: {
            trigger: undefined,
        },
        grid: {
            top: "30%",
            containLabel: true,
        },
        legend: {
            top: "14%",
        },
        title: { text: "TDE by project phase" },
        series: [],
    },
    lineOption: {
        title: {
            text: "Total hours spent",
        },
        tooltip: {
            trigger: "axis",
        },
        grid: {
            right: "4%",
            bottom: "3%",
            containLabel: true,
        },
        toolbox: {
            feature: {
                saveAsImage: {},
                dataView: {},
            },
        },
        xAxis: {
            type: "category",
            boundaryGap: false,
            data: ["Feb 22", "Mar 22", "Apr 22", "Mai 22", "Jun 22", "Jul 22", "Aug 22"],
        },
        yAxis: {
            type: "value",
        },
        series: [
            {
                name: "Spent",
                type: "line",
                data: [0, 14, 25, 30, 60, 85, 103],
            },
        ],
    },
    TDEDomainPieOption: {
        title: {
            text: "TDE by Domain",
            left: "center",
        },
        tooltip: {
            trigger: "item",
        },
        toolbox: {
            feature: {
                saveAsImage: {},
                dataView: {},
            },
        },
        series: [
            {
                name: "Domain   hours",
                type: "pie",
                radius: "50%",

                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)",
                    },
                },
            },
        ],
    },
});

const graphsInfo = ref<
    {
        id: string;
        minWidth: string;
        minHeight: string;
        defaultWidth?: string;
        defaultHeight?: string;
        option: "barOption" | "lineOption" | "TDEDomainPieOption";
        fetch_uri?: string;
        type: chartType;
    }[]
>([
    {
        id: "lineChart",
        minWidth: "600px",
        minHeight: "300px",
        option: "lineOption",
        type: "line",
        fetch_uri: `kpi/line/hour_expenditure`,
    },
    {
        id: "pieChart",
        minWidth: "400px",
        minHeight: "300px",
        option: "TDEDomainPieOption",
        type: "pie",
        fetch_uri: "kpi/pie/hours_by_domain",
    },
    {
        id: "barChart",
        minWidth: "600px",
        minHeight: "300px",
        defaultWidth: "1070px",
        option: "barOption",
        type: "bar",
        fetch_uri: "kpi/stackedbar/hour_expenditure_by_project",
    },
]);

const projectId = computed<number | undefined>(() => {
    const pId = Number(route.query.projectId);
    return isNaN(pId) ? undefined : pId;
});

/**
 * route query parsing computed properties
 */

const period = computed<string[] | undefined>(() => {
    const val = route.query.period;
    if (Array.isArray(val) && val.length === 2 && val.every((v) => v !== null)) {
        return val as string[];
    } else {
        return undefined;
    }
});

const unit = computed<string>(() => {
    const u = route.query.unit;
    if (u !== "hours" && u !== "TDE" && u !== "cost") {
        return "h";
    } else {
        return u === "hours" ? "h" : u;
    }
});

const cummulated = computed<string>(() => {
    const u = route.query.cummulated;
    if (u !== "monthly" && u !== "cummulated") {
        return "cummulated";
    } else {
        return u;
    }
});
const project = computed<Project | undefined>(() => {
    return projectStore.projects.find((p) => p.id === projectId.value);
});

watch([projectId, unit, period, cummulated], ([pId]) => {
    if (pId !== undefined) {
        graphUpdate();
    }
});

function graphUpdate() {
    graphsInfo.value.forEach(async (graphInfo) => {
        const graph = document.getElementById(graphInfo.id);
        if (graph !== null) {
            let chartE: echarts.ECharts;
            const chartE2 = echarts.getInstanceByDom(graph);
            chartE = chartE2 === undefined ? echarts.init(graph) : chartE2;
            if (graphInfo.defaultWidth) {
                graph.style.width = graphInfo.defaultWidth;
            }
            if (graphInfo.defaultHeight) {
                graph.style.height = graphInfo.defaultHeight;
            }
            if (graphInfo.fetch_uri) {
                const query: Record<string, string | number | undefined | boolean> = {};
                if (period.value !== undefined) {
                    query.month1 = Number(period.value[0].split("-")[0]) + 1;
                    query.year1 = Number(period.value[0].split("-")[1]);
                    query.month2 = Number(period.value[1].split("-")[0]) + 1;
                    query.year2 = Number(period.value[1].split("-")[1]);
                }
                query.project_id = project.value?.id;
                query.cumulative = cummulated.value === "cummulated";
                query.unit = unit.value;
                const updatedOptions = await getKPI(graphInfo.type, graphInfo.fetch_uri, query);
                options.value[graphInfo.option] = {
                    ...options.value[graphInfo.option],
                    ...updatedOptions,
                };
            }
            chartE.setOption(options.value[graphInfo.option], true);
            graph.addEventListener("dragstart", function (event) {
                event.dataTransfer?.setData("text/plain", this.id);
                const crt = this;
                // crt.style.opacity = "0.5";
                event.dataTransfer?.setDragImage(crt, 0, 0);
            });
            graph.addEventListener("dragenter", (event) => {
                event.preventDefault();
            });
            graph.addEventListener("dragover", function (event) {
                event.preventDefault();
                // this.style.opacity = "1";
            });
            const resizeObserver = new ResizeObserver(() => {
                chartE?.resize();
            });
            resizeObserver.observe(graph);
        }
    });
}

function onDropHandler(event: DragEvent, j: number) {
    const i = graphsInfo.value.findIndex((graph) => {
        return graph.id === event.dataTransfer?.getData("text/plain");
    });
    if (!isNaN(i) && i < graphsInfo.value.length) {
        const cloneObj = cloneDeep(graphsInfo.value[i]);
        graphsInfo.value[i] = graphsInfo.value[j];
        graphsInfo.value[j] = cloneObj;
    }
}

onMounted(() => {
    if (projectId.value !== undefined) {
        graphUpdate();
    }
});
</script>
<style scoped>
.graph-container {
    padding: 10px;
    border-radius: 15px 15px 0 15px;
    border: 1px rgb(243, 243, 243) solid;
    resize: both;
    overflow: hidden;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 0px 2px 0px, rgba(0, 0, 0, 0.14) 0px 2px 4px 0px;
}

.drag:hover {
    cursor: grab;
    cursor: -moz-grab;
    cursor: -webkit-grab;
}

.project-link {
    text-decoration: none;
}

.project-link:hover {
    color: #0078d4;
}
</style>
