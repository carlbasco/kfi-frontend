/** @jsxImportSource @emotion/react */
import { CustomTable } from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { ApiAuth, Snackbar } from '@lib'
import { Close, Delete, Edit } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField
} from '@mui/material'
import { Box } from '@mui/system'
import styles from '@styles/filemaintenance'
import {
  RecommendationDefaultValues,
  RecommendationForm,
  RecommendationFormYup
} from '@validation'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import useSWR, { mutate } from 'swr'

const Recommendation = () => {
  const { data } = useSWR('/api/recommendation')
  const [openNewForm, setOpenNewForm] = useState(false)
  const handleNewForm = () => {
    setOpenNewForm(!openNewForm)
  }

  const [editId, setEditId] = useState<string | number>('')
  const [openEditForm, setOpenEditForm] = useState(false)
  const handleEditForm = () => {
    setOpenEditForm(!openEditForm)
  }
  const handleClickEdit = (id: string | number) => {
    setEditId(id)
    handleEditForm()
  }

  interface DeleteDataProps {
    id: string | number
    recommendationName: string
  }
  const [deleteData, setDeleteData] = useState<DeleteDataProps>({
    id: '',
    recommendationName: '',
  })
  const [openDeleteForm, setOpenDeleteForm] = useState(false)
  const handleDeleteForm = () => {
    setOpenDeleteForm(!openDeleteForm)
  }
  const handleClickDelete = (
    id: string | number,
    recommendationName: string
  ) => {
    setDeleteData({ id, recommendationName })
    handleDeleteForm()
  }

  return (
    <>
      <Box css={styles.boxRoot}>
        <CustomTable
          size="small"
          title="Recommendation"
          loading={!data}
          data={data}
          header={[
            {
              title: 'Title',
              field: 'recommendationName',
              align: 'left',
              minWidth: '120px',
            },
            {
              title: 'Type of Request',
              align: 'left',
              field: '',
              render: (rowData) => rowData.request?.requestName,
            },
            {
              title: 'Date created',
              field: '',
              align: 'center',
              render: (rowData) => new Date(rowData.createdAt).toDateString(),
            },
          ]}
          addAction={handleNewForm}
          actions={[
            {
              icon: <Edit color="primary" />,
              tooltip: 'Edit',
              onClick: (rowData: { id: string | number }) =>
                handleClickEdit(rowData.id),
            },
            {
              icon: <Delete color="error" />,
              tooltip: 'Delete',
              onClick: (rowData) =>
                handleClickDelete(rowData.id, rowData.recommendationName),
            },
          ]}
        />
        <NewDialog open={openNewForm} handleDialog={handleNewForm} />
        <EditDialog
          id={editId}
          open={openEditForm}
          handleDialog={handleEditForm}
        />
        <DeleteDialog
          deleteData={deleteData}
          open={openDeleteForm}
          handleDialog={handleDeleteForm}
        />
      </Box>
    </>
  )
}

const NewDialog = ({ open, handleDialog }: DialogProps) => {
  const { data: requestApi } = useSWR(open ? `/api/option/typerequest` : null)
  const [fetchLoading, setFetchLoading] = useState(false)

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: RecommendationDefaultValues,
    resolver: yupResolver(RecommendationFormYup),
  })

  const onSubmit: SubmitHandler<RecommendationForm> = async (values) => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.post('/api/recommendation', values)
      const data = await res.data
      setFetchLoading(false)
      Snackbar.success(data.message)
      mutate('/api/recommendation')
      reset()
      handleDialog()
    } catch (err) {
      setFetchLoading(false)
      if (err.response?.data) Snackbar.error(err.response.data.message)
    }
  }

  const handleCloseDialog = () => {
    reset()
    handleDialog()
  }

  return (
    <>
      <Dialog fullWidth maxWidth="xs" open={open}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            New
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
          <DialogContent>
            <Controller
              name="recommendationName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  autoFocus
                  label="Title"
                  margin="dense"
                  variant="outlined"
                  id="recommendationName"
                  error={Boolean(errors.recommendationName)}
                  helperText={errors.recommendationName?.message}
                />
              )}
            />
            <Controller
              name="requestId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Request"
                  margin="dense"
                  variant="outlined"
                  id="requestId"
                  error={Boolean(errors.requestId)}
                  helperText={errors.requestId?.message}
                >
                  <MenuItem value="">
                    <em>----------</em>
                  </MenuItem>
                  {requestApi?.map((item: any) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.requestName}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </DialogContent>
          <DialogActions>
            <LoadingButton
              fullWidth
              size="large"
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

const EditDialog = ({ id, open, handleDialog }: EditDialogProps) => {
  const { data: requestApi } = useSWR(open ? `/api/option/typerequest` : null)
  const { data } = useSWR(open ? `/api/recommendation/${id}` : null, {
    refreshInterval: 0,
  })

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: RecommendationDefaultValues,
    resolver: yupResolver(RecommendationFormYup),
  })

  useEffect(() => {
    if (data) {
      setValue('recommendationName', data.recommendationName)
      setValue('requestId', data.requestId)
    }
  }, [data, setValue])

  const onSubmit: SubmitHandler<RecommendationForm> = async (values) => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.put(`/api/recommendation/${id}`, values)
      const data = await res.data
      setFetchLoading(false)
      Snackbar.success(data.message)
      mutate('/api/recommendation')
      reset()
      handleDialog()
    } catch (err) {
      setFetchLoading(false)
      if (err.response?.data) Snackbar.error(err.response.data.message)
    }
  }

  const handleCloseDialog = () => {
    reset()
    handleDialog()
  }

  const [fetchLoading, setFetchLoading] = useState(false)

  return (
    <>
      <Dialog fullWidth maxWidth="xs" open={open}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            Edit
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
            <DialogContent css={styles.dialogContentLoading}>
              <CircularProgress />
            </DialogContent>
          ) : (
            <>
              <DialogContent>
                <Controller
                  name="recommendationName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      autoFocus
                      label="Title"
                      margin="dense"
                      variant="outlined"
                      id="recommendationName"
                      error={Boolean(errors.recommendationName)}
                      helperText={errors.recommendationName?.message}
                    />
                  )}
                />
                <Controller
                  name="requestId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label="Request"
                      margin="dense"
                      variant="outlined"
                      id="requestId"
                      error={Boolean(errors.requestId)}
                      helperText={errors.requestId?.message}
                    >
                      <MenuItem value="">
                        <em>----------</em>
                      </MenuItem>
                      {requestApi?.map((item: any) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.requestName}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </DialogContent>
              <DialogActions>
                <LoadingButton
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={fetchLoading}
                >
                  Update
                </LoadingButton>
              </DialogActions>
            </>
          )}
        </form>
      </Dialog>
    </>
  )
}

const DeleteDialog = ({
  open,
  deleteData,
  handleDialog,
}: DeleteDialogProps) => {
  const [fetchLoading, setFetchLoading] = useState(false)
  const deleteRequest = async () => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.delete(`/api/recommendation/${deleteData.id}`)
      const data = await res.data
      Snackbar.success(data.message)
      mutate('/api/recommendation')
      setFetchLoading(false)
      handleDialog()
    } catch (err) {
      setFetchLoading(false)
      if (err.response?.data) Snackbar.error(err.response?.data?.message)
      handleDialog()
    }
  }

  return (
    <>
      <Dialog maxWidth="sm" open={open}>
        <DialogTitle>Delete Recommendation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete &nbsp;
            <strong>{deleteData.recommendationName}?</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="inherit"
            onClick={handleDialog}
            disabled={fetchLoading}
          >
            Cancel
          </Button>
          <LoadingButton
            color="error"
            size="large"
            type="submit"
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
  open: boolean
  handleDialog: () => void
}
interface EditDialogProps extends DialogProps {
  id: string | number
}
interface DeleteDialogProps extends DialogProps {
  deleteData: { id: string | number; recommendationName: string }
}

export default Recommendation
