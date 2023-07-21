import { envVariableWithValidation } from "@/utilities/main";
export const organizationNames: string[] = envVariableWithValidation("VITE_ORGANIZATIONS").split(" ");
