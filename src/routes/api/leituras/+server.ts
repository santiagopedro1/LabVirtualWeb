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

  const leituras = await prisma.leituras_de_sensor.findMany({
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

  if (leituras.length === 0) return new Response(null, { status: 404 })
  else
    return new Response(
      JSON.stringify({
        displayDate: dateObj.toLocaleDateString('pt-BR'),
        leituras: leituras
      }),
      { status: 200 }
    )
}
