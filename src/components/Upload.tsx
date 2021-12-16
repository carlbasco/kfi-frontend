/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Close } from '@mui/icons-material'
import { IconButton, Typography } from '@mui/material'
import { Dispatch, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'

const Upload = ({ files, setFiles, filetypes }: Props) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: filetypes,
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      )
    },
  })

  const removeFile = (file: any) => () => {
    const newFiles = [...files]
    newFiles.splice(newFiles.indexOf(file), 1)
    setFiles(newFiles)
  }

  const thumbs = files?.map((file: any) => (
    <div css={styles.thumb} key={file.name}>
      <div css={styles.thumbInner}>
        <IconButton
          size="small"
          css={styles.btnRemove}
          onClick={removeFile(file)}
        >
          <Close />
        </IconButton>
        {file.name.split('.').pop() === 'mp4' ? (
          <video width="200" controls>
            <source src={file.preview} type="video/mp4" />
          </video>
        ) : (
          <img width="150" height="100" src={file.preview} alt="upload" />
        )}
      </div>
    </div>
  ))

  useEffect(
    () => () => {
      files?.forEach((file: any) => URL.revokeObjectURL(file.preview))
    },
    [files]
  )

  return (
    <section className="container">
      <div {...getRootProps({ className: 'dropzone' })} css={styles.dropZone}>
        <input {...getInputProps()} />
        <Typography variant="subtitle1">
          Drag &rsquo; drop some files here, or click to select files
        </Typography>
        <Typography variant="caption" fontWeight={700}>Maximum size per file: 5mb</Typography>
        
      </div>
      <aside css={styles.thumbsContainer}>{thumbs}</aside>
    </section>
  )
}

const styles = {
  thumbsContainer: css`
    margin-top: 1em;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 16;
    justify-content: center;
  `,
  thumb: css`
    display: inline-flex;
    border-radius: 2;
    margin-bottom: 8;
    margin-right: 8;
    width: 100;
    height: 100;
    padding: 4;
    box-sizing: border-box;
    margin: 0.5em 0.5em;
  `,
  thumbInner: css`
    display: flex;
    min-width: 0;
    position: relative;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    padding: 0.4em;
  `,
  img: css`
    display: block;
    width: 150px;
    height: 100px;
  `,
  dropZone: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border-width: 2px;
    border-radius: 2px;
    border-color: rgba(0, 0, 0, 0.21);
    border-style: dashed;
    color: rgba(0, 0, 0, 0.87);
    outline: none;
    transition: border 0.24s ease-in-out;
    &:hover {
      cursor: pointer;
    }
  `,
  btnRemove: css`
    position: absolute;
    z-index: 100;
    top: -10px;
    right: -10px;
    background-color: #e61d20;
    color: #fff;
    border-radius: 50%;
    border: 0;
    &:hover {
      background-color: #961e2e;
      border: 0;
    }
  `,
}

interface Props {
  setFiles: Dispatch<any>
  files: any
  filetypes: string
}

export default Upload
