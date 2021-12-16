/** @jsxImportSource @emotion/react */
import { ImageViewer, Upload } from '@components'
import { css } from '@emotion/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { ApiAuth, Snackbar } from '@lib'
import { Close } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  IconButton,
  MenuItem,
  TextField
} from '@mui/material'
import { Box } from '@mui/system'
import { ReduxState } from '@redux'
import {
  AssessmentDefaultValues,
  AssessmentForm,
  AssessmentFormYup
} from '@validation'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import useSWR, { mutate } from 'swr'

const urlAPI = process.env.NEXT_PUBLIC_API_URL!

const DialogAssessment = ({ id, open, handleDialog }: Props) => {
  const auth = useSelector((state: ReduxState) => state.auth)
  const { data: recommendationApi } = useSWR(
    `/api/option/recommendation/${id}`,
    { refreshInterval: 0 }
  )
  const { data } = useSWR(open && id ? `/api/case/${id}/assessment` : null, {
    refreshInterval: 0,
  })
  const [files, setFiles] = useState<any | null>([])
  const [fetchLoading, setFetchLoading] = useState(false)
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: AssessmentDefaultValues,
    resolver: yupResolver(AssessmentFormYup),
  })

  const handleCloseDialog = () => {
    setFiles(null)
    handleDialog()
  }

  useEffect(() => {
    if (data) {
      setValue(
        'findings',
        data.Assessment?.findings ? data.Assessment.findings : ''
      )
      setValue(
        'recommendationId',
        data.Assessment?.recommendationId
          ? data.Assessment.recommendationId
          : ''
      )
      setValue(
        'recommendationDetails',
        data.Assessment?.recommendationDetails
          ? data.Assessment?.recommendationDetails
          : ''
      )
      if (data.CaseFileRequirement?.length > 0) {
        data.CaseFileRequirement.forEach((item: any, i: number) => {
          setValue(`CaseFileRequirement.${i}.id`, item.id),
            setValue(`CaseFileRequirement.${i}.submitted`, item.submitted)
        })
      }
    }
  }, [data, setValue])

  const onSubmit: SubmitHandler<AssessmentForm> = async (values) => {
    const fd = new FormData()
    if (files?.length > 0) {
      files.forEach((file: any) => {
        fd.append('files', file)
      })
    }
    fd.append('data', JSON.stringify(values))
    try {
      setFetchLoading(true)
      const res = await ApiAuth.put(`/api/case/${id}/assessment`, fd)
      const data = await res.data
      mutate(`/api/sw/case/${id}`)
      mutate(`/api/case/${id}/assessment`)
      Snackbar.success(data.message)
      setFetchLoading(false)
      handleCloseDialog()
    } catch (err) {
      setFetchLoading(false)
      if (err.response?.data) Snackbar.error(err.response.data.message)
    }
  }

  const [openImgViewer, setOpenImgViewer] = useState(false)
  const handleImageViewer = () => {
    setOpenImgViewer(!openImgViewer)
  }
  const [img, setImg] = useState('')
  const onClickImg = (url: string) => {
    setImg(url)
    handleImageViewer()
  }

  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const deleteCaseFile = async (caseFileId: number) => {
    try {
      closeSnackbar()
      setFetchLoading(true)
      const res = await ApiAuth.delete(`/api/case/file/${caseFileId}`)
      const data = await res.data
      setFetchLoading(false)
      mutate(`/api/case/${id}/assessment`)
      closeSnackbar()
      Snackbar.success(data.message)
    } catch (err) {
      if (err.response?.data) Snackbar.error(err.response?.data?.message)
    }
  }
  const onClickDelete = (caseFileId: number) => {
    enqueueSnackbar('Are you sure you want to delete this file?', {
      variant: 'warning',
      autoHideDuration: 10000,
      action: () => (
        <>
          <Button
            size="small"
            color="error"
            variant="text"
            css={styles.btnSnackbar}
            onClick={() => deleteCaseFile(caseFileId)}
          >
            Delete
          </Button>
          <Button
            size="small"
            variant="text"
            color="inherit"
            css={styles.btnSnackbar}
            onClick={() => closeSnackbar()}
          >
            Dismiss
          </Button>
        </>
      ),
    })
  }

  return (
    <>
      <Dialog fullWidth maxWidth="sm" open={open}>
        <DialogTitle>
          Case Assessment
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        {data ? (
          <form>
            <DialogContent>
              <Controller
                name="findings"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    minRows={5}
                    maxRows={10}
                    margin="normal"
                    variant="outlined"
                    label="Case Findings"
                    error={Boolean(errors.findings)}
                    helperText={errors.findings?.message}
                  />
                )}
              />
              <Controller
                name="recommendationId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    required
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    label="Recommendation"
                    error={Boolean(errors.recommendationId)}
                    helperText={errors.recommendationId?.message}
                  >
                    <MenuItem value="">
                      <em>----------</em>
                    </MenuItem>
                    {recommendationApi?.map((item: any) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.recommendationName}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="recommendationDetails"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    multiline
                    minRows={5}
                    maxRows={10}
                    margin="normal"
                    variant="outlined"
                    label="Recommendation Details"
                    error={Boolean(errors.recommendationDetails)}
                    helperText={errors.recommendationDetails?.message}
                  />
                )}
              />
              <Divider css={styles.divider}>Case Requirements</Divider>
              {data?.CaseFileRequirement && (
                <>
                  {data?.CaseFiles.length > 0 && (
                    <>
                      <FormHelperText>
                        Once you click X button on image, it will de deleted on
                        server.
                      </FormHelperText>
                      <div css={styles.boxDownload}>
                        {data?.CaseFiles.map((item: Files) => {
                          const url = urlAPI + item.filePath
                          return item.filePath.split('.').pop() === 'mp4' ? (
                            <div css={styles.divBtn} key={item.id}>
                              <IconButton
                                size="small"
                                css={styles.btnRemove}
                                onClick={() => onClickDelete(item.id)}
                              >
                                <Close />
                              </IconButton>
                              <video width="200" controls>
                                <source src={url} type="video/mp4" />
                              </video>
                            </div>
                          ) : (
                            <div css={styles.divBtn} key={item.id}>
                              <IconButton
                                size="small"
                                css={styles.btnRemove}
                                onClick={() => onClickDelete(item.id)}
                              >
                                <Close />
                              </IconButton>
                              <div css={styles.img}>
                                <a onClick={() => onClickImg(url)}>
                                  <img
                                    width="150"
                                    height="100"
                                    alt="case-img"
                                    src={url}
                                  />
                                </a>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  )}
                  <FormHelperText>
                    Please check for the corresponding file that you submit
                  </FormHelperText>
                  <FormGroup row>
                    {data?.CaseFileRequirement?.map((item: any, i: number) => (
                      <FormControlLabel
                        key={item.id}
                        control={
                          <Controller
                            name={`CaseFileRequirement.${i}.submitted`}
                            control={control}
                            render={({ field }) => {
                              return (
                                <Checkbox
                                  checked={field.value === true ? true : false}
                                  onChange={(e) =>
                                    field.onChange(e.target.checked)
                                  }
                                />
                              )
                            }}
                          />
                        }
                        label={item.requirements?.requirementsName}
                      />
                    ))}
                  </FormGroup>
                  <Box>
                    <Upload
                      filetypes="image/* , video/mp4"
                      files={files}
                      setFiles={setFiles}
                    />
                  </Box>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <LoadingButton
                color="success"
                loading={fetchLoading}
                onClick={() => {
                  setValue('method', 'save')
                  handleSubmit(onSubmit)()
                }}
              >
                Save
              </LoadingButton>
              {auth.user.role !== 'admin' && (
                <LoadingButton
                  loading={fetchLoading}
                  onClick={() => {
                    setValue('method', 'submit')
                    handleSubmit(onSubmit)()
                  }}
                >
                  Submit
                </LoadingButton>
              )}
            </DialogActions>
          </form>
        ) : (
          <>
            <DialogContent>
              <Box css={styles.boxLoading}>
                <CircularProgress />
              </Box>
            </DialogContent>
          </>
        )}
        <ImageViewer
          src={img}
          open={openImgViewer}
          handleImageViewer={handleImageViewer}
        />
      </Dialog>
    </>
  )
}

interface Props {
  id: string | string[]
  open: boolean
  handleDialog: () => void
}

interface Files {
  filePath: string
  id: number
}

const styles = {
  divider: css`
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  `,
  boxLoading: css`
    display: flex;
    justify-content: center;
    margin-bottom: 2.5em;
  `,
  boxDownload: css`
    margin-top: 1em;
    display: flex;
    flex-wrap: wrap;
    gap: 2em;
    justify-content: center;
    align-items: center;
  `,
  img: css`
    padding: 0.4em;
    padding-bottom: 0;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    cursor: pointer;
  `,
  divBtn: css`
    position: relative;
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
  btnSnackbar: css`
    margin-left: 0.5em;
    margin-right: 0.5em;
  `,
}

export default DialogAssessment
