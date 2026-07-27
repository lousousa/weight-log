import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'

declare global {
  interface Window { $toastService: any }
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session} refetchOnWindowFocus={false}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
