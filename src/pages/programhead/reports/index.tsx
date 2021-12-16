/** @jsxImportSource @emotion/react */
import { BudgetDoc, BudgetListDoc, CaseDoc, CaseListDoc } from '@components'
import { css } from '@emotion/react'
import { ProgramHeadLayout } from '@layouts'
import { ApiAuth, Snackbar } from '@lib'
import {
  LoadingButton,
  LocalizationProvider,
  MobileDateRangePicker,
} from '@mui/lab'
import DateAdapter from '@mui/lab/AdapterDayjs'
import { DateRange } from '@mui/lab/DateRangePicker/RangeTypes'
import {
  Autocomplete,
  Breadcrumbs,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { PDFViewer } from '@react-pdf/renderer'
import { ReduxState } from '@redux'
import Head from 'next/head'
import Link from 'next/link'
import { ChangeEvent, FormEvent, useState } from 'react'
import { useSelector } from 'react-redux'
import useSWR from 'swr'

interface BudgetProps {
  date: DateRange<Date>
  status: 'pending' | 'completed' | 'all'
}
interface RequestProps {
  date: DateRange<Date>
  requestId: string | number
  order: string
}

interface CaseListProps {
  branchId: number
  status: string
  date: DateRange<Date>
}

const Report = () => {
  const { user } = useSelector((state: ReduxState) => state.auth)
  const { data: caseApi } = useSWR(`/api/option/report/case`, {
    refreshInterval: 0,
  })
  const { data: budgetApi } = useSWR('/api/option/case/budget', {
    refreshInterval: 0,
  })

  const [reportType, setReportType] = useState('')
  const [caseId, setCaseId] = useState('')
  const [caseListValue, setCaseListValue] = useState<CaseListProps>({
    status: 'all',
    branchId: 0,
    date: [null, null],
  })
  const [budgetCaseId, setBudgetCaseId] = useState('')
  const [budgetListValue, setBudgetListValue] = useState<BudgetProps>({
    date: [null, null],
    status: 'all',
  })

  const [casePdf, setCasePdf] = useState({})
  const [caseListPdf, setCaseListPdf] = useState([])
  const [budgetPdf, setBudgetPdf] = useState({})
  const [budgetListPdf, setBudgetListPdf] = useState([])

  const [fetchLoading, setFetchLoading] = useState(false)
  const setDefaultPDF = () => {
    setCasePdf({})
    setCaseListPdf([])
    setBudgetListPdf([])
    setBudgetPdf([])
  }

  const handleChangeReportType = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setCaseId('')
    setCaseListValue({ status: 'all', date: [null, null], branchId: 0 })
    setBudgetListValue({ date: [null, null], status: 'all' })
    setDefaultPDF()
    setReportType(e.target.value)
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setFetchLoading(true)
      if (reportType === 'case') {
        setDefaultPDF()
        const res = await ApiAuth.get(`/api/report/case/${caseId}`)
        const data = await res.data
        if (!data) return Snackbar.info('Case not found')
        setCasePdf(data)
      }
      if (reportType === 'caseList') {
        setDefaultPDF()
        const res = await ApiAuth.post(`/api/report/caseList`, caseListValue)
        const data = await res.data
        if (!data || data?.length <= 0)
          return Snackbar.info('Case list is empty')
        setCaseListPdf(data)
      }
      if (reportType === 'budgetList') {
        setDefaultPDF()
        const res = await ApiAuth.post(
          `/api/report/budgetList`,
          budgetListValue
        )
        const data = await res.data
        if (!data || data?.length <= 0)
          return Snackbar.info('Budget list is empty')
        setBudgetListPdf(data)
      }
      if (reportType === 'budget') {
        setDefaultPDF()
        const res = await ApiAuth.get(`/api/case/${budgetCaseId}/budget`)
        const data = await res.data
        if (Object.keys(data).length === 0 && data.constructor === Object)
          return Snackbar.info('Budget for this case is empty')
        setBudgetPdf(data)
      }
    } catch (err) {
      if (err.reponse?.data) Snackbar.error(err.reponse?.data?.message)
    } finally {
      setFetchLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Manage Accounts - Kamanggagawa Foundation Inc</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <ProgramHeadLayout>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={4}>
              <form onSubmit={onSubmit}>
                <Paper variant="outlined" css={styles.paper}>
                  <Typography variant="h6" textAlign="center" gutterBottom>
                    Generate Report
                  </Typography>
                  <TextField
                    select
                    required
                    fullWidth
                    margin="dense"
                    label="Report Type"
                    value={reportType}
                    onChange={handleChangeReportType}
                  >
                    <MenuItem value="">
                      <em>----------</em>
                    </MenuItem>
                    <MenuItem value="case">Case</MenuItem>
                    <MenuItem value="caseList">Case List</MenuItem>
                    <MenuItem value="budget">Budget</MenuItem>
                    <MenuItem value="budgetList">Budget List</MenuItem>
                  </TextField>
                  {reportType === 'case' && (
                    <Autocomplete
                      autoHighlight
                      options={caseApi ? caseApi : []}
                      getOptionLabel={(option: any) => `Case ${option.id}`}
                      onChange={(_, option) => {
                        option?.id ? setCaseId(option.id) : ''
                      }}
                      renderOption={(props, option) => (
                        <Box component="li" {...props} key={option.id}>
                          Case {option.id}
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          fullWidth
                          label="Case"
                          margin="dense"
                          variant="outlined"
                          autoComplete="new-password"
                        />
                      )}
                    />
                  )}
                  {reportType === 'caseList' && (
                    <>
                      <TextField
                        select
                        required
                        fullWidth
                        name="status"
                        label="Status"
                        margin="dense"
                        value={caseListValue.status}
                        onChange={(e) =>
                          setCaseListValue({
                            ...caseListValue,
                            [e.target.name]: e.target.value,
                          })
                        }
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="ongoing">On-Going</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                      </TextField>
                      <LocalizationProvider dateAdapter={DateAdapter}>
                        <MobileDateRangePicker
                          endText="To"
                          startText="From"
                          value={caseListValue.date}
                          onChange={(value) => {
                            setCaseListValue({
                              ...caseListValue,
                              date: value,
                            })
                          }}
                          renderInput={(startProps, endProps) => (
                            <>
                              <TextField
                                {...startProps}
                                required
                                fullWidth
                                label="From"
                                margin="dense"
                                autoComplete="new-password"
                              />
                              <Box sx={{ mx: 2 }}> to </Box>
                              <TextField
                                {...endProps}
                                required
                                fullWidth
                                label="To"
                                margin="dense"
                                autoComplete="new-password"
                              />
                            </>
                          )}
                        />
                      </LocalizationProvider>
                    </>
                  )}
                  {reportType === 'budget' && (
                    <Autocomplete
                      autoHighlight
                      options={budgetApi ? budgetApi : []}
                      getOptionLabel={(option: any) => `Case ${option.id}`}
                      onChange={(_, option) => {
                        option?.id ? setBudgetCaseId(option.id) : ''
                      }}
                      renderOption={(props, option) => (
                        <Box component="li" {...props} key={option.id}>
                          Case {option.id}
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          fullWidth
                          label="Case"
                          margin="dense"
                          variant="outlined"
                          autoComplete="new-password"
                        />
                      )}
                    />
                  )}
                  {reportType === 'budgetList' && (
                    <>
                      <TextField
                        select
                        required
                        fullWidth
                        name="status"
                        label="Status"
                        margin="dense"
                        value={budgetListValue.status}
                        onChange={(e) =>
                          setBudgetListValue({
                            ...budgetListValue,
                            [e.target.name]: e.target.value,
                          })
                        }
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                      </TextField>
                      <LocalizationProvider dateAdapter={DateAdapter}>
                        <MobileDateRangePicker
                          endText="To"
                          startText="From"
                          value={budgetListValue.date}
                          onChange={(value) => {
                            setBudgetListValue({
                              ...budgetListValue,
                              date: value,
                            })
                          }}
                          renderInput={(startProps, endProps) => (
                            <>
                              <TextField
                                required
                                fullWidth
                                label="From"
                                margin="dense"
                                {...startProps}
                              />
                              <Box sx={{ mx: 2 }}> to </Box>
                              <TextField
                                fullWidth
                                required
                                label="To"
                                margin="dense"
                                {...endProps}
                              />
                            </>
                          )}
                        />
                      </LocalizationProvider>
                    </>
                  )}
                  <LoadingButton
                    fullWidth
                    type="submit"
                    variant="contained"
                    loading={fetchLoading}
                    css={styles.submitBtn}
                  >
                    Generate
                  </LoadingButton>
                </Paper>
              </form>
            </Grid>
            {casePdf && Object.keys(casePdf).length !== 0 && (
              <Grid item xs={12} lg={8}>
                <PDFViewer width="100%" height="1200px">
                  <CaseDoc data={casePdf} user={user} />
                </PDFViewer>
              </Grid>
            )}
            {caseListPdf && caseListPdf.length > 0 && (
              <Grid item xs={12} lg={8}>
                <PDFViewer width="100%" height="1200px">
                  <CaseListDoc user={user} data={caseListPdf} />
                </PDFViewer>
              </Grid>
            )}
            {budgetPdf && Object.keys(budgetPdf).length !== 0 && (
              <Grid item xs={12} lg={8}>
                <PDFViewer width="100%" height="1200px">
                  <BudgetDoc user={user} data={budgetPdf} />
                </PDFViewer>
              </Grid>
            )}
            {budgetListPdf && budgetListPdf.length > 0 && (
              <Grid item xs={12} lg={8}>
                <PDFViewer width="100%" height="1200px">
                  <BudgetListDoc
                    user={user}
                    data={budgetListPdf}
                    date={budgetListValue.date}
                  />
                </PDFViewer>
              </Grid>
            )}
          </Grid>
        </Box>
      </ProgramHeadLayout>
    </>
  )
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
  paper: css`
    padding: 2em;
    @media (max-width: 600px) {
      padding: 1em;
    }
  `,
  submitBtn: css`
    margin-top: 1em;
  `,
}

export default Report
