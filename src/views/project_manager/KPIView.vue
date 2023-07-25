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
        text: "Forecast",
    },
    tooltip: {
        trigger: "axis",
    },
    legend: {
        data: ["Email", "Union Ads", "Video Ads", "Direct", "Search Engine"],
    },
    grid: {
        left: "3%",
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
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
        type: "value",
    },
    series: [
        {
            name: "Email",
            type: "line",
            stack: "Total",
            data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
            name: "Union Ads",
            type: "line",
            stack: "Total",
            data: [220, 182, 191, 234, 290, 330, 310],
        },
        {
            name: "Video Ads",
            type: "line",
            stack: "Total",
            data: [150, 232, 201, 154, 190, 330, 410],
        },
        {
            name: "Direct",
            type: "line",
            stack: "Total",
            data: [320, 332, 301, 334, 390, 330, 320],
        },
        {
            name: "Search Engine",
            type: "line",
            stack: "Total",
            data: [820, 932, 901, 934, 1290, 1330, 1320],
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
