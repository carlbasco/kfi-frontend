/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import {
    FirstPage,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    LastPage
} from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { Box } from '@mui/system'
import { MouseEvent } from 'react'

const TablePaginationActions = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
}: TablePaginationActionsProps) => {
  const handleFirstPageButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, 0)
  }

  const handleBackButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1)
  }

  const handleNextButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1)
  }

  const handleLastPageButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  return (
    <Box css={styles.box}>
      <IconButton
        css={styles.iconBtn}
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        <FirstPage />
      </IconButton>
      <IconButton
        css={styles.iconBtn}
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        css={styles.iconBtn}
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        css={styles.iconBtn}
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        <LastPage />
      </IconButton>
    </Box>
  )
}

interface TablePaginationActionsProps {
  count: number
  page: number
  rowsPerPage: number
  onPageChange: (event: MouseEvent<HTMLButtonElement>, newPage: number) => void
}

const styles = {
  box: css`
    flex-shrink: 0;
    margin-left: 10px;
  `,
  iconBtn: css`
    margin-left: 0.5em;
  `,
}

export default TablePaginationActions
