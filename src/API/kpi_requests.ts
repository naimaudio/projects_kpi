import { fetcher, origin } from "./requests";
import { phases } from "@/stores/nonReactiveStore";
import { type chartType } from "@/typing";
import type { ECOption } from "@/main";
import type { PieSeriesOption } from "echarts/charts";
import { queryBuilder } from "@/utilities/main";

interface KPISeries<T extends chartType> {
    unit: "h" | "FTE";
    series: {
        data: KPIData[T][];
        name: string;
        type: chartType;
    }[];
    xAxis?: { data: string[] };
    yAxis?: { data: string[] };
    legend?: { data: (string | number)[] };
}

interface KPIData {
    pie: { [key: string]: number };
    line: number;
    bar: number;
    nestedPie: { [key: string]: number };
    stackedLine: number;
    yBar: number;
}

export async function getKPI(
    type: chartType,
    fetch_uri: string,
    query: Record<string, string | boolean | number | undefined>
): Promise<ECOption> {
    const complete_fetch_uri = `${origin}/${fetch_uri}${queryBuilder(query)}`;
    const response = await fetcher(complete_fetch_uri);
    const data: KPISeries<typeof type> = await response.json();
    if (type === "bar" && fetch_uri === "kpi/stackedbar/hour_expenditure_by_project") {
        return {
            series: data.series.map((value) => {
                return { ...value, stack: "y", name: phases[Number(value.name)].code, type: "bar" };
            }),
            legend: { data: data.legend?.data.map((n) => phases[Number(n)].code) },
        };
    } else if (type === "yBar") {
        return {
            series: data.series.map((s) => {
                return {
                    name: s.name,
                    type: "bar",
                    data: s.data,
                };
            }),
            yAxis: data.yAxis,
        };
    } else if (type === "pie") {
        return {
            series: [
                {
                    data: Object.entries(data.series[0].data).map<PieSeriesOption>((value) => {
                        return { value: value[1], name: value[0] };
                    }),
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)",
                        },
                    },
                    type: "pie",
                    radius: "50%",
                    name: data.series[0].name,
                },
            ],
        };
    } else if (type === "line") {
        return {
            series: data.series.map((s) => ({ ...s, type: "line" })),
            xAxis: data.xAxis,
        };
    } else if (type === "stackedLine") {
        return {
            series: data.series.map((s) => {
                console.log(s);
                return {
                    name: s.name,
                    type: "line",
                    stack: "Total",
                    data: s.data,
                };
            }),
            xAxis: data.xAxis,
        };
    } else if (type === "nestedPie") {
        return {
            series: data.series.map((s, index) => {
                return {
                    radius: [index === 0 ? 0 : "45%", index === 0 ? "30%" : "60%"],
                    label:
                        index === 0
                            ? {
                                  position: "inner",
                                  fontSize: 14,
                              }
                            : {
                                  formatter: "{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ",
                                  backgroundColor: "#F6F8FC",
                                  borderColor: "#8C8D8E",
                                  borderWidth: 1,
                                  borderRadius: 4,
                                  rich: {
                                      a: {
                                          color: "#6E7079",
                                          lineHeight: 22,
                                          align: "center",
                                      },
                                      hr: {
                                          borderColor: "#8C8D8E",
                                          width: "100%",
                                          borderWidth: 1,
                                          height: 0,
                                      },
                                      b: {
                                          color: "#4C5058",
                                          fontSize: 14,
                                          fontWeight: "bold",
                                          lineHeight: 33,
                                      },
                                      per: {
                                          color: "#fff",
                                          backgroundColor: "#4C5058",
                                          padding: [3, 4],
                                          borderRadius: 4,
                                      },
                                  },
                              },
                    data: s.data,
                    name: "Capitalization",
                    type: "pie",
                    labelLine: {
                        length: 30,
                    },
                };
            }),
        };
    } else {
        return {};
    }
}
