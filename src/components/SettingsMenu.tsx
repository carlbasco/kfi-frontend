/** @jsxImportSource @emotion/react */
import { ChangePasswordDialog } from '@components'
import { css } from '@emotion/react'
import { Logout, Password, Settings } from '@mui/icons-material'
import { IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material'
import { Auth, AuthState } from '@redux'
import { MouseEvent, useState } from 'react'
import { useDispatch } from 'react-redux'


const SettingsMenu = () => {
  const dispatch = useDispatch()
  const handleClickLogout = async () => {
    dispatch(Auth.logout())
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (e: MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const [openDialog, setOpenDialog] = useState(false)
  const handleDialog = async () => {
    setOpenDialog(!openDialog)
  }

  return (
    <>
      <IconButton color="secondary" css={styles.iconBtn} onClick={handleClick}>
        <Settings />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleDialog} sx={styles.menuItem}>
          <ListItemIcon>
            <Password />
          </ListItemIcon>
          Change Password
        </MenuItem>
        <MenuItem onClick={handleClickLogout} sx={styles.menuItem}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      {openDialog && (
        <ChangePasswordDialog open={openDialog} handleDialog={handleDialog} />
      )}
    </>
  )
}

interface Props {
  authState: AuthState
  logout: () => Promise<any>
}

const styles = {
  menuItem: {
    '&.MuiMenuItem-root:hover': {
      backgroundColor: 'primary.light',
    },
  },
  iconBtn: css`
    margin-left: 0.5em;
    border-radius: 10px;
    border: 1px solid #c7ccd3;
    :hover {
      border: 1px solid #0f3b68;
    }
  `,
}

export default SettingsMenu
