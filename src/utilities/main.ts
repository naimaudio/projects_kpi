const now = new Date();
import type { dayNb } from "@/typing";
import { parse, format } from "date-fns";
import dayjs, { Dayjs } from "dayjs";
/**
 * Parse weekNumber, year to human readable date
 * @param weekNumber week Number (starting at one)
 * @param year year Number
 */
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

export const dayValidation = (day: string | string[]): dayNb | undefined => {
    const dayNb = Number(day);
    return dayNb === 0 || dayNb === 1 || dayNb === 2 || dayNb === 3 || dayNb === 4 ? dayNb : undefined;
};

/**
 * Parse day, weekNumber, year to format YYYY-MM-DD
 * @param day day number (0: Monday, 1, Tuesday...)
 * @param weekNumber week Number (starting at one)
 * @param year year Number
 */
export const dayNumberToDayDate = (day: dayNb, weekNumber: number, year: number) => {
    const dayDate: Date = parse(`${year}-${weekNumber}-${((day + 1) % 7) + 1}`, "Y-w-e", now);
    return format(dayDate, "yyyy-MM-dd");
};

/**
 * Parse day weekNumber, year to human readable date
 * @param day day number (0: Monday, 1, Tuesday...)
 * @param weekNumber week Number (starting at one)
 * @param year year Number
 */
export const dayNumberToString = (day: dayNb, weekNumber: number, year: number) => {
    const dayDate: Date = parse(`${year}-${weekNumber}-${day + 1}`, "Y-w-e", now);
    return format(dayDate, "MMMM d, yyyy");
};

/**
 * Function range as the python range function
 * @param begining strating of the array
 * @param end end of the array, (excluding last number)
 */
export function range(begining: number, end: number, type: "number"): number[];
export function range(begining: number, end: number, type: "string"): string[];
export function range(begining: number, end: number, type: "number" | "string" = "number"): number[] | string[] {
    if (begining >= end) {
        return [];
    }
    const range = [];
    let i: number = begining;
    if (type === "number") {
        while (i < end) {
            range.push(i);
            i++;
        }
        return range;
    } else {
        while (i < end) {
            range.push(i.toString());
            i++;
        }
        return range;
    }
}

/**
 * It sends an error when Environnement variable is missing
 * @param envVariableKey Key f the environnement variable
 */
export function envVariableWithValidation(envVariableKey: string) {
    const envVariable = import.meta.env[envVariableKey];
    if (typeof envVariable !== "string") {
        throw Error(`Environnement variable ${envVariableKey} missing or incorect value : ${envVariable}`);
    }
    return envVariable;
}

export function queryBuilder(query: Record<string, string | boolean | undefined | number>): string {
    const queryArray = Object.entries(query);
    let str = "";
    if (queryArray.length !== 0 && queryArray[0][1] !== undefined) {
        str = `?${queryArray[0][0]}=${queryArray[0][1]}`;
    }
    for (let i = 1; i < queryArray.length; i++) {
        str += `&${queryArray[i][0]}=${queryArray[i][1]}`;
    }
    return str;
}

export function findLastIndex<T>(arr: T[], fn: (value: T, index?: number, array?: T[]) => boolean) {
    return (arr
        .map<[number, T]>((val, i) => [i, val])
        .filter(([i, val]) => fn(val, i, arr))
        .pop() || [-1])[0];
}

export function getFirstWednesdayOfMonth(year: number, month: number): Dayjs {
    // Create a Day.js object for the first day of the month
    const firstDayOfMonth = dayjs(`${year}-${month}-01`);

    // Find the day of the week for the first day of the month (0 is Sunday, 1 is Monday, and so on)
    const dayOfWeek = firstDayOfMonth.day();

    // Calculate the number of days to add to reach Wednesday (3)
    const daysToAdd = (3 - dayOfWeek + 7) % 7;

    // Add the calculated days to get the first Wednesday of the month
    const firstWednesdayOfMonth = firstDayOfMonth.add(daysToAdd, "day");

    return firstWednesdayOfMonth;
}

export function getLastWednesdayOfMonth(year: number, month: number) {
    // Create a Day.js object for the last day of the month
    const lastDayOfMonth = dayjs(`${year}-${month + 1}-01`).subtract(1, "day");

    // Find the day of the week for the last day of the month (0 is Sunday, 1 is Monday, and so on)
    const dayOfWeek = lastDayOfMonth.day();

    // Calculate the number of days to subtract to reach Wednesday (3)
    const daysToSubtract = (dayOfWeek - 3 + 7) % 7;

    // Subtract the calculated days to get the last Wednesday of the month
    const lastWednesdayOfMonth = lastDayOfMonth.subtract(daysToSubtract, "day");

    return lastWednesdayOfMonth;
}

export function countWeeksBetween(startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) {
    // Calculate the difference in milliseconds between the two dates
    const diffInDays = Math.abs(endDate.diff(startDate, "day"));
    console.log(diffInDays);
    // Calculate the number of weeks, rounding up to include partial weeks

    return Math.ceil(diffInDays / 7);
}

export function getWednesdayOfCurrentDate() {
    // Create a Date object for the current date
    const currentDate = new Date();

    // Get the current day of the week (0 is Sunday, 1 is Monday, and so on)
    const currentDayOfWeek = currentDate.getDay();
    // Calculate the number of days to add to reach Wednesday (3)
    const daysToAdd = 3 - currentDayOfWeek;

    // Set the Date object to the Wednesday of the current week
    currentDate.setDate(currentDate.getDate() + daysToAdd);
    return currentDate;
}
