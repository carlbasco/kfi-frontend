/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import animationData from '@lottie/404.json'
import { Player } from '@lottiefiles/react-lottie-player'
import { Button } from '@mui/material'
import Head from 'next/head'
import Link from 'next/link'

const Error404 = () => {
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div css={styles.root}>
        <Player
          css={styles.player}
          src={animationData}
          loop={true}
          autoplay={true}
        />
        <Link href="/" passHref>
          <Button variant="outlined" color="secondary">
            Go Back
          </Button>
        </Link>
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
    height: 100vh;
  `,
  player: css`
    width: 100%;
  `,
}

export default Error404
