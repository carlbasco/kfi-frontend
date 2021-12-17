import { Loading, ProtectedRoute } from '@components'
import { NotiStackProvider, SwrProvider } from '@lib'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { store } from '@redux'
import theme from '@styles/theme'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Router from 'next/router'
import { useEffect, useState } from 'react'
import { Provider } from 'react-redux'

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    Router.events.on('routeChangeStart', () => setLoading(true))
    Router.events.on('routeChangeComplete', () => setLoading(false))
    Router.events.on('routeChangeError', () => setLoading(false))
    return () => {
      Router.events.off('routeChangeStart', () => setLoading(true))
      Router.events.off('routeChangeComplete', () => setLoading(false))
      Router.events.off('routeChangeError', () => setLoading(false))
    }
  }, [])

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Kamanggagawa Foundation Inc</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <SwrProvider>
        <NotiStackProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Loading open={loading} />
            <Provider store={store}>
              <ProtectedRoute Component={Component} pageProps={pageProps} />
            </Provider>
          </ThemeProvider>
        </NotiStackProvider>
      </SwrProvider>
    </>
  )
}

export default MyApp
