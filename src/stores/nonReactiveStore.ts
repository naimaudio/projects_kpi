import { envVariableWithValidation } from "@/utilities/main";
export const organizationNames: string[] = envVariableWithValidation("VITE_ORGANIZATIONS").split(" ");
if (organizationNames.length === 0) {
    throw Error("Setup error : Please provide at least one organization in environement variables");
}

export const phases: { code: string; name: string }[] = [
    { code: "NPI", name: "Phase 0" },
    { code: "DMU", name: "concept" },
    { code: "POC/PF", name: "feasability" },
    { code: "ES", name: "Development 2" },
    { code: "EVT", name: "Development 1" },
    { code: "DVT", name: "Pre-production" },
    { code: "PVT", name: "Mass production" },
    { code: "STOP", name: "Project closure" },
];
