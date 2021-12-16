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
import {
    OccupationDefaultValues,
    OccupationForm,
    OccupationFormYup
} from '@validation'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import useSWR, { mutate } from 'swr'


const Occupation = () => {
  const { data } = useSWR('/api/occupation')

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
    occupationName: string
  }
  const [deleteData, setDeleteData] = useState<DeleteDataProps>({
    id: '',
    occupationName: '',
  })
  const [openDeleteForm, setOpenDeleteForm] = useState(false)
  const handleDeleteForm = () => {
    setOpenDeleteForm(!openDeleteForm)
  }
  const handleClickDelete = (id: string | number, occupationName: string) => {
    setDeleteData({ id, occupationName })
    handleDeleteForm()
  }

  return (
    <>
      <Box css={styles.boxRoot}>
        <CustomTable
          size="small"
          title="Occupation"
          loading={!data}
          data={data}
          header={[
            {
              title: 'Name',
              field: 'occupationName',
              align: 'left',
              minWidth: '120px',
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
                handleClickDelete(rowData.id, rowData.occupationName),
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
    defaultValues: OccupationDefaultValues,
    resolver: yupResolver(OccupationFormYup),
  })

  const onSubmit: SubmitHandler<OccupationForm> = async (values) => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.post('/api/occupation', values)
      const data = await res.data
      setFetchLoading(false)
      Snackbar.success(data.message)
      mutate('/api/occupation')
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
              control={control}
              name="occupationName"
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  autoFocus
                  label="Title"
                  margin="dense"
                  variant="outlined"
                  id="occupationName"
                  error={Boolean(errors.occupationName)}
                  helperText={errors.occupationName?.message}
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
  const { data } = useSWR(open ? `/api/occupation/${id}` : null, {
    refreshInterval: 0,
  })

  const [fetchLoading, setFetchLoading] = useState(false)
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: OccupationDefaultValues,
    resolver: yupResolver(OccupationFormYup),
  })

  const handleCloseDialog = () => {
    reset()
    handleDialog()
  }
  useEffect(() => {
    if (data) setValue('occupationName', data.occupationName)
  }, [data, setValue])

  const onSubmit: SubmitHandler<OccupationForm> = async (values) => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.put(`/api/occupation/${id}`, values)
      const data = await res.data
      setFetchLoading(false)
      Snackbar.success(data.message)
      mutate('/api/occupation')
      handleCloseDialog()
    } catch (err) {
      setFetchLoading(false)
      if (err.response?.data) Snackbar.error(err.response.data.message)
    }
  }

  return (
    <>
      <Dialog fullWidth maxWidth="xs" open={open}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            Update
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
                  control={control}
                  name="occupationName"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      autoFocus
                      label="Title"
                      margin="dense"
                      variant="outlined"
                      id="occupationName"
                      error={Boolean(errors.occupationName)}
                      helperText={errors.occupationName?.message}
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
      const res = await ApiAuth.delete(`/api/occupation/${deleteData.id}`)
      const data = await res.data
      Snackbar.success(data.message)
      mutate('/api/occupation')
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
      <Dialog fullWidth maxWidth="xs" open={open}>
        <DialogTitle>Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete &nbsp;
            <strong>{deleteData.occupationName}?</strong>
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
  deleteData: { id: string | number; occupationName: string }
}

export default Occupation
