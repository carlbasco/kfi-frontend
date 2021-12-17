/** @jsxImportSource @emotion/react */
import { CustomTable } from '@components'
import { css } from '@emotion/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { AdminLayout } from '@layouts'
import { ApiAuth, Snackbar } from '@lib'
import {
  Close,
  Delete,
  Edit,
  Visibility,
  VisibilityOff
} from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import {
  AccountDefaultValues,
  AccountForm,
  AccountFormYup,
  AccountUpdateDefaultValues,
  AccountUpdateForm,
  AccountUpdateFormYup
} from '@validation'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import useSWR, { mutate } from 'swr'

const Admin = () => {
  const { data } = useSWR('/api/accounts')

  const [openNewForm, setOpenNewForm] = useState(false)
  const handleNewForm = () => {
    setOpenNewForm(!openNewForm)
  }
  const [editId, setEditId] = useState('')
  const [openEditForm, setOpenEditForm] = useState(false)
  const handleEditForm = () => {
    setOpenEditForm(!openEditForm)
  }
  const handleClickEdit = (id: string) => {
    setEditId(id)
    handleEditForm()
  }

  const [deleteId, setDeleteId] = useState('')
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const handleDeleteDialog = () => {
    setOpenDeleteDialog(!openDeleteDialog)
  }

  const handleDelete = (id: string) => {
    setDeleteId(id)
    handleDeleteDialog()
  }

  return (
    <>
      <Head>
        <title>Manage Accounts - Kamanggagawa Foundation Inc</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <AdminLayout>
        <Box css={styles.box}>
          <Breadcrumbs aria-label="breadcrumb" css={styles.breadcrumbs}>
            <Link href="/admin">
              <a css={styles.link}>
                <Typography
                  variant="subtitle1"
                  color="textPrimary"
                  css={styles.linkText}
                >
                  Dashboard
                </Typography>
              </a>
            </Link>
            <Typography css={styles.linkActive} variant="subtitle1">
              Accounts
            </Typography>
          </Breadcrumbs>
        </Box>
        <Box>
          <CustomTable
            size="small"
            title="Accounts"
            loading={!data}
            data={data}
            addAction={handleNewForm}
            header={[
              { title: 'Username', align: 'left', field: 'username' },
              {
                title: 'Name',
                align: 'left',
                field: 'name',
                render: (rowData) =>
                  `${rowData.firstName} ${rowData.middleName} ${rowData.lastName}`,
              },
              {
                title: 'Branch',
                align: 'left',
                field: 'branch.branchName',
                render: (rowData) => `${rowData.branch.branchName}`,
              },
              {
                title: 'Role',
                align: 'center',
                field: 'role',
                render: (rowData) =>
                  rowData.role === 'admin' ? (
                    <Chip
                      size="small"
                      label="admin"
                      color="secondary"
                      variant="outlined"
                    />
                  ) : rowData.role === 'programHead' ? (
                    <Chip
                      size="small"
                      color="success"
                      variant="outlined"
                      label="program head"
                    />
                  ) : rowData.role === 'branchHead' ? (
                    <Chip
                      color="info"
                      size="small"
                      variant="outlined"
                      label="branch head"
                    />
                  ) : (
                    <Chip
                      size="small"
                      label="social worker"
                      color="primary"
                      variant="outlined"
                    />
                  ),
              },
              {
                title: 'Status',
                align: 'center',
                field: 'isActive',
                render: (rowData) =>
                  rowData.isActive ? (
                    <Chip size="small" label="active" color="success" />
                  ) : (
                    <Chip size="small" color="error" label="deactivated" />
                  ),
              },
            ]}
            actions={[
              {
                icon: <Edit color="primary" />,
                tooltip: 'Edit Account',
                onClick: (rowData) => handleClickEdit(rowData.id),
              },
              {
                icon: <Delete color="error" />,
                tooltip: 'Delete Account',
                onClick: (rowData) => handleDelete(rowData.id),
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
            id={deleteId}
            open={openDeleteDialog}
            handleDialog={handleDeleteDialog}
          />
        </Box>
      </AdminLayout>
    </>
  )
}

const NewDialog = ({ open, handleDialog }: DialogProps) => {
  const { data: roleApi } = useSWR('/api/option/roles', {
    refreshInterval: 0,
  })
  const { data: branchApi } = useSWR('/api/option/branch', {
    refreshInterval: 0,
  })
  const [fetchLoading, setFetchLoading] = useState(false)
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: AccountDefaultValues,
    resolver: yupResolver(AccountFormYup),
  })

  const onSubmit: SubmitHandler<AccountForm> = async (values) => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.post(`/api/account`, values)
      const data = await res.data
      setFetchLoading(false)
      mutate('/api/accounts')
      Snackbar.success(data.message)
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
      <Dialog fullWidth maxWidth="xs" open={open} onClose={handleCloseDialog}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            New Account
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
            <Box css={styles.boxMessage}>
              <Typography variant="body2">
                Default Password : LastName + 123&nbsp;
              </Typography>
              <Typography variant="body2" fontStyle="italic">
                (ex. DelaCruz123)
              </Typography>
            </Box>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  autoFocus
                  label="Username"
                  margin="dense"
                  id="username"
                  variant="outlined"
                  error={Boolean(errors.username)}
                  helperText={errors.username?.message}
                />
              )}
            />
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="First Name"
                  margin="dense"
                  id="firstName"
                  variant="outlined"
                  error={Boolean(errors.firstName)}
                  helperText={errors.firstName?.message}
                />
              )}
            />
            <Controller
              name="middleName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Middle Name"
                  margin="dense"
                  id="middleName"
                  variant="outlined"
                  error={Boolean(errors.middleName)}
                  helperText={errors.middleName?.message}
                />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Last Name"
                  margin="dense"
                  id="lastName"
                  variant="outlined"
                  error={Boolean(errors.lastName)}
                  helperText={errors.lastName?.message}
                />
              )}
            />
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  id="role"
                  fullWidth
                  label="Role"
                  margin="dense"
                  variant="outlined"
                  error={Boolean(errors.role)}
                  helperText={errors.role?.message}
                >
                  <MenuItem value="">
                    <em>----------</em>
                  </MenuItem>
                  {roleApi?.map((item: any) => (
                    <MenuItem key={item.id} value={item.value}>
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="branchId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  id="branchId"
                  fullWidth
                  label="Branch"
                  margin="dense"
                  variant="outlined"
                  error={Boolean(errors.branchId)}
                  helperText={errors.branchId?.message}
                >
                  <MenuItem value="">
                    <em>----------</em>
                  </MenuItem>
                  {branchApi?.map((item: any) => (
                    <MenuItem key={item.id} value={item.id}>
                      {`${item.branchName} - ${item.address}, ${item.barangay.brgy_name}, ${item.city.city_name} ${item.province.province_name}`}
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
              Create Account
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

const EditDialog = ({ open, handleDialog, id }: EditDialogProps) => {
  const { data: branchApi } = useSWR('/api/option/branch', {
    refreshInterval: 0,
  })
  const { data: roleApi } = useSWR('/api/option/roles', {
    refreshInterval: 0,
  })
  const { data } = useSWR(open ? `/api/account/${id}` : null, {
    refreshInterval: 0,
  })
  const [fetchLoading, setFetchLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: AccountUpdateDefaultValues,
    resolver: yupResolver(AccountUpdateFormYup),
  })

  useEffect(() => {
    if (data) {
      setValue('firstName', data.firstName)
      setValue('middleName', data.middleName)
      setValue('lastName', data.lastName)
      setValue('role', data.role)
      setValue('branchId', data.branchId)
      setValue('isActive', data.isActive.toString())
    }
  }, [data, setValue])

  const handleCloseDialog = () => {
    reset()
    handleDialog()
  }

  const onSubmit: SubmitHandler<AccountUpdateForm> = async (values) => {
    let isActive = values.isActive === 'true' ? true : false
    const newFormData = { ...values, isActive }
    try {
      setFetchLoading(true)
      setFetchLoading(true)
      const res = await ApiAuth.put(`/api/account/${id}`, newFormData)
      const data = await res.data
      mutate('/api/accounts')
      setFetchLoading(false)
      Snackbar.success(data.message)
      handleCloseDialog()
    } catch (err) {
      setFetchLoading(false)
      if (err.response?.data) Snackbar.error(err.response.data.message)
    }
  }

  return (
    <>
      <Dialog fullWidth maxWidth="xs" open={open} onClose={handleCloseDialog}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            Edit Account
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
                <Box display="flex" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2">
                    Username: &nbsp; &nbsp;
                  </Typography>
                  <Typography
                    color="primary"
                    variant="subtitle2"
                    fontWeight={700}
                  >
                    {data?.username ? data.username : ''}
                  </Typography>
                </Box>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      autoFocus
                      label="First Name"
                      margin="dense"
                      id="firstName"
                      variant="outlined"
                      error={Boolean(errors.firstName)}
                      helperText={errors.firstName?.message}
                    />
                  )}
                />
                <Controller
                  name="middleName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      autoFocus
                      label="Middle Name"
                      margin="dense"
                      id="middleName"
                      variant="outlined"
                      error={Boolean(errors.middleName)}
                      helperText={errors.middleName?.message}
                    />
                  )}
                />
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      autoFocus
                      label="Last Name"
                      margin="dense"
                      id="lastName"
                      variant="outlined"
                      error={Boolean(errors.lastName)}
                      helperText={errors.lastName?.message}
                    />
                  )}
                />
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      id="role"
                      fullWidth
                      label="Role"
                      margin="dense"
                      variant="outlined"
                      error={Boolean(errors.role)}
                      helperText={errors.role?.message}
                    >
                      <MenuItem value="">
                        <em>----------</em>
                      </MenuItem>
                      {roleApi?.map((item: any) => (
                        <MenuItem key={item.id} value={item.value}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
                <Controller
                  name="branchId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      id="branchId"
                      fullWidth
                      label="Branch"
                      margin="dense"
                      variant="outlined"
                      error={Boolean(errors.branchId)}
                      helperText={errors.branchId?.message}
                    >
                      <MenuItem value="">
                        <em>----------</em>
                      </MenuItem>
                      {branchApi?.map((item: any) => (
                        <MenuItem key={item.id} value={item.id}>
                          {`${item.branchName} - ${item.address}, ${item.barangay.brgy_name}, ${item.city.city_name} ${item.province.province_name}`}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth variant="outlined" margin="dense">
                      <InputLabel>Password</InputLabel>
                      <OutlinedInput
                        {...field}
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleShowPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      <FormHelperText error={Boolean(errors.password)}>
                        {errors.password?.message}
                      </FormHelperText>
                    </FormControl>
                  )}
                />
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth variant="outlined" margin="dense">
                      <InputLabel>Confirm Password</InputLabel>
                      <OutlinedInput
                        {...field}
                        label="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleShowConfirmPassword}
                              edge="end"
                            >
                              {showConfirmPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      <FormHelperText error={Boolean(errors.confirmPassword)}>
                        {errors.confirmPassword?.message}
                      </FormHelperText>
                    </FormControl>
                  )}
                />
                <FormControl component="fieldset" margin="dense">
                  <FormLabel component="legend">Status</FormLabel>
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup row {...field} id="isActive">
                        <FormControlLabel
                          value={true}
                          control={<Radio />}
                          label="Active"
                        />
                        <FormControlLabel
                          value={false}
                          control={<Radio />}
                          label="Deactivate"
                        />
                      </RadioGroup>
                    )}
                  />
                </FormControl>
              </DialogContent>
              <DialogActions>
                <LoadingButton
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={fetchLoading}
                >
                  Update Account
                </LoadingButton>
              </DialogActions>
            </>
          )}
        </form>
      </Dialog>
    </>
  )
}

const DeleteDialog = (props: EditDialogProps) => {
  const [fetchLoading, setFetchLoading] = useState(false)
  const handleCloseDialog = () => {
    props.handleDialog()
  }

  const onSubmit = async () => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.delete(`/api/account/${props.id}`)
      const data = await res.data
      mutate(`/api/accounts`)
      Snackbar.success(data.message)
      setFetchLoading(false)
      handleCloseDialog()
    } catch (err) {
      setFetchLoading(false)
      if (err.response?.data) Snackbar.error(err.response?.data?.message)
    }
  }

  return (
    <Dialog open={props.open}>
      <DialogTitle>Delete Account</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this account?
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
          color="success"
          onClick={onSubmit}
          loading={fetchLoading}
        >
          Yes
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

interface DialogProps {
  open: boolean
  handleDialog: () => void
}

interface EditDialogProps extends DialogProps {
  id: string | number
}

const styles = {
  box: css`
    margin-bottom: 2em;
  `,
  breadcrumbs: css`
    margin-bottom: 1em;
  `,
  link: css`
    text-decoration: none;
  `,
  linkText: css`
    font-family: inherit;
    &:hover {
      cursor: pointer;
      text-decoration: underline;
      text-decoration-color: #000;
    }
  `,
  linkActive: css`
    font-family: inherit;
    color: #0f3b68;
  `,
  desktopBtn: { display: { xs: 'none', md: 'inherit' } },
  mobileBtn: { display: { md: 'none' } },
  iconBtn: css`
    border: none;
  `,
  dialogContentLoading: css`
    display: flex;
    justify-content: center;
    margin: 3em 6em;
    height: 3em;
  `,
  boxMessage: css`
    display: inline-flex;
  `,
}

export default Admin
