import { envVariableWithValidation } from "@/utilities/main";
export const organizationNames: string[] = envVariableWithValidation("VITE_ORGANIZATIONS").split(" ");
if (organizationNames.length === 0) {
    throw Error("Setup error : Please provide at least one organization in environement variables");
}
