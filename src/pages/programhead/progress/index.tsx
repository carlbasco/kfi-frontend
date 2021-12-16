/** @jsxImportSource @emotion/react */
import { CustomTable } from '@components'
import { ProgramHeadLayout } from '@layouts'
import { Visibility } from '@mui/icons-material'
import { Chip } from '@mui/material'
import Head from 'next/head'
import { useRouter } from 'next/router'
import useSWR from 'swr'


const ProgressNote = () => {
  const router = useRouter()
  const { data } = useSWR('/api/progressnote')

  return (
    <>
      <Head>
        <title>Progress Note - Kamanggagawa Foundation Inc</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <ProgramHeadLayout>
        <CustomTable
          size="small"
          title="Progress Note"
          loading={!data}
          data={data}
          header={[
            {
              title: 'Case',
              field: 'caseId',
              align: 'left',
              minWidth: '130px',
            },
            {
              title: 'Status',
              field: 'status',
              align: 'center',
              render: (rowData) =>
                rowData?.status === 'completed' ? (
                  <Chip size="small" color="success" label="completed" />
                ) : (
                  <Chip size="small" label={rowData?.status} color="primary" />
                ),
            },
            {
              title: 'Date Created',
              field: 'createdAt',
              align: 'center',
              render: (rowData) => new Date(rowData.createdAt).toDateString(),
            },
            {
              title: 'Last Update',
              field: 'updatedAt',
              align: 'center',
              render: (rowData) =>
                rowData?.updatedAt
                  ? new Date(rowData?.updatedAt).toDateString()
                  : '-',
            },
          ]}
          actions={[
            {
              icon: <Visibility color="secondary" />,
              tooltip: 'View',
              onClick: (rowData) => router.push(`/programhead/progress/${rowData.id}`),
            },
          ]}
        />
      </ProgramHeadLayout>
    </>
  )
}

export default ProgressNote
