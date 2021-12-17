/** @jsxImportSource @emotion/react */
import { CustomTable } from '@components'
import { BranchHeadLayout } from '@layouts'
import { Visibility } from '@mui/icons-material'
import { Box } from '@mui/system'
import Head from 'next/head'
import { useRouter } from 'next/router'
import useSWR from 'swr'

const Budget = () => {
  const router = useRouter()
  const { data } = useSWR('/api/budget')
  return (
    <>
      <Head>
        <title>File Maintenance - Kamanggagawa Foundation Inc</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <BranchHeadLayout>
        <Box>
          <CustomTable
            size="medium"
            title="Budget"
            loading={!data}
            data={data}
            header={[
              {
                title: 'Case ID',
                field: 'caseId',
                align: 'left',
                minWidth: '130px',
              },
              {
                title: 'Amount',
                field: 'amount',
                align: 'left',
                render: (rowData) => `₱ ${rowData.amount.toLocaleString()}`,
              },
              {
                title: 'Date created',
                field: 'createdAt',
                align: 'center',
                minWidth: '120px',
                render: (rowData) => new Date(rowData.createdAt).toDateString(),
              },
            ]}
            actions={[
              {
                icon: <Visibility color="secondary" />,
                tooltip: 'View',
                onClick: (rowData) =>
                  router.push(`/branchhead/budget/${rowData.caseId}`),
              },
            ]}
          />
        </Box>
      </BranchHeadLayout>
    </>
  )
}

interface CaseBudgetApi {
  id: string
  Background: {
    firstName: string
    lastName: string
    middleName: string | null
  }
  request: {
    id: number
    requestName: string
    budgetFrom: number
    budgetTo: number
  }
  Assessment: {
    recommendation: {
      recommendationName: string
    }
  } | null
}

export default Budget
