/* eslint-disable jsx-a11y/alt-text */
/** @jsxImportSource @emotion/react */

import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'
import { User } from '@redux'
import { ReactNode } from 'react'

interface Props {
  data: any
  user: User
}

const SocialWorkerDoc = ({ data, user }: Props) => {
  return (
    <>
      <Document title="Type of Request Case">
        <Page size="LETTER" style={styles.page}>
          <View fixed style={styles.headerBox}>
            <Image style={styles.logo} src="/logo.png" />
            <Text style={styles.titleHeader}>Kamangagawa Foundation Inc.</Text>
            <Text style={styles.subtitleHeader}>
              UNTV Station: 909 EDSA, PHILAM Homes, Quezon City
            </Text>
            <Text style={styles.subtitleHeader2}>+632.442.6244</Text>
          </View>
          <Text style={styles.title}>Type of Request Case</Text>
          <View style={styles.tableBox}>
            <Table>
              <TableRow>
                <View
                  style={{
                    width: '40%',
                    borderStyle: 'solid',
                    borderColor: '#bfbfbf',
                    borderBottomColor: '#000',
                    borderWidth: 1,
                    borderLeftWidth: 0,
                    borderTopWidth: 0,
                  }}
                >
                  <Text style={styles.headerTxt}>Type of Request</Text>
                </View>
                <TableHeaderCell>Pending</TableHeaderCell>
                <TableHeaderCell>Rejected</TableHeaderCell>
                <TableHeaderCell>On Going</TableHeaderCell>
                <TableHeaderCell>Completed</TableHeaderCell>
              </TableRow>
              {data.map((item: any, i: number) => (
                <TableRow key={item.id}>
                  <View style={styles.tableCellCustom}>
                    <Text style={styles.txt}>{i + 1}.&nbsp;&nbsp;</Text>
                    <Text style={styles.txt}>{item?.requestName}</Text>
                  </View>
                  <TableCellCenter>
                    {
                      item?.Case?.filter(
                        (val: any) =>
                          val.status === 'pending' ||
                          val.status === 'pendingForAssessment' ||
                          val.status === 'pendingForReview'
                      ).length
                    }
                  </TableCellCenter>
                  <TableCellCenter>
                    {
                      item?.Case?.filter(
                        (val: any) => val.status === 'rejected'
                      ).length
                    }
                  </TableCellCenter>
                  <TableCellCenter>
                    {
                      item?.Case?.filter((val: any) => val.status === 'ongoing')
                        .length
                    }
                  </TableCellCenter>
                  <TableCellCenter>
                    {
                      item?.Case?.filter(
                        (val: any) => val.status === 'completed'
                      ).length
                    }
                  </TableCellCenter>
                </TableRow>
              ))}
            </Table>
          </View>
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

interface TableProps {
  children: ReactNode
}

const Table = ({ children }: TableProps) => (
  <View style={styles.table}>{children}</View>
)
const TableRow = ({ children }: TableProps) => (
  <View style={styles.tableRow}>{children}</View>
)
const TableHeaderCell = ({ children }: TableProps) => (
  <View style={styles.tableCellHeader}>
    <Text style={styles.headerTxt}>{children}</Text>
  </View>
)
const TableCellCenter = ({ children }: TableProps) => (
  <View style={styles.tableCell}>
    <Text style={styles.txtCenter}>{children}</Text>
  </View>
)

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 50,
    paddingBottom: 50,
  },
  title: {
    fontSize: 13,
    fontFamily: 'OpenSans',
    fontWeight: 700,
    marginBottom: 5,
  },
  section: {
    marginTop: 10,
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
    width: '15%',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    width: '15%',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellCustom: {
    width: '40%',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    display: 'flex',
    flexDirection: 'row',
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
    paddingLeft: 5,
    paddingRight: 5,
  },
  txtRight: {
    fontFamily: 'OpenSans',
    fontSize: 11,
    textAlign: 'right',
    paddingLeft: 5,
    paddingRight: 5,
  },
  subtitle1: {
    fontSize: 13,
    fontWeight: 700,
    fontFamily: 'OpenSans',
    width: '30mm',
  },
  customSubtitle: {
    fontSize: 11,
    fontWeight: 700,
    fontFamily: 'OpenSans',
    textAlign: 'right',
  },
  Row: {
    display: 'flex',
    flexDirection: 'row',
  },
  customTableCell: {
    width: '80%',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
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
  tableBox: {
    marginTop: 5,
    marginBottom: 15,
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

export default SocialWorkerDoc
