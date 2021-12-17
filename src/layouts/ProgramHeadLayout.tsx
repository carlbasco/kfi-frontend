/** @jsxImportSource @emotion/react */
import { CustomListItem, NotificationMenu, SettingsMenu } from '@components'
import {
  AccountCircle,
  CreditCard,
  Dashboard,
  Description,
  Menu,
  NoteAlt
} from '@mui/icons-material'
import {
  AppBar,
  Avatar,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  Toolbar,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import { ReduxState } from '@redux'
import styles from '@styles/layout'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode, useState } from 'react'
import { useSelector } from 'react-redux'
import logo from '../../public/apple-touch-icon.png'

const ProgramHeadLayout = ({ children, window }: Props) => {
  const user = useSelector((state: ReduxState) => state.auth.user)
  const accountName = `${user.firstName} ${user.lastName}`

  const [mobileOpen, setMobileOpen] = useState(false)
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <>
      <Toolbar css={styles.toolbar}>
        <Avatar css={styles.accountCircle} sx={{ bgcolor: 'secondary.main' }}>
          <AccountCircle fontSize="large" />
        </Avatar>
        <Box css={styles.accountBox}>
          <Typography variant="subtitle1" fontWeight={700} lineHeight={1}>
            {accountName}
          </Typography>
          <Typography variant="caption" css={styles.accountRole}>
            {user.branchName} - Program Head
          </Typography>
        </Box>
      </Toolbar>
      <Divider variant="middle" sx={{ mt: '.5em' }} />
      <List css={styles.list}>
        <CustomListItem
          link="/programhead"
          label="Dashboard"
          icon={<Dashboard color="inherit" />}
        />
        <CustomListItem
          link="/programhead/budget"
          label="Budget Disbursement"
          icon={<CreditCard color="inherit" />}
        />
        <CustomListItem
          link="/programhead/progress"
          label="Progress Note"
          icon={<NoteAlt color="inherit" />}
        />
        <CustomListItem
          link="/programhead/reports"
          label="Reports"
          icon={<Description color="inherit" />}
        />
      </List>
    </>
  )
  const container =
    window !== undefined ? () => window().document.body : undefined

  return (
    <>
      <Box display="flex">
        <AppBar position="fixed" sx={styles.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={styles.menuIcon}
            >
              <Menu color="secondary" />
            </IconButton>
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
        </AppBar>
        <Box component="nav" sx={styles.boxDrawerMain}>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            container={container}
            onClose={handleDrawerToggle}
            sx={styles.drawerMobile}
          >
            {drawer}
          </Drawer>
          <Drawer variant="permanent" sx={styles.drawer} open>
            {drawer}
          </Drawer>
        </Box>
        <Container maxWidth="xl" css={styles.mainContent}>
          {children}
        </Container>
      </Box>
    </>
  )
}

interface Props {
  children: ReactNode
  window?: () => Window
}

export default ProgramHeadLayout
