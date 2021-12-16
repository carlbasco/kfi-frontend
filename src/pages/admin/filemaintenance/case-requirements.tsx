/** @jsxImportSource @emotion/react */
import { Recommendation, Requirements, TypeRequest } from '@components'
import { AdminLayout } from '@layouts'
import { Breadcrumbs, Typography } from '@mui/material'
import { Box } from '@mui/system'
import styles from '@styles/filemaintenance'
import Head from 'next/head'
import Link from 'next/link'

const CaseRequirements = () => {
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
              Case Requirements
            </Typography>
          </Breadcrumbs>
        </Box>
        <Requirements />
        <TypeRequest />
        <Recommendation />
      </AdminLayout>
    </>
  )
}

export default CaseRequirements
