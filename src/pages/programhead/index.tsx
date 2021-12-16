/** @jsxImportSource @emotion/react */
import { CustomTable } from '@components'
import { css } from '@emotion/react'
import { ProgramHeadLayout } from '@layouts'
import { Check, Close, Loop, MoreHoriz, Visibility } from '@mui/icons-material'
import {
    Avatar,
    Breadcrumbs,
    Chip,
    Grid,
    Paper,
    Typography
} from '@mui/material'
import { Box } from '@mui/system'
import Head from 'next/head'
import { useRouter } from 'next/router'
import useSWR from 'swr'


const ProgramHead = () => {
  const router = useRouter()
  const { data: caseApi } = useSWR('/api/cases')
  const { data: count } = useSWR('/api/cases/count')

  return (
    <>
      <Head>
        <title>Dashboard - Kamanggagawa Foundation Inc</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <ProgramHeadLayout>
        <Box css={styles.box}>
          <Breadcrumbs aria-label="breadcrumb">
            <Typography fontFamily="inherit" variant="subtitle1">
              Dashboard
            </Typography>
          </Breadcrumbs>
        </Box>
        <Box css={styles.boxBtnCreate}></Box>
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
                title: 'Social Worker',
                align: 'left',
                field: '',
                render: (rowData) =>
                  `${rowData.createdBy?.firstName} ${rowData.createdBy?.middleName} ${rowData.createdBy?.lastName}`,
              },
              {
                title: 'Status',
                align: 'center',
                field: 'status',
                render: (rowData) =>
                  rowData.status === 'ongoing' ? (
                    <Chip
                      size="small"
                      label="on-going"
                      color="secondary"
                    />
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
                    <Chip size="small" label={rowData.status} color="warning" />
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
                onClick: (rowData) => router.push(`/programhead/case/${rowData.id}`),
              },
            ]}
          />
        </Box>
      </ProgramHeadLayout>
    </>
  )
}

const styles = {
  box: css`
    margin-bottom: 1em;
    display: flex;
  `,
  link: css`
    text-decoration: none;
  `,
  linkText: css`
    &:hover {
      cursor: pointer;
      font-weight: bolder;
    }
  `,
  tabPanel: css`
    padding-left: 0;
    padding-right: 0;
  `,
  typography: css`
    font-weight: 700;
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

export default ProgramHead
