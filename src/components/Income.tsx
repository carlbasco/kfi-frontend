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
  TextField
} from '@mui/material'
import { Box } from '@mui/system'
import styles from '@styles/filemaintenance'
import { IncomeDefaultValues, IncomeForm, IncomeFormYup } from '@validation'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import useSWR, { mutate } from 'swr'

const MonthlyIncome = () => {
  const { data } = useSWR('/api/income')
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
    name: string
  }
  const [deleteData, setDeleteData] = useState<DeleteDataProps>({
    id: '',
    name: '',
  })
  const [openDeleteForm, setOpenDeleteForm] = useState(false)
  const handleDeleteForm = () => {
    setOpenDeleteForm(!openDeleteForm)
  }
  const handleClickDelete = (id: string | number, name: string) => {
    setDeleteData({ id, name })
    handleDeleteForm()
  }

  return (
    <>
      <Box css={styles.boxRoot}>
        <CustomTable
          size="small"
          title="Monthly Income Range"
          loading={!data}
          data={data}
          header={[
            {
              title: 'From',
              field: 'from',
              align: 'center',
              minWidth: '120px',
            },
            { title: 'To', field: 'to', align: 'center', minWidth: '120px' },
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
                handleClickDelete(
                  rowData.id,
                  `${rowData.from} - ${rowData.to}`
                ),
            },
          ]}
        />
        <NewDialog open={openNewForm} handleDialog={handleNewForm} />
        {openEditForm && (
          <EditDialog
            id={editId}
            open={openEditForm}
            handleDialog={handleEditForm}
          />
        )}
        {openDeleteForm && (
          <DeleteDialog
            deleteData={deleteData}
            open={openDeleteForm}
            handleDialog={handleDeleteForm}
          />
        )}
      </Box>
    </>
  )
}

const NewDialog = ({ open, handleDialog }: DialogProps) => {
  const [fetchLoading, setFetchLoading] = useState(false)

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: IncomeDefaultValues,
    resolver: yupResolver(IncomeFormYup),
  })

  const onSubmit: SubmitHandler<IncomeForm> = async (values) => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.post('/api/income', values)
      const data = await res.data
      setFetchLoading(false)
      Snackbar.success(data.message)
      mutate('/api/income')
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
              name="from"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="from"
                  fullWidth
                  autoFocus
                  label="From"
                  margin="dense"
                  variant="outlined"
                  error={Boolean(errors.from)}
                  helperText={errors.from?.message}
                />
              )}
            />
            <Controller
              name="to"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="to"
                  fullWidth
                  label="To"
                  margin="dense"
                  variant="outlined"
                  error={Boolean(errors.to)}
                  helperText={errors.to?.message}
                />
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
  const { data } = useSWR(open ? `/api/income/${id}` : null, {
    refreshInterval: 0,
  })
  const [fetchLoading, setFetchLoading] = useState(false)

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: IncomeDefaultValues,
    resolver: yupResolver(IncomeFormYup),
  })

  useEffect(() => {
    if (data) {
      setValue('from', data.from)
      setValue('to', data.to)
    }
  }, [data, setValue])

  const onSubmit: SubmitHandler<IncomeForm> = async (values) => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.put(`/api/income/${id}`, values)
      const data = await res.data
      setFetchLoading(false)
      Snackbar.success(data.message)
      mutate('/api/income')
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
                  name="from"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="from"
                      fullWidth
                      autoFocus
                      label="From"
                      margin="dense"
                      variant="outlined"
                      error={Boolean(errors.from)}
                      helperText={errors.from?.message}
                    />
                  )}
                />
                <Controller
                  name="to"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="to"
                      fullWidth
                      label="To"
                      margin="dense"
                      variant="outlined"
                      error={Boolean(errors.to)}
                      helperText={errors.to?.message}
                    />
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
      const res = await ApiAuth.delete(`/api/income/${deleteData.id}`)
      const data = await res.data
      Snackbar.success(data.message)
      mutate('/api/income')
      setFetchLoading(false)
      handleDialog()
    } catch (err) {
      setFetchLoading(false)
      Snackbar.error(err.response.data.message)
      handleDialog()
    }
  }

  return (
    <>
      <Dialog maxWidth="sm" open={open}>
        <DialogTitle>Delete Monthly Income</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete &nbsp;
            <strong>{deleteData.name}?</strong>
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
  deleteData: { id: string | number; name: string }
}

export default MonthlyIncome
