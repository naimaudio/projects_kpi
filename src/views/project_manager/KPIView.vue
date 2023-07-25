<template>
    <div class="page-container">
        <h1 class="title">KPI</h1>
        <div id="barChart" style="display: block, width: 500px; height: 300px"></div>
        <div id="lineChart" style="display: block, width: 500px; height: 600px"></div>
    </div>
</template>
<script setup lang="ts">
import * as echarts from "echarts/core";
import { onMounted } from "vue";

const barOption = {
    xAxis: {},
    yAxis: {
        data: ["Forecast", "Reality"],
    },
    legend: {
        data: ["NPI", "DMU", "POC/PF", "ES", "EVT", "DVT", "PVT", "STOP"],
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
};

const lineOption = {
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
};
onMounted(() => {
    const stackedBarChart = echarts.init(document.getElementById("barChart"));
    stackedBarChart.setOption(barOption);
    const stackedLineChart = echarts.init(document.getElementById("lineChart"));
    stackedLineChart.setOption(lineOption);
});
</script>
