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
import { CityDefaultValues, CityForm, CityFormYup } from '@validation'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import useSWR, { mutate } from 'swr'


const TableCity = () => {
  const { data } = useSWR('/api/city')

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
        title="City / Municipality"
        loading={!data}
        data={data}
        header={[
          {
            title: 'City',
            field: 'city_name',
            align: 'left',
            minWidth: '120px',
          },
          {
            title: 'Province',
            field: 'province_name',
            align: 'left',
            render: (rowData) => `${rowData.province.province_name}`,
          },
          {
            title: 'Total Barangay',
            field: '_count',
            align: 'center',
            render: (rowData) => `${rowData._count.Barangay}`,
          },
        ]}
        addAction={handleNewForm}
        actions={[
          {
            icon: <Edit color="primary" />,
            tooltip: 'Edit',
            onClick: (rowData) => handleClickEdit(rowData.city_code),
          },
          {
            icon: <Delete color="error" />,
            tooltip: 'Delete',
            onClick: (rowData) =>
              handleClickDelete(rowData.city_code, rowData.city_name),
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
  const { data: provinceApi } = useSWR('/api/province', { refreshInterval: 0 })
  const [fetchLoading, setFetchLoading] = useState(false)

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: CityDefaultValues,
    resolver: yupResolver(CityFormYup),
  })

  const handleCloseDialog = () => {
    reset()
    handleDialog()
  }

  const onSubmit: SubmitHandler<CityForm> = async (values) => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.post('/api/city', values)
      const data = await res.data
      setFetchLoading(false)
      mutate('/api/city')
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
            New City
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
              name="city_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  autoFocus
                  fullWidth
                  margin="dense"
                  id="city_name"
                  label="City name"
                  variant="outlined"
                  autoComplete="new-password"
                  error={Boolean(errors.city_name)}
                  helperText={errors.city_name?.message}
                />
              )}
            />
            <Autocomplete
              autoHighlight
              options={provinceApi ? provinceApi : []}
              getOptionLabel={(option: any) => option.province_name}
              onChange={(_, option) => {
                setValue('province_code', option.province_code)
              }}
              renderOption={(props, option) => (
                <Box component="li" {...props} key={option.province_code}>
                  {option.province_name}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  fullWidth
                  label="Province"
                  margin="dense"
                  variant="outlined"
                  autoComplete="new-password"
                  error={Boolean(errors.province_code)}
                  helperText={errors.province_code?.message}
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
  const { data: provinceApi } = useSWR('/api/option/province', {
    refreshInterval: 0,
  })
  const { data } = useSWR(open ? `/api/city/${id}` : null, {
    refreshInterval: 0,
  })
  const [fetchLoading, setFetchLoading] = useState(false)
  const [provinceValue, setProvinceValue] = useState(null)

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: CityDefaultValues,
    resolver: yupResolver(CityFormYup),
  })

  useEffect(() => {
    if (data) {
      setValue('city_name', data?.city_name)
      setValue('province_code', data?.province_code)
    }
    setProvinceValue(
      provinceApi?.find(
        (item: any) => data?.province_code === item.province_code
      )
    )
  }, [data, provinceApi, setValue])

  const handleCloseDialog = () => {
    setProvinceValue(null)
    reset()
    handleDialog()
  }

  const onSubmit: SubmitHandler<CityForm> = async (values) => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.put(`/api/city/${id}`, values)
      const data = await res.data
      setFetchLoading(false)
      mutate('/api/city')
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
          {!data || !provinceApi ? (
            <DialogContent css={styles.dialogContentLoading}>
              <CircularProgress />
            </DialogContent>
          ) : (
            <>
              <DialogContent>
                <Controller
                  name="city_name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      fullWidth
                      margin="dense"
                      id="city_name"
                      name="city_name"
                      label="City name"
                      variant="outlined"
                      autoComplete="new-password"
                      error={Boolean(errors.city_name)}
                      helperText={errors.city_name?.message}
                    />
                  )}
                />
                {provinceValue && (
                  <Autocomplete
                    disableClearable
                    autoHighlight
                    value={provinceValue}
                    options={provinceApi}
                    getOptionLabel={(option: any) => option.province_name}
                    onChange={(_, option) => {
                      setValue('province_code', option?.province_code)
                      setProvinceValue(option)
                    }}
                    isOptionEqualToValue={(option, value) =>
                      value.province_code === option.province_code
                    }
                    renderOption={(props, option) => (
                      <Box component="li" {...props} key={option.province_code}>
                        {option.province_name}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label="Province"
                        margin="dense"
                        variant="outlined"
                        autoComplete="new-password"
                        error={Boolean(errors.province_code)}
                        helperText={errors.province_code?.message}
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
      const res = await ApiAuth.delete(`/api/city/${deleteData.id}`)
      const data = await res.data
      Snackbar.success(data.message)
      mutate('/api/city')
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

export default TableCity
