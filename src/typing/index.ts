export interface Header {
    name: string;
    id: string;
    filterable?: boolean;
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
}

type domain = "Acoustics" | "Tests" | "Hardware" | "Software" | "Mechanics";
export const stringToDomain = (str: string): domain => {
    if (str === "Acoustics" || str === "Tests" || str === "Hardware" || str === "Software" || str === "Mechanics") {
        return str;
    } else {
        throw Error("given string is not a domain");
    }
};

export type DailyDeclaration = Record<days, DeclarationInput[]>;

export const workDayKeys = [0, 1, 2, 3, 4] as const;
export type days = (typeof workDayKeys)[number];

export const workDays: Record<days, string> = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;

export interface ChangeEvent {
    target: { value: string; currentChecked: boolean };
}

export interface RawDeclaration {
    record: {
        date_rec: string;
        user_id: number;
        comment?: string;
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
}

export interface DeclRecord {
    id: number;
    userId: number;
    comment?: string;
    week: number;
    year: number;
}
