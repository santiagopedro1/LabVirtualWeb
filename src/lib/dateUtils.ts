import dayjs from 'dayjs'

dayjs.locale('pt-br')

export function isValidDate(date: string) {
    const [day, month, year] = date.split('/').map(Number)
    return dayjs(`${year}-${month}-${day}`).isValid()
}

export function getDateObj(date: string) {
    if (isValidDate(date)) {
        const [day, month, year] = date.split('/').map(Number)
        return dayjs(`${year}-${month}-${day}`).toDate()
    } else return false
}

export function getDateForQuery(date: Date) {
    return {
        inicioDia: dayjs(date).startOf('day').toDate(),
        fimDia: dayjs(date).endOf('day').toDate()
    }
}
