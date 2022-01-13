/** @jsxImportSource @emotion/react */
import { CustomTable } from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { AdminLayout } from '@layouts'
import { ApiAuth, Snackbar } from '@lib'
import { Close, Delete, Edit } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Autocomplete,
  Breadcrumbs,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import styles from '@styles/filemaintenance'
import { BranchDefaultValues, BranchForm, BranchFormYup } from '@validation'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import useSWR, { mutate } from 'swr'

const Branch = () => {
  const { data } = useSWR('/api/branch')

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
            <Typography fontFamily="inherit" variant="subtitle1">
              File Maintenance
            </Typography>
            <Typography css={styles.linkActive} variant="subtitle1">
              Branch
            </Typography>
          </Breadcrumbs>
        </Box>
        <Box>
          <CustomTable
            title="Branch"
            size="small"
            loading={!data}
            data={data}
            addAction={handleNewForm}
            header={[
              {
                title: 'Branch Name',
                align: 'left',
                field: 'branchName',
                minWidth: '120px',
              },
              {
                title: 'Branch Head',
                align: 'center',
                field: '',
                minWidth: '120px',
                render: (rowData) =>
                  rowData?.branchHead
                    ? `${rowData?.branchHead?.firstName} ${rowData?.branchHead?.lastName}`
                    : `-`,
              },
              {
                title: 'Contact',
                align: 'center',
                field: '',
                minWidth: '142px',
                render: (rowData) =>
                  rowData.User?.phone ? `${rowData.User?.phone}` : '-',
              },
              {
                title: 'Address',
                align: 'left',
                field: 'address',
                minWidth: '250px',
                render: (rowData) =>
                  `${rowData.address} ${rowData.barangay.brgy_name}, ${rowData.city.city_name}, ${rowData.province.province_name}`,
              },
            ]}
            actions={[
              {
                icon: <Edit color="primary" />,
                tooltip: 'Edit Branch',
                onClick: (rowData: { id: string | number }) =>
                  handleClickEdit(rowData.id),
              },
              {
                icon: <Delete color="error" />,
                tooltip: 'Delete Branch',
                onClick: (rowData) =>
                  handleClickDelete(rowData.id, rowData.name),
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
          <DeleteDialog
            deleteData={deleteData}
            open={openDeleteForm}
            handleDialog={handleDeleteForm}
          />
        </Box>
      </AdminLayout>
    </>
  )
}

const NewDialog = ({ open, handleDialog }: DialogProps) => {
  const { data: provinceApi } = useSWR('/api/option/province', {
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
    defaultValues: BranchDefaultValues,
    resolver: yupResolver(BranchFormYup),
  })

  const [cityOption, setCityOption] = useState(null)
  const [brgyOption, setBrgyOption] = useState(null)

  const handleCloseDialog = () => {
    reset()
    setCityOption(null)
    setBrgyOption(null)
    handleDialog()
  }

  const onSubmit: SubmitHandler<BranchForm> = async (values) => {
    try {
      const res = await ApiAuth.post('/api/branch', values)
      const data = await res.data
      setFetchLoading(false)
      Snackbar.success(data.message)
      mutate('/api/branch')
      handleCloseDialog()
    } catch (err) {
      setFetchLoading(false)
      if (err.response?.data) Snackbar.error(err.response.data.message)
    }
  }

  const handleChangeProvince = async (option: any) => {
    if (option) {
      setValue('province_code', option?.province_code)
      try {
        const res = await ApiAuth.get(
          `/api/province/${option.province_code}/city`
        )
        const data = await res.data
        setCityOption(data.City)
      } catch (err) {
        Snackbar.error(err.response.data.message)
        setCityOption(null)
        setBrgyOption(null)
      }
    } else {
      setCityOption(null)
      setBrgyOption(null)
    }
  }

  const handleChangeCity = async (option: any) => {
    if (option) {
      setValue('city_code', option?.city_code)
      try {
        const res = await ApiAuth.get(`/api/city/${option.city_code}/barangay`)
        const data = await res.data
        setBrgyOption(data.Barangay)
      } catch (err) {
        Snackbar.error(err.response.data.message)
        setBrgyOption(null)
      }
    } else {
      setBrgyOption(null)
    }
  }

  return (
    <>
      <Dialog fullWidth maxWidth="sm" open={open}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            New Branch
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
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="branchName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      autoFocus
                      margin="dense"
                      label="Branch Name"
                      name="branchName"
                      variant="outlined"
                      error={Boolean(errors.branchName)}
                      helperText={errors.branchName?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      id="address"
                      variant="outlined"
                      label="Address Line 1"
                      error={Boolean(errors.address)}
                      helperText={errors.address}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                {provinceApi && (
                  <Autocomplete
                    autoHighlight
                    options={provinceApi}
                    getOptionLabel={(option: any) => option.province_name}
                    onChange={(_, option) => handleChangeProvince(option)}
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
                        variant="outlined"
                        autoComplete="new-password"
                        error={Boolean(errors.province_code)}
                        helperText={errors.province_code}
                      />
                    )}
                  />
                )}
              </Grid>
              {cityOption && (
                <Grid item xs={12}>
                  <Autocomplete
                    autoHighlight
                    options={cityOption}
                    getOptionLabel={(option: any) => option.city_name}
                    onChange={(_, option) => handleChangeCity(option)}
                    renderOption={(props, option) => (
                      <Box component="li" {...props} key={option.city_code}>
                        {option.city_name}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        fullWidth
                        label="City"
                        variant="outlined"
                        autoComplete="new-password"
                        error={Boolean(errors.city_code)}
                        helperText={errors.city_code}
                      />
                    )}
                  />
                </Grid>
              )}
              {brgyOption && (
                <Grid item xs={12}>
                  <Autocomplete
                    autoHighlight
                    options={brgyOption}
                    getOptionLabel={(option: any) => option.brgy_name}
                    onChange={(_, option) =>
                      option && setValue('brgy_code', option.brgy_code)
                    }
                    renderOption={(props, option) => (
                      <Box component="li" {...props} key={option.brgy_code}>
                        {option.brgy_name}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        fullWidth
                        label="Barangay"
                        variant="outlined"
                        autoComplete="new-password"
                        error={Boolean(errors.brgy_code)}
                        helperText={errors.brgy_code?.message}
                      />
                    )}
                  />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={fetchLoading}
            >
              Create Branch
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
  const { data } = useSWR(open ? `/api/branch/${id}` : null, {
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
    defaultValues: BranchDefaultValues,
    resolver: yupResolver(BranchFormYup),
  })

  const [cityOption, setCityOption] = useState(null)
  const [brgyOption, setBrgyOption] = useState(null)

  const handleCloseDialog = () => {
    reset()
    setCityOption(null)
    setBrgyOption(null)
    handleDialog()
  }

  useEffect(() => {
    if (data) {
      setValue('branchName', data.branchName)
      setValue('address', data.address)
    }
  }, [data, setValue])

  const onSubmit: SubmitHandler<BranchForm> = async (values) => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.put(`/api/branch/${id}`, values)
      const data = await res.data
      setFetchLoading(false)
      Snackbar.success(data.message)
      mutate('/api/branch')
      handleCloseDialog()
    } catch (err) {
      setFetchLoading(false)
      if (err.response?.data) Snackbar.error(err.response.data.message)
    }
  }

  const handleChangeProvince = async (option: any) => {
    if (option) {
      setValue('province_code', option?.province_code)
      try {
        const res = await ApiAuth.get(
          `/api/province/${option.province_code}/city`
        )
        const data = await res.data
        setCityOption(data.City)
      } catch (err) {
        Snackbar.error(err.response.data.message)
        setCityOption(null)
        setBrgyOption(null)
      }
    } else {
      setCityOption(null)
      setBrgyOption(null)
    }
  }

  const handleChangeCity = async (option: any) => {
    if (option) {
      setValue('city_code', option?.city_code)
      try {
        const res = await ApiAuth.get(`/api/city/${option.city_code}/barangay`)
        const data = await res.data
        setBrgyOption(data.Barangay)
      } catch (err) {
        Snackbar.error(err.response.data.message)
        setBrgyOption(null)
      }
    } else {
      setBrgyOption(null)
    }
  }

  return (
    <>
      <Dialog fullWidth maxWidth="sm" open={open}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            Update Branch
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
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Controller
                      name="branchName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          autoFocus
                          margin="dense"
                          name="branchName"
                          variant="outlined"
                          label="Branch Name"
                          error={Boolean(errors.branchName)}
                          helperText={errors.branchName?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="address"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          id="address"
                          variant="outlined"
                          label="Address Line 1"
                          autoComplete="new-password"
                          error={Boolean(errors.address)}
                          helperText={errors.address}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box css={styles.boxLabel}>
                      <Typography variant="subtitle2" color="textSecondary">
                        current barangay, city, province:
                      </Typography>
                      <Typography variant="body1">
                        {data?.barangay.brgy_name},&nbsp;&nbsp;
                        {data?.city.city_name},&nbsp;&nbsp;
                        {data?.province.province_name}
                      </Typography>
                    </Box>
                    {provinceApi && (
                      <Autocomplete
                        autoHighlight
                        options={provinceApi}
                        getOptionLabel={(option: any) => option.province_name}
                        onChange={(_, option) => handleChangeProvince(option)}
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            {...props}
                            key={option.province_code}
                          >
                            {option.province_name}
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            required
                            fullWidth
                            label="Province"
                            variant="outlined"
                            autoComplete="new-password"
                            error={Boolean(errors.province_code)}
                            helperText={errors.province_code}
                          />
                        )}
                      />
                    )}
                  </Grid>
                  {cityOption && (
                    <Grid item xs={12}>
                      <Autocomplete
                        autoHighlight
                        options={cityOption}
                        getOptionLabel={(option: any) => option.city_name}
                        onChange={(_, option) => handleChangeCity(option)}
                        renderOption={(props, option) => (
                          <Box component="li" {...props} key={option.city_code}>
                            {option.city_name}
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            required
                            fullWidth
                            label="City"
                            variant="outlined"
                            autoComplete="new-password"
                            error={Boolean(errors.city_code)}
                            helperText={errors.city_code}
                          />
                        )}
                      />
                    </Grid>
                  )}
                  {brgyOption && (
                    <Grid item xs={12}>
                      <Autocomplete
                        autoHighlight
                        options={brgyOption}
                        getOptionLabel={(option: any) => option.brgy_name}
                        onChange={(_, option) =>
                          option && setValue('brgy_code', option.brgy_code)
                        }
                        renderOption={(props, option) => (
                          <Box component="li" {...props} key={option.brgy_code}>
                            {option.brgy_name}
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            required
                            fullWidth
                            label="Barangay"
                            variant="outlined"
                            autoComplete="new-password"
                            error={Boolean(errors.brgy_code)}
                            helperText={errors.brgy_code?.message}
                          />
                        )}
                      />
                    </Grid>
                  )}
                </Grid>
              </DialogContent>
              <DialogActions>
                <LoadingButton
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={fetchLoading}
                >
                  Update Branch
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
      const res = await ApiAuth.delete(`/api/branch/${deleteData.id}`)
      const data = await res.data
      Snackbar.success(data.message)
      mutate('/api/branch')
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
        <DialogTitle>Delete Branch</DialogTitle>
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
            Delete Branch
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

export default Branch
