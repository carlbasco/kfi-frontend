/** @jsxImportSource @emotion/react */
import {
    StyledAccordion,
    StyledAccordionDetails,
    StyledAccordionSummary
} from '@components'
import { css } from '@emotion/react'
import { ArrowForwardIosSharp } from '@mui/icons-material'
import { Chip, Paper, Typography } from '@mui/material'
import { Box } from '@mui/system'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { SyntheticEvent, useState } from 'react'


dayjs.extend(localizedFormat)

const AssessmentRemark = ({ data }: any) => {
  const [expanded, setExpanded] = useState<number | false>(false)
  const handleChange =
    (panel: number) => (e: SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false)
    }
  return (
    <>
      {data && data?.Assessment?.AssessmentRemark && (
        <Paper variant="outlined" css={styles.paper}>
          <Typography fontWeight={700} textAlign="center" variant="subtitle1">
            Program Head remarks on Case Assessment
          </Typography>
          {data?.Assessment?.AssessmentRemark?.map((item: any) => (
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
                  <ArrowForwardIosSharp sx={{ fontSize: '0.9rem' }} />
                }
              >
                <Typography>
                  {dayjs(item?.createdAt).format('L [ at ] hh:mm a')}
                </Typography>
              </StyledAccordionSummary>
              <StyledAccordionDetails>
                <Box display="inline-flex" alignItems="center">
                  <Typography variant="subtitle1">Status: &nbsp;</Typography>
                  {item?.status === 'accepted' ? (
                    <Chip
                      size="small"
                      color="success"
                      variant="outlined"
                      label={item?.status}
                    />
                  ) : (
                    <Chip
                      size="small"
                      color="error"
                      variant="outlined"
                      label={item?.status}
                    />
                  )}
                </Box>
                <Typography variant="body1" css={styles.paragraph}>
                  {item?.remark}
                </Typography>
              </StyledAccordionDetails>
            </StyledAccordion>
          ))}
        </Paper>
      )}
    </>
  )
}

const styles = {
  paper: css`
    padding: 2em;
    margin-bottom: 2em;
    @media (max-width: 600px) {
      padding: 1em;
    }
  `,
  paragraph: css`
    text-indent: 3em;
    text-align: justify;
  `,
}
export default AssessmentRemark
