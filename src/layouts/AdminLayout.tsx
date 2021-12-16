/** @jsxImportSource @emotion/react */
import { CustomListItem, NotificationMenu, SettingsMenu } from '@components'
import {
    AccountCircle,
    Class,
    CreditCard,
    Dashboard,
    Description,
    ExpandLess,
    ExpandMore,
    Folder,
    HomeWork,
    ManageAccounts,
    Menu,
    MoreHoriz,
    NoteAlt,
    Room
} from '@mui/icons-material'
import {
    AppBar,
    Avatar,
    Collapse,
    Container,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography
} from '@mui/material'
import { Box } from '@mui/system'
import { ReduxState } from '@redux'
import styles from '@styles/layout'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import logo from '../../public/apple-touch-icon.png'


const AdminLayout = ({ children, window }: Props) => {
  const router = useRouter()
  const user = useSelector((state: ReduxState) => state.auth.user)
  const accountName = `${user.firstName} ${user.lastName}`

  const [mobileOpen, setMobileOpen] = useState(false)
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const [expand, setExpand] = useState(false)

  useEffect(() => {
    if (router.pathname.startsWith('/admin/filemaintenance')) setExpand(true)
  }, [router])

  const handleClickExpand = () => {
    setExpand(!expand)
  }

  const drawer = (
    <>
      <Toolbar css={styles.toolbar}>
        <Avatar
          sx={{ bgcolor: 'secondary.main' }}
          css={styles.accountCircle}
        >
          <AccountCircle fontSize="large" />
        </Avatar>
        <Box css={styles.accountBox}>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            lineHeight={1}
            
          >
            {accountName}
          </Typography>
          <Typography variant="caption" css={styles.accountRole}>
          {user.branchName} - Admin
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List css={styles.list}>
        <CustomListItem
          link="/admin"
          label="Dashboard"
          icon={<Dashboard color="inherit" />}
        />
        <CustomListItem
          link="/admin/budget"
          label="Budget Disbursement"
          icon={<CreditCard color="inherit" />}
        />
        <CustomListItem
          link="/admin/progress"
          label="Progress Note"
          icon={<NoteAlt color="inherit" />}
        />
        <CustomListItem
          link="/admin/accounts"
          label="Accounts"
          icon={<ManageAccounts color="inherit" />}
        />
        <ListItemButton onClick={handleClickExpand} sx={styles.listItemButton}>
          <ListItemIcon css={styles.itemIconBlack}>
            <Folder color="inherit" />
          </ListItemIcon>
          <ListItemText primary="File Maintenance" />
          {expand ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={expand} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <CustomListItem
              label="Address"
              link="/admin/filemaintenance/address"
              nested={true}
              icon={<Room color="inherit" />}
            />
            <CustomListItem
              label="Branch"
              link="/admin/filemaintenance/branch"
              nested={true}
              icon={<HomeWork color="inherit" />}
            />
            <CustomListItem
              label="Case Requirements"
              link="/admin/filemaintenance/case-requirements"
              nested={true}
              icon={<Class color="inherit" />}
            />
            <CustomListItem
              label="Others"
              link="/admin/filemaintenance/others"
              nested={true}
              icon={<MoreHoriz color="inherit" />}
            />
          </List>
        </Collapse>
        <CustomListItem
          link="/admin/reports"
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
            <Box sx={{ flexGrow: 1 }} />
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

export default AdminLayout
