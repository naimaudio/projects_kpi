import type { EChartsOption } from "echarts/types/dist/shared";
import { fetcher, origin } from "./requests";
import { phases } from "@/stores/nonReactiveStore";
import { type chartType } from "@/typing";

interface KPISeries<T extends chartType> {
    unit: "h" | "FTE";
    series: {
        data: KPIData[T][];
        name: string;
        type: chartType;
    }[];
    xAxis?: { data: string[] };
}

interface KPIData {
    pie: { [key: string]: number };
    line: number;
    bar: number;
}

export async function getKPI(
    type: chartType,
    fetch_uri: string,
    projectId?: number,
    cumulative?: boolean
): Promise<EChartsOption> {
    const complete_fetch_uri =
        projectId !== undefined && cumulative !== undefined
            ? `${origin}/${fetch_uri}?project_id=${projectId}&cumulative=${cumulative}`
            : projectId !== undefined
            ? `${origin}/${fetch_uri}?project_id=${projectId}`
            : cumulative !== undefined
            ? `${origin}/${fetch_uri}?cumulative=${cumulative}`
            : `${origin}/${fetch_uri}`;
    const response = await fetcher(complete_fetch_uri);
    const data: KPISeries<typeof type> = await response.json();
    if (type === "bar") {
        return {
            series: data.series.map((value) => {
                return { ...value, stack: "y", name: phases[Number(value.name)].name };
            }),
        };
    } else if (type === "pie") {
        return {
            series: [
                {
                    data: Object.entries(data.series[0].data).map((value) => {
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
