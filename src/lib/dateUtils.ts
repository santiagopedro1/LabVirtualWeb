import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export function isValidDate(date: string) {
    return dayjs(date, ['DD/MM/YYYY', 'X'], true).isValid()
}

export function getDateObj(date: string) {
    if (!isValidDate(date)) return null
    return dayjs(date, ['DD/MM/YYYY', 'X']).toDate()
}

export function getDateForQuery(date: Date) {
    const inicioDia = dayjs(date).startOf('day').toDate()
    const fimDia = dayjs(date).endOf('day').toDate()

    return { inicioDia, fimDia }
}
