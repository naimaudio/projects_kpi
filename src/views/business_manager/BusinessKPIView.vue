<template>
    <div class="page-container">
        <h1 class="title">Business KPI</h1>

        <div style="display: flex; gap: 15px; flex-wrap: wrap; margin-top: 20px">
            <div v-for="(graph, index) in graphs" :key="graph.id">
                <div
                    :id="graph.id"
                    class="graph-container"
                    :style="{ minWidth: graph.minWidth, minHeight: graph.minHeight }"
                    draggable="true"
                    @drop="(event) => onDropHandler(event, index)"
                >
                    <DragIcon style="position: absolute; bottom: 5px; left: 10px" draggable="true" class="drag" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import * as echarts from "echarts/core";
import { onMounted, ref, computed, watch } from "vue";
import { cloneDeep } from "lodash";
import { type chartType } from "@/typing";
import { getKPI } from "@/API/kpi_requests";
import type { ECOption } from "@/main";
import { useRoute } from "vue-router";
import DragIcon from "@/components/icons/DragIcon.vue";

const route = useRoute();

const options = ref<Record<string, ECOption>>({
    capSummaryOption: {
        title: {
            text: "Capitalization summary",
            left: "center",
        },
        tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
    },
    barCapSummaryOption: {
        title: {
            text: "Capitalization Summary",
        },
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow",
            },
        },
        legend: {},
        grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
        },
        xAxis: {
            type: "value",
            boundaryGap: [0, 0.01],
        },
    },
    lineNonCapSummaryOption: {
        title: {
            text: "Non capitalizable summary",
            left: "center",
        },
        tooltip: {
            trigger: "axis",
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
        yAxis: {
            type: "value",
        },
    },
    lineOption: {
        title: {
            text: "Total hours spent",
        },
        tooltip: {
            trigger: "axis",
        },
        legend: {
            data: ["Spent"],
        },
        grid: {
            right: "4%",
            bottom: "3%",
            containLabel: true,
        },
        toolbox: {
            feature: {
                saveAsImage: {},
                dataView: {
                    optionToContent: function (opt) {
                        let axisData = (opt.xAxis as { data: string[] }[])[0].data;
                        let serie = (opt.series as { data: string[] }[])[0].data;
                        let rows = [["Month", "Value"]];
                        rows = rows.concat(axisData.map((item, i) => [item, serie[i]]));
                        let string = "";
                        rows.forEach((item) => (string += "<p>" + item[0] + "\t" + item[1] + "</p>"));
                        string += "<button> Click to export</button>";
                        return string;
                    },
                },
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
        option:
            | "lineOption"
            | "TDEDomainPieOption"
            | "capSummaryOption"
            | "barCapSummaryOption"
            | "lineNonCapSummaryOption";
        fetch_uri?: string;
        type: chartType;
    }[]
>([
    {
        id: "lineChart",
        minWidth: "600px",
        minHeight: "400px",
        option: "lineOption",
        type: "line",
        fetch_uri: "business_kpi/line/hour_expenditure",
    },
    {
        id: "pieChart",
        minWidth: "500px",
        minHeight: "400px",
        option: "TDEDomainPieOption",
        type: "pie",
        fetch_uri: "business_kpi/pie/hours_by_domain",
    },
    {
        id: "capSummary",
        minWidth: "1140px",
        minHeight: "700px",
        option: "capSummaryOption",
        type: "nestedPie",
        fetch_uri: "business_kpi/pie/cap_summary",
    },

    {
        id: "barCapSummary",
        minWidth: "1140px",
        minHeight: "500px",
        option: "barCapSummaryOption",
        type: "yBar",
        fetch_uri: "business_kpi/bar/cap_summary",
    },
    {
        id: "nonCapSummary",
        minWidth: "700px",
        minHeight: "400px",
        option: "lineNonCapSummaryOption",
        type: "stackedLine",
        fetch_uri: "business_kpi/line/noncap_summary",
    },
]);

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

watch([unit, period, cummulated], ([pId]) => {
    if (pId !== undefined) {
        graphUpdate();
    }
});
onMounted(() => {
    graphUpdate();
});

function graphUpdate() {
    graphs.value.forEach(async (graphInfo) => {
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
    padding: 10px;
    border-radius: 15px 15px 0 15px;
    border: 1px rgb(243, 243, 243) solid;
    resize: both;
    overflow: hidden;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 0px 2px 0px, rgba(0, 0, 0, 0.14) 0px 2px 4px 0px;
}

.drag:hover {
    cursor: grab;
}
</style>
