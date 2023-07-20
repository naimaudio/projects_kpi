export interface Header {
    name: string;
    id: string;
    filterable?: boolean;
    width?: string;
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
}

export const domains = ["Acoustics", "Tests", "Hardware", "Software", "Mechanics", "Project Management"] as const;
export type domain = (typeof domains)[number];

export type DailyDeclaration = Record<dayNb, DeclarationInput[]>;

export const dayNumbers = [0, 1, 2, 3, 4] as const;
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
    projects: {
        project_id: number;
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

export interface DeclRecord {
    id: number;
    userId: number;
    comment?: string;
    week: number;
    year: number;
    projectCodes: string[];
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
