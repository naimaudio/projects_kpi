import type {
    DeclRecord,
    RawDeclaration,
    User,
    RawUser,
    domain,
    role,
    Declaration,
    RawBufferRecord,
    DailyDeclaration,
} from "@/typing";
import { domains } from "@/typing";
import type {
    Project,
    RawProjectPhasesAndMonthlyInfos,
    CompleteProject,
    RawProjectPhase,
    ProjectPhase,
    RawProject,
    MonthInYear,
} from "@/typing/project";
import dayjs from "dayjs";
import { cloneDeep } from "lodash";
import {} from "./project";

export function userFromRaw(rawUser: RawUser): User {
    return {
        email: rawUser.email,
        domain: stringToDomain(rawUser.domain),
        firstDeclarationDay: dayjs(rawUser.date_entrance, "YYYY-MM-DD").toDate(),
        id: rawUser.id,
        username: rawUser.username,
        role: stringToRole(rawUser.role),
        status: rawUser.status,
    };
}
export const stringToDomain = (str: string): domain => {
    const domainStr = str as domain;
    if (domains.includes(domainStr)) {
        return domainStr;
    } else {
        throw Error("given string is not a domain");
    }
};

export const stringToRole = (str: string): role => {
    if (str === "Employee" || str === "Project Manager" || str === "Business Manager") {
        return str;
    } else {
        throw Error("given string is not a role");
    }
};

export function projectsFromRaw(rawProjects: RawProject[]): Project[] {
    return rawProjects.map<Project>((rawProject: RawProject) => {
        return {
            id: rawProject.id,
            code: rawProject.project_code,
            division: rawProject.division,
            name: rawProject.project_name,
            expansionRenewal: rawProject.type,
            subCategory: rawProject.sub_category,
            classification: rawProject.classification,
            entity: rawProject.entity,
            complexity: rawProject.complexity,
            endCapDate: rawProject.end_cap_date === null ? undefined : rawProject.end_cap_date,
            startCapDate: rawProject.start_cap_date === null ? undefined : rawProject.start_cap_date,
            startDate: rawProject.start_date === null ? undefined : rawProject.start_date,
            endDate: rawProject.end_date === null ? undefined : rawProject.end_date,
            status: rawProject.status,
        };
    });
}

export function declarationsFromRaw(
    rawDeclarations: RawDeclaration[],
    projectCodeMapping: Record<number, string>
): {
    declarations: Declaration[];
    records: DeclRecord[];
} {
    const decl: Declaration[] = [];
    const rec: DeclRecord[] = [];
    let i = -1;
    const lengthProjects = rawDeclarations.length;
    rawDeclarations.forEach((rawDeclaration, index) => {
        rec.push({
            id: index,
            userId: rawDeclaration.record.user_id,
            week: dayjs(rawDeclaration.record.date_rec).week(),
            year: dayjs(rawDeclaration.record.date_rec).get("year"),
            projectCodes: [],
            comment: rawDeclaration.record.comment === null ? undefined : rawDeclaration.record.comment,
        });
        i += 1;
        rawDeclaration.record_projects.forEach((p, jndex) => {
            decl.push({
                week: dayjs(rawDeclaration.record.date_rec).week(),
                year: dayjs(rawDeclaration.record.date_rec).get("year"),
                projectId: p.project_id,
                hours: p.declared_hours,
                id: index * lengthProjects + jndex,
                projectCode: projectCodeMapping[p.project_id],
                domain: p.domain,
            });
            rec[i].projectCodes.push(projectCodeMapping[p.project_id]);
        });
    });
    return {
        declarations: decl,
        records: rec,
    };
}

export function rawBuffersToDailyDeclaration(
    rawBuffers: RawBufferRecord[],
    defaultDailyDeclaration: DailyDeclaration,
    week: number,
    year: number
): DailyDeclaration {
    const newDailyDeclaration = cloneDeep(defaultDailyDeclaration);
    rawBuffers.forEach((rawBuf: RawBufferRecord) => {
        const date = dayjs(rawBuf.day_date, "YYYY-MM-DD");
        if (date.week() === week && date.get("year") === year) {
            const i = newDailyDeclaration[0].findIndex((decl) => decl.projectId === rawBuf.project_id);
            const day = (date.get("day") - 1) % 7;
            if (i !== -1 && (day === 0 || day === 1 || day === 2 || day === 3 || day === 4)) {
                newDailyDeclaration[day][i].hours = rawBuf.daily_hours;
            }
        }
    });
    return newDailyDeclaration;
}

export function rawPhasesToPhase(phases: RawProjectPhase[]): ProjectPhase[] {
    return phases.map<ProjectPhase>((phase) => {
        return {
            endDate: phase.end_date,
            startDate: phase.start_date,
            projectPhase: phase.project_phase,
        };
    });
}

export function rawProjectToProjectComplete(projectPack: RawProjectPhasesAndMonthlyInfos): CompleteProject {
    return {
        id: projectPack.project.id,
        code: projectPack.project.project_code,
        division: projectPack.project.division,
        classification: projectPack.project.classification,
        complexity: projectPack.project.complexity,
        entity: projectPack.project.entity,
        expansionRenewal: projectPack.project.type,
        name: projectPack.project.project_name,
        subCategory: projectPack.project.sub_category,
        phases: rawPhasesToPhase(projectPack.phases),
        monthly_informations: projectPack.monthly_informations,
        startDate: projectPack.project.start_date || undefined,
        endCapDate: projectPack.project.end_cap_date || undefined,
        endDate: projectPack.project.end_date || undefined,
        startCapDate: projectPack.project.start_cap_date || undefined,
        status: projectPack.project.status,
    };
}

export function monthYeartoDate(date: MonthInYear) {
    return `${date.year}-${date.month + 1}-01`;
}
