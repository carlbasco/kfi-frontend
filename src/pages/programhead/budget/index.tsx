/** @jsxImportSource @emotion/react */
import { CustomTable } from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { ProgramHeadLayout } from '@layouts'
import { ApiAuth, Snackbar } from '@lib'
import { Close, Visibility } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Breadcrumbs,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import styles from '@styles/filemaintenance'
import { BudgetDefaultValues, BudgetForm, BudgetFormYup } from '@validation'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ChangeEvent, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import useSWR, { mutate } from 'swr'

const Budget = () => {
  const router = useRouter()
  const { data } = useSWR('/api/budget')

  const [openNewDialog, setOpenNewDialog] = useState(false)
  const handleNewDialog = () => {
    setOpenNewDialog(!openNewDialog)
  }

  return (
    <>
      <Head>
        <title>File Maintenance - Kamanggagawa Foundation Inc</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <ProgramHeadLayout>
        <Box css={styles.box}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link href="/programhead">
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
            <Typography css={styles.linkActive} variant="subtitle1">
              Budget
            </Typography>
          </Breadcrumbs>
        </Box>
        <Box>
          <CustomTable
            size="medium"
            title="Budget"
            loading={!data}
            data={data}
            header={[
              {
                title: 'Case ID',
                field: 'caseId',
                align: 'left',
                minWidth: '130px',
              },
              {
                title: 'Amount',
                field: 'amount',
                align: 'left',
                render: (rowData) => `₱ ${rowData.amount.toLocaleString()}`,
              },
              {
                title: 'Date created',
                field: 'createdAt',
                align: 'center',
                minWidth: '120px',
                render: (rowData) => new Date(rowData.createdAt).toDateString(),
              },
            ]}
            addAction={handleNewDialog}
            actions={[
              {
                icon: <Visibility color="secondary" />,
                tooltip: 'View',
                onClick: (rowData) =>
                  router.push(`/programhead/budget/${rowData.caseId}`),
              },
            ]}
          />
          <NewDialog open={openNewDialog} handleDialog={handleNewDialog} />
        </Box>
      </ProgramHeadLayout>
    </>
  )
}

const NewDialog = (props: DialogProps) => {
  const { data: caseBudgetApi } = useSWR<CaseBudgetApi[]>('/api/option/budget')
  const [fetchLoading, setFetchLoading] = useState(false)
  const [selectedValue, setSelectedValue] = useState({
    budgetRange: '',
    client: '',
    recommendation: '',
    request: '',
  })

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: BudgetDefaultValues,
    resolver: yupResolver(BudgetFormYup),
  })

  const handleCloseDialog = () => {
    setSelectedValue({
      client: ``,
      budgetRange: ``,
      recommendation: ``,
      request: ``,
    })
    reset()
    props.handleDialog()
  }

  const onSubmit: SubmitHandler<BudgetForm> = async (values) => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.post('/api/budget', values)
      const data = await res.data
      mutate('/api/budget')
      Snackbar.success(data.message)
      setFetchLoading(false)
      handleCloseDialog()
    } catch (err) {
      setFetchLoading(false)
      if (err.response?.data) Snackbar.error(err.response?.data?.message)
    }
  }

  const handleChangeBudget = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setValue('caseId', e.target.value)
    const temp = caseBudgetApi?.filter((item) => e.target.value === item.id)
    if (temp && temp.length > 0) {
      setSelectedValue({
        ...selectedValue,
        client: `${temp[0].Background?.lastName}, ${temp[0].Background?.firstName}. ${temp[0].Background?.middleName}`,
        request: `${temp[0].request.requestName}`,
        recommendation: `${temp[0].Assessment?.recommendation.recommendationName}`,
        budgetRange: `₱${temp[0].request.budgetFrom.toLocaleString()} to ${temp[0].request.budgetTo.toLocaleString()}`,
      })
    } else {
      setSelectedValue({
        client: ``,
        budgetRange: ``,
        recommendation: ``,
        request: ``,
      })
    }
  }

  return (
    <>
      <Dialog fullWidth maxWidth="xs" open={props.open}>
        <DialogTitle>
          New Budget
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            {selectedValue.client && (
              <FormHelperText>
                Client&apos;s name:&nbsp;{selectedValue.client}
              </FormHelperText>
            )}
            {selectedValue.request && (
              <FormHelperText>
                Type of Request:&nbsp;{selectedValue.request}
              </FormHelperText>
            )}
            {selectedValue.recommendation && (
              <FormHelperText>
                Recommendation:&nbsp;{selectedValue.recommendation}
              </FormHelperText>
            )}
            {selectedValue.budgetRange && (
              <FormHelperText>
                Budget range:&nbsp;{selectedValue.budgetRange}
              </FormHelperText>
            )}
            <Controller
              name="caseId"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  required
                  fullWidth
                  label="Case"
                  margin="normal"
                  value={field.value}
                  onChange={handleChangeBudget}
                  error={Boolean(errors.caseId)}
                  helperText={errors.caseId?.message}
                >
                  <MenuItem value="">
                    <em>----------</em>
                  </MenuItem>
                  {caseBudgetApi?.map((item, i) => (
                    <MenuItem key={i} value={item.id}>
                      {`Case -${item.id}`}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  margin="dense"
                  type="number"
                  label="Amount"
                  error={Boolean(errors.amount)}
                  helperText={errors.amount?.message}
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <LoadingButton
              fullWidth
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

interface DialogProps {
  id?: string | number
  open: boolean
  handleDialog: () => void
}

interface CaseBudgetApi {
  id: string
  Background: {
    firstName: string
    lastName: string
    middleName: string | null
  }
  request: {
    id: number
    requestName: string
    budgetFrom: number
    budgetTo: number
  }
  Assessment: {
    recommendation: {
      recommendationName: string
    }
  } | null
}

export default Budget
