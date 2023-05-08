import { json } from '@sveltejs/kit'
import { prisma } from '$lib/prisma'
import { getDateForQuery, getDateObj, fixDate } from '$lib/dateUtils'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ request, url }) => {
    const headers = request.headers
    if (!headers.get('key'))
        return json(
            { message: 'Sem chave de API' },
            {
                status: 403
            }
        )
    if (headers.get('key') !== '123')
        return json(
            { message: 'Chave de API errada' },
            {
                status: 403
            }
        )

    const date = url.searchParams.get('data')
    const download = url.searchParams.get('download')
    const userId = url.searchParams.get('userId')

    if (!date)
        return json(
            { message: 'Nenhuma data foi fornecida' },
            {
                status: 400
            }
        )

    const dateObj = getDateObj(date)
    if (!dateObj)
        return json(
            { message: 'Data inválida' },
            {
                status: 400
            }
        )

    const { inicioDia, fimDia } = getDateForQuery(dateObj)

    const queryRes = await prisma.leituras_de_sensor.findMany({
        where: {
            data_hora: {
                gte: inicioDia,
                lt: fimDia
            }
        },
        orderBy: {
            data_hora: 'asc'
        }
    })

    if (queryRes.length === 0)
        return json(
            { message: 'Sem dados para a data fornecida' },
            { status: 404 }
        )

    const leituras = queryRes.reduce((acc: Leitura, item) => {
        const { id_sensor_de_usuario, data_hora, leitura } = item as LeituraDB

        if (!(id_sensor_de_usuario in acc)) {
            acc[id_sensor_de_usuario] = []
        }

        Object.keys(leitura).forEach(key => {
            if (key.includes('_')) {
                const newKey = key.replace('_', ' ')
                leitura[newKey] = leitura[key]
                delete leitura[key]
            }
        })

        acc[id_sensor_de_usuario].push({
            data_hora: fixDate(data_hora, 3),
            ...leitura
        })

        return acc
    }, {})

    if (!download)
        return json(
            {
                displayDate: dateObj.toLocaleDateString('pt-BR'),
                leituras
            },
            { status: 200 }
        )
    else {
        const format = download

        switch (format) {
            default:
                return json(null, { status: 400 })

            case 'json':
                const leiturasJsonFixed = fixDates(leituras)
                return json(leiturasJsonFixed, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    status: 200
                })

            case 'csv':
                return json(JSONtoCSV(leituras), {
                    headers: {
                        'Content-Type': 'text/csv'
                    },
                    status: 200
                })
        }
    }
}

function JSONtoCSV(dados: Leitura): string {
    const headers = new Set<string>()
    const rows: Record<string, string | number>[] = []

    Object.keys(dados).forEach(sensor => {
        Object.values(dados[sensor]).forEach((leitura, index) => {
            if (!rows[index]) rows[index] = {}
            Object.keys(leitura).forEach(key => {
                if (key === 'data_hora') {
                    headers.add('horario')
                    const date = new Date(leitura[key])
                    const hora =
                        date.getHours() < 10
                            ? `0${date.getHours()}`
                            : date.getHours()
                    const minuto =
                        date.getMinutes() < 10
                            ? `0${date.getMinutes()}`
                            : date.getMinutes()
                    const horario = `${hora}:${minuto}`
                    key = 'horario'
                    rows[index][key] = horario
                } else {
                    headers.add(`${sensor}/${key}`)
                    rows[index][`${sensor}/${key}`] = leitura[key]
                }
            })
        })
    })

    const csv =
        Array.from(headers).join(',') +
        '\n' +
        rows
            .map(row =>
                Array.from(headers)
                    .map(header => String(row[header]))
                    .join(',')
            )
            .join('\n')

    return csv
}

function fixDates(dados: Leitura): Leitura {
    Object.keys(dados).forEach(sensor => {
        Object.values(dados[sensor]).forEach(leitura => {
            const newDate = new Date(leitura.data_hora)
            newDate.setHours(newDate.getHours() - 3)
            leitura.data_hora = newDate.toISOString()
        })
    })
    return dados
}
