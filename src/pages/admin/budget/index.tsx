/** @jsxImportSource @emotion/react */
import { CustomTable } from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { AdminLayout } from '@layouts'
import { ApiAuth, Snackbar } from '@lib'
import { Close, Delete, Edit, Visibility } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Breadcrumbs,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
  IconButton,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import styles from '@styles/filemaintenance'
import {
  AdminBudgetDefaultValues,
  AdminBudgetForm,
  AdminBudgetFormYup
} from '@validation'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import useSWR, { mutate } from 'swr'

const Budget = () => {
  const router = useRouter()
  const { data } = useSWR('/api/budget')

  const [openNewDialog, setOpenNewDialog] = useState(false)
  const handleNewDialog = () => {
    setOpenNewDialog(!openNewDialog)
  }

  const [deleteBudgetId, setDeleteBudgetId] = useState(0)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const handleEditDialog = () => {
    setOpenEditDialog(!openEditDialog)
  }
  const handleClickEdit = (id: number) => {
    setEditBudgetId(id)
    handleEditDialog()
  }

  const [editBudgetId, setEditBudgetId] = useState(0)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const handleDeleteDialog = () => {
    setOpenDeleteDialog(!openDeleteDialog)
  }
  const handleClickDelete = (id: number) => {
    setDeleteBudgetId(id)
    handleDeleteDialog()
  }

  return (
    <>
      <Head>
        <title>File Maintenance - Kamanggagawa Foundation Inc</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <AdminLayout>
        <Box css={styles.box}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link href="/admin">
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
              Budget
            </Typography>
          </Breadcrumbs>
        </Box>
        <Box>
          <CustomTable
            size="small"
            title="Budget"
            loading={!data}
            data={data}
            header={[
              {
                title: 'Case ID',
                field: 'caseId',
                align: 'left',
                minWidth: '130px',
              },
              {
                title: 'Amount',
                field: 'amount',
                align: 'left',
                render: (rowData) => `₱ ${rowData.amount.toLocaleString()}`,
              },
              {
                title: 'Date created',
                field: 'createdAt',
                align: 'center',
                minWidth: '120px',
                render: (rowData) => new Date(rowData.createdAt).toDateString(),
              },
            ]}
            addAction={handleNewDialog}
            actions={[
              {
                icon: <Visibility color="secondary" />,
                tooltip: 'View',
                onClick: (rowData) =>
                  router.push(`/admin/budget/${rowData.caseId}`),
              },
              {
                icon: <Edit color="primary" />,
                tooltip: 'Edit',
                onClick: (rowData) => handleClickEdit(rowData.id),
              },
              {
                icon: <Delete color="error" />,
                tooltip: 'Delete',
                onClick: (rowData) => {
                  handleClickDelete(rowData.id)
                },
              },
            ]}
          />
        </Box>
        <NewDialog open={openNewDialog} handleDialog={handleNewDialog} />
        <EditDialog
          id={editBudgetId}
          open={openEditDialog}
          handleDialog={handleEditDialog}
        />
        <DeleteDialog
          id={deleteBudgetId}
          open={openDeleteDialog}
          handleDialog={handleDeleteDialog}
        />
      </AdminLayout>
    </>
  )
}

const NewDialog = (props: DialogProps) => {
  const { data: caseBudgetApi } = useSWR<CaseBudgetApi[]>('/api/option/budget')
  const { data: statusApi } = useSWR(`/api/option/budget/status`)
  const [fetchLoading, setFetchLoading] = useState(false)
  const [selectedValue, setSelectedValue] = useState({
    budgetRange: '',
    client: '',
    recommendation: '',
    request: '',
  })

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: AdminBudgetDefaultValues,
    resolver: yupResolver(AdminBudgetFormYup),
  })

  const handleCloseDialog = () => {
    setSelectedValue({
      client: ``,
      budgetRange: ``,
      recommendation: ``,
      request: ``,
    })
    reset()
    props.handleDialog()
  }

  const onSubmit: SubmitHandler<AdminBudgetForm> = async (values) => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.post('/api/admin/budget', values)
      const data = await res.data
      mutate('/api/budget')
      Snackbar.success(data.message)
      setFetchLoading(false)
      handleCloseDialog()
    } catch (err) {
      setFetchLoading(false)
      if (err.response?.data) Snackbar.error(err.response?.data?.message)
    }
  }

  const handleChangeBudget = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setValue('caseId', e.target.value)
    const temp = caseBudgetApi?.filter((item) => e.target.value === item.id)
    if (temp && temp.length > 0) {
      setSelectedValue({
        ...selectedValue,
        client: `${temp[0].Background?.lastName}, ${temp[0].Background?.firstName}. ${temp[0].Background?.middleName}`,
        request: `${temp[0].request.requestName}`,
        recommendation: `${temp[0].Assessment?.recommendation.recommendationName}`,
        budgetRange: `₱${temp[0].request.budgetFrom.toLocaleString()} to ${temp[0].request.budgetTo.toLocaleString()}`,
      })
    } else {
      setSelectedValue({
        client: ``,
        budgetRange: ``,
        recommendation: ``,
        request: ``,
      })
    }
  }

  return (
    <>
      <Dialog fullWidth maxWidth="xs" open={props.open}>
        <DialogTitle>
          New Budget
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
            {selectedValue.client && (
              <FormHelperText>
                Client&apos;s name:&nbsp;{selectedValue.client}
              </FormHelperText>
            )}
            {selectedValue.request && (
              <FormHelperText>
                Type of Request:&nbsp;{selectedValue.request}
              </FormHelperText>
            )}
            {selectedValue.recommendation && (
              <FormHelperText>
                Recommendation:&nbsp;{selectedValue.recommendation}
              </FormHelperText>
            )}
            {selectedValue.budgetRange && (
              <FormHelperText>
                Budget range:&nbsp;{selectedValue.budgetRange}
              </FormHelperText>
            )}
            <Controller
              name="caseId"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  required
                  fullWidth
                  label="Case"
                  margin="normal"
                  value={field.value}
                  onChange={handleChangeBudget}
                  error={Boolean(errors.caseId)}
                  helperText={errors.caseId?.message}
                >
                  <MenuItem value="">
                    <em>----------</em>
                  </MenuItem>
                  {caseBudgetApi?.map((item, i) => (
                    <MenuItem key={i} value={item.id}>
                      Case {item.id}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  required
                  fullWidth
                  label="Status"
                  margin="normal"
                  error={Boolean(errors.caseId)}
                  helperText={errors.caseId?.message}
                >
                  <MenuItem value="">
                    <em>----------</em>
                  </MenuItem>
                  {statusApi?.map((item: any) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  margin="dense"
                  type="number"
                  label="Amount"
                  error={Boolean(errors.amount)}
                  helperText={errors.amount?.message}
                />
              )}
            />
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

const EditDialog = (props: DialogProps) => {
  const { data: caseBudgetApi } = useSWR<CaseBudgetApi[]>(
    '/api/option/budget/admin'
  )
  const { data: statusApi } = useSWR(`/api/option/budget/status`)
  const { data } = useSWR(props.open ? `/api/budget/${props.id}` : null)
  const [fetchLoading, setFetchLoading] = useState(false)
  const [budgetRange, setBudgetRange] = useState('')

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: AdminBudgetDefaultValues,
    resolver: yupResolver(AdminBudgetFormYup),
  })

  const handleCloseDialog = () => {
    setBudgetRange('')
    reset()
    props.handleDialog()
  }

  const onSubmit: SubmitHandler<AdminBudgetForm> = async (values) => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.put(`/api/budget/${props.id}`, values)
      const data = await res.data
      mutate('/api/budget')
      Snackbar.success(data.message)
      setFetchLoading(false)
      handleCloseDialog()
    } catch (err) {
      setFetchLoading(false)
      if (err.response?.data) Snackbar.error(err.response?.data?.message)
    }
  }

  const handleChangeBudget = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setValue('caseId', e.target.value)
    const temp = caseBudgetApi?.filter((item) => e.target.value === item.id)
    temp && temp.length > 0
      ? setBudgetRange(
          `Budget range: ₱ ${temp[0].request.budgetFrom.toLocaleString()} to ${temp[0].request.budgetTo.toLocaleString()}`
        )
      : setBudgetRange('')
  }

  useEffect(() => {
    if (data) {
      const temp = caseBudgetApi?.filter((item) => data?.caseId === item.id)
      temp && temp.length > 0
        ? setBudgetRange(
            `Budget range: ₱ ${temp[0].request.budgetFrom.toLocaleString()} to ${temp[0].request.budgetTo.toLocaleString()}`
          )
        : setBudgetRange('')
      setValue('caseId', data?.caseId)
      setValue('amount', data?.amount)
      setValue('status', data?.status)
    }
  }, [data, setValue, caseBudgetApi])

  return (
    <>
      <Dialog fullWidth maxWidth="xs" open={props.open}>
        <DialogTitle>
          Update Budget
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              {budgetRange && <FormHelperText>{budgetRange}</FormHelperText>}
              <Controller
                name="caseId"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    required
                    disabled
                    fullWidth
                    label="Case"
                    margin="normal"
                    value={field.value}
                    onChange={handleChangeBudget}
                    error={Boolean(errors.caseId)}
                    helperText={errors.caseId?.message}
                  >
                    <MenuItem value="">
                      <em>----------</em>
                    </MenuItem>
                    {caseBudgetApi?.map((item, i) => (
                      <MenuItem key={i} value={item.id}>
                        Case {item.id}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    required
                    fullWidth
                    label="Status"
                    margin="normal"
                    error={Boolean(errors.caseId)}
                    helperText={errors.caseId?.message}
                  >
                    <MenuItem value="">
                      <em>----------</em>
                    </MenuItem>
                    {statusApi?.map((item: any) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    margin="dense"
                    type="number"
                    label="Amount"
                    error={Boolean(errors.amount)}
                    helperText={errors.amount?.message}
                  />
                )}
              />
            </DialogContent>
            <DialogActions>
              <LoadingButton
                fullWidth
                type="submit"
                variant="contained"
                loading={fetchLoading}
              >
                Update Budget
              </LoadingButton>
            </DialogActions>
          </form>
        ) : (
          <DialogContent>
            <Box css={styles.boxLoading}>
              <CircularProgress />
            </Box>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}
const DeleteDialog = (props: DialogProps) => {
  const [fetchLoading, setFetchLoading] = useState(false)

  const handleCloseDialog = () => {
    props.handleDialog()
  }

  const deleteRequest = async () => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.delete(`/api/budget/${props.id}`)
      const data = await res.data
      setFetchLoading(false)
      Snackbar.success(data.message)
      handleCloseDialog()
    } catch (err) {
      setFetchLoading(false)
      if (err.response?.data) Snackbar.error(err.response?.data?.message)
    }
  }

  return (
    <>
      <Dialog fullWidth maxWidth="xs" open={props.open}>
        <DialogTitle>Delete Budget</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this budget?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="inherit"
            disabled={fetchLoading}
            onClick={handleCloseDialog}
          >
            Cancel
          </Button>
          <LoadingButton
            color="error"
            loading={fetchLoading}
            onClick={deleteRequest}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

interface DialogProps {
  id?: string | number
  open: boolean
  handleDialog: () => void
}

interface CaseBudgetApi {
  id: string
  Background: {
    firstName: string
    lastName: string
    middleName: string | null
  }
  request: {
    id: number
    requestName: string
    budgetFrom: number
    budgetTo: number
  }
  Assessment: {
    recommendation: {
      recommendationName: string
    }
  } | null
}

export default Budget
