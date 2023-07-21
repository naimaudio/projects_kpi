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
import type { Project } from "@/typing/project";
import type { RawProject } from "@/typing/project";
import dayjs from "dayjs";
import { cloneDeep } from "lodash";

export function userFromRaw(rawUser: RawUser): User {
    return {
        email: rawUser.email,
        domain: stringToDomain(rawUser.domain),
        firstDeclarationDay: dayjs(rawUser.date_entrance, "YYYY-MM-DD").toDate(),
        id: rawUser.id,
        username: rawUser.username,
        role: stringToRole(rawUser.role),
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
            expansion_renewal: rawProject.type,
            sub_category: rawProject.sub_category,
            classification: rawProject.classification,
            manager: rawProject.project_manager,
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
        rawDeclaration.projects.forEach((p, jndex) => {
            decl.push({
                week: dayjs(rawDeclaration.record.date_rec).week(),
                year: dayjs(rawDeclaration.record.date_rec).get("year"),
                projectId: p.project_id,
                hours: p.declared_hours,
                id: index * lengthProjects + jndex,
                projectCode: projectCodeMapping[p.project_id],
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
