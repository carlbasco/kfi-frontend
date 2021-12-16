/** @jsxImportSource @emotion/react */
import { CustomTable } from '@components'
import { css } from '@emotion/react'
import { SocialWorkerLayout } from '@layouts'
import { ApiAuth, Snackbar } from '@lib'
import {
    Check,
    Close,
    Delete,
    Edit,
    Loop,
    MoreHoriz,
    Visibility,
    Work
} from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
    Avatar,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Paper,
    Typography
} from '@mui/material'
import { Box } from '@mui/system'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR, { mutate } from 'swr'


const SocialWorker = () => {
  const router = useRouter()
  const { data: caseApi } = useSWR('/api/cases')
  const { data: count } = useSWR('/api/cases/count')

  const [deleteId, setDeleteId] = useState<string | number>('')
  const [openDeleteDialgo, setOpenDeleteDialgo] = useState(false)
  const handleDeleteDialog = () => {
    setOpenDeleteDialgo(!openDeleteDialgo)
  }
  const onClickDelete = (id: string | number) => {
    setDeleteId(id)
    handleDeleteDialog()
  }

  return (
    <>
      <Head>
        <title>Case - Kamanggagawa Foundation Inc</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <SocialWorkerLayout>
        <Box css={styles.boxBtnCreate}>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<Work />}
            onClick={() => router.push('/socialworker/case/new')}
          >
            New Case
          </Button>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper css={styles.card}>
              <Typography variant="subtitle2" css={styles.cardText}>
                Pending
              </Typography>
              <Box css={styles.boxContent}>
                <Typography variant="h4" css={styles.cardText}>
                  {count?.pending}
                </Typography>
                <Avatar css={styles.cardAvatar}>
                  <MoreHoriz css={styles.cardIcon} />
                </Avatar>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper css={styles.cardOngoing}>
              <Typography variant="subtitle2" css={styles.cardText}>
                On-Going
              </Typography>
              <Box css={styles.boxContent}>
                <Typography variant="h4" css={styles.cardText}>
                  {count?.onGoing}
                </Typography>
                <Avatar css={styles.cardAvatar}>
                  <Loop css={styles.cardIcon} />
                </Avatar>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper css={styles.cardCanceled}>
              <Typography variant="subtitle2" css={styles.cardText}>
                Rejected
              </Typography>
              <Box css={styles.boxContent}>
                <Typography variant="h4" css={styles.cardText}>
                  {count?.rejected}
                </Typography>
                <Avatar css={styles.cardAvatar}>
                  <Close css={styles.cardIcon} />
                </Avatar>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper css={styles.cardCompleted}>
              <Typography variant="subtitle2" css={styles.cardText}>
                Completed
              </Typography>
              <Box css={styles.boxContent}>
                <Typography variant="h4" css={styles.cardText}>
                  {count?.completed}
                </Typography>
                <Avatar css={styles.cardAvatar}>
                  <Check css={styles.cardIcon} />
                </Avatar>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        <Box css={styles.table}>
          <CustomTable
            title="Cases"
            size="small"
            loading={!caseApi}
            data={caseApi}
            header={[
              {
                title: 'Case ID',
                align: 'left',
                field: 'id',
              },
              {
                title: 'Status',
                align: 'center',
                field: 'status',
                render: (rowData) =>
                  rowData.status === 'ongoing' ? (
                    <Chip size="small" label="on-going" color="secondary" />
                  ) : rowData.status === 'completed' ? (
                    <Chip size="small" label={rowData.status} color="success" />
                  ) : rowData.status === 'rejected' ? (
                    <Chip size="small" label={rowData.status} color="error" />
                  ) : rowData.status === 'pendingForAssessment' ? (
                    <Chip
                      size="small"
                      label="pending for assessment"
                      color="warning"
                    />
                  ) : rowData.status === 'pendingForReview' ? (
                    <Chip
                      size="small"
                      label="pending for review"
                      color="warning"
                    />
                  ) : (
                    <Chip
                      size="small"
                      label={rowData?.status}
                      color="warning"
                    />
                  ),
              },
              {
                title: 'Start Date',
                align: 'center',
                field: 'startDate',
                render: (rowData) =>
                  rowData.startDate
                    ? new Date(rowData.startDate).toDateString()
                    : `-`,
              },
              {
                title: 'End Date',
                align: 'center',
                field: 'endDate',
                render: (rowData) =>
                  rowData.endDate
                    ? new Date(rowData.endDate).toDateString()
                    : `-`,
              },
              {
                title: 'Last Update',
                align: 'center',
                field: 'updatedAt',
                render: (rowData) =>
                  rowData.updatedAt
                    ? new Date(rowData.updatedAt).toDateString()
                    : `-`,
              },
            ]}
            actions={[
              {
                icon: <Visibility color="secondary" />,
                tooltip: 'View Case',
                onClick: (rowData) =>
                  router.push(`/socialworker/case/${rowData.id}`),
              },
              (rowData) => ({
                icon: <Edit color="primary" />,
                tooltip: 'Edit Case',
                hidden: rowData.status !== 'incomplete',
                onClick: () =>
                  router.push(`/socialworker/case/${rowData.id}/edit`),
              }),
              (rowData) => ({
                icon: <Delete color="error" />,
                tooltip: 'Delete Case',
                hidden: rowData.status !== 'incomplete',
                onClick: () => onClickDelete(rowData.id),
              }),
            ]}
          />
        </Box>
        <DeleteDialog
          id={deleteId}
          open={openDeleteDialgo}
          handleDialog={handleDeleteDialog}
        />
      </SocialWorkerLayout>
    </>
  )
}

const DeleteDialog = ({ open, id, handleDialog }: DeleteDialogProps) => {
  const [fetchLoading, setFetchLoading] = useState(false)
  const deleteRequest = async () => {
    try {
      setFetchLoading(true)
      const res = await ApiAuth.delete(`/api/sw/case/${id}`)
      const data = await res.data
      Snackbar.success(data.message)
      mutate('/api/cases')
      setFetchLoading(false)
      handleDialog()
    } catch (err) {
      setFetchLoading(false)
      Snackbar.error(err.response?.data?.message)
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
            <strong>Case {id}?</strong>
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

interface DeleteDialogProps {
  open: boolean
  handleDialog: () => void
  id: string | number
}

const styles = {
  tabPanel: css`
    padding-left: 0;
    padding-right: 0;
  `,
  card: css`
    padding: 1em;
    height: 145px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 0;
    background: linear-gradient(
      169deg,
      rgba(181, 111, 31, 1) 0%,
      rgba(230, 165, 15, 1) 77%,
      rgba(255, 193, 7, 1) 100%
    );
  `,
  cardOngoing: css`
    padding: 1em;
    height: 145px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 0;
    background: linear-gradient(
      169deg,
      rgba(4, 41, 122, 1) 0%,
      rgba(28, 133, 179, 1) 77%,
      rgba(50, 214, 229, 1) 100%
    );
  `,
  cardCanceled: css`
    padding: 1em;
    height: 145px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 0;
    background: linear-gradient(
      120deg,
      rgba(138, 3, 21, 1) 0%,
      rgba(194, 63, 78, 1) 100%
    );
  `,
  cardCompleted: css`
    padding: 1em;
    height: 145px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 0;
    background: linear-gradient(
      145deg,
      rgba(5, 91, 62, 1) 66%,
      rgba(0, 129, 64, 1) 100%
    );
  `,

  cardText: css`
    color: #fff;
  `,

  boxContent: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  cardAvatar: css`
    width: 60px;
    height: 60px;
  `,
  cardIcon: css`
    width: 45px;
    height: 60px;
  `,
  boxBtnCreate: css`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1em;
  `,
  table: css`
    margin-top: 1em;
  `,
}

export default SocialWorker
