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
    legend?: { data: (string | number)[] };
}

interface KPIData {
    pie: { [key: string]: number };
    line: number;
    bar: number;
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
                return { ...value, stack: "y", name: phases[Number(value.name)].code };
            }),
            legend: { data: data.legend?.data.map((n) => phases[Number(n)].code) },
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
            series: data.series,
            xAxis: data.xAxis,
        };
    }
    return {};
}
