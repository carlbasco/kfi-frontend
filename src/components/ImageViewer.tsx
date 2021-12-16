/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Close, CloudDownload } from '@mui/icons-material'
import { Backdrop, IconButton } from '@mui/material'
import { Box } from '@mui/system'
import { downloadImage } from '@utils'


interface Props {
  src: string
  open: boolean
  handleImageViewer: () => void
}

const ImageViewer = (props: Props) => {
  const onClickDownload = () => {
    downloadImage(props.src)
  }
  return (
    <>
      <Backdrop
        open={props.open}
        sx={{ zIndex: 'tooltip', backgroundColor: 'rgb(0 0 0 / 90%)' }}
      >
        <Box css={styles.box}>
          <IconButton css={styles.downloadBtn} onClick={onClickDownload}>
            <CloudDownload fontSize="large" />
          </IconButton>
          <IconButton css={styles.closeBtn} onClick={props.handleImageViewer}>
            <Close />
          </IconButton>
        </Box>
        <Box css={styles.rootBox}>
          <img src={props.src} alt="image" css={styles.image} />
        </Box>
      </Backdrop>
    </>
  )
}

const styles = {
  rootBox: css`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  `,
  image: css`
    border-radius: 8px;
    max-width: 700px;
    margin: auto;
    display: block;
    width: 80%;
    @media only screen and (max-width: 600px) {
      width: 90%;
    }
  `,
  closeBtn: css`
    color: #fff;
    transition: transform 0.2s;
    &:hover {
      transform: scale(1.3);
    }
  `,
  box: css`
    right: 0;
    top: 0;
    position: absolute;
  `,
  downloadBtn: css`
    color: #fff;
    transition: transform 0.2s;
    &:hover {
      transform: scale(1.2);
    }
  `,
}

export default ImageViewer
