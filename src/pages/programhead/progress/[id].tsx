/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { ProgramHeadLayout } from '@layouts'
import { ApiAuth, Snackbar } from '@lib'
import { LoadingButton } from '@mui/lab'
import {
    Chip,
    CircularProgress,
    Grid,
    Paper,
    TextField,
    Typography
} from '@mui/material'
import { Box } from '@mui/system'
import {
    ProgressNoteRemarkDefaultValues,
    ProgressNoteRemarkForm,
    ProgressNoteRemarkFormYup
} from '@validation'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import useSWR, { mutate } from 'swr'


const ProgressNote = () => {
  const router = useRouter()
  const id = router.query.id
  const { data, error } = useSWR(id ? `/api/progressnote/${id}` : null)

  const [fetchLoading, setFetchLoading] = useState(false)

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: ProgressNoteRemarkDefaultValues,
    resolver: yupResolver(ProgressNoteRemarkFormYup),
  })

  const onSubmit: SubmitHandler<ProgressNoteRemarkForm> = async (values) => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.put(
        `/api/head/progressnote/${data?.id}`,
        values
      )
      const resData = await res.data
      mutate(`/api/progressnote/${id}`)
      Snackbar.success(resData.message)
      setFetchLoading(false)
    } catch (err) {
      setFetchLoading(false)
      if (err.response?.data) return Snackbar.error(err.response?.data?.message)
    }
  }

  return (
    <>
      <Head>
        <title>Progress Note - Kamanggagawa Foundation Inc</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <ProgramHeadLayout>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={8}>
            <Paper variant="outlined" css={styles.paper}>
              {error ? (
                <Box display="flex" justifyContent="center">
                  <Typography variant="h6">Progress Note not found</Typography>
                </Box>
              ) : data ? (
                <>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Case ID:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="body1">{data?.caseId}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Status:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      {data?.status === 'completed' ? (
                        <Chip size="small" color="success" label="completed" />
                      ) : (
                        <Chip
                          size="small"
                          color="primary"
                          label={data?.status}
                        />
                      )}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Activity:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="body1">{data?.activity}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Date:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="body1">
                        {new Date(data?.createdAt).toDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 4 }}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Client:
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1" css={styles.paragraph}>
                        {data?.client}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Family:
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1" css={styles.paragraph}>
                        {data?.family}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Environment:
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1" css={styles.paragraph}>
                        {data?.environment}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Church:
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1" css={styles.paragraph}>
                        {data?.church}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Livelihood:
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1" css={styles.paragraph}>
                        {data?.livelihood}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        What Transpired:
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1" css={styles.paragraph}>
                        {data?.transpired}
                      </Typography>
                    </Grid>
                    {data?.status === 'completed' && (
                      <>
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            Program Head &apos;s Remark:
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body1" css={styles.paragraph}>
                            {data?.remark}
                          </Typography>
                        </Grid>
                      </>
                    )}
                  </Grid>
                  {data?.status === 'pending' && (
                    <Box sx={{ mt: 2 }}>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                          name="remark"
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
                              label="Remark"
                              variant="outlined"
                              error={Boolean(errors.remark)}
                              helperText={errors.remark?.message}
                            />
                          )}
                        />
                        <Box display="flex" justifyContent="flex-end">
                          <LoadingButton
                            type="submit"
                            color="primary"
                            variant="contained"
                            loading={fetchLoading}
                          >
                            Submit
                          </LoadingButton>
                        </Box>
                      </form>
                    </Box>
                  )}
                </>
              ) : (
                <Box display="flex" justifyContent="center">
                  <CircularProgress />
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </ProgramHeadLayout>
    </>
  )
}

const styles = {
  paper: css`
    padding: 2em;
  `,
  paragraph: css`
    text-indent: 3em;
    text-align: justify;
  `,
}

export default ProgressNote
