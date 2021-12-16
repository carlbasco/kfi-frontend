/** @jsxImportSource @emotion/react */
import { Education, Income, Occupation, Religion } from '@components'
import { AdminLayout } from '@layouts'
import { Breadcrumbs, Typography } from '@mui/material'
import { Box } from '@mui/system'
import styles from '@styles/filemaintenance'
import Head from 'next/head'
import Link from 'next/link'

const Other = () => {
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
            <Typography fontFamily="inherit" variant="subtitle1">
              File Maintenance
            </Typography>
            <Typography css={styles.linkActive} variant="subtitle1">
              Others
            </Typography>
          </Breadcrumbs>
        </Box>
        <Education />
        <Income />
        <Occupation />
        <Religion />
      </AdminLayout>
    </>
  )
}

export default Other
