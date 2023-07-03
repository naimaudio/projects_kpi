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

export interface User {
    id: number;
    username: string;
    email: string;
}

export type DailyDeclaration = Record<days, DeclarationInput[]>;

export const workDayKeys = [0, 1, 2, 3, 4] as const;
export type days = (typeof workDayKeys)[number];

export const workDays: Record<days, string> = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;

export interface ChangeEvent {
    target: { value: string; currentChecked: boolean };
}

export interface RawDeclaration {
    worked_hours: number;
    date_rec: string;
    project_id: number;
    user_id: number;
    comment?: string;
}

export interface Declaration {
    hours: number;
    week: number;
    year: number;
    projectId: number;
    projectCode: string;
    comment?: string;
    id: number;
}
