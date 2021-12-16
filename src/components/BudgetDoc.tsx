/* eslint-disable jsx-a11y/alt-text */
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
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { ReactNode } from 'react'

dayjs.extend(localizedFormat)
const urlAPI = process.env.NEXT_PUBLIC_API_URL!

interface BudgetProps {
  data: any
  user: User
}

const BudgetDoc = ({ data, user }: BudgetProps) => {
  return (
    <>
      <Document title="Budget List">
        <Page size="LETTER" style={styles.page}>
          <View fixed style={styles.headerBox}>
            <Image style={styles.logo} src="/logo.png" />
            <Text style={styles.titleHeader}>Kamangagawa Foundation Inc.</Text>
            <Text style={styles.subtitleHeader}>
              UNTV Station: 909 EDSA, PHILAM Homes, Quezon City
            </Text>
            <Text style={styles.subtitleHeader2}>+632.442.6244</Text>
          </View>
          <Text style={styles.title}>Budget Disbursement</Text>
          <View style={styles.section}>
            <View style={styles.Row}>
              <Text style={styles.subtitle1}>Case ID:</Text>
              <Text style={styles.txt}>{data?.case?.id}</Text>
            </View>
            <View style={styles.Row}>
              <Text style={styles.subtitle1}>Client:</Text>
              <Text style={styles.txt}>
                {data.case.Background?.firstName}&nbsp;&nbsp;
                {data.case.Background?.lastName}
              </Text>
            </View>
            <View style={styles.Row}>
              <Text style={styles.subtitle1}>Type of Request:</Text>
              <Text style={styles.txt}>{data.case?.request?.requestName}</Text>
            </View>
            <View style={styles.Row}>
              <Text style={styles.subtitle1}>Recommendation:</Text>
              <Text style={styles.txt}>
                {data.case?.Assessment?.recommendation?.recommendationName}
              </Text>
            </View>
            <View style={styles.Row}>
              <Text style={styles.subtitle1}>Date Created:</Text>
              <Text style={styles.txt}>
                {dayjs(data?.createdAt).format('L')}
              </Text>
            </View>
            <View style={styles.Row}>
              <Text style={styles.subtitle1}> Amount:</Text>
              <Text style={styles.txt}>
                Php {data?.amount && data?.amount.toLocaleString()}
              </Text>
            </View>
            <View style={styles.Row}>
              <Text style={styles.subtitle1}>Status:</Text>
              <Text style={styles.txt}>{data?.status}</Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.subtitle1}>Liquidation:</Text>
            {data?.BudgetDetail !== null &&
              data?.BudgetDetail.length > 0 &&
              data?.BudgetDetail?.map((item: any) => (
                <View style={styles.section} key={item.id}>
                  <Text style={styles.subtitle2}>
                    {dayjs(item?.createdAt).format('L [ at ] hh:mm a')}
                  </Text>
                  <View style={styles.Row}>
                    <Text style={styles.customSubtitle1}>Status:</Text>
                    <Text style={styles.txt}>{item?.status}</Text>
                  </View>
                  <View style={styles.tableBox}>
                    <Table>
                      <TableRow>
                        <View style={styles.tableCellHeaderArticle}>
                          <Text style={styles.headerTxt}>Particulars</Text>
                        </View>
                        <TableHeaderCellCustom>Quantity</TableHeaderCellCustom>
                        <TableHeaderCellCustom>Unit</TableHeaderCellCustom>
                        <TableHeaderCell>Price</TableHeaderCell>
                        <TableHeaderCell>Total Price</TableHeaderCell>
                      </TableRow>
                      {item?.liquidation !== null &&
                        item?.liquidation.length > 0 &&
                        item?.liquidation?.map((item2: any, i: number) => (
                          <TableRow key={i}>
                            <View style={styles.tableCellArticle}>
                              <Text style={styles.txt}>{item2.article}</Text>
                            </View>
                            <TableCellCenterCustom>
                              {item2.qty}
                            </TableCellCenterCustom>
                            <TableCellCenterCustom>
                              {item2.unit}
                            </TableCellCenterCustom>
                            <TableCellRight>
                              Php{item2.price.toLocaleString()}
                            </TableCellRight>
                            <TableCellRight>
                              Php{(item2.price * item2.qty).toLocaleString()}
                            </TableCellRight>
                          </TableRow>
                        ))}
                      <TableRow>
                        <View
                          style={{
                            width: '80%',
                            borderStyle: 'solid',
                            borderColor: '#bfbfbf',
                            borderWidth: 1,
                            borderLeftWidth: 0,
                            borderTopWidth: 0,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: 'OpenSans',
                              fontSize: 11,
                              textAlign: 'right',
                              paddingLeft: 5,
                              paddingRight: 5,
                              fontWeight: 700,
                            }}
                          >
                            Total Amount
                          </Text>
                        </View>
                        <TableCellRight>
                          Php
                          {item?.liquidation !== null &&
                            item?.liquidation.length > 0 &&
                            item?.liquidation
                              ?.reduce(
                                (total: number, value: any) =>
                                  total + value.qty * value.price,
                                0
                              )
                              .toLocaleString()}
                        </TableCellRight>
                      </TableRow>
                    </Table>
                  </View>
                </View>
              ))}
          </View>
          <View style={styles.section}>
            {data?.BudgetDetail !== null &&
              data?.BudgetDetail.length > 0 &&
              data?.BudgetDetail?.map((item: any) => (
                <View key={item.id}>
                  {item?.BudgetFile !== null &&
                    item?.BudgetFile.length > 0 &&
                    item?.BudgetFile?.map((item2: any) => (
                      <View key={item2.id}>
                        <Image
                          style={{ marginHorizontal: 30, marginVertical: 30 }}
                          src={urlAPI + item2.filePath}
                        />
                      </View>
                    ))}
                </View>
              ))}
          </View>
          <View style={styles.footerBox} fixed>
            <View style={styles.Row}>
              <Text style={styles.subtitleFooter}>Social Worker:&nbsp;</Text>
              <Text style={styles.textFooter}>
                {data?.case?.createdBy?.firstName}&nbsp;
                {data?.case?.createdBy?.lastName}
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}
            >
              {data?.case?.branch?.branchHead !== null && (
                <View style={styles.Row}>
                  <Text style={styles.subtitleFooter}>Branch Head:&nbsp;</Text>
                  <Text style={styles.textFooter}>
                    {data?.case?.branch?.branchHead?.firstName}&nbsp;
                    {data?.case?.branch?.branchHead?.lastName}
                  </Text>
                </View>
              )}
              <View style={styles.Row}>
                <Text style={styles.subtitleFooter}>Generate by:&nbsp;</Text>
                <Text
                  style={{
                    fontSize: 9,
                    fontFamily: 'OpenSans',
                    paddingRight: 60,
                  }}
                >
                  {user.firstName} {user.lastName}
                </Text>
              </View>
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
const TableHeaderCellCustom = ({ children }: TableProps) => (
  <View style={styles.tableCellHeaderCustom}>
    <Text style={styles.headerTxt}>{children}</Text>
  </View>
)
const TableCellCenter = ({ children }: TableProps) => (
  <View style={styles.tableCell}>
    <Text style={styles.txtCenter}>{children}</Text>
  </View>
)
const TableCellCenterCustom = ({ children }: TableProps) => (
  <View style={styles.tableCellCustom}>
    <Text style={styles.txtCenter}>{children}</Text>
  </View>
)
const TableCellRight = ({ children }: TableProps) => (
  <View style={styles.tableCell}>
    <Text style={styles.txtRight}>{children}</Text>
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
    marginBottom: 10,
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
    width: '20%',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeaderArticle: {
    width: '30%',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeaderCustom: {
    width: '15%',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellArticle: {
    width: '30%',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    width: '20%',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellCustom: {
    width: '15%',
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
    width: '50mm',
  },
  subtitle2: {
    fontSize: 11,
    fontWeight: 700,
    fontFamily: 'OpenSans',
  },
  customSubtitle1: {
    fontSize: 11,
    fontWeight: 700,
    fontFamily: 'OpenSans',
    width: '30mm',
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

export default BudgetDoc
