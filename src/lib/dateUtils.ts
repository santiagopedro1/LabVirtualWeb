import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(customParseFormat)
dayjs.extend(timezone)
dayjs.extend(utc)

export function isValidDate(date: string) {
    return dayjs(date, ['DD/MM/YYYY', 'X'], true).isValid()
}

export function getDateObj(date: string) {
    if (!isValidDate(date)) return null
    return dayjs(date, 'DD/MM/YYYY').add(4, 'hours').toDate()
}

export function getDateForQuery(date: Date) {
    const inicioDia = dayjs
        .tz(date, 'America/Sao_Paulo')
        .startOf('day')
        .toDate()
    const fimDia = dayjs.tz(date, 'America/Sao_Paulo').endOf('day').toDate()

    return { inicioDia, fimDia }
}
