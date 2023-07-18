const now = new Date();
import type { days } from "@/typing";
import { parse, format } from "date-fns";

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

export const dayValidation = (day: string | string[]): days | null => {
    const dayNb = Number(day);
    return dayNb === 0 || dayNb === 1 || dayNb === 2 || dayNb === 3 || dayNb === 4 ? dayNb : null;
};

/**
 * Parse day, weekNumber, year to format YYYY-MM-DD
 * @param day day number (0: Monday, 1, Tuesday...)
 * @param weekNumber week Number (starting at one)
 * @param year year Number
 */
export const dayNumberToDayDate = (day: days, weekNumber: number, year: number) => {
    const dayDate: Date = parse(`${year}-${weekNumber}-${((day + 1) % 7) + 1}`, "Y-w-e", now);
    return format(dayDate, "yyyy-MM-dd");
};

/**
 * Parse day weekNumber, year to human readable date
 * @param day day number (0: Monday, 1, Tuesday...)
 * @param weekNumber week Number (starting at one)
 * @param year year Number
 */
export const dayNumberToString = (day: days, weekNumber: number, year: number) => {
    const dayDate: Date = parse(`${year}-${weekNumber}-${day + 1}`, "Y-w-e", now);
    return format(dayDate, "MMMM d, yyyy");
};

export function assertIsNode(e: EventTarget | null): asserts e is Node {
    if (!e || !("nodeType" in e)) {
        throw new Error(`Node expected`);
    }
}

/**
 * Function range as the python range function
 * @param begining strating of the array
 * @param end end of the array, (excluding last number)
 */
export function range(begining: number, end: number): number[] {
    if (begining >= end) {
        return [];
    }
    const range = [];
    let i: number = begining;
    while (i < end) {
        range.push(i);
        i++;
    }
    return range;
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
