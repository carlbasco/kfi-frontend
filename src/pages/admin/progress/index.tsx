/** @jsxImportSource @emotion/react */
import { CustomTable } from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { AdminLayout } from '@layouts'
import { ApiAuth, Snackbar } from '@lib'
import { Close, Delete, Edit, Visibility } from '@mui/icons-material'
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
  FormHelperText,
  IconButton,
  MenuItem,
  TextField
} from '@mui/material'
import { Box } from '@mui/system'
import {
  AdminProgressNoteDefaultValues,
  AdminProgressNoteForm,
  AdminProgressNoteFormYup
} from '@validation'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import useSWR, { mutate } from 'swr'

const ProgressNote = () => {
  const router = useRouter()
  const { data } = useSWR('/api/progressnote')

  const [openNewDialog, setOpenNewDialog] = useState(false)
  const handleNewDialog = () => {
    setOpenNewDialog(!openNewDialog)
  }

  const [editId, setEditId] = useState(0)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const handleEditDialog = () => {
    setOpenEditDialog(!openEditDialog)
  }

  const [deleteId, setDeleteId] = useState(0)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const handleDeleteDialog = () => {
    setOpenDeleteDialog(!openDeleteDialog)
  }

  return (
    <>
      <Head>
        <title>Progress Note - Kamanggagawa Foundation Inc</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <AdminLayout>
        <CustomTable
          size="small"
          title="Progress Note"
          loading={!data}
          data={data}
          addAction={handleNewDialog}
          header={[
            {
              title: 'Case',
              field: 'caseId',
              align: 'left',
              minWidth: '130px',
            },
            {
              title: 'Status',
              field: 'status',
              align: 'center',
              render: (rowData) =>
                rowData?.status === 'completed' ? (
                  <Chip size="small" color="success" label="completed" />
                ) : (
                  <Chip size="small" label={rowData?.status} color="primary" />
                ),
            },
            {
              title: 'Date Created',
              field: 'createdAt',
              align: 'center',
              render: (rowData) => new Date(rowData.createdAt).toDateString(),
            },
            {
              title: 'Last Update',
              field: 'updatedAt',
              align: 'center',
              render: (rowData) =>
                rowData?.updatedAt
                  ? new Date(rowData?.updatedAt).toDateString()
                  : '-',
            },
          ]}
          actions={[
            {
              icon: <Visibility color="secondary" />,
              tooltip: 'View',
              onClick: (rowData) =>
                router.push(`/admin/progress/${rowData.id}`),
            },
            {
              icon: <Edit color="primary" />,
              tooltip: 'Edit',
              onClick: (rowData) => {
                setEditId(rowData.id)
                handleEditDialog()
              },
            },
            {
              icon: <Delete color="error" />,
              tooltip: 'Delete',
              onClick: (rowData) => {
                setDeleteId(rowData.id)
                handleDeleteDialog()
              },
            },
          ]}
        />
        <NewDialog open={openNewDialog} handleDialog={handleNewDialog} />
        <EditDialog
          id={editId}
          open={openEditDialog}
          handleDialog={handleEditDialog}
        />
        <DeleteDialog
          id={deleteId}
          open={openDeleteDialog}
          handleDialog={handleDeleteDialog}
        />
      </AdminLayout>
    </>
  )
}

const NewDialog = (props: DialogProps) => {
  const { data: caseApi } = useSWR<CaseApi[]>('/api/option/case/progressnote')
  const { data: statusApi } = useSWR(`/api/option/progressnote/status`)
  const [fetchLoading, setFetchLoading] = useState(false)
  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: AdminProgressNoteDefaultValues,
    resolver: yupResolver(AdminProgressNoteFormYup),
  })

  const handleCloseDialog = () => {
    reset()
    props.handleDialog()
  }

  const onSubmit: SubmitHandler<AdminProgressNoteForm> = async (values) => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.post(`/api/admin/progressnote`, values)
      const data = await res.data
      mutate('/api/progressnote')
      Snackbar.success(data.message)
      setFetchLoading(false)
      handleCloseDialog()
    } catch (err) {
      setFetchLoading(false)
      if (err.response?.data) Snackbar.error(err.response?.data?.message)
    }
  }

  const [client, setClient] = useState('')
  const handleChangeClient = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (e.target.value) {
      const temp = caseApi?.find((item) => item.id === e.target.value)
      setClient(
        temp?.Background?.lastName +
          ',' +
          '  ' +
          temp?.Background?.firstName +
          '  ' +
          temp?.Background?.middleName
      )
      setValue('caseId', e.target.value)
    } else {
      setValue('caseId', '')
      setClient('')
    }
  }

  return (
    <>
      <Dialog fullWidth maxWidth="sm" open={props.open}>
        <DialogTitle>
          New Progress Note
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
            {client && (
              <FormHelperText>Client:&nbsp;&nbsp;{client}</FormHelperText>
            )}
            <Controller
              name="caseId"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  required
                  fullWidth
                  value={field.value}
                  onChange={handleChangeClient}
                  label="Case"
                  margin="dense"
                  variant="outlined"
                  error={Boolean(errors?.caseId)}
                  helperText={errors.caseId?.message}
                >
                  <MenuItem>
                    <em>--------</em>
                  </MenuItem>
                  {caseApi?.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      Case&nbsp;{item.id}
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
                  margin="dense"
                  variant="outlined"
                  error={Boolean(errors?.caseId)}
                  helperText={errors.caseId?.message}
                >
                  <MenuItem>
                    <em>--------</em>
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
              name="activity"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  required
                  margin="dense"
                  label="Activity"
                  variant="outlined"
                  error={Boolean(errors.activity)}
                  helperText={errors.activity?.message}
                />
              )}
            />
            <Controller
              name="client"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  minRows={5}
                  maxRows={10}
                  margin="dense"
                  variant="outlined"
                  label="Client"
                  error={Boolean(errors.client)}
                  helperText={errors.client?.message}
                />
              )}
            />
            <Controller
              name="family"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  minRows={5}
                  maxRows={10}
                  margin="dense"
                  label="Family"
                  variant="outlined"
                  error={Boolean(errors.family)}
                  helperText={errors.family?.message}
                />
              )}
            />
            <Controller
              name="environment"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  minRows={5}
                  maxRows={10}
                  margin="dense"
                  variant="outlined"
                  label="Environment"
                  error={Boolean(errors.environment)}
                  helperText={errors.environment?.message}
                />
              )}
            />
            <Controller
              name="church"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  minRows={5}
                  maxRows={10}
                  margin="dense"
                  variant="outlined"
                  label="Church"
                  error={Boolean(errors.church)}
                  helperText={errors.church?.message}
                />
              )}
            />
            <Controller
              name="livelihood"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  minRows={5}
                  maxRows={10}
                  margin="dense"
                  variant="outlined"
                  label="Livelihood"
                  error={Boolean(errors.livelihood)}
                  helperText={errors.livelihood?.message}
                />
              )}
            />
            <Controller
              name="transpired"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  minRows={5}
                  maxRows={10}
                  margin="dense"
                  variant="outlined"
                  label="What Transpired"
                />
              )}
            />
            <Controller
              name="remark"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  minRows={5}
                  maxRows={10}
                  margin="dense"
                  variant="outlined"
                  label="Program Head's Remark"
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <LoadingButton
              type="submit"
              color="success"
              variant="contained"
              loading={fetchLoading}
            >
              save
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

const EditDialog = (props: DialogProps) => {
  const { data: caseApi } = useSWR<CaseApi[]>('/api/option/case/progressnote')
  const { data: statusApi } = useSWR(`/api/option/progressnote/status`)
  const { data } = useSWR(props.open ? `/api/progressnote/${props.id}` : null)

  const [fetchLoading, setFetchLoading] = useState(false)
  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: AdminProgressNoteDefaultValues,
    resolver: yupResolver(AdminProgressNoteFormYup),
  })

  const handleCloseDialog = () => {
    reset()
    props.handleDialog()
  }

  const onSubmit: SubmitHandler<AdminProgressNoteForm> = async (values) => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.put(
        `/api/admin/progressnote/${props.id}`,
        values
      )
      const data = await res.data
      mutate('/api/progressnote')
      Snackbar.success(data.message)
      setFetchLoading(false)
      handleCloseDialog()
    } catch (err) {
      setFetchLoading(false)
      if (err.response?.data) Snackbar.error(err.response?.data?.message)
    }
  }

  const [client, setClient] = useState('')
  const handleChangeClient = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (e.target.value) {
      const temp = caseApi?.find((item) => item.id === e.target.value)
      setClient(
        temp?.Background?.lastName +
          ',' +
          '  ' +
          temp?.Background?.firstName +
          '  ' +
          temp?.Background?.middleName
      )
      setValue('caseId', e.target.value)
    } else {
      setValue('caseId', '')
      setClient('')
    }
  }

  useEffect(() => {
    if (data) {
      setValue('status', data?.status ? data?.status : '')
      setValue('caseId', data?.caseId ? data?.caseId : '')
      setValue('activity', data?.activity ? data?.activity : '')
      setValue('client', data?.client ? data?.client : '')
      setValue('family', data?.family ? data?.family : '')
      setValue('environment', data?.environment ? data?.environment : '')
      setValue('church', data?.church ? data?.church : '')
      setValue('livelihood', data?.livelihood ? data?.livelihood : '')
      setValue('transpired', data?.transpired ? data?.transpired : '')
      setValue('remark', data?.remark ? data?.remark : '')
    }
    const temp = caseApi?.find((item) => item.id == data?.caseId)
    setClient(
      temp?.Background?.lastName +
        ',' +
        '  ' +
        temp?.Background?.firstName +
        '  ' +
        temp?.Background?.middleName
    )
  }, [setValue, data, caseApi])

  return (
    <>
      <Dialog fullWidth maxWidth="sm" open={props.open}>
        <DialogTitle>
          Edit Progress Note
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
        {!data ? (
          <DialogContent>
            <Box display="flex" justifyContent="center" sx={{ pt: 1, pb: 5 }}>
              <CircularProgress />
            </Box>
          </DialogContent>
        ) : (
          <>
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogContent>
                {client && (
                  <FormHelperText>Client:&nbsp;&nbsp;{client}</FormHelperText>
                )}
                <Controller
                  name="caseId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      select
                      disabled
                      fullWidth
                      value={field.value}
                      onChange={handleChangeClient}
                      label="Case"
                      margin="dense"
                      variant="outlined"
                      error={Boolean(errors?.caseId)}
                      helperText={errors.caseId?.message}
                    >
                      <MenuItem>
                        <em>--------</em>
                      </MenuItem>
                      {caseApi?.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          Case&nbsp;{item.id}
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
                      margin="dense"
                      variant="outlined"
                      error={Boolean(errors?.caseId)}
                      helperText={errors.caseId?.message}
                    >
                      <MenuItem>
                        <em>--------</em>
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
                  name="activity"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      required
                      margin="dense"
                      label="Activity"
                      variant="outlined"
                      error={Boolean(errors.activity)}
                      helperText={errors.activity?.message}
                    />
                  )}
                />
                <Controller
                  name="client"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={5}
                      maxRows={10}
                      margin="dense"
                      variant="outlined"
                      label="Client"
                      error={Boolean(errors.client)}
                      helperText={errors.client?.message}
                    />
                  )}
                />
                <Controller
                  name="family"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={5}
                      maxRows={10}
                      margin="dense"
                      label="Family"
                      variant="outlined"
                      error={Boolean(errors.family)}
                      helperText={errors.family?.message}
                    />
                  )}
                />
                <Controller
                  name="environment"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={5}
                      maxRows={10}
                      margin="dense"
                      variant="outlined"
                      label="Environment"
                      error={Boolean(errors.environment)}
                      helperText={errors.environment?.message}
                    />
                  )}
                />
                <Controller
                  name="church"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={5}
                      maxRows={10}
                      margin="dense"
                      variant="outlined"
                      label="Church"
                      error={Boolean(errors.church)}
                      helperText={errors.church?.message}
                    />
                  )}
                />
                <Controller
                  name="livelihood"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={5}
                      maxRows={10}
                      margin="dense"
                      variant="outlined"
                      label="Livelihood"
                      error={Boolean(errors.livelihood)}
                      helperText={errors.livelihood?.message}
                    />
                  )}
                />
                <Controller
                  name="transpired"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={5}
                      maxRows={10}
                      margin="dense"
                      variant="outlined"
                      label="What Transpired"
                    />
                  )}
                />
                <Controller
                  name="remark"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={5}
                      maxRows={10}
                      margin="dense"
                      variant="outlined"
                      label="Program Head's Remark"
                    />
                  )}
                />
              </DialogContent>
              <DialogActions>
                <LoadingButton
                  type="submit"
                  color="success"
                  variant="contained"
                  loading={fetchLoading}
                >
                  save
                </LoadingButton>
              </DialogActions>
            </form>
          </>
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

  const onSubmit = async () => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.delete(`/api/progressnote/${props.id}`)
      const data = await res.data
      mutate(`/api/progressnote`)
      Snackbar.success(data.message)
      handleCloseDialog()
      setFetchLoading(false)
    } catch (err) {
      setFetchLoading(false)
      if (err.response?.data) Snackbar.error(err.response?.data?.message)
    }
  }

  return (
    <>
      <Dialog open={props.open}>
        <DialogTitle>Delete Progress Note</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this Progress note?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleCloseDialog}>
            Cancel
          </Button>
          <LoadingButton
            color="error"
            loading={fetchLoading}
            onClick={onSubmit}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

interface DialogProps {
  id?: number
  open: boolean
  handleDialog: () => void
}

export interface CaseApi {
  id: string
  Background: Background
}

export interface Background {
  firstName: string
  middleName: string
  lastName: string
}

export default ProgressNote
