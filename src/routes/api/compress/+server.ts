import { inflateSync, deflateSync } from 'zlib'

import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request }) => {
    if (request.headers.get('key') !== '123')
        return new Response(null, { status: 403 })

    const headers = request.headers

    const input = JSON.parse(
        await (
            await request.arrayBuffer().then(buffer => Buffer.from(buffer))
        ).toString()
    ).input

    if (!input) return new Response(null, { status: 400 })

    switch (headers.get('modo')) {
        case 'compress':
            const compressed = deflateSync(JSON.stringify(input)).toString(
                'base64'
            )
            return new Response(JSON.stringify({ output: compressed }), {
                status: 200
            })

        case 'decompress':
            const decompressed = JSON.parse(
                inflateSync(Buffer.from(input, 'base64')).toString()
            )
            return new Response(JSON.stringify({ output: decompressed }), {
                status: 200
            })

        default:
            return new Response(null, { status: 400 })
    }
}
