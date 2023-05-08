import type { RequestHandler } from './$types'
import { json } from '@sveltejs/kit'
import { prisma } from '$lib/prisma'

export const GET: RequestHandler = async ({ request, url }) => {
    const userId = Number(url.searchParams.get('userId'))

    if (!userId || isNaN(userId)) {
        return json(
            { message: 'Id faltando ou não é um número' },
            { status: 400 }
        )
    }

    const user = await prisma.usuarios.findUnique({
        where: {
            id: userId
        }
    })

    if (!user) {
        return json({ message: 'Usuário não encontrado' }, { status: 404 })
    }

    const userSensores = await prisma.sensores_de_usuario.findMany({
        where: {
            id_de_usuario: userId
        },
        select: {
            id_de_sensor: true,
            descricao: true
        }
    })

    const sensores = await prisma.sensores.findMany({
        where: {
            id: {
                in: userSensores.map(sensor => sensor.id_de_sensor)
            }
        }
    })

    return json({
        user: { ...user, sensores_do_usuario: userSensores },
        sensores
    })
}
