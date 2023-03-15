import type { RequestHandler } from './$types'

function JSONtoCSV(dados: Leitura): string {
    const headers = new Set<string>()
    const rows: Record<string, string | number>[] = []

    Object.keys(dados).forEach(sensor => {
        Object.values(dados[sensor]).forEach((leitura, index) => {
            if (!rows[index]) rows[index] = {}
            Object.keys(leitura).forEach(key => {
                if (key === 'data_hora') {
                    headers.add('horario')
                    const date = new Date(leitura[key]).toLocaleTimeString(
                        'pt-BR',
                        {
                            hour: '2-digit',
                            minute: '2-digit'
                        }
                    )
                    key = 'horario'
                    rows[index][key] = date
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

export const GET: RequestHandler = async ({ request, url, fetch }) => {
    const headers = request.headers
    if (headers.get('key') !== '123')
        return new Response(JSON.stringify({ message: 'no key' }), {
            status: 403
        })

    const format = url.searchParams.get('format')

    const leituras = await fetch(
        `/api/leituras?date=${url.searchParams.get('date')}`,
        {
            headers: {
                key: '123'
            }
        }
    )

    if (leituras.status === 404) return new Response(null, { status: 404 })

    const leiturasJson = await leituras.json()

    switch (format) {
        default:
            return new Response(null, { status: 400 })

        case 'json':
            return new Response(JSON.stringify(leiturasJson.leituras), {
                headers: {
                    'Content-Type': 'application/json'
                },
                status: 200
            })

        case 'csv':
            return new Response(JSONtoCSV(leiturasJson.leituras), {
                headers: {
                    'Content-Type': 'text/csv'
                },
                status: 200
            })
    }
}
