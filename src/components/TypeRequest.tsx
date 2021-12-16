/** @jsxImportSource @emotion/react */
import { CustomTable } from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { ApiAuth, Snackbar } from '@lib'
import { Close, Delete, Edit } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  IconButton,
  TextField,
} from '@mui/material'
import { Box } from '@mui/system'
import styles from '@styles/filemaintenance'
import {
  TypeRequestDefaultValue,
  TypeRequestForm,
  TypeRequestFormYup,
} from '@validation'
import { ChangeEvent, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import useSWR, { mutate } from 'swr'

const TypeRequest = () => {
  const { data } = useSWR('/api/request')
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
    requestName: string
  }
  const [deleteData, setDeleteData] = useState<DeleteDataProps>({
    id: '',
    requestName: '',
  })
  const [openDeleteForm, setOpenDeleteForm] = useState(false)
  const handleDeleteForm = () => {
    setOpenDeleteForm(!openDeleteForm)
  }
  const handleClickDelete = (id: string | number, requestName: string) => {
    setDeleteData({ id, requestName })
    handleDeleteForm()
  }

  return (
    <>
      <Box>
        <CustomTable
          size="small"
          title="Type of Request"
          loading={!data}
          data={data}
          addAction={handleNewForm}
          header={[
            {
              title: 'Title',
              field: 'requestName',
              align: 'left',
              minWidth: '120px',
            },
            {
              title: 'Requirements',
              field: '',
              align: 'left',
              render: (rowData) =>
                rowData.requirements.map(
                  (item: any) => `${item.requirementsName},  `
                ),
            },
            {
              title: 'Budget',
              field: '',
              align: 'center',
              render: (rowData) =>
                `₱ ${rowData.budgetFrom.toLocaleString()} - ${rowData.budgetTo.toLocaleString()}`,
            },
            {
              title: 'Date created',
              field: '',
              align: 'center',
              render: (rowData) => new Date(rowData.createdAt).toDateString(),
            },
          ]}
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
                handleClickDelete(rowData.id, rowData.requestName),
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
  const { data: requirementsApi } = useSWR('/api/option/requirements', {
    refreshInterval: 0,
  })

  const [fetchLoading, setFetchLoading] = useState(false)
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: TypeRequestDefaultValue,
    resolver: yupResolver(TypeRequestFormYup),
  })

  const handleCloseDialog = () => {
    reset()
    handleDialog()
  }

  const onSubmit: SubmitHandler<TypeRequestForm> = async (values) => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.post('/api/request', values)
      const data = await res.data
      setFetchLoading(false)
      mutate('/api/request')
      Snackbar.success(data.message)
      handleCloseDialog()
    } catch (err) {
      setFetchLoading(false)
      if (err.response?.data) Snackbar.error(err.response.data.message)
    }
  }

  return (
    <>
      <Dialog fullWidth maxWidth="sm" open={open}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            New Type of Request
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
              name="requestName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  autoFocus
                  label="Title"
                  margin="dense"
                  id="requestName"
                  variant="outlined"
                  error={Boolean(errors.requestName)}
                  helperText={errors.requestName?.message}
                />
              )}
            />
            <Divider css={styles.divider}>Budget Range</Divider>
            <Controller
              name="budgetFrom"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="budgetFrom"
                  label="From"
                  type="number"
                  margin="dense"
                  variant="outlined"
                  error={Boolean(errors.budgetFrom)}
                  helperText={errors.budgetFrom?.message}
                />
              )}
            />
            <Controller
              name="budgetTo"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="budgetTo"
                  label="To"
                  type="number"
                  margin="dense"
                  variant="outlined"
                  error={Boolean(errors.budgetTo)}
                  helperText={errors.budgetTo?.message}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  multiline
                  fullWidth
                  minRows={5}
                  maxRows={10}
                  margin="dense"
                  id="description"
                  variant="outlined"
                  label="Description"
                  error={Boolean(errors.description)}
                  helperText={errors.description}
                />
              )}
            />
            <Divider css={styles.divider}>File Requirements</Divider>
            <FormHelperText error={Boolean(errors.requirementsId)}>
              {errors.requirementsId?.message}
            </FormHelperText>
            <FormGroup row={true}>
              {requirementsApi?.map((item: any) => (
                <FormControlLabel
                  key={item.id}
                  label={item.requirementsName}
                  control={
                    <Controller
                      name="requirementsId"
                      control={control}
                      render={({ field: { onChange, value, ...props } }) => (
                        <Checkbox
                          {...props}
                          value={item.id}
                          id="requirementsId"
                          checked={value.indexOf(item.id.toString()) > -1}
                          onChange={(e) =>
                            handleChange(e, onChange, value, item.id)
                          }
                        />
                      )}
                    />
                  }
                />
              ))}
            </FormGroup>
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
  const { data } = useSWR(open ? `/api/request/${id}` : null, {
    refreshInterval: 0,
  })
  const { data: requirementsApi } = useSWR('/api/option/requirements', {
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
    defaultValues: TypeRequestDefaultValue,
    resolver: yupResolver(TypeRequestFormYup),
  })

  useEffect(() => {
    if (data) {
      setValue('requestName', data.requestName)
      setValue('budgetFrom', data.budgetFrom)
      setValue('budgetTo', data.budgetTo)
      setValue('description', data.description)
      setValue(
        'requirementsId',
        data.requirementsId.length > 0 ? data.requirementsId : ''
      )
    }
  }, [data, setValue])

  const handleCloseDialog = () => {
    reset()
    handleDialog()
  }

  const onSubmit: SubmitHandler<TypeRequestForm> = async (values) => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.put(`/api/request/${id}`, values)
      const data = await res.data
      setFetchLoading(false)
      mutate('/api/request')
      Snackbar.success(data.message)
      handleCloseDialog()
    } catch (err) {
      setFetchLoading(false)
      if (err.response?.data) Snackbar.error(err.response.data.message)
    }
  }

  return (
    <>
      <Dialog fullWidth maxWidth="sm" open={open}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            Update Type of Request
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
                  name="requestName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      autoFocus
                      label="Title"
                      margin="dense"
                      id="requestName"
                      variant="outlined"
                      error={Boolean(errors.requestName)}
                      helperText={errors.requestName?.message}
                    />
                  )}
                />
                <Divider css={styles.divider}>Budget Range</Divider>
                <Controller
                  name="budgetFrom"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      autoFocus
                      id="budgetFrom"
                      label="From"
                      type="number"
                      margin="dense"
                      variant="outlined"
                      error={Boolean(errors.budgetFrom)}
                      helperText={errors.budgetFrom?.message}
                    />
                  )}
                />
                <Controller
                  name="budgetTo"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      autoFocus
                      id="budgetTo"
                      label="To"
                      type="number"
                      margin="dense"
                      variant="outlined"
                      error={Boolean(errors.budgetTo)}
                      helperText={errors.budgetTo?.message}
                    />
                  )}
                />
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      multiline
                      fullWidth
                      minRows={5}
                      maxRows={10}
                      margin="dense"
                      id="description"
                      variant="outlined"
                      label="Description"
                      error={Boolean(errors.description)}
                      helperText={errors.description}
                    />
                  )}
                />
                <Divider css={styles.divider}>File Requirements</Divider>
                <FormHelperText error={Boolean(errors.requirementsId)}>
                  {errors.requirementsId?.message}
                </FormHelperText>
                <FormGroup row={true}>
                  {requirementsApi?.map((item: any) => (
                    <FormControlLabel
                      key={item.id}
                      label={item.requirementsName}
                      control={
                        <Controller
                          name="requirementsId"
                          control={control}
                          render={({
                            field: { onChange, value, ...props },
                          }) => (
                            <Checkbox
                              {...props}
                              value={item.id}
                              id="requirementsId"
                              checked={value.indexOf(item.id.toString()) > -1}
                              onChange={(e) =>
                                handleChange(e, onChange, value, item.id)
                              }
                            />
                          )}
                        />
                      }
                    />
                  ))}
                </FormGroup>
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
      const res = await ApiAuth.delete(`/api/request/${deleteData.id}`)
      const data = await res.data
      Snackbar.success(data.message)
      mutate('/api/request')
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
        <DialogTitle>Delete Type of Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete &nbsp;
            <strong>{deleteData.requestName}?</strong>
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
  deleteData: { id: string | number; requestName: string }
}

const handleChange = (
  e: ChangeEvent<HTMLInputElement>,
  onChange: (...event: any[]) => void,
  value: string | string[],
  option: any
) => {
  const values = value as unknown as Array<any>
  const setValue = e.target.value
  const toBeRemoved = values.indexOf(option.toString()) > -1
  const newValue = toBeRemoved
    ? values.filter((t) => t !== setValue)
    : [...values, setValue]
  onChange(newValue.length > 0 ? newValue : '')
}

export default TypeRequest
