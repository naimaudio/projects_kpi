
const now = new Date()
import {parse, format} from 'date-fns'

export const weekNumberToString = (weekNumber: number, year: number) => {
  const firstDay = parse(`${year}-${weekNumber}-Monday`, "Y-w-EEEE", now)
  const lastDay = parse(`${year}-${weekNumber}-Friday`, "Y-w-EEEE", now)
  const formatedFirstDay = format(firstDay, "do 'of' MMMM Y")
  const formatedLastDay = format(lastDay, "do 'of' MMMM Y")
  return `From the ${formatedFirstDay} to the ${formatedLastDay}`
}