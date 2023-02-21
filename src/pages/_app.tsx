import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import ToastService from '@/components/toastService'

declare global {
  interface Window { $toastService: any }
}

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
