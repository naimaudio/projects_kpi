import type {
    DeclarationInput,
    MonthlyHours,
    RawBufferRecord,
    RawDeclaration,
    RawUser,
    SimplifiedResponse,
    MonthlyHoursItem,
    dayNb,
    domain,
    Person,
    RawDeclarationMinified,
    MonthlyReport,
    MonthlyReportInformation,
} from "@/typing";
import { monthYeartoDate } from "@/typing/conversions";
import type {
    CompleteProject,
    ProjectMonthlyInformationItem,
    RawProject,
    RawProjectPhasesAndMonthlyInfos,
    RawProjectPhase,
    ProjectStatus,
    IncompleteProjectMonthlyInformationItem,
    MonthInYear,
} from "@/typing/project";
import {
    countWeeksBetween,
    dayNumberToDayDate,
    envVariableWithValidation,
    getFirstWednesdayOfMonth,
    getLastWednesdayOfMonth,
} from "@/utilities/main";

export const origin = envVariableWithValidation("VITE_FAST_API_URI");

export async function fetcher(
    input: RequestInfo | URL,
    init?: RequestInit | undefined,
    timeout: number = 10000
): Promise<Response> {
    const objKey = localStorage[`msal.token.keys.${envVariableWithValidation("VITE_CLIENT_ID")}`];

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
            throw new TypeError("token validation failed");
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

export async function getProject(projectCode: string): Promise<SimplifiedResponse<RawProjectPhasesAndMonthlyInfos>> {
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

export async function postFavorites(
    favorites: { userId: number; projectId: number }[]
): Promise<SimplifiedResponse<any>> {
    const response = await fetcher(`${origin}/favorites`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(favorites.map((f) => ({ user_id: f.userId, project_id: f.projectId }))),
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
        record_projects: [],
        record: {
            comment: comment === undefined ? null : comment,
            date_rec: dayNumberToDayDate(2, week, year),
            user_id: userId,
        },
    };

    declarations.forEach((declaration) => {
        requestBody.record_projects.push({
            declared_hours: declaration.hours,
            project_id: declaration.projectId,
            domain: declaration.domain,
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

export async function hoursModification(
    declarations: DeclarationInput[],
    userId: number,
    week: number,
    year: number,
    comment?: string
): Promise<SimplifiedResponse<any>> {
    const requestBody: RawDeclaration = {
        record_projects: [],
        record: {
            comment: comment === undefined ? null : comment,
            date_rec: dayNumberToDayDate(2, week, year),
            user_id: userId,
        },
    };

    declarations.forEach((declaration) => {
        requestBody.record_projects.push({
            declared_hours: declaration.hours,
            project_id: declaration.projectId,
            domain: declaration.domain,
        });
    });
    const response = await fetcher(`${origin}/records`, {
        method: "PUT",
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
    timeSpentByProject: { projectId: number; hours: number }[],
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
            timeSpentByProject.map((tsbp) => {
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

export async function getCSVFile(): Promise<SimplifiedResponse<Blob>> {
    const response = await fetcher(`${origin}/export-records-csv`, { method: "POST" });
    return { status: response.status, data: await response.blob() };
}

export async function updateProject(project: CompleteProject): Promise<SimplifiedResponse<{ detail: string }>> {
    interface RequestBody extends RawProjectPhasesAndMonthlyInfos {}
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
            end_cap_date: project.endCapDate || null,
            end_date: project.endDate || null,
            start_cap_date: project.startCapDate || null,
            start_date: project.startDate || null,
            status: project.status,
            default_cap:
                project.defaultCapitalization === false
                    ? project.defaultCapitalization
                    : project.defaultCapitalization || null,
        },
        phases: project.phases.map<RawProjectPhase>((p) => {
            return { end_date: p.endDate, start_date: p.startDate, project_phase: p.projectPhase };
        }),
        monthly_informations: project.monthly_informations,
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

export async function putProjectState(projectId: number, status: ProjectStatus) {
    const response = await fetcher(`${origin}/project/change_state?project_id=${projectId}&status=${status}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return { status: response.status, data: await response.json() };
}
export async function postProject(project: Omit<CompleteProject, "id">) {
    interface RequestBody {
        project: Omit<RawProject, "id">;
        phases: RawProjectPhase[];
        project_monthly_information: ProjectMonthlyInformationItem[];
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
            end_cap_date: project.endCapDate || null,
            end_date: project.endDate || null,
            start_cap_date: project.startCapDate || null,
            start_date: project.startDate || null,
            status: project.status,
            default_cap: project.defaultCapitalization || null,
        },
        phases: project.phases.map<RawProjectPhase>((p) => {
            return { end_date: p.endDate, start_date: p.startDate, project_phase: p.projectPhase };
        }),
        project_monthly_information: project.monthly_informations,
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

export async function getMonthlyHours(date: MonthInYear): Promise<SimplifiedResponse<MonthlyHours[]>> {
    const response = await fetcher(`${origin}/monthlyhours?year=${date.year}&month=${date.month + 1}`, {});
    return { status: response.status, data: await response.json() };
}

export async function getUsers(): Promise<SimplifiedResponse<Person[]>> {
    const response = await fetcher(`${origin}/getusers`, {});
    return { status: response.status, data: await response.json() };
}

export async function putMonthlyHours(
    date: MonthInYear,
    monthlyHoursItems: MonthlyHoursItem[],
    projectMonthlyInformations: { project_id: number; capitalizable: boolean | undefined }[],
    monthlyInformations: MonthlyReportInformation
): Promise<SimplifiedResponse<MonthlyHours[]>> {
    interface RequestBody {
        hours_items: {
            user_id: number;
            user_name?: string;
            hours: { project_id: number; hours: number; domain: string }[];
        }[];
        project_monthly_informations: IncompleteProjectMonthlyInformationItem[];
        report_informations: MonthlyReportInformation;
    }
    const monthlyHours: RequestBody = {
        hours_items: [],
        project_monthly_informations: [],
        report_informations: monthlyInformations,
    };
    monthlyHoursItems.forEach((mhItem) => {
        const index = monthlyHours.hours_items.findIndex((val) => {
            val.user_id === mhItem.user_id;
        });
        if (index !== -1) {
            monthlyHours.hours_items[index].hours.push({
                project_id: mhItem.project_id,
                hours: mhItem.hours,
                domain: mhItem.domain,
            });
        } else {
            monthlyHours.hours_items.push({
                hours: [{ project_id: mhItem.project_id, hours: mhItem.hours, domain: mhItem.domain }],
                user_id: mhItem.user_id,
                user_name: mhItem.user_name,
            });
        }
    });
    projectMonthlyInformations.forEach((mi) => {
        monthlyHours.project_monthly_informations.push({
            capitalizable: mi.capitalizable,
            project_id: mi.project_id,
        });
    });
    const response = await fetcher(`${origin}/monthlyhours?year=${date.year}&month=${date.month + 1}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(monthlyHours),
    });
    return { status: response.status, data: await response.json() };
}

export async function postMonthlyHours(date: MonthInYear): Promise<SimplifiedResponse<MonthlyHours[]>> {
    const response = await fetcher(
        `${origin}/monthlyhours?year=${date.year}&month=${date.month + 1}`,
        {
            method: "POST",
        },
        600000
    );
    return { status: response.status, data: await response.json() };
}

export async function getDeclarationData(projectIds: number[]): Promise<SimplifiedResponse<RawDeclarationMinified[]>> {
    const response = await fetcher(`${origin}/data?`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(projectIds),
    });
    return { status: response.status, data: await response.json() };
}

export async function getExportMonthlyHours(date: MonthInYear): Promise<SimplifiedResponse<Blob>> {
    const response = await fetcher(`${origin}/export_monthly?year=${date.year}&month=${date.month + 1}`, {
        method: "GET",
    });
    return { status: response.status, data: await response.blob() };
}

export async function getExportMonthlyOverallReview(date: MonthInYear): Promise<SimplifiedResponse<Blob>> {
    const response = await fetcher(
        `${origin}/export/monthly_project_capitalization?year=${date.year}&month=${date.month + 1}`,
        {
            method: "GET",
        }
    );
    return { status: response.status, data: await response.blob() };
}

export async function postImportCsv(file: File): Promise<SimplifiedResponse<Blob>> {
    const data = new FormData();
    data.append("file", file);

    const response = await fetcher(`${origin}/import-csv`, {
        method: "POST",
        body: data,
    });
    return { status: response.status, data: await response.json() };
}

export async function getMonthlyReport(date: MonthInYear): Promise<SimplifiedResponse<MonthlyReport>> {
    const response = await fetcher(`${origin}/monthly_report?year=${date.year}&month=${date.month + 1}`);
    return { status: response.status, data: await response.json() };
}

export async function postMonthlyReport(monthlyReport: MonthlyReport): Promise<SimplifiedResponse<MonthlyReport>> {
    const response = await fetcher(`${origin}/monthly_report`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            month: monthYeartoDate(monthlyReport.month),
            closed: monthlyReport.closed,
            sync_date: monthlyReport.sync_date,
            overtime_threshold:
                countWeeksBetween(
                    getFirstWednesdayOfMonth(monthlyReport.month.year, monthlyReport.month.month + 1).subtract(
                        2,
                        "day"
                    ),
                    getLastWednesdayOfMonth(monthlyReport.month.year, monthlyReport.month.month + 1).add(2, "day")
                ) * 35,
        }),
    });
    return { status: response.status, data: await response.json() };
}

export async function closeOrOpenMonthlyReport(date: MonthInYear, close: boolean) {
    const response = await fetcher(
        `${origin}/monthly_report?year=${date.year}&month=${date.month + 1}&close=${close}`,
        {
            method: "PUT",
        }
    );
    return { status: response.status, data: await response.json() };
}

export async function getProjectMonthlyInfo(
    date: MonthInYear
): Promise<SimplifiedResponse<ProjectMonthlyInformationItem[]>> {
    const response = await fetcher(`${origin}/projects/monthly-info?year=${date.year}&month=${date.month + 1}`, {
        method: "GET",
    });
    return { status: response.status, data: await response.json() };
}

export async function getProjectsExport(): Promise<SimplifiedResponse<Blob>> {
    const response = await fetcher(`${origin}/projects/export`, {
        method: "GET",
    });
    return { status: response.status, data: await response.blob() };
}

export async function getProjectsDefaultCapitalization(
    projectIds: number[]
): Promise<SimplifiedResponse<{ project_id: number; capitalizable: boolean | null }[]>> {
    const response = await fetcher(`${origin}/projects/capitalization/get`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(projectIds),
    });
    return { status: response.status, data: await response.json() };
}
