//user-service/frontend/pages/_app.js
//todo: Update data fetching – see: https://nextjs.org/docs/pages/building-your-application/routing/custom-app
import {SessionProvider} from 'next-auth/react'

export default function MyApp({Component, pageProps}) {
    return (
            <SessionProvider session={pageProps.session}>
                <Component {...pageProps} />
            </SessionProvider>
    )
}
