import { envVariableWithValidation } from "@/utilities/main";
export const organizationNames: string[] = envVariableWithValidation("VITE_ORGANIZATIONS").split(" ");
if (organizationNames.length === 0) {
    throw Error("Setup error : Please provide at least one organization in environement variables");
}

export const phases: { code: string; name: string }[] = [
    { code: "NPI", name: "Phase 0" },
    { code: "POC/Spec", name: "concept" },
    { code: "Feasability", name: "feasability" },
    { code: "Dev/ES", name: "Development 1" },
    { code: "Dev/EVT", name: "Development 2" },
    { code: "DVT", name: "Pre-production" },
    { code: "PVT", name: "Mass production" },
    { code: "STOP", name: "Project closure" },
];

export const routes_by_access = {
    "Business Manager": [
        {
            label: "Declaration",
            subgroup: [
                {
                    label: "Declare hours",
                    link: "declaration",
                    secondaryLinks: ["dayDeclaration", "declarationDate"],
                },
                {
                    label: " History",
                    link: "history",
                },
                {
                    label: " Change",
                    link: "change",
                },
            ],
        },
        {
            label: "Project management",
            subgroup: [
                {
                    label: "KPI",
                    link: "KPI",
                },
                {
                    label: "Forecast",
                    link: "forecast",
                },
                {
                    label: "Data",
                    link: "data",
                },
            ],
        },
        {
            label: "Business management",
            subgroup: [
                {
                    label: "Monthly report",
                    link: "montly_report",
                },
                {
                    label: "Business KPI",
                    link: "business_kpi",
                },
                {
                    label: "Projects",
                    link: "projects",
                },
            ],
        },
    ],
    "Project Manager": [
        {
            label: "Declaration",
            subgroup: [
                {
                    label: "Declare hours",
                    link: "declaration",
                },
                {
                    label: " History",
                    link: "history",
                },
                {
                    label: " Change",
                    link: "change",
                },
            ],
        },
        {
            label: "Project management",
            subgroup: [
                {
                    label: "KPI",
                    link: "KPI",
                },
                {
                    label: "Forecast",
                    link: "forecast",
                },
                {
                    label: "Data",
                    link: "data",
                },
                {
                    label: "Projects",
                    link: "projects",
                },
            ],
        },
    ],
    Employee: [
        {
            label: "Declarations",
            subgroup: [
                {
                    label: "Declare hours",
                    link: "declaration",
                },
                {
                    label: "History",
                    link: "history",
                },
            ],
        },
        {
            label: "Glossary",
            subgroup: [
                {
                    label: "Projects",
                    link: "projects",
                },
            ],
        },
    ],
};
