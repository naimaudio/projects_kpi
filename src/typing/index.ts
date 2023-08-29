export interface Header {
    name: string;
    id: string;
    filterable?: boolean;
    width?: string;
    clickable?: boolean;
}
export interface MatrixHeader {
    name: string;
    id: number;
}
export interface MatrixHeaderExtended {
    name: string;
    desc: string;
    id: number;
}
export interface Preferences {
    preferedMethod: InputMethod;
}

export const inputMethodKeys = ["daily", "weekly"] as const;
export type InputMethod = (typeof inputMethodKeys)[number];

export const inputMethods: Record<InputMethod, string> = {
    daily: "Daily",
    weekly: "Weekly",
};

export interface DeclarationInput {
    projectId: number;
    name: string;
    hours: number;
    projectCode?: string;
    domain: domain;
}

export const domains = [
    "General",
    "Acoustics",
    "Tests",
    "Hardware",
    "Software",
    "Mechanics",
    "Project Management",
    "Shop floor",
] as const;

export type domain = (typeof domains)[number];

/**
 * Used in weekly declaration
 */
export type DailyDeclaration = Record<dayNb, DeclarationInput[]>;

export const dayNumbers = [0, 1, 2, 3, 4] as const;

/**
 * 0: Monday
 * 1: Tuesday
 * 2: Wednesday
 * 3: Thursday
 * 4: Friday
 */
export type dayNb = (typeof dayNumbers)[number];

export type role = "Employee" | "Business Manager" | "Project Manager";
export const workDays: Record<dayNb, string> = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;

export interface ChangeEvent {
    target: { value: string; currentChecked: boolean };
}

export interface RawDeclaration {
    record: {
        date_rec: string;
        user_id: number;
        comment: string | null;
    };
    record_projects: {
        project_id: number;
        domain: domain;
        declared_hours: number;
    }[];
}

export interface Declaration {
    hours: number;
    week: number;
    year: number;
    projectId: number;
    projectCode: string;
    id: number;
    domain: domain;
}

export interface DeclRecord {
    id: number;
    userId: number;
    comment?: string;
    week: number;
    year: number;
    projectCodes: string[];
}

export interface RawUser {
    date_entrance: string | null;
    domain: string;
    email: string;
    id: number;
    role: string;
    username: string;
    view: boolean;
}

export interface User {
    id: number;
    username: string;
    email: string;
    firstDeclarationDay: Date;
    domain: domain;
    role: role;
}

export interface SimplifiedResponse<T> {
    status: number;
    data: T;
}

export interface RawBufferRecord {
    user_id: number;
    day_date: string;
    project_id: number;
    daily_hours: number;
}

export type chartType = "pie" | "line" | "bar" | "nestedPie" | "stackedLine" | "yBar";

export interface MonthlyHours {
    user_id: number;
    user_name?: string;
    domain: domain;
    hours: { project_id: number; hours: number }[];
}

export interface MonthlyHoursItem {
    user_id: number;
    user_name?: string;
    project_id: number;
    hours: number;
}

export interface InputItem {
    column_id: number;
    row_id: number;
    value: number;
}

export interface Person {
    name: string;
    email: string;
    id: number;
}

export interface RawDeclarationMinified {
    email: string;
    hours: number;
    name: string;
    project_code: string;
    week: number;
    year: number;
    id: number;
}
