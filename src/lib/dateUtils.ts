import dayjs from 'dayjs'

dayjs.locale('pt-br')

export function isValidDate(date: string) {
    const [day, month, year] = date.split('/').map(Number)
    return dayjs(`${year}-${month}-${day}`).isValid()
}

export function getDateObj(date: string) {
    if (isValidDate(date)) {
        const [day, month, year] = date.split('/').map(Number)
        return new Date(`${year}-${month}-${day}`)
    } else return false
}

export function getDateForQuery(date: Date) {
    const inicioDia = dayjs(date).startOf('day').subtract(3, 'hours').toDate()
    const fimDia = dayjs(date).endOf('day').subtract(3, 'hours').toDate()

    return { inicioDia, fimDia }
}

export function getDateInBRT(date: Date) {
    return dayjs(date).add(3, 'hours').toDate()
}
