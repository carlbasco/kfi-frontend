/** @jsxImportSource @emotion/react */
import { AssessmentRemark, ImageViewer, Loading } from '@components'
import { css } from '@emotion/react'
import { BranchHeadLayout } from '@layouts'
import { Cancel, CheckCircle } from '@mui/icons-material'
import {
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

dayjs.extend(localizedFormat)
const urlAPI = process.env.NEXT_PUBLIC_API_URL!

const Case = () => {
  const router = useRouter()
  const { id } = router.query
  const { data, error, isValidating } = useSWR(
    id ? `/api/head/case/${id}` : null
  )

  const [loading, setLoading] = useState(true)
  useEffect(() => {
    !isValidating && setLoading(false)
  }, [isValidating])

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
        <title>Case - Kamanggagawa Foundation Inc</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Loading open={loading} />
      <BranchHeadLayout>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={12} md={8} css={styles.grid}>
            <Paper variant="outlined" css={styles.paper}>
              {error ? (
                <Box display="flex" justifyContent="center">
                  <Typography variant="h6">Case not found</Typography>
                </Box>
              ) : data ? (
                <>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Case ID:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">{id}</Typography>
                    </Grid>
                    <Grid item xs={4} sm={6}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Status:
                      </Typography>
                    </Grid>
                    <Grid item xs={8} sm={6}>
                      {data?.status === 'rejected' ? (
                        <Chip
                          size="small"
                          color="error"
                          variant="filled"
                          label={data?.status}
                        />
                      ) : data?.status === 'ongoing' ? (
                        <Chip
                          size="small"
                          color="secondary"
                          variant="filled"
                          label="on-going"
                        />
                      ) : data?.status === 'completed' ? (
                        <Chip
                          size="small"
                          color="success"
                          variant="filled"
                          label={data?.status}
                        />
                      ) : data?.status === 'pendingForAssessment' ? (
                        <Chip
                          size="small"
                          label="pending for assessment"
                          color="warning"
                        />
                      ) : data?.status === 'pendingForReview' ? (
                        <Chip
                          size="small"
                          label="pending for review"
                          color="warning"
                        />
                      ) : (
                        <Chip
                          size="small"
                          label={data?.status}
                          color="warning"
                        />
                      )}
                    </Grid>
                  </Grid>

                  {data.Background && (
                    <>
                      <Divider css={styles.middle}>
                        Background Information
                      </Divider>
                      <Grid container>
                        <Grid item xs={6} sm={4}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            Name:
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={8}>
                          <Typography variant="body1">
                            {`${data.Background.firstName} ${data.Background?.middleName} ${data.Background.lastName}`}
                          </Typography>
                        </Grid>
                        {data.Background?.nickname && (
                          <>
                            <Grid item xs={6} sm={4}>
                              <Typography variant="subtitle1" fontWeight={700}>
                                Nickname:
                              </Typography>
                            </Grid>
                            <Grid item xs={6} sm={8}>
                              <Typography variant="body1">
                                {data?.Background.nickname}
                              </Typography>
                            </Grid>
                          </>
                        )}
                        <Grid item xs={6} sm={4}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            Age:
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={8}>
                          <Typography variant="body1">
                            {data.Background.age}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            Sex:
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={8}>
                          <Typography variant="body1">
                            {data.Background.sex}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            Civil Status:
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={8}>
                          <Typography variant="body1">
                            {data.Background.civilStatus}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            Birth Date:
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={8}>
                          <Typography variant="body1">
                            {new Date(
                              data.Background.birthDate
                            ).toLocaleDateString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            Religion:
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={8}>
                          <Typography variant="body1">
                            {data?.Background.religion?.religionName}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            Education:
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={8}>
                          <Typography variant="body1">
                            {data?.Background.education?.educationName}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            Occuptaion:
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={8}>
                          <Typography variant="body1">
                            {data?.Background.occupation?.occupationName}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            Monthly Income:
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={8}>
                          {data?.Background.income ? (
                            <Typography variant="body1">
                              ₱{data.Background.income?.from.toLocaleString()}
                              &nbsp;&nbsp;-&nbsp;&nbsp;
                              {data.Background.income?.to.toLocaleString()}
                            </Typography>
                          ) : (
                            <Typography variant="body1">n/a</Typography>
                          )}
                        </Grid>

                        <Grid item xs={6} sm={4}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            Contact Number:
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={8}>
                          {data?.Background.phone && (
                            <Typography variant="body1">
                              +63&nbsp;{data.Background.phone}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            Address:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                          <Typography variant="body1">
                            {data?.Background.address}&nbsp;&nbsp;
                            {data?.Background.street}&nbsp;&nbsp;
                          </Typography>
                        </Grid>
                        {data?.Background?.barangay &&
                          data?.Background?.city &&
                          data?.Background?.province && (
                            <>
                              <Grid item xs={6} sm={4} />
                              <Grid item xs={12} sm={8}>
                                <Typography variant="body1">
                                  {data?.Background.barangay?.brgy_name}
                                  ,&nbsp;&nbsp;
                                  {data?.Background.city?.city_name}
                                  ,&nbsp;&nbsp;
                                  {data?.Background.province?.province_name}
                                  &nbsp;&nbsp;
                                </Typography>
                              </Grid>
                            </>
                          )}
                      </Grid>
                      {data?.Background.Family &&
                        data.Background.Family.length > 0 && (
                          <>
                            <Divider css={styles.middle}>
                              Family Composition
                            </Divider>
                            {data.Background.Family &&
                              data.Background.Family.map((item: any) => (
                                <Grid container key={item.id}>
                                  <Grid item xs={6} sm={4}>
                                    <Typography
                                      variant="subtitle1"
                                      fontWeight={700}
                                    >
                                      Full Name:
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6} sm={8}>
                                    <Typography variant="body1">
                                      {`${item.firstName} ${item.middleName} ${item.lastName}`}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6} sm={4}>
                                    <Typography
                                      variant="subtitle1"
                                      fontWeight={700}
                                    >
                                      Age:
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6} sm={8}>
                                    <Typography variant="body1">
                                      {item.age}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6} sm={4}>
                                    <Typography
                                      variant="subtitle1"
                                      fontWeight={700}
                                    >
                                      Education:
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6} sm={8}>
                                    <Typography variant="body1">
                                      {item.education &&
                                        item.education.educationName}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6} sm={4}>
                                    <Typography
                                      variant="subtitle1"
                                      fontWeight={700}
                                    >
                                      Occupation:
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6} sm={8}>
                                    <Typography variant="body1">
                                      {item.occupation &&
                                        item.occupation.occupationName}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6} sm={4}>
                                    <Typography
                                      variant="subtitle1"
                                      fontWeight={700}
                                    >
                                      Monthly Income:
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6} sm={8}>
                                    {item.income ? (
                                      <Typography
                                        variant="body1"
                                        css={styles.mb}
                                      >
                                        ₱{item.income.from.toLocaleString()}
                                        &nbsp;&nbsp;-&nbsp;&nbsp;
                                        {item.income.to.toLocaleString()}
                                      </Typography>
                                    ) : (
                                      <Typography
                                        variant="body1"
                                        css={styles.mb}
                                      >
                                        n/a
                                      </Typography>
                                    )}
                                  </Grid>
                                </Grid>
                              ))}
                          </>
                        )}
                      <Divider css={styles.middle}>Munting Pangarap</Divider>
                      <Grid container alignItems="center">
                        <Grid item xs={12} sm={4}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            Type of Request:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body1">
                            {data?.request.requestName}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            Request Summary:
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body1" css={styles.paragraph}>
                            {data?.requestSummary}
                          </Typography>
                        </Grid>
                      </Grid>
                    </>
                  )}
                  {data?.CaseLetter && data.CaseLetter.length > 0 && (
                    <>
                      <Divider variant="middle" css={styles.middle}>
                        Letter
                      </Divider>
                      <div css={styles.boxDownload}>
                        {data?.CaseLetter.map((item: Files) => {
                          const url = urlAPI + item.filePath
                          return item.filePath.split('.').pop() === 'mp4' ? (
                            <div key={item.id}>
                              <video width="200" controls>
                                <source src={url} type="video/mp4" />
                              </video>
                            </div>
                          ) : (
                            <div key={item.id} css={styles.img}>
                              <a onClick={() => onClickImg(url)}>
                                <img
                                  width="150"
                                  height="100"
                                  alt="case-img"
                                  src={url}
                                />
                              </a>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  )}
                  {data?.status !== 'incomplete' &&
                    data?.status !== 'pending' &&
                    data?.note && (
                      <>
                        <Divider variant="middle" css={styles.middle}>
                          Program Head remarks
                        </Divider>
                        <Grid container>
                          <Grid item xs={12}>
                            <Typography variant="body1" css={styles.paragraph}>
                              {data.note}
                            </Typography>
                          </Grid>
                        </Grid>
                      </>
                    )}
                  {data?.Assessment &&
                    (data?.status === 'pendingForReview' ||
                      data?.status === 'ongoing' ||
                      data?.status === 'completed') && (
                      <>
                        <Divider css={styles.middle}>Case Assessment</Divider>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle1" fontWeight={700}>
                              Findings:
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1" css={styles.paragraph}>
                              {data?.Assessment?.findings}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Box display="inlineFlex">
                              <Typography variant="subtitle1" fontWeight={700}>
                                Recommendation: &nbsp;&nbsp;&nbsp;
                              </Typography>
                              <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                fontStyle="italic"
                              >
                                {
                                  data?.Assessment?.recommendation
                                    ?.recommendationName
                                }
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1" css={styles.paragraph}>
                              {data?.Assessment?.recommendationDetails}
                            </Typography>
                          </Grid>
                        </Grid>
                      </>
                    )}
                  {data?.CaseFiles.length > 0 &&
                    (data?.status === 'pendingForReview' ||
                      data?.status === 'ongoing' ||
                      data?.status === 'completed') && (
                      <>
                        <Divider css={styles.middle}>Case Requirements</Divider>
                        <div css={styles.boxDownload}>
                          {data?.CaseFiles.map((item: Files) => {
                            const url = urlAPI + item.filePath
                            return item.filePath.split('.').pop() === 'mp4' ? (
                              <div key={item.id}>
                                <video width="200" controls>
                                  <source src={url} type="video/mp4" />
                                </video>
                              </div>
                            ) : (
                              <div key={item.id} css={styles.img}>
                                <a onClick={() => onClickImg(url)}>
                                  <img
                                    width="150"
                                    height="100"
                                    alt="case-img"
                                    src={url}
                                  />
                                </a>
                              </div>
                            )
                          })}
                        </div>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell
                                variant="head"
                                style={{ fontWeight: 700 }}
                              >
                                Requirement
                              </TableCell>
                              <TableCell
                                variant="head"
                                style={{ fontWeight: 700 }}
                              >
                                Submit
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {data?.CaseFileRequirement?.map((item: any) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  {item.requirements?.requirementsName}
                                </TableCell>
                                <TableCell>
                                  {item.submitted === true ? (
                                    <CheckCircle color="success" />
                                  ) : (
                                    <Cancel color="error" />
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </>
                    )}
                </>
              ) : (
                <Box display="flex" justifyContent="center">
                  <CircularProgress />
                </Box>
              )}
            </Paper>
            <AssessmentRemark data={data} />
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

interface Files {
  filePath: string
  id: number
}

const styles = {
  dividerTop: css`
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  `,
  box: css`
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
  grid: css`
    margin-top: 0.5em;
  `,
  paper: css`
    padding: 2em;
    margin-bottom: 2em;
    @media (max-width: 600px) {
      padding: 1em;
    }
  `,
  middle: css`
    margin-top: 1.5em;
    margin-bottom: 1.5em;
    font-weight: 700;
  `,
  boxDownload: css`
    margin-top: 1em;
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
  paragraph: css`
    text-indent: 3em;
    text-align: justify;
  `,
  ul: css`
    margin-left: 1em;
    margin-bottom: 1em;
    list-style-type: disc;
  `,
  mb: css`
    margin-bottom: 1.5em;
  `,
  boxAction: css`
    display: flex;
    justify-content: flex-end;
    gap: 1em;
  `,
  boxAction2: css`
    margin-top: 1em;
    display: flex;
    justify-content: flex-end;
    gap: 1em;
  `,
}

export default Case
