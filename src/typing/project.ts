export interface UserProject {
    id: number;
    code: string;
    name: string;
    manager?: number;
    time_spend: number;
    favorite: boolean;
}

export const divisions = ["ALL", "HOME", "PRO", "MOTORITIES", "RESEARCH"] as const;
export type Division = (typeof divisions)[number];
export type SubCategory =
    | "H_CI"
    | "H_LSP"
    | "H_HP"
    | "M_CAR"
    | "M_MAR"
    | "M_OEM"
    | "P_LSP"
    | "P_HP"
    | "ETC"
    | "H_AMP"
    | "";
export const subCategoryLabels: Record<SubCategory, string> = {
    H_CI: "Home CI",
    H_LSP: "Home Loudspeaker",
    H_HP: "Home Headphone",
    M_CAR: "Motorities Car",
    M_MAR: "Motorities Marine",
    M_OEM: "Motorities OEM",
    P_LSP: "Pro Loudspeaker",
    P_HP: "Pro Headphone",
    ETC: "Others",
    H_AMP: "Home Amplifier",
    "": "",
} as const;

export const divisionOptions: { [key in Division]: { id: key; label: string; subDivisions: SubCategory[] } } = {
    ALL: {
        id: "ALL",
        label: "All",
        subDivisions: ["ETC", ""],
    },
    HOME: {
        id: "HOME",
        label: "Home",
        subDivisions: ["H_CI", "H_LSP", "H_HP", "H_AMP", ""],
    },
    MOTORITIES: {
        id: "MOTORITIES",
        label: "Motorities",
        subDivisions: ["M_CAR", "M_MAR", "M_OEM", ""],
    },
    PRO: {
        id: "PRO",
        label: "Pro",
        subDivisions: ["P_LSP", "P_HP", ""],
    },
    RESEARCH: {
        id: "RESEARCH",

        label: "Research",
        subDivisions: [""],
    },
};
export const classifications = ["1 STRATEGIC", "2 TACTICAL", "3 DEFENSIVE", "NC"] as const;
export type Classification = (typeof classifications)[number];

export const classificationLabels: Record<Classification, string> = {
    NC: "NC",
    "1 STRATEGIC": "Strategic",
    "2 TACTICAL": "Tactical",
    "3 DEFENSIVE": "Defensive",
} as const;

export type ExpansionRenewal = "EXPANSION" | "RENEWAL" | "";

export interface Project {
    id: number;
    code: string;
    division: Division;
    sub_category: SubCategory;
    classification: Classification;
    expansion_renewal: ExpansionRenewal;
    manager?: number;
    name: string;
}

export interface RawProject {
    id: number;
    project_code: string;
    division: Division;
    sub_category: SubCategory;
    classification: Classification;
    type: ExpansionRenewal;
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
