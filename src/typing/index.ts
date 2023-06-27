export interface Header {
    name: string;
    id: string;
    filterable: boolean;
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

export interface Declaration {
    id: string;
    userEmail: string;
    projectCode: string;
    workedHours: number;
    dateReg: Date;
    comment: string;
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
