import { ThunkDispatch } from 'redux-thunk'

export interface User {
  username: string
  firstName: string
  middleName?: string
  lastName: string
  role: string
  branchName: string
}

export interface AuthState {
  user: User
  isLoading: boolean
  isAuthenticated: boolean
  fetchRequest: boolean
}

export type ReduxState = {
  auth: AuthState
}

export interface LoginPayload {
  username: string
  password: string
}

export interface PasswordPayload {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export enum AuthActionType {
  request = 'request',
  response = 'response',
  success = 'success',
  loading = 'loading',
  loaded = 'loaded',
  logout = 'logout',
}

export interface AuthResponse {
  type: typeof AuthActionType.response
}
export interface AuthRequest {
  type: typeof AuthActionType.request
}
export interface AuthSuccess {
  type: typeof AuthActionType.success
  payload: User
}
export interface AuthLoaded {
  type: typeof AuthActionType.loaded
}
export interface AuthLoading {
  type: typeof AuthActionType.loading
}
export interface AuthLogout {
  type: typeof AuthActionType.logout
}

export type AuthAction =
  | AuthResponse
  | AuthRequest
  | AuthSuccess
  | AuthLoading
  | AuthLoaded
  | AuthLogout

export type Dispatch = ThunkDispatch<AuthState, any, AuthAction>
