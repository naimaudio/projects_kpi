import type { DeclarationInput, RawDeclaration, RawUser, SimplifiedResponse } from "@/typing";
import type { RawProject } from "@/typing/project";
import { dayNumberToDayDate, envVariableWithValidation } from "@/utilities/main";
import type { domain } from "@/typing/index";

const origin = "http://192.168.14.30:8080";

async function fetcher(input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> {
    const objKey = localStorage[`msal.token.keys.${envVariableWithValidation("VITE_CLIENT_ID")}`];
    const updatedOptions = { ...init };

    if (objKey !== undefined) {
        const tokenObj = localStorage.getItem(JSON.parse(objKey)["accessToken"]);
        const token = tokenObj === null ? null : JSON.parse(tokenObj).secret;
        if (token === null || token === undefined) {
            throw Error("Token not found, be sure that the user is authenticated");
        }
        if (init !== undefined) {
            updatedOptions.headers = { ...init.headers, Authorization: `Bearer ${token}` };
        } else {
            updatedOptions.headers = { Authorization: `Bearer ${token}` };
        }
    }
    return fetch(input, updatedOptions);
}

export async function getProjects(): Promise<SimplifiedResponse<RawProject[]>> {
    const response = await fetcher(`${origin}/projects`, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return { status: response.status, data: await response.json() };
}

export async function getUser(): Promise<SimplifiedResponse<RawUser>> {
    const response = await fetcher(`${origin}/user`, {});
    return { status: response.status, data: await response.json() };
}

export async function getFavorites(userId: number): Promise<SimplifiedResponse<number[]>> {
    const response = await fetcher(`${origin}/favorites/${userId}`);
    return { status: response.status, data: await response.json() };
}

export async function postFavorites(userId: number, projectId: number): Promise<SimplifiedResponse<any>> {
    const response = await fetcher(`${origin}/favorites`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify([
            {
                user_id: userId,
                project_id: projectId,
            },
        ]),
    });
    return { status: response.status, data: await response.json() };
}

export async function deleteFavorites(userId: number, projectId: number): Promise<SimplifiedResponse<any>> {
    const response = await fetcher(`${origin}/favorites`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id: userId,
            project_id: projectId,
        }),
    });
    return { status: response.status, data: await response.json() };
}

export async function hoursRegistration(
    declarations: DeclarationInput[],
    userId: number,
    week: number,
    year: number,
    comment?: string
): Promise<SimplifiedResponse<any>> {
    const requestBody: RawDeclaration = {
        projects: [],
        record: {
            comment: comment,
            date_rec: dayNumberToDayDate(4, week, year),
            user_id: userId,
        },
    };

    declarations.forEach((declaration) => {
        requestBody.projects.push({
            declared_hours: declaration.hours,
            project_id: declaration.projectId,
        });
    });
    const response = await fetcher(`${origin}/records`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    });
    return { status: response.status, data: await response.json() };
}

export async function getDeclarations(userId: number): Promise<SimplifiedResponse<RawDeclaration[]>> {
    const response = await fetcher(`${origin}/records/${userId}`);
    return { status: response.status, data: await response.json() };
}

export async function getDomain(userId: number): Promise<SimplifiedResponse<domain>> {
    const response = await fetcher(`${origin}/domain/${userId}`);
    return { status: response.status, data: await response.json() };
}

export async function putDomain(userId: number, domain: domain) {
    const response = await fetcher(`${origin}/domain/${userId}?updated_domain=${domain}`, {
        method: "PUT",
    });
    return { status: response.status, data: await response.json() };
}
