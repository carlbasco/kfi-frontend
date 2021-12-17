/** @jsxImportSource @emotion/react */
import { TableBarangay, TableCity, TableProvince } from '@components'
import { css } from '@emotion/react'
import { AdminLayout } from '@layouts'
import { Breadcrumbs, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import Head from 'next/head'
import Link from 'next/link'

const Address = () => {
  return (
    <>
      <Head>
        <title>File Maintenance - Kamanggagawa Foundation Inc</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <AdminLayout>
        <Box css={styles.box}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link href="/admin">
              <a css={styles.link}>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  css={styles.linkText}
                >
                  Dashboard
                </Typography>
              </a>
            </Link>
            <Typography variant="subtitle1" fontFamily="inherit">
              File Maintenance
            </Typography>
            <Typography css={styles.linkActive} variant="subtitle1">
              Address
            </Typography>
          </Breadcrumbs>
        </Box>
        <Box>
          <Grid container spacing={1.2}>
            <Grid item xs={12}>
              <TableBarangay />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TableCity />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TableProvince />
            </Grid>
          </Grid>
        </Box>
      </AdminLayout>
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
  tabPanel: css`
    padding-left: 0;
    padding-right: 0;
  `,
}

export default Address
