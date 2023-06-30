import type { DeclarationInput, RawDeclaration } from "@/typing";
import type { RawProject } from "@/typing/project";
import { format } from "date-fns";

const origin = "http://192.168.14.30:8080";

export async function getProjects(): Promise<RawProject[]> {
    return fetch(`${origin}/projects/`, {
        headers: {
            "Content-Type": "application/json",
        },
    }).then((projects) => {
        return projects.json();
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

export async function hoursRegistration(declarations: DeclarationInput[], userId: number, comment?: string) {
    const requestBody: RawDeclaration[] = [];
    declarations.forEach((declaration) => {
        requestBody.push({
            worked_hours: declaration.hours,
            date_rec: format(new Date(), "YYYY-MM-DD"),
            project_id: declaration.projectId,
            comment: comment,
            user_id: userId,
        });
    });
    return fetch(`${origin}/record`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    });
}

export async function getDeclarations(userId: number): Promise<RawDeclaration[]> {
    return fetch(`${origin}/records/${userId}`).then((response) => {
        return response.json();
    });
}
