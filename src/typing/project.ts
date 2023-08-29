export interface UserProject {
    id: number;
    code: string;
    name: string;
    time_spent: number;
    favorite: boolean;
}

export const divisions = ["ALL", "HOME", "PRO", "HEADPHONE", "MOTORITIES", "RESEARCH"] as const;
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
    | "ABS"
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
    ABS: "Day off",
    "": "",
} as const;

export const divisionOptions: { [key in Division]: { id: key; label: string; subDivisions: SubCategory[] } } = {
    ALL: {
        id: "ALL",
        label: "All",
        subDivisions: ["ETC", "ABS", ""],
    },
    HOME: {
        id: "HOME",
        label: "Home",
        subDivisions: ["H_CI", "H_LSP", "H_AMP", ""],
    },
    MOTORITIES: {
        id: "MOTORITIES",
        label: "Motorities",
        subDivisions: ["M_CAR", "M_MAR", "M_OEM", ""],
    },
    PRO: {
        id: "PRO",
        label: "Pro",
        subDivisions: ["P_LSP", ""],
    },
    HEADPHONE: {
        id: "HEADPHONE",
        label: "Headphone",
        subDivisions: ["H_HP", "P_HP", ""],
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

export const expansionRenewalArray = ["Expansion", "Renewal", "NC", ""] as const;
export type ExpansionRenewal = (typeof expansionRenewalArray)[number];
export const expansionRenewalLabels: { [key in ExpansionRenewal]: string } = {
    Expansion: "Expansion",
    Renewal: "Renewal",
    NC: "NC",
    "": "",
} as const;

export interface Project {
    id: number;
    code: string;
    division: Division;
    subCategory: SubCategory;
    classification: Classification;
    expansionRenewal: ExpansionRenewal;
    name: string;
    entity: string;
    complexity: number;
    startCapDate?: string;
    endCapDate?: string;
    startDate?: string;
    endDate?: string;
}

export interface RawProject {
    id: number;
    project_code: string;
    division: Division;
    sub_category: SubCategory;
    classification: Classification;
    type: ExpansionRenewal;
    project_name: string;
    entity: string;
    complexity: number;
    start_cap_date: string | null;
    end_cap_date: string | null;
    start_date: string | null;
    end_date: string | null;
}

export interface RawProjectPhase {
    project_phase: number;
    start_date: string;
    end_date: string;
}

export interface ProjectPhase {
    projectPhase: number;
    startDate: string;
    endDate: string;
}

export interface BlankProjectPhase {
    projectPhase?: number;
    startDate?: string;
    endDate?: string;
}

export interface RawProjectPhasesAndForecast {
    project: RawProject;
    phases: RawProjectPhase[];
    forecasts: ForecastItem[];
}

export interface CompleteProject extends Project {
    phases: ProjectPhase[];
    forecast: ForecastItem[];
}

export interface BlankProject {
    code?: string;
    division?: Division;
    subCategory?: SubCategory;
    classification?: Classification;
    expansionRenewal?: ExpansionRenewal;
    name?: string;
    entity?: string;
    complexity?: number;
    phases: BlankProjectPhase[];
    forecast: ForecastItem[];
    startCapDate?: string;
    endCapDate?: string;
    startDate?: string;
    endDate?: string;
}

export interface SelectableUserProject extends UserProject {
    selected: boolean;
}

export interface SelectableProject extends Project {
    selected: boolean;
}
export interface WeekInYear {
    week: number;
    year: number;
}

export interface WeekInYearLabeled {
    week: number;
    year: number;
    label?: "error" | "success";
}

export interface ForecastItem {
    project_id?: number;
    month: number;

    year: number;

    hours: number;
}
