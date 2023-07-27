<template>
    <div class="page-container">
        <h1 class="title">KPI</h1>
        <div id="drop-target" style="display: flex; gap: 5px; flex-wrap: wrap">
            <div
                v-for="(graph, index) in graphs"
                :id="graph.id"
                :key="graph.id"
                class="graph-container"
                :style="{ minWidth: graph.minWidth, minHeight: graph.minHeight }"
                draggable="true"
                @drop="(event) => onDropHandler(event, index)"
            ></div>
        </div>
    </div>
</template>
<script setup lang="ts">
import * as echarts from "echarts/core";
import { onMounted, ref } from "vue";
import { cloneDeep } from "lodash";

const options = {
    barOption: {
        xAxis: {},
        yAxis: {
            data: ["Forecast", "Reality"],
        },
        grid: {
            top: "30%",
            containLabel: true,
        },
        legend: {
            data: ["NPI", "DMU", "POC/PF", "ES", "EVT", "DVT", "PVT", "STOP"],
            top: "14%",
        },
        title: { text: "TDE by project phase" },
        series: [
            {
                data: [10, 22],
                name: "NPI",
                stack: "y",
                type: "bar",
            },
            {
                data: [5, 4],
                name: "DMU",
                stack: "y",
                type: "bar",
            },
            {
                data: [5, 4],
                name: "POC/PF",
                stack: "y",
                type: "bar",
            },
            {
                data: [5, 4],
                name: "ES",
                stack: "y",
                type: "bar",
            },
            {
                data: [5, 4],
                name: "EVT",
                stack: "y",
                type: "bar",
            },

            {
                data: [5, 4],
                name: "DVT",
                stack: "y",
                type: "bar",
            },

            {
                data: [5, 4],
                name: "PVT",
                stack: "y",
                type: "bar",
            },
            {
                data: [5, 4],
                name: "STOP",
                stack: "y",
                type: "bar",
            },
        ],
    },
    lineOption: {
        title: {
            text: "Total TDE",
        },
        tooltip: {
            trigger: "axis",
        },
        legend: {
            data: ["Spend", "Forecast"],
        },
        grid: {
            right: "4%",
            bottom: "3%",
            containLabel: true,
        },
        toolbox: {
            feature: {
                saveAsImage: {},
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
                name: "Spend",
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
    pieOption: {
        title: {
            text: "TDE by Domain",
            subtext: "Fake Data",
            left: "center",
        },
        tooltip: {
            trigger: "item",
        },

        series: [
            {
                name: "Access From",
                type: "pie",
                radius: "50%",
                data: [
                    { value: 1048, name: "Tests" },
                    { value: 735, name: "Mechanics" },
                    { value: 580, name: "Acoustics" },
                    { value: 484, name: "Project Management" },
                    { value: 300, name: "Software" },
                    { value: 300, name: "Hardware" },
                ],
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
};
const graphs = ref<
    {
        id: string;
        minWidth: string;
        minHeight: string;
        defaultWidth?: string;
        defaultHeight?: string;
        option: "barOption" | "lineOption" | "pieOption";
    }[]
>([
    { id: "barChart", minWidth: "600px", minHeight: "300px", defaultWidth: "1070px", option: "barOption" },
    { id: "lineChart", minWidth: "600px", minHeight: "300px", option: "lineOption" },
    { id: "pieChart", minWidth: "400px", minHeight: "300px", option: "pieOption" },
]);

// const pieChart = ref<ComponentPublicInstance | null>(null);
onMounted(() => {
    graphs.value.forEach((graphInfo, index) => {
        const graph = document.getElementById(graphInfo.id);
        const chartE = echarts.init(graph);
        if (graph !== null) {
            if (graphInfo.defaultWidth) {
                graph.style.width = graphInfo.defaultWidth;
            }
            if (graphInfo.defaultHeight) {
                graph.style.height = graphInfo.defaultHeight;
            }
            chartE.setOption(options[graphInfo.option]);
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
