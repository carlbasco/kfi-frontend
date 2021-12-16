import { AuthLoading } from '@components'
import Error404 from '@pages/404'
import { Auth, ReduxState } from '@redux'
import { NextComponentType, NextPageContext } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const ProtectedRoute = ({ Component, pageProps }: Props) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const authState = useSelector((state: ReduxState) => state.auth)
  const {
    user: { role },
    isLoading,
  } = authState

  useEffect(() => {
    dispatch(Auth.load())
  }, [dispatch])

  let allowed = true
  if (
    (role !== 'admin' && router.pathname.startsWith('/admin')) ||
    (role !== 'socialworker' && router.pathname.startsWith('/socialworker')) ||
    (role !== 'programHead' && router.pathname.startsWith('/programhead')) ||
    (role !== 'branchHead' && router.pathname.startsWith('/brachhead'))
  ) {
    allowed = false
  }
  const ComponentToRender = allowed ? Component : Error404
  return (
    <>{isLoading ? <AuthLoading /> : <ComponentToRender {...pageProps} />}</>
  )
}

interface Props {
  Component: NextComponentType<NextPageContext, any, {}>
  pageProps: any
}

export default ProtectedRoute
