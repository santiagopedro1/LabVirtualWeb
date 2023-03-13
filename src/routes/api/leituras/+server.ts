import { prisma } from '$lib/prisma'
import { getDateForQuery, getDateObj } from '$lib/dateUtils'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ request, url }) => {
    const headers = request.headers
    if (headers.get('key') !== '123')
        return new Response(JSON.stringify({ message: 'no key' }), {
            status: 403
        })

    const date = url.searchParams.get('date')
    if (!date)
        return new Response(JSON.stringify({ message: 'no date' }), {
            status: 400
        })

    const dateObj = getDateObj(date)
    if (!dateObj)
        return new Response(JSON.stringify({ message: 'invalid date' }), {
            status: 400
        })

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

    if (queryRes.length === 0) return new Response(null, { status: 404 })

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
            data_hora: data_hora.toISOString(),
            ...leitura
        })

        return acc
    }, {})

    return new Response(
        JSON.stringify({
            displayDate: dateObj.toLocaleDateString('pt-BR'),
            leituras,
            datas: {
                inicioDia,
                fimDia
            }
        }),
        { status: 200 }
    )
}
