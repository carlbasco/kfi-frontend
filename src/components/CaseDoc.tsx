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

dayjs.extend(localizedFormat)

interface Props {
  data: any
  user: User
}

const urlAPI = process.env.NEXT_PUBLIC_API_URL!

const CaseDoc = ({ data, user }: Props) => {
  return (
    <>
      <Document title={`Case ${data?.id}`}>
        <Page size="LETTER" style={styles.page}>
          <View fixed style={styles.headerBox}>
            <Image style={styles.logo} src="/logo.png" />
            <Text style={styles.titleHeader}>Kamangagawa Foundation Inc.</Text>
            <Text style={styles.subtitleHeader}>
              UNTV Station: 909 EDSA, PHILAM Homes, Quezon City
            </Text>
            <Text style={styles.subtitleHeader2}>+632.442.6244</Text>
          </View>
          <Text style={styles.title}>Case Report</Text>
          <View style={styles.section}>
            <View style={styles.Row}>
              <Text style={styles.subtitle2}>Case ID:</Text>
              <Text style={styles.text}>{data?.id}</Text>
            </View>
            <View style={styles.Row}>
              <Text style={styles.subtitle2}>Branch:</Text>
              <Text style={styles.text}>{data?.branch?.branchName}</Text>
            </View>
            <View style={styles.Row}>
              <Text style={styles.subtitle2}>Status:</Text>
              <Text style={styles.text}>
                {data?.status === 'pendingForAssessment'
                  ? 'pending for assessment'
                  : data?.status === 'pendingForReview'
                  ? 'pending for review'
                  : data?.status === 'ongoing'
                  ? 'on-going'
                  : data?.status}
              </Text>
            </View>
            <View style={styles.Row}>
              <Text style={styles.subtitle2}>Social Worker:</Text>
              <Text style={styles.text}>
                {data?.createdBy?.firstName}&nbsp;{data?.createdBy?.lastName}
              </Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.subtitle1}>Background Information:</Text>
            <View style={styles.Row}>
              <Text style={styles.subtitle2}>Name:</Text>
              <Text style={styles.text}>
                {data?.Background?.firstName}&nbsp;&nbsp;
                {data?.Background?.middleName}&nbsp;&nbsp;
                {data?.Background?.lastName}
              </Text>
            </View>
            {data?.Background?.nickname !== '' && (
              <View style={styles.Row}>
                <Text style={styles.subtitle2}>Nickname:</Text>
                <Text style={styles.text}>{data?.Background.nickname}</Text>
              </View>
            )}
            {data?.Backgroud?.age !== '' && (
              <View style={styles.Row}>
                <Text style={styles.subtitle2}>Age:</Text>
                <Text style={styles.text}>{data.Background.age} yrs. old</Text>
              </View>
            )}
            {data?.Background?.sex !== '' && (
              <View style={styles.Row}>
                <Text style={styles.subtitle2}>Sex:</Text>
                <Text style={styles.text}>{data.Background.sex}</Text>
              </View>
            )}
            {data?.Background?.civilStatus !== '' && (
              <View style={styles.Row}>
                <Text style={styles.subtitle2}>Civil Status:</Text>
                <Text style={styles.text}>{data.Background.civilStatus}</Text>
              </View>
            )}
            {data?.Background?.birtDate !== '' && (
              <View style={styles.Row}>
                <Text style={styles.subtitle2}>BirthDate:</Text>
                <Text style={styles.text}>
                  {dayjs(data.Background.birthDate).format('L')}
                </Text>
              </View>
            )}
            {data?.Background?.religion !== null && (
              <View style={styles.Row}>
                <Text style={styles.subtitle2}>Civil Status:</Text>
                <Text style={styles.text}>
                  {data?.Background.religion?.religionName}
                </Text>
              </View>
            )}
            {data?.Background.education !== null && (
              <View style={styles.Row}>
                <Text style={styles.subtitle2}>Education:</Text>
                <Text style={styles.text}>
                  {data?.Background.education?.educationName}
                </Text>
              </View>
            )}
            {data?.Background.occupation !== null && (
              <View style={styles.Row}>
                <Text style={styles.subtitle2}>Occuptaion:</Text>
                <Text style={styles.text}>
                  {data?.Background.occupation?.occupationName}
                </Text>
              </View>
            )}
            {data?.Background?.income !== null && (
              <View style={styles.Row}>
                <Text style={styles.subtitle2}>Monthly Income:</Text>
                <Text style={styles.text}>
                  Php{data.Background.income?.from.toLocaleString()}
                  &nbsp;&nbsp;-&nbsp;&nbsp;
                  {data.Background.income?.to.toLocaleString()}
                </Text>
              </View>
            )}
            {data?.Background?.phone !== '' && (
              <View style={styles.Row}>
                <Text style={styles.subtitle2}>Contact Number:</Text>
                <Text style={styles.text}>
                  +63&nbsp;{data.Background.phone}
                </Text>
              </View>
            )}
            {data?.Background?.address !== '' &&
              data?.Background?.street !== '' && (
                <View style={styles.Row}>
                  <Text style={styles.subtitle2}>Address:</Text>
                  <Text style={styles.text}>
                    {data?.Background.address}&nbsp;&nbsp;
                    {data?.Background.street}&nbsp;&nbsp;
                  </Text>
                </View>
              )}
            {data?.Background?.barangay !== null &&
              data?.Background?.city !== null &&
              data?.Background?.province !== null && (
                <View style={styles.Row}>
                  <Text style={styles.subtitle2}></Text>
                  <Text style={styles.text}>
                    {data?.Background.barangay?.brgy_name}
                    ,&nbsp;&nbsp;
                    {data?.Background.city?.city_name}
                    ,&nbsp;&nbsp;
                    {data?.Background.province?.province_name}
                    &nbsp;&nbsp;
                  </Text>
                </View>
              )}
          </View>
          {data?.Background?.Family !== null &&
            data?.Background?.Family?.map((item: any) => (
              <View key={item.id}>
                <View style={styles.section}>
                  <Text style={styles.subtitle1}>Family Composition:</Text>
                  <View style={styles.subSection}>
                    <View style={styles.Row}>
                      <Text style={styles.subtitle2}>Name:</Text>
                      <Text style={styles.text}>
                        {item?.firstName}&nbsp;&nbsp;
                        {item?.middleName}&nbsp;&nbsp;
                        {item?.lastName}
                      </Text>
                    </View>
                    {item.age && (
                      <View style={styles.Row}>
                        <Text style={styles.subtitle2}>Age:</Text>
                        <Text style={styles.text}>{item.age} yrs. old</Text>
                      </View>
                    )}
                    {item.education && (
                      <View style={styles.Row}>
                        <Text style={styles.subtitle2}>Education:</Text>
                        <Text style={styles.text}>
                          {item.education.educationName}
                        </Text>
                      </View>
                    )}
                    {item.occupation && (
                      <View style={styles.Row}>
                        <Text style={styles.subtitle2}>Occupation:</Text>
                        <Text style={styles.text}>
                          {item.occupation.occupationName}
                        </Text>
                      </View>
                    )}
                    {item.income && (
                      <View style={styles.Row}>
                        <Text style={styles.subtitle2}>Monthly Income:</Text>
                        <Text style={styles.text}>
                          Php{item.income.from.toLocaleString()}
                          &nbsp;&nbsp;-&nbsp;&nbsp;
                          {item.income.to.toLocaleString()}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}
          <View style={styles.section}>
            <Text style={styles.subtitle1}>Munting Pangarap:</Text>
            <View style={styles.Row}>
              <Text style={styles.subtitle2}>Type of Request:</Text>
              <Text style={styles.text}>{data?.request.requestName}</Text>
            </View>
            <Text style={styles.subtitle2}>Request Summary:</Text>
            <Text style={styles.paragraph}>{data?.requestSummary}</Text>
          </View>
          {data?.note !== null ||
            (data?.note === '' && (
              <View style={styles.section}>
                <Text style={styles.subtitle1}>Program Head Remarks:</Text>
                <Text style={styles.paragraph}>{data.note}</Text>
              </View>
            ))}
          {data?.Assessment !== null && (
            <View style={styles.section}>
              <Text style={styles.subtitle1}>Case Assessment:</Text>
              <Text style={styles.subtitle2}>Findings:</Text>
              <Text style={styles.paragraph}>{data?.Assessment?.findings}</Text>
              <View style={styles.Row}>
                <Text style={styles.subtitle2}>Recommendation:</Text>
                <Text style={styles.paragraph}>
                  {data?.Assessment?.recommendation?.recommendationName}
                </Text>
              </View>
              <Text style={styles.paragraph}>
                {data?.Assessment?.recommendationDetails}
              </Text>
            </View>
          )}
          {data?.Budget !== null && (
            <View style={styles.section}>
              <View style={styles.Row}>
                <Text style={styles.subtitle2}>Budget Amount:</Text>
                <Text style={styles.text}>
                  Php&nbsp;{data?.Budget?.amount.toLocaleString()}
                </Text>
              </View>
            </View>
          )}
          {data?.ProgressNotes !== null &&
            data?.ProgressNotes?.length > 0 &&
            data?.ProgressNotes.map(
              (item: any) =>
                item.status !== 'incomplete' && (
                  <View style={styles.section} key={item.id}>
                    <Text style={styles.subtitle1}>Progress Note:</Text>
                    <View style={styles.Row}>
                      <Text style={styles.subtitle2}>Activity:</Text>
                      <Text style={styles.text}>{item.activity}</Text>
                    </View>
                    <View style={styles.Row}>
                      <Text style={styles.subtitle2}>Date:</Text>
                      <Text style={styles.text}>
                        {dayjs(item.createdAt).format('L')}
                      </Text>
                    </View>
                    <Text style={styles.subtitle2}>Client:</Text>
                    <Text style={styles.paragraph}>{item.client}</Text>
                    <Text style={styles.subtitle2}>Family:</Text>
                    <Text style={styles.paragraph}>{item.family}</Text>
                    <Text style={styles.subtitle2}>Environment:</Text>
                    <Text style={styles.paragraph}>{item.environment}</Text>
                    <Text style={styles.subtitle2}>Church:</Text>
                    <Text style={styles.paragraph}>{item.church}</Text>
                    <Text style={styles.subtitle2}>Livelihood:</Text>
                    <Text style={styles.paragraph}>{item.livelihood}</Text>
                    <Text style={styles.subtitle2}>What Transpired:</Text>
                    <Text style={styles.paragraph}>{item.transpired}</Text>
                    {item?.remark !== '' && (
                      <>
                        <Text style={styles.subtitle2}>
                          Programhead Remarks:
                        </Text>
                        <Text style={styles.paragraph}>{item.client}</Text>
                      </>
                    )}
                  </View>
                )
            )}
          {data?.CaseLetter !== null && data?.CaseLetter?.length > 0 && (
            <View style={styles.section}>
              {data?.CaseLetter !== null &&
                data?.CaseLetter?.length > 0 &&
                data?.CaseLetter?.map((item: any) => (
                  <Image
                    src={urlAPI + item.filePath}
                    key={item.id}
                    style={{ marginHorizontal: 50 }}
                  />
                ))}
            </View>
          )}
          <View style={styles.section}>
            {data?.CaseFiles !== null &&
              data?.CaseFiles?.length > 0 &&
              data?.CaseFiles?.map((item: any) => (
                <Image
                  src={urlAPI + item.filePath}
                  key={item.id}
                  style={{ marginHorizontal: 50 }}
                />
              ))}
          </View>
          <View style={styles.footerBox} fixed>
            <View
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}
            >
              {data?.branch?.branchHead !== null && (
                <View style={styles.Row}>
                  <Text style={styles.subtitleFooter}>Branch Head:&nbsp;</Text>
                  <Text style={styles.textFooter}>
                    {data?.branch?.branchHead?.firstName}&nbsp;
                    {data?.branch?.branchHead?.lastName}
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

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 50,
    paddingBottom: 50,
  },
  title: {
    fontSize: 14,
    fontFamily: 'OpenSans',
    fontWeight: 700,
    marginBottom: 10,
  },
  section: {
    marginTop: 5,
    marginBottom: 5,
  },
  subSection: {
    marginBottom: 5,
  },
  sectionBox: {
    display: 'flex',
    justifyContent: 'center',
  },
  Row: {
    display: 'flex',
    flexDirection: 'row',
  },
  subtitle1: {
    fontSize: 13,
    fontWeight: 700,
    fontFamily: 'OpenSans',
    marginBottom: 5,
  },
  subtitle2: {
    fontSize: 12,
    fontFamily: 'OpenSans',
    fontWeight: 700,
    width: '60mm',
  },
  text: {
    fontSize: 12,
    fontFamily: 'OpenSans',
  },
  paragraph: {
    fontSize: 12,
    fontFamily: 'OpenSans',
    textIndent: 20,
    textAlign: 'justify',
    marginBottom: 10,
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
    bottom: 30,
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

export default CaseDoc
