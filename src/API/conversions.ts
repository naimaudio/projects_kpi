import type { DeclRecord, RawDeclaration, User } from "@/typing";
import type { RawUser, domain, role, Declaration } from "@/typing";
import type { Project } from "@/typing/project";
import type { RawProject } from "@/typing/project";
import dayjs from "dayjs";

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
    if (str === "Acoustics" || str === "Tests" || str === "Hardware" || str === "Software" || str === "Mechanics") {
        return str;
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
    return rawProjects.map<Project>((rawProject) => {
        return {
            id: rawProject.id,
            code: rawProject.project_code,
            division: rawProject.division,
            name: rawProject.project_name,
            sub_category: rawProject.sub_category,
            classification: rawProject.classification,
            expansion_renewal: rawProject.expansion_renewal,
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
