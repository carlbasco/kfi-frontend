/** @jsxImportSource @emotion/react */
import {
  ImageViewer,
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary
} from '@components'
import { css } from '@emotion/react'
import { BranchHeadLayout } from '@layouts'
import { ArrowForwardIosSharp } from '@mui/icons-material'
import {
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { SyntheticEvent, useState } from 'react'
import useSWR from 'swr'

dayjs.extend(localizedFormat)
const urlAPI = process.env.NEXT_PUBLIC_API_URL!

const Budget = () => {
  const router = useRouter()
  const id = router.query.id
  const { data, error } = useSWR(id ? `/api/case/${id}/budget` : null, {
    refreshInterval: 0,
  })

  const [expanded, setExpanded] = useState<number | false>(false)
  const handleChange =
    (panel: number) => (event: SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false)
    }

  const [openImgViewer, setOpenImgViewer] = useState(false)
  const handleImageViewer = () => {
    setOpenImgViewer(!openImgViewer)
  }
  const [img, setImg] = useState('')
  const onClickImg = (url: string) => {
    setImg(url)
    handleImageViewer()
  }

  return (
    <>
      <Head>
        <title>Budget - Kamanggagawa Foundation Inc</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <BranchHeadLayout>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8}>
            <Paper variant="outlined" css={styles.paper}>
              {error ? (
                <Box display="flex" justifyContent="center">
                  <Typography variant="h6">Case Budget not found</Typography>
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
                      <Typography variant="body1">{data?.case?.id}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Client:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="body1">
                        {data.case.Background?.lastName},&nbsp;&nbsp;
                        {data.case.Background?.firstName}&nbsp;&nbsp;
                        {data.case.Background?.middleName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Type of Request:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="body1">
                        {data.case?.request?.requestName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Recommendation:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="body1">
                        {
                          data.case?.Assessment?.recommendation
                            ?.recommendationName
                        }
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Date Created:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body1">
                        {new Date(data?.createdAt).toDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Amount:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body1">
                        {data?.amount && `₱ ${data?.amount.toLocaleString()}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Status:
                      </Typography>
                    </Grid>
                    <Grid item xs={8} sm={8}>
                      {data?.status === 'completed' ? (
                        <Chip
                          size="small"
                          color="success"
                          label={data?.status}
                        />
                      ) : data?.status === 'pendingForReview' ? (
                        <Chip
                          size="small"
                          color="primary"
                          label="pending for review"
                        />
                      ) : (
                        <Chip
                          size="small"
                          color="primary"
                          label={data?.status}
                        />
                      )}
                    </Grid>
                  </Grid>
                  {data?.BudgetDetail.length <= 0 ? (
                    <>
                      <Divider css={styles.divider}>Liquidation</Divider>
                      <Box display="flex" justifyContent="center">
                        <Typography variant="subtitle2">
                          liquidation is empty
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Divider css={styles.divider}>Liquidation</Divider>
                      {data?.BudgetDetail?.map((item: any) => (
                        <StyledAccordion
                          square
                          key={item.id}
                          elevation={0}
                          disableGutters
                          expanded={expanded === item?.id}
                          onChange={handleChange(item?.id)}
                        >
                          <StyledAccordionSummary
                            expandIcon={
                              <ArrowForwardIosSharp
                                sx={{ fontSize: '0.9rem' }}
                              />
                            }
                          >
                            <Typography>
                              {dayjs(item?.createdAt).format(
                                'L [ at ] hh:mm a'
                              )}
                            </Typography>
                          </StyledAccordionSummary>
                          <StyledAccordionDetails>
                            <Box display="inline-flex" alignItems="center">
                              <Typography variant="subtitle1">
                                Status:
                              </Typography>
                              &nbsp; &nbsp;
                              {item?.status === 'approved' ? (
                                <Chip
                                  size="small"
                                  color="secondary"
                                  variant="outlined"
                                  label="approved"
                                />
                              ) : item?.status === 'rejected' ? (
                                <Chip
                                  size="small"
                                  color="error"
                                  label="rejected"
                                  variant="outlined"
                                />
                              ) : (
                                <Chip
                                  size="small"
                                  label="pending"
                                  color="primary"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                            <Box
                              display="flex"
                              justifyContent="center"
                              flexWrap="wrap"
                              sx={{ mt: 2, mb: 2, gap: '1em' }}
                            >
                              {item?.BudgetFile?.map((item2: any) => {
                                const url = urlAPI + item2.filePath
                                return (
                                  <div key={item2.id} css={styles.img}>
                                    <a onClick={() => onClickImg(url)}>
                                      <img
                                        width="150"
                                        height="100"
                                        alt="case-img"
                                        src={urlAPI + item2.filePath}
                                      />
                                    </a>
                                  </div>
                                )
                              })}
                            </Box>
                            {item?.liquidation && (
                              <Box>
                                <TableContainer
                                  component={Paper}
                                  variant="outlined"
                                  sx={{
                                    mt: 1,
                                    mb: 1,
                                    borderRadius: 0,
                                    maxHeight: '465px',
                                  }}
                                >
                                  <Table stickyHeader size="small">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell
                                          variant="head"
                                          css={styles.cellHeader}
                                        >
                                          Particulars
                                        </TableCell>
                                        <TableCell
                                          variant="head"
                                          css={styles.cellHeader}
                                        >
                                          Quantity
                                        </TableCell>
                                        <TableCell
                                          variant="head"
                                          css={styles.cellHeader}
                                        >
                                          Unit
                                        </TableCell>
                                        <TableCell
                                          variant="head"
                                          css={styles.cellHeader}
                                        >
                                          Price
                                        </TableCell>
                                        <TableCell
                                          variant="head"
                                          css={styles.cellHeader}
                                        >
                                          Amount
                                        </TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {item?.liquidation.map(
                                        (item: any, i: number) => (
                                          <TableRow key={i}>
                                            <TableCell align="center">
                                              {item.article}
                                            </TableCell>
                                            <TableCell align="center">
                                              {item.qty}
                                            </TableCell>
                                            <TableCell align="center">
                                              {item.unit}
                                            </TableCell>
                                            <TableCell align="center">
                                              ₱{item.price.toLocaleString()}
                                            </TableCell>
                                            <TableCell align="right">
                                              ₱
                                              {(
                                                item.qty * item.price
                                              ).toLocaleString()}
                                            </TableCell>
                                          </TableRow>
                                        )
                                      )}
                                      <TableRow>
                                        <TableCell
                                          colSpan={4}
                                          css={styles.cellTotal}
                                        >
                                          Total Amount
                                        </TableCell>
                                        <TableCell align="right">
                                          ₱
                                          {item?.liquidation
                                            ?.reduce(
                                              (total: number, value: any) =>
                                                total + value.qty * value.price,
                                              0
                                            )
                                            .toLocaleString()}
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </Box>
                            )}
                            {item?.remarks && (
                              <Box>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight={700}
                                >
                                  Remarks:
                                </Typography>
                                <Typography
                                  variant="body1"
                                  textAlign="justify"
                                  sx={{ textIndent: '2em' }}
                                >
                                  {item?.remarks}
                                </Typography>
                              </Box>
                            )}
                          </StyledAccordionDetails>
                        </StyledAccordion>
                      ))}
                    </>
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
        <ImageViewer
          src={img}
          open={openImgViewer}
          handleImageViewer={handleImageViewer}
        />
      </BranchHeadLayout>
    </>
  )
}

const styles = {
  paper: css`
    padding: 2em;
    @media (max-width: 600px) {
      padding: 1em;
    }
  `,
  divider: css`
    margin-top: 1.5em;
    margin-bottom: 1.5em;
    font-weight: 700;
  `,
  img: css`
    padding: 0.4em;
    padding-bottom: 0;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    cursor: pointer;
  `,
  box: css`
    margin-bottom: 1em;
    display: flex;
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
  reject: css`
    color: #db2023;
  `,
  approve: css`
    color: #0f3b68;
  `,
  cellHeader: css`
    font-weight: 700;
    text-align: center;
  `,
  cellTotal: css`
    font-weight: 700;
    text-align: right;
  `,
}

export default Budget
