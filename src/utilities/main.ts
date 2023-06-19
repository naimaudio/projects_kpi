
const now = new Date()
import type { Project, RawProject } from '@/typing/project'
import {parse, format} from 'date-fns'

export const weekNumberToString = (weekNumber: number, year: number) => {
  const firstDay:Date = parse(`${year}-${weekNumber}-Monday`, "Y-w-EEEE", now)
  const lastDay:Date = parse(`${year}-${weekNumber}-Friday`, "Y-w-EEEE", now)
  if (firstDay.getMonth() === lastDay.getMonth()){
    const formatedFirstDay: string = format(firstDay, "MMMM d")
    const formatedLastDay:string = format(lastDay, "d, yyyy")
    return `${formatedFirstDay} to ${formatedLastDay}`
  }
  else if (firstDay.getFullYear() === lastDay.getFullYear()){
    const formatedFirstDay: string = format(firstDay, "MMMM d,")
    const formatedLastDay:string = format(lastDay, "MMMM d, yyyy")
    return `${formatedFirstDay} to ${formatedLastDay}`
  } else {
    const formatedFirstDay: string = format(firstDay, "MMMM d, yyyy")
    const formatedLastDay:string = format(lastDay, "MMMM d, yyyy")
    return `${formatedFirstDay} to the ${formatedLastDay}`
  }
}

export const rawProjectToProject: (project:RawProject) => Project = (project: RawProject) => {
  const displayableProject: Project = {
    id: project.id,
    manager: project?.manager,
    favorite: true,
    name: project.name,
    time_spend: 0
  }
  return displayableProject
}