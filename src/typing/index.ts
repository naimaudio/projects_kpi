
export interface Header {
    name: string,
    id: string,
    filterable: boolean
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

export interface DeclarationInput {
    name: string,
    hours: string
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