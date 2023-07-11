import type { DeclarationInput, RawDeclaration, RawUser } from "@/typing";
import type { RawProject } from "@/typing/project";
import { dayNumberToDayDate, envVariableWithValidation } from "@/utilities/main";
import { domain } from "../typing/index";

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

export async function getProjects(): Promise<RawProject[]> {
    return fetcher(`${origin}/projects`, {
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        return response.json();
    });
}

export async function getUser(): Promise<RawUser> {
    return fetcher(`${origin}/user`, {}).then((response) => {
        return response.json();
    });
}

export async function getFavorites(userId: number): Promise<{ status: number; data: number[] }> {
    const response = await fetcher(`${origin}/favorites/${userId}`);
    return { status: response.status, data: await response.json() };
}

export async function postFavorites(userId: number, projectId: number) {
    return fetcher(`${origin}/favorites`, {
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
}

export async function deleteFavorites(userId: number, projectId: number) {
    return fetcher(`${origin}/favorites`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id: userId,
            project_id: projectId,
        }),
    });
}

export async function hoursRegistration(
    declarations: DeclarationInput[],
    userId: number,
    week: number,
    year: number,
    comment?: string
) {
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
    return fetcher(`${origin}/records`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    });
}

export async function getDeclarations(userId: number): Promise<RawDeclaration[]> {
    return fetcher(`${origin}/records/${userId}`).then((response) => {
        return response.json();
    });
}

export async function getDomain(userId: number) {
    return fetcher(`${origin}/domain/${userId}`).then((response) => {
        return response.json();
    });
}

export async function putDomain(userId: number, domain: domain) {
    const response = await fetcher(`${origin}/domain/${userId}?updated_domain=${domain}`, {
        method: "PUT",
    });
    return { status: response.status, data: await response.json() };
}
