/** @jsxImportSource @emotion/react */
import { PhoneNumberFormat, Upload } from '@components'
import { css } from '@emotion/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { AdminLayout } from '@layouts'
import { ApiAuth, Snackbar } from '@lib'
import { PersonAdd, PersonRemove } from '@mui/icons-material'
import { LoadingButton, MobileDatePicker } from '@mui/lab'
import DateAdapter from '@mui/lab/AdapterDayjs'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import {
  Autocomplete,
  Breadcrumbs,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import {
  AdminCaseDefaultValues,
  AdminCaseForm,
  AdminCaseFormYup,
} from '@validation'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ChangeEvent, useState } from 'react'
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form'
import useSWR from 'swr'

const NewCase = () => {
  const { data: option } = useSWR('/api/option/admin/case', {
    refreshInterval: 0,
  })
  const { data: provinceApi } = useSWR('/api/option/province', {
    refreshInterval: 0,
  })

  const router = useRouter()
  const {
    reset,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: AdminCaseDefaultValues,
    resolver: yupResolver(AdminCaseFormYup),
  })

  const { fields, append, remove } = useFieldArray({
    name: 'Background.Family',
    control,
  })

  const watchFieldArray = watch('Background.Family')
  const arrayFields = fields.map((field, i) => {
    return {
      ...field,
      ...watchFieldArray[i],
    }
  })

  const [cityOption, setCityOption] = useState(null)
  const [brgyOption, setBrgyOption] = useState(null)
  const handleChangeProvince = async (option: any) => {
    if (option) {
      setValue('Background.province_code', option?.province_code)
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
      setValue('Background.city_code', option?.city_code)
      try {
        const res = await ApiAuth.get(`/api/city/${option.city_code}/barangay`)
        const data = await res.data
        setBrgyOption(data.Barangay)
      } catch (err) {
        if (err.response?.data) Snackbar.error(err.response.data.message)
        setBrgyOption(null)
      }
    } else {
      setBrgyOption(null)
    }
  }

  const [fetchLoading, setFetchLoading] = useState(false)
  const [files, setFiles] = useState<any | null>([])

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const handleConfirmDialog = () => {
    setOpenConfirmDialog(!openConfirmDialog)
  }
  const onClickConfirm = () => {
    window.scrollTo(0, 0)
    handleConfirmDialog()
  }
  const onClickSubmitCase = () => {
    handleSubmit(onSubmit)()
  }

  const onSubmit: SubmitHandler<AdminCaseForm> = async (values) => {
    const fd = new FormData()
    if (files.length <= 0) return Snackbar.error('Letter is required')
    files.forEach((file: any) => fd.append('files', file))
    fd.append('data', JSON.stringify(values))
    try {
      setFetchLoading(true)
      const res = await ApiAuth.post(`/api/admin/case/`, fd)
      const data = await res.data
      Snackbar.success(data.message)
      reset()
      setCityOption(null)
      setBrgyOption(null)
      setFiles(null)
      setFetchLoading(false)
      handleConfirmDialog()
      router.replace('/admin')
    } catch (err) {
      setFetchLoading(false)
      handleConfirmDialog()
      if (err.response?.data) Snackbar.error(err.response.data.message)
    }
  }

  const [description, setDescription] = useState('')

  return (
    <>
      <Head>
        <title>Case - Kamanggagawa Foundation Inc</title>
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
              New Case
            </Typography>
          </Breadcrumbs>
        </Box>
        <Grid justifyContent="center" display="flex">
          <Grid item xs={12} sm={10}>
            <Paper variant="outlined" sx={styles.paper}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Typography variant="h6" css={styles.title}>
                  Create Case
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Controller
                      name="userId"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          required
                          fullWidth
                          label="Social Worker"
                          error={Boolean(errors.userId)}
                          helperText={errors.userId?.message}
                        >
                          <MenuItem value="">
                            <em>----------</em>
                          </MenuItem>
                          {option?.socialworker.map((item: any) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item?.lastName}, &nbsp;&nbsp;
                              {item?.firstName}&nbsp;&nbsp;
                              {item?.middleName}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
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
                          error={Boolean(errors.userId)}
                          helperText={errors.userId?.message}
                        >
                          <MenuItem value="">
                            <em>----------</em>
                          </MenuItem>
                          {option?.caseStatus.map((item: any) => (
                            <MenuItem key={item.value} value={item.value}>
                              {item.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      control={control}
                      name="startDate"
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={DateAdapter}>
                          <MobileDatePicker
                            {...field}
                            clearable
                            label="Start Date"
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                label="Start Date"
                                error={Boolean(errors.startDate)}
                                helperText={errors.startDate?.message}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      control={control}
                      name="endDate"
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={DateAdapter}>
                          <MobileDatePicker
                            {...field}
                            clearable
                            label="End Date"
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                label="End Date"
                                error={Boolean(errors.endDate)}
                                helperText={errors.endDate?.message}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                  </Grid>
                </Grid>
                <Divider css={styles.divider} variant="middle">
                  Background Information
                </Divider>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="Background.firstName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          fullWidth
                          label="First Name"
                          id="Background.firstName"
                          error={Boolean(errors.Background?.firstName)}
                          helperText={errors.Background?.firstName?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="Background.middleName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Middle Name"
                          id="Background.middleName"
                          error={Boolean(errors.Background?.middleName)}
                          helperText={errors.Background?.middleName?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="Background.lastName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          fullWidth
                          label="Last Name"
                          error={Boolean(errors.Background?.lastName)}
                          helperText={errors.Background?.lastName?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="Background.nickname"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <TextField
                          fullWidth
                          onChange={onChange}
                          value={value}
                          label="Nick Name"
                          error={Boolean(errors.Background?.nickname)}
                          helperText={errors.Background?.nickname?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="Background.age"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          fullWidth
                          label="Age"
                          type="number"
                          error={Boolean(errors.Background?.age)}
                          helperText={errors.Background?.age?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      control={control}
                      name="Background.birthDate"
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={DateAdapter}>
                          <MobileDatePicker
                            {...field}
                            label="Date of Birth"
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                required
                                fullWidth
                                label="Birth Date"
                                error={Boolean(errors.Background?.birthDate)}
                                helperText={
                                  errors.Background?.birthDate?.message
                                }
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="Background.sex"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          required
                          fullWidth
                          label="Sex"
                          error={Boolean(errors.Background?.sex)}
                          helperText={errors.Background?.sex?.message}
                        >
                          <MenuItem value="">
                            <em>----------</em>
                          </MenuItem>
                          {option?.sex?.map((item: any) => (
                            <MenuItem key={item.value} value={item.value}>
                              {item.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="Background.civilStatus"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          required
                          fullWidth
                          label="Civil Status"
                          error={Boolean(errors.Background?.civilStatus)}
                          helperText={errors.Background?.civilStatus?.message}
                        >
                          <MenuItem value="">
                            <em>----------</em>
                          </MenuItem>
                          {option?.civilStatus?.map((item: any) => (
                            <MenuItem key={item.value} value={item.value}>
                              {item.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Contact Number</InputLabel>
                      <Controller
                        control={control}
                        name="Background.phone"
                        render={({ field }) => (
                          <OutlinedInput
                            {...field}
                            id="Background.phone"
                            name="Background.phone"
                            label="Contact Number"
                            inputComponent={PhoneNumberFormat as any}
                          />
                        )}
                      />
                      <FormHelperText error={Boolean(errors.Background?.phone)}>
                        {errors.Background?.phone?.message}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      control={control}
                      name="Background.religionId"
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Religion"
                          error={Boolean(errors.Background?.religionId)}
                          helperText={errors.Background?.religionId?.message}
                        >
                          <MenuItem value="">
                            <em>----------</em>
                          </MenuItem>
                          {option?.religion?.map((item: any) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.religionName}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      control={control}
                      name="Background.educationId"
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Education"
                          error={Boolean(errors.Background?.educationId)}
                          helperText={errors.Background?.educationId?.message}
                        >
                          <MenuItem value="">
                            <em>----------</em>
                          </MenuItem>
                          {option?.education?.map((item: any) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.educationName}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      control={control}
                      name="Background.occupationId"
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Occupation"
                          error={Boolean(errors.Background?.occupationId)}
                          helperText={errors.Background?.occupationId?.message}
                        >
                          <MenuItem value="">
                            <em>----------</em>
                          </MenuItem>
                          {option?.occupation?.map((item: any) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.occupationName}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      control={control}
                      name="Background.incomeId"
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Monthly Income"
                          error={Boolean(errors.Background?.incomeId)}
                          helperText={errors.Background?.incomeId?.message}
                        >
                          <MenuItem value="">
                            <em>----------</em>
                          </MenuItem>
                          {option?.income?.map((item: any) => (
                            <MenuItem key={item.id} value={item.id}>
                              ₱{item.from.toLocaleString()}&nbsp;-&nbsp;
                              {item.to.toLocaleString()}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      control={control}
                      name="Background.address"
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Unit no/ Building flr/ Apartment/ Blk, Lot/ House number"
                          error={Boolean(errors.Background?.address)}
                          helperText={errors.Background?.address?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      control={control}
                      name="Background.street"
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Street"
                          error={Boolean(errors.Background?.street)}
                          helperText={errors.Background?.street?.message}
                        />
                      )}
                    />
                  </Grid>
                  {provinceApi && (
                    <Grid item xs={12} sm={4}>
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
                            fullWidth
                            required
                            label="Province"
                            margin="dense"
                            variant="outlined"
                            autoComplete="new-password"
                            error={Boolean(errors?.Background?.province_code)}
                            helperText={
                              errors?.Background?.province_code?.message
                            }
                          />
                        )}
                      />
                    </Grid>
                  )}
                  {cityOption && (
                    <Grid item xs={12} sm={4}>
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
                            fullWidth
                            required
                            label="City"
                            margin="dense"
                            variant="outlined"
                            autoComplete="new-password"
                            error={Boolean(errors?.Background?.city_code)}
                            helperText={errors?.Background?.city_code?.message}
                          />
                        )}
                      />
                    </Grid>
                  )}
                  {brgyOption && (
                    <Grid item xs={12} sm={4}>
                      <Autocomplete
                        autoHighlight
                        options={brgyOption}
                        getOptionLabel={(option: any) => option.brgy_name}
                        onChange={(_, option) =>
                          option &&
                          setValue('Background.brgy_code', option.brgy_code)
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
                            margin="dense"
                            variant="outlined"
                            autoComplete="new-password"
                            error={Boolean(errors.Background?.brgy_code)}
                            helperText={errors.Background?.brgy_code?.message}
                          />
                        )}
                      />
                    </Grid>
                  )}
                </Grid>
                <Divider css={styles.divider} variant="middle">
                  Family Composition
                </Divider>
                <Box display="flex" justifyContent="flex-end">
                  <Tooltip title="add">
                    <IconButton
                      onClick={() => {
                        append({
                          firstName: '',
                          middleName: '',
                          lastName: '',
                          age: '',
                          educationId: '',
                          occupationId: '',
                          incomeId: '',
                        })
                      }}
                    >
                      <PersonAdd />
                    </IconButton>
                  </Tooltip>
                </Box>
                {arrayFields.map((field, i) => {
                  const errFirstName = errors.Background?.Family?.[i].firstName
                  const errMiddleName =
                    errors.Background?.Family?.[i].middleName
                  const errLastName = errors.Background?.Family?.[i].lastName
                  const errAge = errors.Background?.Family?.[i].age
                  const errEducation =
                    errors.Background?.Family?.[i].educationId
                  const errOccupation =
                    errors.Background?.Family?.[i].occupationId
                  const errIncome = errors.Background?.Family?.[i].incomeId
                  return (
                    <Grid container spacing={2} key={field.id}>
                      <Grid item xs={12} sm={4}>
                        <Controller
                          name={`Background.Family.${i}.firstName`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              required
                              label="First Name"
                              error={Boolean(errFirstName)}
                              helperText={errFirstName?.message}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Controller
                          name={`Background.Family.${i}.middleName`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Middle Name"
                              error={Boolean(errMiddleName)}
                              helperText={errMiddleName?.message}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Controller
                          name={`Background.Family.${i}.lastName`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              required
                              fullWidth
                              label="Last Name"
                              error={Boolean(errLastName)}
                              helperText={errLastName?.message}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Controller
                          name={`Background.Family.${i}.age`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              required
                              fullWidth
                              label="Age"
                              error={Boolean(errAge)}
                              helperText={errAge?.message}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Controller
                          name={`Background.Family.${i}.educationId`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              select
                              fullWidth
                              label="Education"
                              error={Boolean(errEducation)}
                              helperText={errEducation?.message}
                            >
                              <MenuItem value="">
                                <em>----------</em>
                              </MenuItem>
                              {option?.education?.map((item: any) => (
                                <MenuItem key={item.id} value={item.id}>
                                  {item.educationName}
                                </MenuItem>
                              ))}
                            </TextField>
                          )}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Controller
                          name={`Background.Family.${i}.occupationId`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              select
                              fullWidth
                              label="Occupation"
                              error={Boolean(errOccupation)}
                              helperText={errOccupation?.message}
                            >
                              <MenuItem value="">
                                <em>----------</em>
                              </MenuItem>
                              {option?.occupation?.map((item: any) => (
                                <MenuItem key={item.id} value={item.id}>
                                  {item.occupationName}
                                </MenuItem>
                              ))}
                            </TextField>
                          )}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Controller
                          name={`Background.Family.${i}.incomeId`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              select
                              fullWidth
                              label="Monthly Income"
                              error={Boolean(errIncome)}
                              helperText={errIncome?.message}
                            >
                              <MenuItem value="">
                                <em>----------</em>
                              </MenuItem>
                              {option?.income?.map((item: any) => (
                                <MenuItem key={item.id} value={item.id}>
                                  ₱{item.from.toLocaleString()}&nbsp;-&nbsp;
                                  {item.to.toLocaleString()}
                                </MenuItem>
                              ))}
                            </TextField>
                          )}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Box display="flex" justifyContent="flex-end">
                          <Tooltip title="remove">
                            <IconButton onClick={() => remove(i)}>
                              <PersonRemove />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Grid>
                    </Grid>
                  )
                })}
                <Divider css={styles.divider} variant="middle">
                  Munting Pangarap
                </Divider>
                <Grid item xs={12}>
                  {description && (
                    <FormHelperText>
                      Description:&nbsp; {description}
                    </FormHelperText>
                  )}
                  <Autocomplete
                    autoHighlight
                    options={option?.request ? option?.request : []}
                    getOptionLabel={(option: any) => option.requestName}
                    onChange={(_, option) => {
                      if (option) {
                        setValue('requestId', option.id)
                        setDescription(option.description)
                      } else {
                        setValue('requestId', ''), setDescription('')
                      }
                    }}
                    renderOption={(props, option) => (
                      <Box component="li" {...props} key={option.id}>
                        {option.requestName}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        required
                        label="Type of Request"
                        margin="dense"
                        variant="outlined"
                        autoComplete="new-password"
                        error={Boolean(errors.requestId)}
                        helperText={errors.requestId?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="requestSummary"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        required
                        multiline
                        minRows={5}
                        maxRows={10}
                        margin="normal"
                        variant="outlined"
                        label="Request Summary"
                      />
                    )}
                  />
                </Grid>
                <Divider css={styles.divider} variant="middle">
                  Letter
                </Divider>
                <Box>
                  <Upload
                    filetypes="image/* "
                    files={files}
                    setFiles={setFiles}
                  />
                </Box>
                <Grid item xs={12}>
                  <Controller
                    name="note"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        minRows={5}
                        maxRows={10}
                        margin="normal"
                        variant="outlined"
                        label="Program Head Remark"
                      />
                    )}
                  />
                </Grid>
                <Box css={styles.boxBtn}>
                  <LoadingButton
                    color="success"
                    variant="contained"
                    css={styles.loadingBtn}
                    loading={fetchLoading}
                    onClick={onClickConfirm}
                  >
                    Save
                  </LoadingButton>
                </Box>
              </form>
            </Paper>
          </Grid>
        </Grid>
        <ConfirmationDialog
          open={openConfirmDialog}
          fetchLoading={fetchLoading}
          handleDialog={handleConfirmDialog}
          handleRequest={onClickSubmitCase}
        />
      </AdminLayout>
    </>
  )
}

interface ConfirmationSubmitProps {
  open: boolean
  fetchLoading: boolean
  handleRequest: () => void
  handleDialog: () => void
}

const ConfirmationDialog = (props: ConfirmationSubmitProps) => {
  return (
    <Dialog maxWidth="sm" open={props.open}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to save this case?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="inherit"
          onClick={props.handleDialog}
          disabled={props.fetchLoading}
        >
          Cancel
        </Button>
        <LoadingButton
          size="large"
          color="success"
          loading={props.fetchLoading}
          onClick={props.handleRequest}
        >
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

const styles = {
  paper: { p: { xs: 1.5, sm: 3, md: 4 }, mt: 3 },
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
  divider: css`
    margin-top: 1.5em;
    margin-bottom: 1.5em;
    font-weight: 700;
  `,

  loadingBtn: css`
    margin-top: 1em;
    margin-bottom: 1em;
    margin-left: 1em;
  `,
  title: css`
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    margin-bottom: 1em;
  `,
  boxBtn: css`
    display: flex;
    justify-content: flex-end;
  `,
}

export default NewCase
