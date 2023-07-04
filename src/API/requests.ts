import type { DeclarationInput, RawDeclaration } from "@/typing";
import type { RawProject } from "@/typing/project";
import { dayNumberToDayDate } from "@/utilities/main";

const origin = "http://192.168.14.30:8080";

export async function getProjects(): Promise<RawProject[]> {
    return fetch(`${origin}/projects`, {
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        return response.json();
    });
}

export async function getUser(userId: number): Promise<RawProject[]> {
    return fetch(`${origin}/user?user_id=${userId}`, {}).then((response) => {
        return response.json();
    });
}

export async function getFavorites(userId: number): Promise<number[]> {
    return fetch(`${origin}/favorites/${userId}`).then((response) => {
        return response.json();
    });
}

export async function postFavorites(userId: number, projectId: number) {
    return fetch(`${origin}/favorites`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify([
            {
                user_id: 2,
                project_id: projectId,
            },
        ]),
    });
}

export async function deleteFavorites(userId: number, projectId: number) {
    return fetch(`${origin}/favorites`, {
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
    const requestBody: RawDeclaration[] = [];
    declarations.forEach((declaration) => {
        requestBody.push({
            declared_hours: declaration.hours,
            modified_hours: declaration.hours,
            date_rec: dayNumberToDayDate(0, week, year),
            project_id: declaration.projectId,
            user_id: userId,
        });
    });
    fetch(`${origin}/records`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify([
            {
                date_rec: dayNumberToDayDate(0, week, year),
                comment: comment,
                user_id: userId,
            },
        ]),
    });

    fetch(`${origin}/record-projects`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    });
}

export async function getDeclarations(userId: number): Promise<RawDeclaration[]> {
    return fetch(`${origin}/record-projects?hoursuserid=${userId}`).then((response) => {
        return response.json();
    });
}
