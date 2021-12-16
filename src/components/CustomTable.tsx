/** @jsxImportSource @emotion/react */
import { TablePaginationAction } from '@components'
import { css } from '@emotion/react'
import { AddCircle, Search } from '@mui/icons-material'
import {
    Button,
    CircularProgress,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip,
    Typography
} from '@mui/material'
import { Box } from '@mui/system'
import { searchFilter } from '@utils'
import { ChangeEvent, MouseEvent, useState } from 'react'


const CustomTable = ({
  title,
  data,
  header,
  size,
  maxHeight,
  loading,
  addAction,
  actions,
}: TableProps) => {
  const [searchKeyword, setFilterSearch] = useState('')
  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterSearch(e.target.value)
  }

  const results = !searchKeyword ? data : searchFilter(data, searchKeyword)

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const handleChangePage = (
    e: MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (e: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10))
    setPage(0)
  }

  return (
    <>
      <Paper css={styles.paper} variant="outlined">
        <Box css={styles.boxHeader}>
          <Typography variant="h6" gutterBottom css={styles.title}>
            {title}
          </Typography>
          {addAction && (
            <>
              <Button
                size="small"
                color="secondary"
                variant="outlined"
                onClick={addAction}
                startIcon={<AddCircle />}
                sx={styles.desktopBtn}
              >
                New
              </Button>
              <Tooltip title="New" arrow>
                <IconButton
                  color="secondary"
                  onClick={addAction}
                  sx={styles.mobileBtn}
                >
                  <AddCircle />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
        <Grid container css={styles.grid}>
          <Grid item sm={6} />
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              id="search"
              name="search"
              label="Search"
              variant="outlined"
              disabled={loading}
              autoComplete="new-password"
              onChange={handleChangeSearch}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Search />
                  </InputAdornment>
                ),
                sx: { borderRadius: 0 },
              }}
            />
          </Grid>
        </Grid>
        <TableContainer sx={{ maxHeight: maxHeight ? maxHeight : '465px' }}>
          <Table stickyHeader size={size}>
            <TableHead>
              <TableRow>
                {header.map((item, index) => (
                  <TableCell
                    key={index}
                    align={item.align}
                    sx={{ minWidth: item.minWidth }}
                    css={styles.tableCellHeader}
                  >
                    {item.title}
                  </TableCell>
                ))}
                {results && results.length > 0 && actions && (
                  <TableCell align="center" css={styles.tableCellHeader}>
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <>
                  <TableRow>
                    <TableCell colSpan={header.length} align="center">
                      <Box css={styles.tableCellBox}>
                        <CircularProgress />
                        <Typography variant="subtitle1">Loading</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                </>
              ) : data?.length <= 0 || results?.length <= 0 ? (
                <>
                  <TableRow>
                    <TableCell colSpan={header.length} align="center">
                      <Typography variant="subtitle1">
                        No records found
                      </Typography>
                    </TableCell>
                  </TableRow>
                </>
              ) : (
                results
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((rowData, index) => (
                    <TableRow hover key={index}>
                      {header.map(({ field, render, align }, index) =>
                        render ? (
                          <TableCell key={index} align={align}>
                            {render(rowData)}
                          </TableCell>
                        ) : (
                          <TableCell key={index} align={align}>
                            {rowData[field]}
                          </TableCell>
                        )
                      )}
                      {actions && actions.length > 0 && (
                        <TableCell align="center" css={styles.tableCellAction}>
                          {actions.map((item, index) => {
                            if (typeof item === 'function') {
                              const fnItem = item(rowData)
                              if (fnItem.hidden && fnItem.hidden === true)
                                return ''
                              return (
                                <Tooltip
                                  key={index}
                                  title={fnItem.tooltip}
                                  arrow
                                >
                                  <IconButton
                                    onClick={() => fnItem.onClick(rowData)}
                                  >
                                    {fnItem.icon}
                                  </IconButton>
                                </Tooltip>
                              )
                            } else {
                              return (
                                <Tooltip key={index} title={item.tooltip} arrow>
                                  <IconButton
                                    onClick={() => item.onClick(rowData)}
                                  >
                                    {item.icon}
                                  </IconButton>
                                </Tooltip>
                              )
                            }
                          })}
                        </TableCell>
                      )}
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 15, 20, 50, 100]}
          colSpan={3}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          count={results?.length > 0 ? results.length : 0}
          ActionsComponent={TablePaginationAction}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  )
}

const styles = {
  paper: css`
    padding: 1.5em;
    padding-bottom: 0.25em;
  `,
  boxHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5em;
  `,
  grid: css`
    margin-bottom: 1em;
  `,
  title: css`
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
  `,
  tableCellHeader: css`
    font-weight: 700;
  `,
  tablePagination: css`
    margin-top: 2px;
  `,
  tableCellBox: css`
    margin-top: 1em;
    margin-bottom: 1em;
  `,
  tableCellAction: css`
    min-width: 180px;
  `,
  desktopBtn: { display: { xs: 'none', md: 'inherit', borderRadius: 0 } },
  mobileBtn: { display: { md: 'none' } },
}

interface TableProps {
  title: string
  size: 'medium' | 'small'
  loading?: boolean
  maxHeight?: string
  addAction?: () => void
  header: HeaderProps[]
  data: {}[]
  actions?: (ActionProps | ((rowData: any) => ExtendedActionProps))[]
}

interface HeaderProps {
  title: string
  minWidth?: string
  field: string
  align: 'right' | 'left' | 'inherit' | 'center' | 'justify' | undefined
  render?: (rowData: any) => JSX.Element | string
}

interface ActionProps {
  icon: JSX.Element
  tooltip: string
  onClick: (rowData: any) => void
}

interface ExtendedActionProps extends ActionProps {
  hidden?: boolean
}

export default CustomTable
