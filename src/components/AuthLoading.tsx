/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import animationData from '@lottie/loading.json'
import { Player } from '@lottiefiles/react-lottie-player'
import { Typography } from '@mui/material'


const AuthLoading = () => {
  return (
    <>
      <div css={styles.root}>
        <Player autoplay css={styles.player} src={animationData} loop={true} />
        <Typography css={styles.text} variant="h5">
          LOADING...
        </Typography>
      </div>
    </>
  )
}

const styles = {
  root: css`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    z-index: 10000;
    height: 100vh;
  `,
  player: css`
    width: 100%;
  `,
  text: css`
    color: black;
    margin-top: -6em;
    font-weight: 700;
    font-family: 'Open Sans', sans-serif;
  `,
}

export default AuthLoading
