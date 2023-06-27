const now = new Date();
import type { days } from "@/typing";
import { parse, format } from "date-fns";

export const weekNumberToString = (weekNumber: number, year: number) => {
    const firstDay: Date = parse(`${year}-${weekNumber}-Monday`, "Y-w-EEEE", now);
    const lastDay: Date = parse(`${year}-${weekNumber}-Friday`, "Y-w-EEEE", now);
    if (firstDay.getMonth() === lastDay.getMonth()) {
        const formatedFirstDay: string = format(firstDay, "MMMM d");
        const formatedLastDay: string = format(lastDay, "d, yyyy");
        return `${formatedFirstDay} to ${formatedLastDay}`;
    } else if (firstDay.getFullYear() === lastDay.getFullYear()) {
        const formatedFirstDay: string = format(firstDay, "MMMM d,");
        const formatedLastDay: string = format(lastDay, "MMMM d, yyyy");
        return `${formatedFirstDay} to ${formatedLastDay}`;
    } else {
        const formatedFirstDay: string = format(firstDay, "MMMM d, yyyy");
        const formatedLastDay: string = format(lastDay, "MMMM d, yyyy");
        return `${formatedFirstDay} to the ${formatedLastDay}`;
    }
};

export const dayValidation = (day: string | string[]): days | null => {
    const dayNb = Number(day);
    return dayNb === 0 || dayNb === 1 || dayNb === 2 || dayNb === 3 || dayNb === 4 ? dayNb : null;
};

export const dayNumberToString = (day: days, weekNumber: number, year: number) => {
    const dayDate: Date = parse(`${year}-${weekNumber}-${day + 1}`, "Y-w-e", now);
    return format(dayDate, "MMMM d, yyyy");
};
