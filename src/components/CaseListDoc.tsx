/* eslint-disable jsx-a11y/alt-text */
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View
} from '@react-pdf/renderer'
import { User } from '@redux'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { ReactNode } from 'react'

dayjs.extend(localizedFormat)

const CaseListDoc = ({ data, user }: { data: any; user: User }) => {
  return (
    <>
      <Document title="Case List">
        <Page size="LETTER" style={styles.page} orientation="portrait">
          <View fixed style={styles.headerBox}>
            <Image style={styles.logo} src="/logo.png" />
            <Text style={styles.titleHeader}>Kamangagawa Foundation Inc.</Text>
            <Text style={styles.subtitleHeader}>
              UNTV Station: 909 EDSA, PHILAM Homes, Quezon City
            </Text>
            <Text style={styles.subtitleHeader2}>+632.442.6244</Text>
          </View>
          <Text style={styles.title}>Case List</Text>
          <Table>
            <TableRow>
              <TableHeaderCell>Case ID</TableHeaderCell>
              <TableHeaderCell>Branch</TableHeaderCell>
              <TableHeaderCell>Social Worker</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Start Date</TableHeaderCell>
              <TableHeaderCell>End Date</TableHeaderCell>
            </TableRow>
            {data?.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCellCenter>{item.branch?.branchName}</TableCellCenter>
                <TableCellCenter>
                  {item.createdBy?.firstName}&nbsp;{item.createdBy?.lastName}
                </TableCellCenter>
                <TableCellCenter>
                  {item.status === 'pendingForAssessment'
                    ? 'pending for assessment'
                    : item.status === 'pendingForReview'
                    ? 'pending for review'
                    : item?.status === 'ongoing'
                    ? 'on-going'
                    : item.status}
                </TableCellCenter>
                <TableCellCenter>
                  {item?.startDate ? dayjs(item?.startDate).format('L') : '-'}
                </TableCellCenter>
                <TableCellCenter>
                  {item?.endDate ? dayjs(item?.endDate).format('L') : '-'}
                </TableCellCenter>
              </TableRow>
            ))}
          </Table>
          <View style={styles.footerBox} fixed>
            <View style={styles.Row}>
              <Text style={styles.subtitleFooter}>Generate by:&nbsp;</Text>
              <Text style={styles.textFooter}>
                {user.firstName} {user.lastName}
              </Text>
            </View>
          </View>
        </Page>
      </Document>
    </>
  )
}

interface Props {
  children: ReactNode
}

const Table = ({ children }: Props) => (
  <View style={styles.table}>{children}</View>
)
const TableRow = ({ children }: Props) => (
  <View style={styles.tableRow}>{children}</View>
)
const TableHeaderCell = ({ children }: Props) => (
  <View style={styles.tableCellHeader}>
    <Text style={styles.headerTxt}>{children}</Text>
  </View>
)

const TableCell = ({ children }: Props) => (
  <View style={styles.tableCell}>
    <Text style={styles.txt}>{children}</Text>
  </View>
)
const TableCellCenter = ({ children }: Props) => (
  <View style={styles.tableCell}>
    <Text style={styles.txtCenter}>{children}</Text>
  </View>
)

const styles = StyleSheet.create({
  page: {
    paddingTop: 25,
    paddingBottom: 25,
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 13,
    fontFamily: 'OpenSans',
    fontWeight: 700,
    marginBottom: 10,
  },
  table: {
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCellHeader: {
    width: '16.66%',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    width: '16.66%',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  headerTxt: {
    fontFamily: 'OpenSans',
    fontSize: 11,
    fontWeight: 700,
    textAlign: 'center',
  },
  txt: {
    fontFamily: 'OpenSans',
    fontSize: 11,
  },
  txtCenter: {
    fontFamily: 'OpenSans',
    fontSize: 11,
    textAlign: 'center',
  },
  logo: {
    width: 30,
    height: 30,
  },
  headerBox: {
    paddingTop: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleHeader: {
    textAlign: 'center',
    fontSize: 13,
    fontFamily: 'OpenSans',
    fontWeight: 700,
  },
  subtitleHeader: {
    textAlign: 'center',
    fontSize: 9,
    fontFamily: 'OpenSans',
  },
  subtitleHeader2: {
    textAlign: 'center',
    fontSize: 9,
    fontFamily: 'OpenSans',
    marginBottom: 15,
  },
  footerBox: {
    position: 'absolute',
    bottom: 40,
    left: 50,
    right: 0,
  },
  subtitleFooter: {
    fontSize: 9,
    fontWeight: 700,
    fontFamily: 'OpenSans',
  },
  textFooter: {
    fontSize: 9,
    fontFamily: 'OpenSans',
  },
  Row: {
    display: 'flex',
    flexDirection: 'row',
  },
})

Font.register({
  family: 'OpenSans',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/opensans/v13/IgZJs4-7SA1XX_edsoXWog.ttf',
    },
    {
      src: 'https://fonts.gstatic.com/s/opensans/v13/O4NhV7_qs9r9seTo7fnsVKCWcynf_cDxXwCLxiixG1c.ttf',
      fontStyle: 'italic',
    },
    {
      src: 'https://fonts.gstatic.com/s/opensans/v13/k3k702ZOKiLJc3WVjuplzC3USBnSvpkopQaUR-2r7iU.ttf',
      fontWeight: 700,
    },
    {
      src: 'https://fonts.gstatic.com/s/opensans/v13/PRmiXeptR36kaC0GEAetxne1Pd76Vl7zRpE7NLJQ7XU.ttf',
      fontWeight: 700,
      fontStyle: 'italic',
    },
  ],
})

export default CaseListDoc
