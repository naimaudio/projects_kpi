
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
    manager?: string
    name: string
}

export interface Preferences {
    preferedMethod: InputMethod
}

export const inputMethodKeys = ["daily", "weekly"] as const
export type InputMethod = typeof inputMethodKeys[number]

export const inputMethods: Record<InputMethod, string> = {
  "daily": "Daily",
  "weekly": "Weekly"
}

export interface Declaration {
    id: string
    userEmail: string
    projectCode: string
    workedHours: number
    dateReg: Date
    comment: string
} 

export interface User {
    id: number
    username: string
    email: string
} 