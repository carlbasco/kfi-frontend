import { AuthAction, AuthActionType, AuthState } from './types'

export const initialState = {
  user: {
    username: '',
    firstName: '',
    middleName: '',
    lastName: '',
    role: '',
    branchName: '',
  },
  isLoading: true,
  isAuthenticated: false,
  fetchRequest: false,
}

const authReducer = (state: AuthState = initialState, action: AuthAction) => {
  switch (action.type) {
    case AuthActionType.request:
      return {
        ...state,
        isLoading: false,
        fetchRequest: true,
      }
    case AuthActionType.response:
      return {
        ...state,
        isLoading: false,
        fetchRequest: false,
      }
    case AuthActionType.success:
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        isAuthenticated: true,
        fetchRequest: false,
      }
    case AuthActionType.loading:
      return {
        ...state,
        isLoading: true,
      }
    case AuthActionType.loaded:
      return {
        ...state,
        isLoading: false,
      }
    case AuthActionType.logout:
      return {
        ...initialState,
        isLoading: false,
      }
    default:
      return state
  }
}

export default authReducer
