/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import animationData from '@lottie/loading.json'
import { Player } from '@lottiefiles/react-lottie-player'
import { Backdrop, Typography } from '@mui/material'


const Loading = ({ open }: { open: boolean }) => {
  return (
    <>
      <Backdrop
        open={open}
        sx={{ zIndex: 'modal', backgroundColor: 'rgb(0 0 0 / 90%)' }}
      >
        <div css={styles.root}>
          <Player
            autoplay
            loop={true}
            css={styles.player}
            src={animationData}
          />
          <Typography variant="h5" css={styles.typography}>
            LOADING...
          </Typography>
        </div>
      </Backdrop>
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
  `,
  player: css`
    width: 100%;
  `,
  typography: css`
    color: #fff;
    margin-top: -6em;
    font-weight: 700;
    font-family: 'Open Sans';
  `,
}

export default Loading
