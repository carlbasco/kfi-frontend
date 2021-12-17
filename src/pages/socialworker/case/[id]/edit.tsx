/** @jsxImportSource @emotion/react */
import { Loading, PhoneNumberFormat, Upload } from '@components'
import { css } from '@emotion/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { SocialWorkerLayout } from '@layouts'
import { ApiAuth, Snackbar } from '@lib'
import { Close, PersonAdd, PersonRemove } from '@mui/icons-material'
import { LoadingButton, MobileDatePicker } from '@mui/lab'
import DateAdapter from '@mui/lab/AdapterDayjs'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import {
  Autocomplete,
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
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import {
  CaseFormUpdateYup,
  CaseUpdateDefaultValues,
  CaseUpdateForm
} from '@validation'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm
} from 'react-hook-form'
import useSWR, { mutate } from 'swr'

const urlAPI = process.env.NEXT_PUBLIC_API_URL!

const EditCase = () => {
  const { data: provinceApi } = useSWR('/api/option/province', {
    refreshInterval: 0,
  })
  const { data: option } = useSWR('/api/option/case', { refreshInterval: 0 })

  const router = useRouter()
  const id = router.query.id
  const { data, error } = useSWR(id ? `/api/sw/case/${id}/edit` : null)

  const [openImgViewer, setOpenImgViewer] = useState(false)
  const handleImageViewer = () => {
    setOpenImgViewer(!openImgViewer)
  }
  const [img, setImg] = useState('')
  const onClickImg = (url: string) => {
    setImg(url)
    handleImageViewer()
  }

  const {
    reset,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: CaseUpdateDefaultValues,
    resolver: yupResolver(CaseFormUpdateYup),
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
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [deleteLetterId, setDeleteLetterId] = useState<string | number>('')
  const handleDeleteLetter = () => {
    setOpenDeleteDialog(!openDeleteDialog)
  }
  const onClickDeleteLetter = (id: string | number) => {
    setDeleteLetterId(id)
    handleDeleteLetter()
  }

  const [fetchLoading, setFetchLoading] = useState(false)
  const [files, setFiles] = useState<any | null>([])

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [onSubmitState, setOnSubmitState] = useState<'save' | 'submit'>('save')
  const handleConfirmDialog = () => {
    setOpenConfirmDialog(!openConfirmDialog)
  }
  const onClickConfirm = (state: 'save' | 'submit') => {
    window.scrollTo(0, 0)
    setOnSubmitState(state)
    handleConfirmDialog()
  }
  const onClickSubmitCase = () => {
    if (onSubmitState === 'save') {
      setValue('caseStatus', 'incomplete')
      handleSubmit(onSubmit)()
    } else {
      setValue('caseStatus', 'pending')
      handleSubmit(onSubmit)()
    }
  }

  const onSubmit: SubmitHandler<CaseUpdateForm> = async (values) => {
    const fd = new FormData()
    files.forEach((file: any) => fd.append('files', file))
    fd.append('data', JSON.stringify(values))
    try {
      setFetchLoading(true)
      const res = await ApiAuth.put(`/api/case/${id}`, fd)
      const data = await res.data
      Snackbar.success(data.message)
      reset()
      setCityOption(null)
      setBrgyOption(null)
      setFiles(null)
      setFetchLoading(false)
      handleConfirmDialog()
      router.replace(`/socialworker/case/${id}`)
    } catch (err) {
      handleConfirmDialog()
      setFetchLoading(false)
      if (err.response?.data) Snackbar.error(err.response.data.message)
    }
  }

  useEffect(() => {
    if (data && option) {
      setValue('Background.firstName', data.Background?.firstName)
      setValue(
        'Background.middleName',
        data.Background?.middleName ? data.Background?.middleName : ''
      )
      setValue('Background.lastName', data.Background?.lastName)
      setValue(
        'Background.nickname',
        data.Background?.nickname ? data.Background?.nickname : ''
      )
      setValue('Background.age', data.Background?.age)
      setValue(
        'Background.sex',
        data.Background?.sex ? data.Background?.sex : ''
      )
      setValue(
        'Background.civilStatus',
        data.Background?.civilStatus ? data.Background?.civilStatus : ''
      )
      setValue('Background.birthDate', data.Background?.birthDate)
      setValue(
        'Background.phone',
        data.Background?.phone ? data.Background?.phone : ''
      )
      setValue(
        'Background.address',
        data.Background?.address ? data.Background?.address : ''
      )
      setValue(
        'Background.street',
        data.Background?.street ? data.Background?.street : ''
      )
      setValue(
        'Background.religionId',
        data.Background?.religionId ? data.Background?.religionId : ''
      )
      setValue(
        'Background.educationId',
        data.Background?.educationId ? data.Background?.educationId : ''
      )
      setValue(
        'Background.occupationId',
        data.Background?.occupationId ? data.Background?.occupationId : ''
      )
      setValue('requestId', data?.requestId)
      setValue(
        'requestSummary',
        data?.requestSummary ? data?.requestSummary : ''
      )
      if (data.Background.Family && data.Background?.Family.length > 0) {
        const temp: any[] = []
        data.Background.Family.forEach((item: any) => {
          const educationId = item.educationId ? item.educationId : ''
          const occupationId = item.occupationId ? item.occupationId : ''
          const incomeId = item.incomeId ? item.incomeId : ''
          temp.push({ ...item, educationId, occupationId, incomeId })
        })
        setValue('Background.Family', temp)
      }
    }
  }, [data, setValue, option])

  return (
    <>
      <Head>
        <title>Case - Kamanggagawa Foundation Inc</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <SocialWorkerLayout>
        <Grid justifyContent="center" display="flex">
          <Grid item xs={12} sm={10}>
            <Paper variant="outlined" sx={styles.paper}>
              {!data && !option && <Loading open={true} />}
              {data && option && (
                <form>
                  <Typography variant="h6" css={styles.title}>
                    Edit Case {id}
                  </Typography>
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
                        <FormHelperText
                          error={Boolean(errors.Background?.phone)}
                        >
                          {errors.Background?.phone}
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
                            helperText={
                              errors.Background?.occupationId?.message
                            }
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
                            label="Income"
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
                    <Grid item xs={12}>
                      <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1">
                          Current Barangay, City, Province:&nbsp;&nbsp;&nbsp;
                        </Typography>
                        <Typography variant="body1" color="secondary">
                          {data?.Background?.barangay?.brgy_name}, &nbsp;
                          {data?.Background?.city?.city_name},&nbsp;
                          {data?.Background?.province?.province_name}
                        </Typography>
                      </Box>
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
                            <Box
                              component="li"
                              {...props}
                              key={option.city_code}
                            >
                              {option.city_name}
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
                              error={Boolean(errors?.Background?.city_code)}
                              helperText={
                                errors?.Background?.city_code?.message
                              }
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
                            <Box
                              component="li"
                              {...props}
                              key={option.brgy_code}
                            >
                              {option.brgy_name}
                            </Box>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
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
                    <Grid item xs={12}>
                      <FormHelperText>
                        To update Province, City, Barangay, please complete
                        those fields or it will not update at all.
                      </FormHelperText>
                    </Grid>
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
                    const errFirstName =
                      errors.Background?.Family?.[i].firstName
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
                                label="Monthly Income
                              "
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
                    <Controller
                      name="requestId"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          disabled
                          required
                          fullWidth
                          margin="normal"
                          label="Type of Request"
                          error={Boolean(errors.requestId)}
                          helperText={errors.requestId?.message}
                        >
                          <MenuItem value="">
                            <em>----------</em>
                          </MenuItem>
                          {option?.request?.map((item: any) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.requestName}
                            </MenuItem>
                          ))}
                        </TextField>
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
                  {data?.CaseLetter && data.CaseLetter.length > 0 && (
                    <>
                      <div css={styles.boxDownload}>
                        {data?.CaseLetter.map((item: Files) => {
                          const url = urlAPI + item.filePath
                          return (
                            <div css={styles.divBtn} key={item.id}>
                              <IconButton
                                size="small"
                                css={styles.btnRemove}
                                onClick={() => onClickDeleteLetter(item.id)}
                              >
                                <Close />
                              </IconButton>
                              <div css={styles.img}>
                                <a onClick={() => onClickImg(url)}>
                                  <img
                                    width="150"
                                    height="100"
                                    alt="case-img"
                                    src={url}
                                  />
                                </a>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  )}
                  <DeleteDialog
                    open={openDeleteDialog}
                    id={deleteLetterId}
                    handleDialog={handleDeleteLetter}
                  />
                  <Box>
                    <Upload
                      filetypes="image/* "
                      files={files}
                      setFiles={setFiles}
                    />
                  </Box>
                  <Box css={styles.boxBtn}>
                    <LoadingButton
                      css={styles.loadingBtn}
                      variant="contained"
                      loading={fetchLoading}
                      color="success"
                      onClick={() => onClickConfirm('save')}
                    >
                      Save
                    </LoadingButton>
                    <LoadingButton
                      css={styles.loadingBtn}
                      variant="contained"
                      loading={fetchLoading}
                      onClick={() => onClickConfirm('submit')}
                    >
                      Submit
                    </LoadingButton>
                  </Box>
                </form>
              )}
              {error && !data && (
                <>
                  <Box display="flex" justifyContent="center">
                    <Typography variant="h6">Case not found</Typography>
                  </Box>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
        <ConfirmationDialog
          open={openConfirmDialog}
          method={onSubmitState}
          fetchLoading={fetchLoading}
          handleDialog={handleConfirmDialog}
          handleRequest={onClickSubmitCase}
        />
      </SocialWorkerLayout>
    </>
  )
}

interface DeleteDialogProps {
  open: boolean
  id: string | number
  handleDialog: () => void
}

const DeleteDialog = ({ id, open, handleDialog }: DeleteDialogProps) => {
  const router = useRouter()
  const caseId = router.query.id
  const [fetchLoading, setFetchLoading] = useState(false)
  const deleteRequest = async () => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.delete(`/api/case/letter/${id}`)
      const data = await res.data
      setFetchLoading(false)
      mutate(`/api/sw/case/${caseId}/edit`)
      Snackbar.success(data.message)
      handleDialog()
    } catch (err) {
      setFetchLoading(false)
      if (err.response?.data) Snackbar.error(err.response.data.message)
      handleDialog()
    }
  }

  return (
    <>
      <Dialog fullWidth maxWidth="xs" open={open}>
        <DialogTitle>Delete Letter</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this letter?
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

interface ConfirmationSubmitProps {
  open: boolean
  method: string
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
          Are you sure you want to {props.method} this case?
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
          color={props.method === 'save' ? 'success' : 'primary'}
          loading={props.fetchLoading}
          onClick={props.handleRequest}
        >
          {props.method}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

interface Files {
  filePath: string
  id: number
}

const styles = {
  paper: { p: { xs: 1.5, sm: 3, md: 4 }, mt: 3 },
  link: css`
    text-decoration: none;
  `,
  linkText: css`
    &:hover {
      cursor: pointer;
      font-weight: bolder;
    }
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
  `,
  boxBtn: css`
    display: flex;
    justify-content: flex-end;
  `,
  boxDownload: css`
    margin-top: 1em;
    margin-bottom: 1.5em;
    display: flex;
    flex-wrap: wrap;
    gap: 2em;
    justify-content: center;
    align-items: center;
  `,
  img: css`
    padding: 0.4em;
    padding-bottom: 0;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    cursor: pointer;
  `,
  divBtn: css`
    position: relative;
  `,
  btnRemove: css`
    position: absolute;
    z-index: 100;
    top: -10px;
    right: -10px;
    background-color: #e61d20;
    color: #fff;
    border-radius: 50%;
    border: 0;
    &:hover {
      background-color: #961e2e;
      border: 0;
    }
  `,
}

export default EditCase
