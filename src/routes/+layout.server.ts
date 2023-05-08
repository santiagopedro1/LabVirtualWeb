import type { LayoutServerLoad } from './$types'

export const load = (async ({ cookies }) => {
    let theme = cookies.get('labvTheme')
    switch (theme) {
        case 'dark':
            cookies.set('labvTheme', theme, {
                maxAge: 60 * 60 * 24 * 365,
                path: '/',
                sameSite: 'lax',
                httpOnly: false
            })
            break
        case 'light':
            cookies.set('labvTheme', theme, {
                maxAge: 60 * 60 * 24 * 365,
                path: '/',
                sameSite: 'lax',
                httpOnly: false
            })
            break
        default:
            theme = 'light'
            cookies.set('labvTheme', theme, {
                maxAge: 60 * 60 * 24 * 365,
                path: '/',
                sameSite: 'lax',
                httpOnly: false
            })
    }
    return {
        theme: theme
    }
}) satisfies LayoutServerLoad
