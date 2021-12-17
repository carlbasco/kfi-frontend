/** @jsxImportSource @emotion/react */
import { NotificationMenu, SettingsMenu } from '@components'
import { css } from '@emotion/react'
import { AccountCircle } from '@mui/icons-material'
import {
  AppBar,
  Avatar,
  Container,
  Tab,
  Tabs,
  Toolbar,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import { ReduxState } from '@redux'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import logo from '../../public/apple-touch-icon.png'

interface Props {
  children: ReactNode
}

interface LinkTabProps {
  href: string
  label: string
}

const SocialWorkerLayout = ({ children }: Props) => {
  const router = useRouter()
  const [value, setValue] = useState(0)

  useEffect(() => {
    router.pathname.startsWith('/branchhead/budget') && setValue(1)
    router.pathname.startsWith('/branchhead/progress') && setValue(2)
    router.pathname.startsWith('/branchhead/accounts') && setValue(3)
    router.pathname.startsWith('/branchhead/reports') && setValue(4)
  }, [router])

  const { user } = useSelector((state: ReduxState) => state.auth)
  const accountName = `${user.firstName} ${user.lastName}`
  return (
    <>
      <Box>
        <AppBar position="fixed" css={styles.appBar}>
          <Container maxWidth="lg">
            <Toolbar disableGutters={true}>
              <Link passHref href="/">
                <a css={styles.aLink}>
                  <Image src={logo} width={40} height={40} alt="logo" />
                  <Typography
                    variant="h6"
                    fontFamily="Open Sans"
                    sx={styles.companyName}
                  >
                    Kamanggagawa Foundation Inc.
                  </Typography>
                </a>
              </Link>
              <Box flexGrow={1} />
              <NotificationMenu />
              <SettingsMenu />
            </Toolbar>
          </Container>
        </AppBar>
        <Container maxWidth="lg" css={styles.mainContent}>
          <Box display="flex" alignItems="center">
            <Avatar sx={{ mr: 1, mt: 1, ml: 2, bgcolor: 'secondary.main' }}>
              <AccountCircle fontSize="large" />
            </Avatar>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight={700} lineHeight={0.6}>
                Hello, {accountName}!
              </Typography>
              <Typography variant="caption">
                {user.branchName} - Branch Head
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              width: '100%',
              borderBottom: 1,
              borderColor: 'divider',
              mb: 4,
            }}
          >
            <Tabs
              allowScrollButtonsMobile
              value={value}
              variant="scrollable"
              sx={{ color: 'secondary.dark' }}
            >
              <LinkTab label="Case" href="/branchhead" />
              <LinkTab label="Budget" href="/branchhead/budget" />
              <LinkTab label="Progress Note" href="/branchhead/progress" />
              <LinkTab label="Accounts" href="/branchhead/accounts" />
              <LinkTab label="Reports" href="/branchhead/reports" />
            </Tabs>
          </Box>
          {children}
        </Container>
      </Box>
    </>
  )
}

const LinkTab = ({ href, label }: LinkTabProps) => {
  return (
    <Link href={href} passHref>
      <Tab label={label} css={styles.tab} />
    </Link>
  )
}

const styles = {
  appBar: css`
    color: #fff;
    backdrop-filter: blur(8px);
    background: transparent;
    box-shadow: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  `,
  companyName: {
    color: 'secondary.main',
    pl: '.5em',
    display: { xs: 'none', sm: 'block' },
    lineHeight: 1,
  },
  mainContent: css`
    flex-grow: 1;
    padding: 1.5em;
    margin-top: 64px;
    @media only screen and (max-width: 600px) {
      padding: 1em;
      margin-top: 56px;
    }
    @media only screen and (max-width: 375px) {
      padding: 1em;
      margin-top: 56px;
    }
  `,
  box: css`
    width: 100%;
  `,
  aLink: css`
    display: flex;
    text-decoration: none;
    align-items: center;
  `,
  tab: css`
    font-weight: 700;
    opacity: unset;
  `,
}

export default SocialWorkerLayout
