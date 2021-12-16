/** @jsxImportSource @emotion/react */
import { CustomTable } from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { ApiAuth, Snackbar } from '@lib'
import { Close, Delete, Edit } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
    Autocomplete,
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
    BarangayDefaultValues,
    BarangayForm,
    BarangayFormYup
} from '@validation'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import useSWR, { mutate } from 'swr'


const TableBarangay = () => {
  const { data } = useSWR('/api/barangay')

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
        maxHeight="370px"
        size="small"
        title="Barangay"
        loading={!data}
        data={data}
        header={[
          {
            title: 'Barangay',
            field: 'brgy_name',
            align: 'left',
            minWidth: '120px',
          },
          {
            title: 'City',
            field: 'city_name',
            align: 'left',
            minWidth: '120px',
            render: (rowData) => `${rowData.city.city_name}`,
          },
          {
            title: 'Province',
            field: 'province_name',
            align: 'left',
            minWidth: '120px',
            render: (rowData) => `${rowData.city.province.province_name}`,
          },
        ]}
        addAction={handleNewForm}
        actions={[
          {
            icon: <Edit color="primary" />,
            tooltip: 'Edit',
            onClick: (rowData) => handleClickEdit(rowData.brgy_code),
          },
          {
            icon: <Delete color="error" />,
            tooltip: 'Delete',
            onClick: (rowData) =>
              handleClickDelete(rowData.brgy_code, rowData.brgy_name),
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
  const { data: cityApi } = useSWR('/api/option/city', { refreshInterval: 0 })

  const [fetchLoading, setFetchLoading] = useState(false)
  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: BarangayDefaultValues,
    resolver: yupResolver(BarangayFormYup),
  })

  const handleCloseDialog = () => {
    reset()
    handleDialog()
  }

  const onSubmit: SubmitHandler<BarangayForm> = async (values) => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.post('/api/barangay', values)
      const data = await res.data
      setFetchLoading(false)
      mutate('/api/barangay')
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
            New Barangay
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
              name="brgy_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  autoFocus
                  margin="dense"
                  variant="outlined"
                  label="Barangay name"
                  autoComplete="new-password"
                  error={Boolean(errors.brgy_name)}
                  helperText={errors.brgy_name?.message}
                />
              )}
            />
            <Autocomplete
              autoHighlight
              options={cityApi ? cityApi : []}
              getOptionLabel={(option: any) =>
                `${option.city_name}  -  ${option.province.province_name}`
              }
              onChange={(_, option) => {
                setValue('city_code', option?.city_code)
              }}
              renderOption={(props, option) => (
                <Box component="li" {...props} key={option.city_code}>
                  {option.city_name}&nbsp;&nbsp;-&nbsp;
                  {option.province.province_name}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="City"
                  margin="dense"
                  variant="outlined"
                  autoComplete="new-password"
                  error={Boolean(errors.city_code)}
                  helperText={errors.city_code?.message}
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
  const { data: cityApi } = useSWR('/api/option/city', { refreshInterval: 0 })
  const { data } = useSWR(open ? `/api/barangay/${id}` : null)

  const [fetchLoading, setFetchLoading] = useState(false)
  const [cityValue, setCityValue] = useState(null)

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: BarangayDefaultValues,
    resolver: yupResolver(BarangayFormYup),
  })

  useEffect(() => {
    if (data) {
      setValue('brgy_name', data?.brgy_name)
      setValue('city_code', data?.city_code)
    }
    setCityValue(
      cityApi?.find((item: any) => data?.city_code === item.city_code)
    )
  }, [data, cityApi, setValue])

  const handleCloseDialog = () => {
    setCityValue(null)
    reset()
    handleDialog()
  }

  const onSubmit: SubmitHandler<BarangayForm> = async (values) => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.put(`/api/barangay/${id}`, values)
      const data = await res.data
      setFetchLoading(false)
      mutate('/api/barangay')
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
          {!data && !cityApi ? (
            <DialogContent css={styles.dialogContentLoading}>
              <CircularProgress />
            </DialogContent>
          ) : (
            <>
              <DialogContent>
                <Controller
                  name="brgy_name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      fullWidth
                      id="brgy_name"
                      margin="dense"
                      variant="outlined"
                      label="Barangay name"
                      error={Boolean(errors.brgy_name)}
                      helperText={errors.brgy_name?.message}
                    />
                  )}
                />
                {cityValue && (
                  <Autocomplete
                    autoHighlight
                    disableClearable
                    options={cityApi}
                    value={cityValue}
                    getOptionLabel={(option: any) =>
                      `${option.city_name}  -  ${option.province.province_name}`
                    }
                    onChange={(_, option) => {
                      setValue('city_code', option?.city_code)
                      setCityValue(option)
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.city_code === value.city_code
                    }
                    renderOption={(props, option) => (
                      <Box component="li" {...props} key={option.city_code}>
                        {option.city_name}&nbsp;&nbsp;-&nbsp;
                        {option.province.province_name}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        id="city"
                        name="city"
                        label="City"
                        margin="dense"
                        variant="outlined"
                        autoComplete="new-password"
                        error={Boolean(errors.city_code)}
                        helperText={errors.city_code?.message}
                      />
                    )}
                  />
                )}
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
      const res = await ApiAuth.delete(`/api/barangay/${deleteData.id}`)
      const data = await res.data
      Snackbar.success(data.message)
      mutate('/api/barangay')
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

export default TableBarangay
