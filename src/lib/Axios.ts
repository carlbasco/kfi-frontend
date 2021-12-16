import { Snackbar, Token } from '@lib'
import { AuthActionType, store } from '@redux'
import axios from 'axios'
import jwtDecode, { JwtPayload } from 'jwt-decode'
import Router from 'next/router'
import { SWRConfiguration } from 'swr'


export const baseURL =
  process.env.NEXT_PUBLIC_API_URL! || 'http://localhost:3001'
axios.defaults.baseURL = baseURL
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/json'

//request for not authenticated
export const Api = axios.create()
Api.interceptors.response.use(
  (res) => {
    return res
  },
  async (err) => {
    return Promise.reject(err)
  }
)

//request for authenticated
export const ApiAuth = axios.create()
let cancelToken: any
ApiAuth.interceptors.request.use(async (config) => {
  if (typeof cancelToken != typeof undefined)
    cancelToken.cancel('Request was canceled due to duplication')
  cancelToken = axios.CancelToken.source()
  if (Token.get() === '') {
    await Api.get('/Api/auth/token', { cancelToken: cancelToken.token }).then(
      (res) => {
        Token.set(res.data)
      }
    )
  } else {
    const decoded = jwtDecode<JwtPayload>(Token.get())
    if (Date.now() >= decoded.exp! * 1000) {
      await Api.get('/Api/auth/token', { cancelToken: cancelToken.token }).then(
        (res) => Token.set(res.data)
      )
    }
  }
  if (config.headers) config.headers['Authorization'] = 'Bearer ' + Token.get()
  return config
})

ApiAuth.interceptors.response.use(
  (res) => {
    return res
  },
  async function (err) {
    if (err.response.status === 401) {
      store.dispatch({ type: AuthActionType.logout })
      Snackbar.info(err.response.data.message)
      Router.replace('/')
    }
    return Promise.reject(err)
  }
)

export const swrConfig: SWRConfiguration = {
  fetcher: (url: string) => ApiAuth.get(url).then((res) => res.data),
  refreshInterval: 1000 * 60,
}

export const fetcher = (url: string) => ApiAuth.get(url).then((res) => res.data)
