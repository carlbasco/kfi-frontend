/** @jsxImportSource @emotion/react */
import { AssessmentRemark, ImageViewer, Loading } from '@components'
import { css } from '@emotion/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { ProgramHeadLayout } from '@layouts'
import { ApiAuth, Snackbar } from '@lib'
import { Cancel, CheckCircle } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import {
  CaseHeadDefaultValues,
  CaseHeadForm,
  CaseHeadFormYup
} from '@validation'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import useSWR, { mutate } from 'swr'

dayjs.extend(localizedFormat)
const urlAPI = process.env.NEXT_PUBLIC_API_URL!

const Case = () => {
  const router = useRouter()
  const { id } = router.query
  const { data, error, isValidating } = useSWR(
    id ? `/api/head/case/${id}` : null
  )

  const [loading, setLoading] = useState(true)
  useEffect(() => {
    !isValidating && setLoading(false)
  }, [isValidating])

  const [openImgViewer, setOpenImgViewer] = useState(false)
  const handleImageViewer = () => {
    setOpenImgViewer(!openImgViewer)
  }
  const [img, setImg] = useState('')
  const onClickImg = (url: string) => {
    setImg(url)
    handleImageViewer()
  }

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [onSubmitState, setOnSubmitState] = useState<'accept' | 'reject'>(
    'accept'
  )
  const handleConfirmDialog = () => {
    setOpenConfirmDialog(!openConfirmDialog)
  }
  const onClickConfirm = (state: 'accept' | 'reject') => {
    window.scrollTo(0, 0)
    setOnSubmitState(state)
    handleConfirmDialog()
  }

  const [openAssessmentConfirmDialog, setOpenAssessmentConfirmDialog] =
    useState(false)
  const [assessmentMethod, setAssessmentMethod] = useState<'accept' | 'reject'>(
    'accept'
  )
  const handleAssessmentConfirmDialog = () => {
    setOpenAssessmentConfirmDialog(!openAssessmentConfirmDialog)
  }

  const [openCompleteDialog, setOpenCompleteDialog] = useState(false)
  const handleCompleteDialog = () => {
    setOpenCompleteDialog(!openCompleteDialog)
  }

  return (
    <>
      <Head>
        <title>Case - Kamanggagawa Foundation Inc</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Loading open={loading} />
      <ProgramHeadLayout>
        <Box css={styles.box}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link href="/programhead">
              <a css={styles.link}>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  css={styles.linkText}
                >
                  Dashboard
                </Typography>
              </a>
            </Link>
            <Typography css={styles.linkActive} variant="subtitle1">
              Case
            </Typography>
          </Breadcrumbs>
        </Box>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={12} md={8} css={styles.grid}>
            <Paper variant="outlined" css={styles.paper}>
              {error ? (
                <Box display="flex" justifyContent="center">
                  <Typography variant="h6">Case not found</Typography>
                </Box>
              ) : data ? (
                <>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Case ID:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">{id}</Typography>
                    </Grid>
                    <Grid item xs={4} sm={6}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Status:
                      </Typography>
                    </Grid>
                    <Grid item xs={8} sm={6}>
                      {data?.status === 'rejected' ? (
                        <Chip
                          size="small"
                          color="error"
                          variant="filled"
                          label={data?.status}
                        />
                      ) : data?.status === 'ongoing' ? (
                        <Chip
                          size="small"
                          color="secondary"
                          variant="filled"
                          label="on-going"
                        />
                      ) : data?.status === 'completed' ? (
                        <Chip
                          size="small"
                          color="success"
                          variant="filled"
                          label={data?.status}
                        />
                      ) : data?.status === 'pendingForAssessment' ? (
                        <Chip
                          size="small"
                          label="pending for assessment"
                          color="warning"
                        />
                      ) : data?.status === 'pendingForReview' ? (
                        <Chip
                          size="small"
                          label="pending for review"
                          color="warning"
                        />
                      ) : (
                        <Chip
                          size="small"
                          label={data?.status}
                          color="warning"
                        />
                      )}
                    </Grid>
                  </Grid>

                  {data.Background && (
                    <>
                      <Divider css={styles.middle}>
                        Background Information
                      </Divider>
                      <Grid container>
                        <Grid item xs={6} sm={4}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            Name:
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={8}>
                          <Typography variant="body1">
                            {`${data.Background.firstName} ${data.Background?.middleName} ${data.Background.lastName}`}
                          </Typography>
                        </Grid>
                        {data.Background?.nickname && (
                          <>
                            <Grid item xs={6} sm={4}>
                              <Typography variant="subtitle1" fontWeight={700}>
                                Nickname:
                              </Typography>
                            </Grid>
                            <Grid item xs={6} sm={8}>
                              <Typography variant="body1">
                                {data?.Background.nickname}
                              </Typography>
                            </Grid>
                          </>
                        )}
                        <Grid item xs={6} sm={4}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            Age:
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={8}>
                          <Typography variant="body1">
                            {data.Background.age}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            Sex:
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={8}>
                          <Typography variant="body1">
                            {data.Background.sex}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            Civil Status:
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={8}>
                          <Typography variant="body1">
                            {data.Background.civilStatus}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            Birth Date:
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={8}>
                          <Typography variant="body1">
                            {new Date(
                              data.Background.birthDate
                            ).toLocaleDateString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            Religion:
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={8}>
                          <Typography variant="body1">
                            {data?.Background.religion?.religionName}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            Education:
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={8}>
                          <Typography variant="body1">
                            {data?.Background.education?.educationName}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            Occuptaion:
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={8}>
                          <Typography variant="body1">
                            {data?.Background.occupation?.occupationName}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            Monthly Income:
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={8}>
                          {data?.Background.income ? (
                            <Typography variant="body1">
                              ₱{data.Background.income?.from.toLocaleString()}
                              &nbsp;&nbsp;-&nbsp;&nbsp;
                              {data.Background.income?.to.toLocaleString()}
                            </Typography>
                          ) : (
                            <Typography variant="body1">n/a</Typography>
                          )}
                        </Grid>

                        <Grid item xs={6} sm={4}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            Contact Number:
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={8}>
                          {data?.Background.phone && (
                            <Typography variant="body1">
                              +63&nbsp;{data.Background.phone}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            Address:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                          <Typography variant="body1">
                            {data?.Background.address}&nbsp;&nbsp;
                            {data?.Background.street}&nbsp;&nbsp;
                          </Typography>
                        </Grid>
                        {data?.Background?.barangay &&
                          data?.Background?.city &&
                          data?.Background?.province && (
                            <>
                              <Grid item xs={6} sm={4} />
                              <Grid item xs={12} sm={8}>
                                <Typography variant="body1">
                                  {data?.Background.barangay?.brgy_name}
                                  ,&nbsp;&nbsp;
                                  {data?.Background.city?.city_name}
                                  ,&nbsp;&nbsp;
                                  {data?.Background.province?.province_name}
                                  &nbsp;&nbsp;
                                </Typography>
                              </Grid>
                            </>
                          )}
                      </Grid>
                      {data?.Background.Family &&
                        data.Background.Family.length > 0 && (
                          <>
                            <Divider css={styles.middle}>
                              Family Composition
                            </Divider>
                            {data.Background.Family &&
                              data.Background.Family.map((item: any) => (
                                <Grid container key={item.id}>
                                  <Grid item xs={6} sm={4}>
                                    <Typography
                                      variant="subtitle1"
                                      fontWeight={700}
                                    >
                                      Full Name:
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6} sm={8}>
                                    <Typography variant="body1">
                                      {`${item.firstName} ${item.middleName} ${item.lastName}`}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6} sm={4}>
                                    <Typography
                                      variant="subtitle1"
                                      fontWeight={700}
                                    >
                                      Age:
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6} sm={8}>
                                    <Typography variant="body1">
                                      {item.age}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6} sm={4}>
                                    <Typography
                                      variant="subtitle1"
                                      fontWeight={700}
                                    >
                                      Education:
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6} sm={8}>
                                    <Typography variant="body1">
                                      {item.education &&
                                        item.education.educationName}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6} sm={4}>
                                    <Typography
                                      variant="subtitle1"
                                      fontWeight={700}
                                    >
                                      Occupation:
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6} sm={8}>
                                    <Typography variant="body1">
                                      {item.occupation &&
                                        item.occupation.occupationName}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6} sm={4}>
                                    <Typography
                                      variant="subtitle1"
                                      fontWeight={700}
                                    >
                                      Monthly Income:
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6} sm={8}>
                                    {item.income ? (
                                      <Typography
                                        variant="body1"
                                        css={styles.mb}
                                      >
                                        ₱{item.income.from.toLocaleString()}
                                        &nbsp;&nbsp;-&nbsp;&nbsp;
                                        {item.income.to.toLocaleString()}
                                      </Typography>
                                    ) : (
                                      <Typography
                                        variant="body1"
                                        css={styles.mb}
                                      >
                                        n/a
                                      </Typography>
                                    )}
                                  </Grid>
                                </Grid>
                              ))}
                          </>
                        )}
                      <Divider css={styles.middle}>Munting Pangarap</Divider>
                      <Grid container alignItems="center">
                        <Grid item xs={12} sm={4}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            Type of Request:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body1">
                            {data?.request.requestName}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            Request Summary:
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body1" css={styles.paragraph}>
                            {data?.requestSummary}
                          </Typography>
                        </Grid>
                      </Grid>
                    </>
                  )}
                  {data?.CaseLetter && data.CaseLetter.length > 0 && (
                    <>
                      <Divider variant="middle" css={styles.middle}>
                        Letter
                      </Divider>
                      <div css={styles.boxDownload}>
                        {data?.CaseLetter.map((item: Files) => {
                          const url = urlAPI + item.filePath
                          return item.filePath.split('.').pop() === 'mp4' ? (
                            <div key={item.id}>
                              <video width="200" controls>
                                <source src={url} type="video/mp4" />
                              </video>
                            </div>
                          ) : (
                            <div key={item.id} css={styles.img}>
                              <a onClick={() => onClickImg(url)}>
                                <img
                                  width="150"
                                  height="100"
                                  alt="case-img"
                                  src={url}
                                />
                              </a>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  )}
                  {data?.status === 'pending' && (
                    <>
                      <ConfirmationDialog
                        open={openConfirmDialog}
                        handleDialog={handleConfirmDialog}
                        method={onSubmitState}
                      />
                      <Divider css={styles.middle} />
                      <Box css={styles.boxAction}>
                        <Button
                          color="error"
                          variant="contained"
                          onClick={() => onClickConfirm('reject')}
                        >
                          Reject
                        </Button>
                        <Button
                          color="secondary"
                          variant="contained"
                          onClick={() => onClickConfirm('accept')}
                        >
                          Accept
                        </Button>
                      </Box>
                    </>
                  )}
                  {data?.status !== 'incomplete' &&
                    data?.status !== 'pending' &&
                    data?.note && (
                      <>
                        <Divider variant="middle" css={styles.middle}>
                          Program Head remarks
                        </Divider>
                        <Grid container>
                          <Grid item xs={12}>
                            <Typography variant="body1" css={styles.paragraph}>
                              {data.note}
                            </Typography>
                          </Grid>
                        </Grid>
                      </>
                    )}
                  {data?.Assessment &&
                    (data?.status === 'pendingForReview' ||
                      data?.status === 'ongoing' ||
                      data?.status === 'completed') && (
                      <>
                        <Divider css={styles.middle}>Case Assessment</Divider>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle1" fontWeight={700}>
                              Findings:
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1" css={styles.paragraph}>
                              {data?.Assessment?.findings}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Box display="inlineFlex">
                              <Typography variant="subtitle1" fontWeight={700}>
                                Recommendation: &nbsp;&nbsp;&nbsp;
                              </Typography>
                              <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                fontStyle="italic"
                              >
                                {
                                  data?.Assessment?.recommendation
                                    ?.recommendationName
                                }
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1" css={styles.paragraph}>
                              {data?.Assessment?.recommendationDetails}
                            </Typography>
                          </Grid>
                        </Grid>
                      </>
                    )}
                  {data?.CaseFiles.length > 0 &&
                    (data?.status === 'pendingForReview' ||
                      data?.status === 'ongoing' ||
                      data?.status === 'completed') && (
                      <>
                        <Divider css={styles.middle}>Case Requirements</Divider>
                        <div css={styles.boxDownload}>
                          {data?.CaseFiles.map((item: Files) => {
                            const url = urlAPI + item.filePath
                            return item.filePath.split('.').pop() === 'mp4' ? (
                              <div key={item.id}>
                                <video width="200" controls>
                                  <source src={url} type="video/mp4" />
                                </video>
                              </div>
                            ) : (
                              <div key={item.id} css={styles.img}>
                                <a onClick={() => onClickImg(url)}>
                                  <img
                                    width="150"
                                    height="100"
                                    alt="case-img"
                                    src={url}
                                  />
                                </a>
                              </div>
                            )
                          })}
                        </div>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell
                                variant="head"
                                style={{ fontWeight: 700 }}
                              >
                                Requirement
                              </TableCell>
                              <TableCell
                                variant="head"
                                style={{ fontWeight: 700 }}
                              >
                                Submit
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {data?.CaseFileRequirement?.map((item: any) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  {item.requirements?.requirementsName}
                                </TableCell>
                                <TableCell>
                                  {item.submitted === true ? (
                                    <CheckCircle color="success" />
                                  ) : (
                                    <Cancel color="error" />
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        {data?.status === 'pendingForReview' && (
                          <>
                            <Box css={styles.boxAction2}>
                              <Button
                                variant="outlined"
                                color="error"
                                onClick={() => {
                                  setAssessmentMethod('reject')
                                  handleAssessmentConfirmDialog()
                                }}
                              >
                                Reject Assessment
                              </Button>
                              <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => {
                                  setAssessmentMethod('accept')
                                  handleAssessmentConfirmDialog()
                                }}
                              >
                                Accept Assessment
                              </Button>
                            </Box>
                            <DialogAssessmentConfirmation
                              method={assessmentMethod}
                              open={openAssessmentConfirmDialog}
                              handleDialog={handleAssessmentConfirmDialog}
                            />
                          </>
                        )}
                      </>
                    )}
                  {data?.status === 'ongoing' &&
                    data?.ProgressNotes?.length > 0 &&
                    data?.Budget && (
                      <>
                        <Box
                          display="flex"
                          justifyContent="flex-end"
                          sx={{ mt: 3 }}
                        >
                          <Button
                            color="success"
                            variant="contained"
                            onClick={handleCompleteDialog}
                          >
                            Mark as completed
                          </Button>
                        </Box>
                        <CompleteConfirmation
                          open={openCompleteDialog}
                          handleDialog={handleCompleteDialog}
                        />
                      </>
                    )}
                </>
              ) : (
                <Box display="flex" justifyContent="center">
                  <CircularProgress />
                </Box>
              )}
            </Paper>
            <AssessmentRemark data={data} />
          </Grid>
        </Grid>
        <ImageViewer
          src={img}
          open={openImgViewer}
          handleImageViewer={handleImageViewer}
        />
      </ProgramHeadLayout>
    </>
  )
}

const ConfirmationDialog = (props: DialogProps) => {
  const router = useRouter()
  const id = router.query.id
  const [fetchLoading, setFetchLoading] = useState(false)

  const {
    reset,
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: CaseHeadDefaultValues,
    resolver: yupResolver(CaseHeadFormYup),
  })

  const onSubmit: SubmitHandler<CaseHeadForm> = async (values) => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.post(`/api/head/case/${id}`, values)
      const data = await res.data
      mutate(`/api/head/case/${id}`)
      setFetchLoading(false)
      Snackbar.success(data.message)
      reset()
      props.handleDialog()
    } catch (err) {
      setFetchLoading(false)
      if (err.response?.data) Snackbar.error(err.response.data.message)
      props.handleDialog()
    }
  }

  return (
    <Dialog fullWidth maxWidth="xs" open={props.open}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to {props.method} this case?
        </DialogContentText>
        <form>
          <Controller
            name="note"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                required
                fullWidth
                multiline
                minRows={5}
                maxRows={10}
                margin="normal"
                variant="outlined"
                label="Remarks/Comment for this case"
                error={Boolean(errors.note)}
                helperText={errors.note?.message}
              />
            )}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          color="inherit"
          onClick={props.handleDialog}
          disabled={fetchLoading}
        >
          Cancel
        </Button>
        <LoadingButton
          size="large"
          loading={fetchLoading}
          color={props.method === 'accept' ? 'secondary' : 'error'}
          onClick={() => {
            setValue('status', props.method)
            handleSubmit(onSubmit)()
          }}
        >
          {props.method}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

const DialogAssessmentConfirmation = (props: DialogProps) => {
  const router = useRouter()
  const id = router.query.id
  const [fetchLoading, setFetchLoading] = useState(false)
  const [remark, setRemark] = useState('')

  const handleCloseDialog = () => {
    props.handleDialog()
    setRemark('')
  }

  const postAssessment = async () => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.post(`/api/head/case/assessment/${id}`, {
        status: props.method,
        remark: remark,
      })
      const data = await res.data
      mutate(`/api/head/case/${id}`)
      Snackbar.success(data.message)
      setFetchLoading(false)
      handleCloseDialog()
      if (props.method === 'accept') router.push('/programhead/budget')
    } catch (err) {
      setFetchLoading(false)
      if (err.response?.data) Snackbar.error(err.response?.data?.message)
      handleCloseDialog()
    }
  }

  return (
    <>
      <Dialog fullWidth maxWidth="sm" open={props.open}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {props.method} this Case
            Assessment/Requirements?
          </DialogContentText>
          <TextField
            fullWidth
            required
            multiline
            minRows={5}
            maxRows={10}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            name="remark"
            label="Remarks"
            margin="normal"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="inherit"
            onClick={handleCloseDialog}
            disabled={fetchLoading}
          >
            Cancel
          </Button>
          <LoadingButton
            size="large"
            loading={fetchLoading}
            color={props.method === 'accept' ? 'secondary' : 'error'}
            onClick={postAssessment}
          >
            {props.method}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

const CompleteConfirmation = (props: CompleteDialogProps) => {
  const router = useRouter()
  const id = router.query.id

  const [fetchLoading, setFetchLoading] = useState(false)
  const handleCloseDialog = () => {
    props.handleDialog()
    window.scrollTo(0, 0)
  }

  const onSubmit = async () => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.post(`/api/head/case/${id}/completed`)
      const data = await res.data
      Snackbar.success(data.message)
      mutate(`/api/head/case/${id}`)
      setFetchLoading(false)
      handleCloseDialog()
    } catch (err) {
      setFetchLoading(false)
      if (err?.response?.data) Snackbar.error(err.response?.data?.message)
    }
  }

  return (
    <Dialog fullWidth maxWidth="xs" open={props.open}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to change this case status to completed?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={handleCloseDialog}>
          Cancel
        </Button>
        <LoadingButton
          color="success"
          onClick={onSubmit}
          loading={fetchLoading}
        >
          Yes
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

interface DialogProps {
  open: boolean
  method: string
  handleDialog: () => void
}

interface CompleteDialogProps {
  open: boolean
  handleDialog: () => void
}

interface Files {
  filePath: string
  id: number
}

const styles = {
  dividerTop: css`
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  `,
  box: css`
    margin-bottom: 1em;
  `,
  link: css`
    text-decoration: none;
  `,
  linkText: css`
    font-family: inherit;
    &:hover {
      cursor: pointer;
      text-decoration: underline;
      text-decoration-color: #000;
    }
  `,
  linkActive: css`
    font-family: inherit;
    color: #0f3b68;
  `,
  grid: css`
    margin-top: 0.5em;
  `,
  paper: css`
    padding: 2em;
    margin-bottom: 2em;
    @media (max-width: 600px) {
      padding: 1em;
    }
  `,
  middle: css`
    margin-top: 1.5em;
    margin-bottom: 1.5em;
    font-weight: 700;
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
  paragraph: css`
    text-indent: 3em;
    text-align: justify;
  `,
  ul: css`
    margin-left: 1em;
    margin-bottom: 1em;
    list-style-type: disc;
  `,
  mb: css`
    margin-bottom: 1.5em;
  `,
  boxAction: css`
    display: flex;
    justify-content: flex-end;
    gap: 1em;
  `,
  boxAction2: css`
    margin-top: 1em;
    display: flex;
    justify-content: flex-end;
    gap: 1em;
  `,
}

export default Case
