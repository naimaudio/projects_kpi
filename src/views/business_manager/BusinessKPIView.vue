<template>
    <div class="page-container">
        <h1 class="title">Business KPI</h1>

        <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-top: 20px">
            <div v-for="(graph, index) in graphs" :key="graph.id">
                <div
                    :id="graph.id"
                    class="graph-container"
                    :style="{ minWidth: graph.minWidth, minHeight: graph.minHeight }"
                    draggable="true"
                    @drop="(event) => onDropHandler(event, index)"
                ></div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import * as echarts from "echarts/core";
import { onMounted, ref } from "vue";
import { cloneDeep } from "lodash";
import { type chartType } from "@/typing";
import { getKPI } from "@/API/kpi_requests";
import type { ECOption } from "@/main";
const options = ref<Record<string, ECOption>>({
    lineOption: {
        title: {
            text: "Total hours spent",
        },
        tooltip: {
            trigger: "axis",
        },
        legend: {
            data: ["Spent", "Forecast"],
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
            {
                name: "Forecast",
                type: "line",
                data: [0, 15, 23, 28, 32, 48, 73],
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

const graphs = ref<
    {
        id: string;
        minWidth: string;
        minHeight: string;
        defaultWidth?: string;
        defaultHeight?: string;
        option: "lineOption" | "TDEDomainPieOption";
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
        fetch_uri: "business_kpi/line/hour_expenditure",
    },
    {
        id: "pieChart",
        minWidth: "400px",
        minHeight: "300px",
        option: "TDEDomainPieOption",
        type: "pie",
        fetch_uri: "business_kpi/pie/hours_by_domain",
    },
]);

// const pieChart = ref<ComponentPublicInstance | null>(null);
onMounted(() => {
    graphs.value.forEach(async (graphInfo) => {
        const graph = document.getElementById(graphInfo.id);
        const chartE = echarts.init(graph);
        if (graph !== null) {
            if (graphInfo.defaultWidth) {
                graph.style.width = graphInfo.defaultWidth;
            }
            if (graphInfo.defaultHeight) {
                graph.style.height = graphInfo.defaultHeight;
            }
            if (graphInfo.fetch_uri) {
                const updatedOptions = await getKPI(graphInfo.type, graphInfo.fetch_uri, { cumulative: true });
                options.value[graphInfo.option] = {
                    ...options.value[graphInfo.option],
                    ...updatedOptions,
                };
            }

            chartE.setOption(options.value[graphInfo.option]);
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
});

const onDropHandler = (event: DragEvent, j: number) => {
    const i = graphs.value.findIndex((graph) => {
        return graph.id === event.dataTransfer?.getData("text/plain");
    });
    if (!isNaN(i) && i < graphs.value.length) {
        const cloneObj = cloneDeep(graphs.value[i]);
        graphs.value[i] = graphs.value[j];
        graphs.value[j] = cloneObj;
    }
};

// getKPI("pie", "TDE_by_domain");
</script>
<style scoped>
.graph-container {
    padding: 30px;
    border-radius: 15px 15px 0 15px;
    border: 4px darkgray solid;
    resize: both;
    overflow: hidden;
}
</style>
