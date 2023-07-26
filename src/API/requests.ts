import type { DeclarationInput, RawBufferRecord, RawDeclaration, RawUser, SimplifiedResponse, dayNb } from "@/typing";
import type { CompleteProject, RawProject, RawProjectAndPhases, RawProjectPhase } from "@/typing/project";
import { dayNumberToDayDate, envVariableWithValidation } from "@/utilities/main";
import type { domain } from "@/typing/index";

const origin = envVariableWithValidation("VITE_FAST_API_URI");
async function fetcher(input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> {
    const objKey = localStorage[`msal.token.keys.${envVariableWithValidation("VITE_CLIENT_ID")}`];
    const timeout = 10000;
    const controller = new AbortController();
    const updatedOptions = { ...init, signal: controller.signal };
    const id = setTimeout(() => {
        controller.abort();
        console.error("request aborted");
        return { status: 408, data: undefined };
    }, timeout);

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
    const response = await fetch(input, updatedOptions);
    clearTimeout(id);
    return response;
}

export async function getProjects(): Promise<SimplifiedResponse<RawProject[]>> {
    const response = await fetcher(`${origin}/projects`, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return { status: response.status, data: await response.json() };
}

export async function getProject(projectCode: string): Promise<SimplifiedResponse<RawProjectAndPhases>> {
    const response = await fetcher(`${origin}/project?projectcode=${projectCode}`, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return { status: response.status, data: await response.json() };
}

export async function getUser(): Promise<SimplifiedResponse<RawUser>> {
    const response = await fetcher(`${origin}/user`);
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
            comment: comment === undefined ? null : comment,
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

export async function postBufferTable(
    userId: number,
    timeSpendByProject: { projectId: number; hours: number }[],
    day: dayNb,
    week: number,
    year: number
): Promise<SimplifiedResponse<any>> {
    const response = await fetcher(`${origin}/buffertable`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(
            timeSpendByProject.map((tsbp) => {
                return {
                    user_id: userId,
                    project_id: tsbp.projectId,
                    daily_hours: tsbp.hours,
                    day_date: dayNumberToDayDate(day, week, year),
                };
            })
        ),
    });
    return { status: response.status, data: await response.json() };
}

export async function getBufferTable(
    userId: number,
    week: number,
    year: number
): Promise<SimplifiedResponse<RawBufferRecord[]>> {
    const response = await fetcher(
        `${origin}/buffertable?hours_user_id=${userId}&date_init=${dayNumberToDayDate(
            0,
            week,
            year
        )}&date_end=${dayNumberToDayDate(4, week, year)}`
    );
    return { status: response.status, data: await response.json() };
}

export async function getCSVFile(): Promise<SimplifiedResponse<any>> {
    const response = await fetcher(`${origin}/export-records-csv`);
    return { status: response.status, data: await response.blob() };
}

export async function updateProject(project: CompleteProject) {
    interface RequestBody extends RawProjectAndPhases {}
    const requestBody: RequestBody = {
        project: {
            id: project.id,
            entity: project.entity,
            project_code: project.code,
            project_name: project.name,
            complexity: project.complexity,
            classification: project.classification,
            division: project.division,
            sub_category: project.subCategory,
            type: project.expansionRenewal,
        },
        phases: project.phases.map<RawProjectPhase>((p) => {
            return { end_date: p.endDate, start_date: p.startDate, project_phase: p.projectPhase };
        }),
    };
    const response = await fetcher(`${origin}/project`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    });
    return { status: response.status, data: await response.json() };
}

export async function postProject(project: Omit<CompleteProject, "id">) {
    interface RequestBody {
        project: Omit<RawProject, "id">;
        phases: RawProjectPhase[];
    }
    const requestBody: RequestBody = {
        project: {
            entity: project.entity,
            project_code: project?.code,
            project_name: project?.name,
            complexity: project.complexity,
            classification: project.classification,
            division: project.division,
            sub_category: project.subCategory,
            type: project.expansionRenewal,
        },
        phases: project.phases.map<RawProjectPhase>((p) => {
            return { end_date: p.endDate, start_date: p.startDate, project_phase: p.projectPhase };
        }),
    };
    const response = await fetcher(`${origin}/project`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    });
    return { status: response.status, data: await response.json() };
}
