/** @jsxImportSource @emotion/react */
import {
  ImageViewer,
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
  Upload
} from '@components'
import { css } from '@emotion/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { SocialWorkerLayout } from '@layouts'
import { ApiAuth, Snackbar } from '@lib'
import {
  AddCircle,
  ArrowForwardIosSharp,
  Close,
  Delete
} from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
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
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import {
  LiquidationDefaultValues,
  LiquidationForm,
  LiquidationFormYup
} from '@validation'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { SyntheticEvent, useState } from 'react'
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm
} from 'react-hook-form'
import useSWR, { mutate } from 'swr'

dayjs.extend(localizedFormat)
const urlAPI = process.env.NEXT_PUBLIC_API_URL!

const Budget = () => {
  const router = useRouter()
  const id = router.query.id
  const { data, error } = useSWR(id ? `/api/case/${id}/budget` : '', {
    refreshInterval: 0,
  })

  const [openNewDialog, setOpenNewDialog] = useState(false)
  const handleNewDialog = () => {
    setOpenNewDialog(!openNewDialog)
  }

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const handleDeleteDialog = () => {
    setOpenDeleteDialog(!openDeleteDialog)
  }

  const [expanded, setExpanded] = useState<number | false>(false)
  const handleChange =
    (panel: number) => (event: SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false)
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

  return (
    <>
      <Head>
        <title>Budget - Kamanggagawa Foundation Inc</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <SocialWorkerLayout>
        {data?.status === 'pending' && (
          <>
            <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
              <Button
                color="secondary"
                variant="outlined"
                onClick={handleNewDialog}
              >
                Upload Liquidation
              </Button>
            </Box>
            <NewDialog
              id={data?.id}
              open={openNewDialog}
              handleDialog={handleNewDialog}
            />
          </>
        )}
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8}>
            <Paper variant="outlined" css={styles.paper}>
              {error ? (
                <Box display="flex" justifyContent="center">
                  <Typography variant="h6">Case Budget not found</Typography>
                </Box>
              ) : data ? (
                <>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Case ID:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="body1">{data?.case?.id}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Client:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="body1">
                        {data.case.Background?.lastName},&nbsp;&nbsp;
                        {data.case.Background?.firstName}&nbsp;&nbsp;
                        {data.case.Background?.middleName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Type of Request:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="body1">
                        {data.case?.request?.requestName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Recommendation:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="body1">
                        {
                          data.case?.Assessment?.recommendation
                            ?.recommendationName
                        }
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Date Created:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body1">
                        {new Date(data?.createdAt).toDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Amount:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body1">
                        {data?.amount && `₱ ${data?.amount.toLocaleString()}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Status:
                      </Typography>
                    </Grid>
                    <Grid item xs={8} sm={8}>
                      {data?.status === 'completed' ? (
                        <Chip
                          size="small"
                          color="success"
                          label={data?.status}
                        />
                      ) : data?.status === 'pendingForReview' ? (
                        <Chip
                          size="small"
                          color="primary"
                          label="pending for review"
                        />
                      ) : (
                        <Chip
                          size="small"
                          color="primary"
                          label={data?.status}
                        />
                      )}
                    </Grid>
                  </Grid>
                  {data?.BudgetDetail.length <= 0 ? (
                    <>
                      <Divider css={styles.divider}>Liquidation</Divider>
                      <Box display="flex" justifyContent="center">
                        <Typography variant="subtitle2">
                          liquidation is empty
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Divider css={styles.divider}>Liquidation</Divider>
                      {data?.BudgetDetail?.map((item: any, i: number) => (
                        <StyledAccordion
                          square
                          key={i}
                          elevation={0}
                          disableGutters
                          expanded={expanded === item?.id}
                          onChange={handleChange(item?.id)}
                        >
                          <StyledAccordionSummary
                            expandIcon={
                              <ArrowForwardIosSharp
                                sx={{ fontSize: '0.9rem' }}
                              />
                            }
                          >
                            <Typography>
                              {dayjs(item?.createdAt).format(
                                'L [ at ] hh:mm a'
                              )}
                            </Typography>
                          </StyledAccordionSummary>
                          <StyledAccordionDetails>
                            <Box display="inline-flex" alignItems="center">
                              <Typography variant="subtitle1">
                                Status:
                              </Typography>
                              &nbsp; &nbsp;
                              {item?.status === 'approved' ? (
                                <Chip
                                  size="small"
                                  color="secondary"
                                  variant="outlined"
                                  label="approved"
                                />
                              ) : item?.status === 'rejected' ? (
                                <Chip
                                  size="small"
                                  color="error"
                                  label="rejected"
                                  variant="outlined"
                                />
                              ) : (
                                <Chip
                                  size="small"
                                  label="pending"
                                  color="primary"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                            <Box
                              display="flex"
                              justifyContent="center"
                              flexWrap="wrap"
                              sx={{ mt: 2, mb: 2, gap: '1em' }}
                            >
                              {item?.BudgetFile?.map((item2: any) => {
                                const url = urlAPI + item2.filePath
                                return (
                                  <div css={styles.img} key={item2.id}>
                                    <a onClick={() => onClickImg(url)}>
                                      <img
                                        width="150"
                                        height="100"
                                        alt="case-img"
                                        src={urlAPI + item2.filePath}
                                      />
                                    </a>
                                  </div>
                                )
                              })}
                            </Box>
                            {item?.liquidation && (
                              <Box>
                                <TableContainer
                                  component={Paper}
                                  variant="outlined"
                                  sx={{
                                    mt: 1,
                                    mb: 1,
                                    borderRadius: 0,
                                    maxHeight: '465px',
                                  }}
                                >
                                  <Table stickyHeader size="small">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell
                                          variant="head"
                                          css={styles.cellHeader}
                                        >
                                          Particulars
                                        </TableCell>
                                        <TableCell
                                          variant="head"
                                          css={styles.cellHeader}
                                        >
                                          Quantity
                                        </TableCell>
                                        <TableCell
                                          variant="head"
                                          css={styles.cellHeader}
                                        >
                                          Unit
                                        </TableCell>
                                        <TableCell
                                          variant="head"
                                          css={styles.cellHeader}
                                        >
                                          Price
                                        </TableCell>
                                        <TableCell
                                          variant="head"
                                          css={styles.cellHeader}
                                        >
                                          Amount
                                        </TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {item?.liquidation.map(
                                        (item: any, i: number) => (
                                          <TableRow key={i}>
                                            <TableCell align="center">
                                              {item.article}
                                            </TableCell>
                                            <TableCell align="center">
                                              {item.qty}
                                            </TableCell>
                                            <TableCell align="center">
                                              {item.unit}
                                            </TableCell>
                                            <TableCell align="center">
                                              ₱{item.price.toLocaleString()}
                                            </TableCell>
                                            <TableCell align="right">
                                              ₱
                                              {(
                                                item.qty * item.price
                                              ).toLocaleString()}
                                            </TableCell>
                                          </TableRow>
                                        )
                                      )}
                                      <TableRow>
                                        <TableCell
                                          colSpan={4}
                                          css={styles.cellTotal}
                                        >
                                          Total Amount
                                        </TableCell>
                                        <TableCell align="right">
                                          ₱
                                          {item?.liquidation
                                            ?.reduce(
                                              (total: number, value: any) =>
                                                total + value.qty * value.price,
                                              0
                                            )
                                            .toLocaleString()}
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </Box>
                            )}
                            {item?.remarks && (
                              <Box>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight={700}
                                >
                                  Remarks:
                                </Typography>
                                <Typography
                                  variant="body1"
                                  textAlign="justify"
                                  sx={{ textIndent: '2em' }}
                                >
                                  {item?.remarks}
                                </Typography>
                              </Box>
                            )}
                            {item?.status === 'pending' && (
                              <Box
                                display="flex"
                                justifyContent="flex-end"
                                sx={{ mt: 2 }}
                              >
                                <DeleteDialog
                                  id={item?.id}
                                  open={openDeleteDialog}
                                  handleDialog={handleDeleteDialog}
                                />
                                <Button
                                  color="error"
                                  variant="outlined"
                                  startIcon={<Delete />}
                                  onClick={handleDeleteDialog}
                                >
                                  Delete
                                </Button>
                              </Box>
                            )}
                          </StyledAccordionDetails>
                        </StyledAccordion>
                      ))}
                    </>
                  )}
                </>
              ) : (
                <Box display="flex" justifyContent="center">
                  <CircularProgress />
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
        <ImageViewer
          src={img}
          open={openImgViewer}
          handleImageViewer={handleImageViewer}
        />
      </SocialWorkerLayout>
    </>
  )
}

const NewDialog = (props: DialogProps) => {
  const router = useRouter()
  const id = router.query.id
  const [fetchLoading, setfetchLoading] = useState(false)
  const [files, setFiles] = useState<any | null>([])

  const {
    reset,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: LiquidationDefaultValues,
    resolver: yupResolver(LiquidationFormYup),
  })

  const handleCloseDialog = () => {
    setFiles(null)
    reset()
    props.handleDialog()
  }

  const { fields, append, remove } = useFieldArray({
    name: 'liquidation',
    control,
  })

  const watchFieldArray = watch('liquidation')
  const arrayFields = fields.map((field, i) => {
    return {
      ...field,
      ...watchFieldArray[i],
    }
  })

  const onSubmit: SubmitHandler<LiquidationForm> = async (values) => {
    const fd = new FormData()
    if (files.length <= 0) return Snackbar.warning('File is empty')
    files.forEach((file: any) => {
      fd.append('files', file)
    })
    fd.append('data', JSON.stringify(values))
    try {
      setfetchLoading(true)
      const res = await ApiAuth.post(`/api/sw/case/${props.id}/budget`, fd)
      const data = await res.data
      setFiles(null)
      setfetchLoading(false)
      mutate(`/api/case/${id}/budget`)
      Snackbar.success(data.message)
      handleCloseDialog()
    } catch (err) {
      setfetchLoading(false)
      if (err.response?.data) Snackbar.error(err.response?.data?.message)
    }
  }

  return (
    <>
      <Dialog fullWidth maxWidth="md" open={props.open}>
        <DialogTitle>
          Upload Liquidation
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Box>
              <Upload filetypes="image/*" files={files} setFiles={setFiles} />
            </Box>
            <Box display="flex" justifyContent="flex-start" sx={{ mb: 2 }}>
              <Button
                variant="text"
                color="inherit"
                startIcon={<AddCircle />}
                onClick={() =>
                  append({
                    article: '',
                    qty: '',
                    unit: '',
                    price: '',
                  })
                }
              >
                Add field
              </Button>
            </Box>
            {arrayFields.map((field, i) => {
              const errArticle = errors.liquidation?.[i].article
              const errQty = errors.liquidation?.[i].qty
              const errUnit = errors.liquidation?.[i].unit
              const errPrice = errors.liquidation?.[i].price
              return (
                <Grid container spacing={2} key={field.id} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name={`liquidation.${i}.article`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          required
                          {...field}
                          fullWidth
                          label="Particulars"
                          error={Boolean(errArticle)}
                          helperText={errArticle?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Controller
                      name={`liquidation.${i}.qty`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          required
                          {...field}
                          fullWidth
                          type="number"
                          label="Quantity"
                          error={Boolean(errQty)}
                          helperText={errQty?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Controller
                      name={`liquidation.${i}.unit`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          required
                          {...field}
                          fullWidth
                          label="Unit"
                          error={Boolean(errUnit)}
                          helperText={errUnit?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Controller
                      name={`liquidation.${i}.price`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          type="number"
                          required
                          fullWidth
                          {...field}
                          label="Price"
                          error={Boolean(errPrice)}
                          helperText={errPrice?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Tooltip title="remove">
                      <IconButton onClick={() => remove(i)} size="large">
                        <Delete color="error" />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              )
            })}
          </DialogContent>
          <DialogActions>
            <LoadingButton
              fullWidth
              type="submit"
              variant="contained"
              loading={fetchLoading}
            >
              Submit
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

const DeleteDialog = (props: DialogProps) => {
  const router = useRouter()
  const id = router.query.id
  const [fetchLoading, setFetchLoading] = useState(false)

  const handleCloseDialog = () => {
    props.handleDialog()
  }

  const handleDelete = async () => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.delete(`/api/sw/budget/file/${props.id}`)
      const data = await res.data
      mutate(`/api/case/${id}/budget`)
      setFetchLoading(false)
      Snackbar.success(data.message)
      handleCloseDialog()
    } catch (err) {
      setFetchLoading(false)
      if (err.response?.data) Snackbar.error(err.response?.data?.message)
    }
  }

  return (
    <Dialog open={props.open}>
      <DialogTitle>Delete Liquidation</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this liquidation?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="text" color="inherit" onClick={handleCloseDialog}>
          Cancel
        </Button>
        <LoadingButton
          color="error"
          variant="text"
          loading={fetchLoading}
          onClick={handleDelete}
        >
          Delete
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

interface DialogProps {
  id?: string | number
  open: boolean
  handleDialog: () => void
}

const styles = {
  paper: css`
    padding: 2em;
    @media (max-width: 600px) {
      padding: 1em;
    }
  `,
  divider: css`
    margin-top: 1.5em;
    margin-bottom: 1.5em;
    font-weight: 700;
  `,
  img: css`
    padding: 0.4em;
    padding-bottom: 0;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    cursor: pointer;
  `,
  cellHeader: css`
    font-weight: 700;
    text-align: center;
  `,
  cellTotal: css`
    font-weight: 700;
    text-align: right;
  `,
}

export default Budget
