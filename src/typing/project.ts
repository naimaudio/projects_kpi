export interface UserProject {
    id: number;
    code: string;
    name: string;
    manager?: number;
    time_spend: number;
    favorite: boolean;
}

export type Division = "HOME" | "PRO" | "MOTORITIES";
export type SubCategory = "H_CI" | "H_LSP" | "H_HP" | "M_CAR" | "M_MAR" | "M_OEM" | "P_LSP" | "P_HP" | "ETC" | "H_AMP";
export enum Classification {
    STRATEGIC = 1,
    TACTICAL = 2,
    DEFENSIVE = 3,
}
export type ExpansionRenewal = "EXPANSION" | "RENEWAL";

export interface Project {
    id: number;
    code: string;
    division: Division[];
    sub_category: SubCategory;
    classification?: Classification;
    expansion_renewal?: ExpansionRenewal;
    manager?: number;
    name: string;
}

export interface RawProject {
    id: number;
    project_code: string;
    division: Division[];
    sub_category: SubCategory;
    classification?: Classification;
    expansion_renewal?: ExpansionRenewal;
    project_manager?: number;
    project_name: string;
}

export interface SelectableProject extends UserProject {
    selected: boolean;
}

export interface WeekInYear {
    week: number;
    year: number;
}
