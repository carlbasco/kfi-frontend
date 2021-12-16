/** @jsxImportSource @emotion/react */
import { AuthLoading } from '@components'
import { css } from '@emotion/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Person, Visibility, VisibilityOff } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { Auth, AuthState, LoginPayload, ReduxState } from '@redux'
import { LoginDefaultValues, LoginForm, LoginFormYup } from '@validation'
import Head from 'next/head'
import Image from 'next/image'
import Router from 'next/router'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import logo from '../../public/logo.png'

const Home = () => {
  const [showPassword, setShowPassword] = useState(false)

  const dispatch = useDispatch()
  const authState = useSelector((state: ReduxState) => state.auth)
  const { user, isAuthenticated, fetchRequest, isLoading } = authState
  useEffect(() => {
    if (isAuthenticated) {
      if (user.role === 'admin') Router.replace('/admin')
      if (user.role === 'programHead') Router.replace('/programhead')
      if (user.role === 'socialworker') Router.replace('/socialworker')
      if (user.role === 'branchHead') Router.replace('/branchhead')
    }
  }, [user, isAuthenticated])

  const { control, handleSubmit, formState } = useForm({
    defaultValues: LoginDefaultValues,
    resolver: yupResolver(LoginFormYup),
  })
  const errors = formState.errors
  const onSubmit: SubmitHandler<LoginForm> = async (values) => {
    dispatch(Auth.login(values))
  }
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  if (isAuthenticated) return <AuthLoading />
  return (
    <>
      <Head>
        <title>Login - Kamanggagawa Foundation Inc</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div css={styles.main}>
        <Container maxWidth="sm" css={styles.container}>
          <Box css={styles.box}>
            <div css={styles.logo}>
              <Image src={logo} alt="logo" width={120} height={120} />
            </div>
            <Typography css={styles.company} variant="h6">
              KAMANGGAGAWA FOUNDATION INC.
            </Typography>
            <Typography variant="body2" gutterBottom>
              Login to your account
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    id="username"
                    margin="normal"
                    label="Username"
                    error={Boolean(errors.username)}
                    helperText={errors.username?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Person />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    id="password"
                    margin="normal"
                    label="Password"
                    error={Boolean(errors.password)}
                    helperText={errors.password?.message}
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                            css={styles.iconBtn}
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
              <LoadingButton
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                loading={fetchRequest}
                css={styles.btn}
              >
                Login
              </LoadingButton>
            </form>
          </Box>
        </Container>
      </div>
    </>
  )
}

interface Props {
  authState: AuthState
  login: (data: LoginPayload) => Promise<any>
}

const styles = {
  main: css`
    height: 100vh;
    background: url(/wave.svg);
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-repeat: no-repeat;
    background-size: cover;
  `,
  formControl: css`
    margin-bottom: 1.2em;
  `,
  loginBox: css`
    border-radius: 15px;
    padding: 3em 1.5em;
    max-width: 420px;
    display: flex;
    flex-direction: column;
  `,
  logo: css`
    display: flex;
    justify-content: center;
  `,
  container: css`
    display: flex;
    justify-content: center;
  `,
  divider: css`
    margin-bottom: 1.5em;
  `,
  iconBtn: css`
    border: none;
  `,
  company: css`
    font-weight: 700;
    font-family: 'Open sans';
    color: #0f3b68;
    line-height: 1;
    text-align: center;
    margin-bottom: 3em;
  `,
  btn: css`
    margin-top: 1.2em;
  `,
  box: css`
    max-width: 440px;
    padding-left: 2em;
    padding-right: 2em;
  `,
}

export default Home
