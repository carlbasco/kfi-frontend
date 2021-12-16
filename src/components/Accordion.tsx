import { ArrowForwardIosSharp } from '@mui/icons-material'
import {
    Accordion as MuiAccordion, AccordionDetails as MuiAccordionDetails,
    AccordionProps, AccordionSummary as MuiAccordionSummary, AccordionSummaryProps
} from '@mui/material'
import { styled } from '@mui/system'

const StyledAccordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  border: `1px solid rgba(0, 0, 0, .125)`,
  '&:before': {
    display: 'none',
  },
}))

const StyledAccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharp sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(() => ({
  backgroundColor: 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: '1em',
  },
}))

const StyledAccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}))

export { StyledAccordion, StyledAccordionDetails, StyledAccordionSummary }

