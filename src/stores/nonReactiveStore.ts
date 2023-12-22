import { envVariableWithValidation } from "@/utilities/main";
export const organizationNames: string[] = envVariableWithValidation("VITE_ORGANIZATIONS").split(" ");
if (organizationNames.length === 0) {
    throw Error("Setup error : Please provide at least one organization in environement variables");
}

export const phasesDefinition = [
    { code: "NPI", name: "Phase 0" },
    { code: "POC/Spec", name: "concept" },
    { code: "Feasability", name: "feasability" },
    { code: "Dev/ES", name: "Development 1" },
    { code: "Dev/EVT", name: "Development 2" },
    { code: "DVT", name: "Pre-production" },
    { code: "PVT", name: "Mass production" },
] as const;

export const phasesRecord: Record<string, string> = {};
phasesDefinition.forEach((ph) => {
    phasesRecord[ph.code] = ph.name;
});

/**
 * This variable defines the routes accessible in the left pannel of the application depending on the access rôle of the user
 */
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
                    label: "Data",
                    link: "data",
                },
                {
                    label: "Projects",
                    link: "projects",
                    secondaryLinks: ["project"],
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
                    secondaryLinks: ["dayDeclaration", "declarationDate"],
                },
                {
                    label: " History",
                    link: "history",
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
                    label: "Data",
                    link: "data",
                },
                {
                    label: "Projects",
                    link: "projects",
                    secondaryLinks: ["project"],
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
                    secondaryLinks: ["dayDeclaration", "declarationDate"],
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
