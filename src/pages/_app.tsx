import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import {SessionProvider, SessionProviderProps} from 'next-auth/react'

declare global {
  interface Window { $toastService: any }
}

export default function App({ Component, pageProps, session }: AppProps & SessionProviderProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
