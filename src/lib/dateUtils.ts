import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export function isValidDate(date: string) {
    return dayjs(date, ['DD/MM/YYYY', 'X'], true).isValid()
}

export function getDateObj(date: string) {
    if (!isValidDate(date)) return null
    return dayjs(date, 'DD/MM/YYYY').add(4, 'hours').toDate()
}

export function getDateForQuery(date: Date) {
    const inicioDia = dayjs(date).startOf('day').subtract(3, 'hours').toDate()
    const fimDia = dayjs(date).endOf('day').subtract(3, 'hours').toDate()

    return { inicioDia, fimDia }
}

export function fixDate(date: Date, hours: number) {
    return dayjs(date).add(hours, 'hours').toISOString()
}
