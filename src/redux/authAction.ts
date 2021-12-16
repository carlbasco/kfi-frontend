import { Api, ApiAuth, Snackbar, Token } from '@lib'
import {
  AuthAction,
  AuthActionType,
  LoginPayload,
  PasswordPayload
} from '@redux'
import Router from 'next/router'
import { Dispatch } from 'redux'

class Auth {
  login = (payload: LoginPayload) => async (dispatch: Dispatch<AuthAction>) => {
    try {
      dispatch({ type: AuthActionType.request })
      const res = await Api.post('/api/auth/login', payload)
      const data = await res.data
      Token.set(data.accessToken)
      dispatch({ type: AuthActionType.success, payload: data.user })
      Snackbar.success(data.message)
    } catch (err) {
      dispatch({ type: AuthActionType.logout })
      if (err.response?.data) {
        Snackbar.error(err.response.data.message)
      }
    }
  }

  load = () => async (dispatch: Dispatch<AuthAction>) => {
    try {
      dispatch({ type: AuthActionType.loading })
      const res = await Api.get('/api/auth/user')
      const data = await res.data
      if (!Object.entries(data).length) {
        return dispatch({ type: AuthActionType.loaded })
      }
      Token.set(data.accessToken)
      return dispatch({ type: AuthActionType.success, payload: data.user })
    } catch (err) {
      dispatch({ type: AuthActionType.logout })
    }
  }

  logout = () => async (dispatch: Dispatch<AuthAction>) => {
    dispatch({ type: AuthActionType.request })
    try {
      await Api.post('/api/auth/logout').then(() => {
        dispatch({ type: AuthActionType.logout })
        Router.replace('/')
      })
      Snackbar.info('You have been logout')
    } catch (err) {
      if (err.response?.data) {
        Snackbar.error(err.response.data.message)
      }
    }
  }

  noUser = () => (dispatch: Dispatch<AuthAction>) => {
    dispatch({ type: AuthActionType.logout })
  }

  changePassword =
    (payload: PasswordPayload) => async (dispatch: Dispatch<AuthAction>) => {
      dispatch({ type: AuthActionType.request })
      try {
        const res = await ApiAuth.post('/api/auth/changepassword', payload)
        const data = await res.data
        Token.set(data.accessToken)
        dispatch({ type: AuthActionType.success, payload: data.user })
        Snackbar.success(data.message)
      } catch (err) {
        dispatch({ type: AuthActionType.response })
        if (err.response?.data) {
          Snackbar.error(err.response.data.message)
        }
      }
    }
}

export default new Auth()
