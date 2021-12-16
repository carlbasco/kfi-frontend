import { Api } from '@lib'
import { AuthActionType, store } from '@redux'

class Token {
  private accessToken
  constructor() {
    this.accessToken = ''
  }
  set(token: string) {
    this.accessToken = token
  }
  get() {
    return this.accessToken
  }
  requestServer = async (refreshToken: string) => {
    try {
      const res = await Api({
        url: '/api/auth/token',
        method: 'GET',
        headers: {
          cookie: 'tid=' + refreshToken,
        },
      })
      const data = await res.data
      this.accessToken = data
    } catch (err) {
      if (err.response.status === 401) {
        store.dispatch({ type: AuthActionType.logout })
      }
    }
  }
}

export default new Token()
