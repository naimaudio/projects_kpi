export interface Header {
    name: string,
    id: string,
    filterable: boolean
}
export type Division = "HOME" | "PRO" | "MOTORITIES"
export type SubCategory = "H_CI" | "H_LSP" | "H_HP" | "M_CAR" | "M_MAR" | "M_OEM" | "P_LSP" | "P_HP" | "ETC" | "H_AMP"
export enum Classification {
    STRATEGIC = 1,
    TACTICAL = 2,
    DEFENSIVE = 3
}
export type ExpansionRenewal = "EXPANSION" | "RENEWAL"

export interface RawProject {
    id: string
    division: Division[]
    sub_category: SubCategory
    classification?: Classification
    expansion_renewal?: ExpansionRenewal
    name: string
}

export interface User {
    id: string
    prefe
}