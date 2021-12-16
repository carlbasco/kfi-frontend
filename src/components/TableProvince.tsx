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
import styles from '@styles/filemaintenance'
import {
    ProvinceDefaultValues,
    ProvinceForm,
    ProvinceFormYup
} from '@validation'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import useSWR, { mutate } from 'swr'


const TableProvince = () => {
  const { data } = useSWR('/api/province')

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
      <CustomTable
        size="small"
        maxHeight="370px"
        title="Province"
        loading={!data}
        data={data}
        header={[
          {
            title: 'Province',
            field: 'province_name',
            align: 'left',
            minWidth: '120px',
          },
          {
            title: 'Total City/ Municipality',
            field: '_count',
            align: 'center',
            render: (rowData) =>
              `${rowData._count.City ? rowData._count.City : 0}`,
          },
        ]}
        addAction={handleNewForm}
        actions={[
          {
            icon: <Edit color="primary" />,
            tooltip: 'Edit',
            onClick: (rowData) => handleClickEdit(rowData.province_code),
          },
          {
            icon: <Delete color="error" />,
            tooltip: 'Delete',
            onClick: (rowData) =>
              handleClickDelete(rowData.province_code, rowData.province_name),
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
    defaultValues: ProvinceDefaultValues,
    resolver: yupResolver(ProvinceFormYup),
  })

  const handleCloseDialog = () => {
    reset()
    handleDialog()
  }

  const onSubmit: SubmitHandler<ProvinceForm> = async (values) => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.post('/api/province', values)
      const data = await res.data
      setFetchLoading(false)
      mutate('/api/province')
      Snackbar.success(data.message)
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
            New Province
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
              name="province_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  autoFocus
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  id="province_name"
                  label="Province name"
                  autoComplete="new-password"
                  error={Boolean(errors.province_name)}
                  helperText={errors.province_name?.message}
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
  const { data } = useSWR(open ? `/api/province/${id}` : null, {
    refreshInterval: 0,
  })
  const [fetchLoading, setFetchLoading] = useState(false)

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: ProvinceDefaultValues,
    resolver: yupResolver(ProvinceFormYup),
  })

  useEffect(() => {
    if (data) {
      setValue('province_name', data?.province_name)
    }
  }, [data, setValue])

  const handleCloseDialog = () => {
    reset()
    handleDialog()
  }

  const onSubmit: SubmitHandler<ProvinceForm> = async (values) => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.put(`/api/province/${id}`, values)
      const data = await res.data
      setFetchLoading(false)
      mutate('/api/province')
      Snackbar.success(data.message)
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
                  name="province_name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      fullWidth
                      margin="dense"
                      variant="outlined"
                      id="province_name"
                      label="Province name"
                      autoComplete="new-password"
                      error={Boolean(errors.province_name)}
                      helperText={errors.province_name?.message}
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
      const res = await ApiAuth.delete(`/api/province/${deleteData.id}`)
      const data = await res.data
      Snackbar.success(data.message)
      mutate('/api/province')
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
        <DialogTitle>Delete</DialogTitle>
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

export default TableProvince
