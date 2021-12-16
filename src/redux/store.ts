import { applyMiddleware, combineReducers, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware, { ThunkMiddleware } from 'redux-thunk'
import auth from './authReducer'
import { AuthAction, AuthState, Dispatch } from './types'


const reducers = combineReducers({ auth })
const middleWare = thunkMiddleware as ThunkMiddleware<
  AuthState,
  AuthAction,
  any
>

const composeEnhancers = composeWithDevTools({ trace: true })
const compose =
  process.env.NODE_ENV === 'development'
    ? composeEnhancers(applyMiddleware<Dispatch, any>(middleWare))
    : applyMiddleware<Dispatch, any>(middleWare)

export const store = createStore(reducers, compose)
