/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { ApiAuth, Snackbar } from '@lib'
import { Notifications } from '@mui/icons-material'
import {
  Badge,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useRouter } from 'next/router'
import { MouseEvent, useEffect, useState } from 'react'
import useSWR, { mutate } from 'swr'

dayjs.extend(relativeTime)

const NotificationMenu = () => {
  const router = useRouter()
  const { data: notifApi } = useSWR('/api/notification')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (e: MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const onClickReadNotification = async (id: number, url: string) => {
    router.push(url)
    try {
      await ApiAuth.post('/api/notification/' + id)
      mutate('/api/notification')
    } catch (err) {
      if (err.response?.data) Snackbar.error(err.response?.data?.message)
    }
  }

  const onClickReadAllNotification = async () => {
    try {
      await ApiAuth.post('/api/notification')
      mutate('/api/notification')
    } catch (err) {
      if (err.response?.data) Snackbar.error(err.response?.data?.message)
    }
  }

  const [notifCount, setNotifCount] = useState(0)

  const newBrowserNotification = () => {
    if (notifApi && notifApi?.length > 0) {
      const temp = notifApi.filter((item: any) => item.isRead === false)
      temp.forEach((item: any) => {
        new Notification('Unread Notification', {
          body: item.message,
          tag: item.id,
          renotify: true,
          icon: "/logo.png",
        }).onclick = () => {
          window.focus()
          onClickReadNotification(item.id, item.url)
        }
      })
    }
  }
  const browserNotification = () => {
    if (!('Notification' in window)) {
      Snackbar.info('This browser does not support desktop notification')
    } else {
      if (Notification.permission === 'granted') return newBrowserNotification()
      if (Notification.permission !== 'denied')
        Notification.requestPermission().then(() => newBrowserNotification())
    }
  }

  useEffect(() => {
    if (notifApi && notifApi?.length > 0) {
      const temp = notifApi?.filter((item: any) => item.isRead === false)
      setNotifCount(temp.length)
    } else {
      setNotifCount(0)
    }
    browserNotification()
  }, [notifApi])

  return (
    <>
      <IconButton color="secondary" css={styles.iconBtn} onClick={handleClick}>
        <Badge color="primary" badgeContent={notifCount}>
          <Notifications />
        </Badge>
      </IconButton>
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            borderRadius: '8px',
            width: '270px',
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
        <Box css={styles.boxHeader}>
          <Typography variant="subtitle1" textAlign="center" fontWeight={700}>
            Notifications&nbsp;&nbsp;&nbsp;
          </Typography>
        </Box>
        <Divider />
        <Box css={styles.boxMain}>
          {!notifApi ||
            (notifApi?.length <= 0 && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="body2" align="center">
                  You have 0 notification
                </Typography>
              </Box>
            ))}
          {notifApi &&
            notifApi?.length > 0 &&
            notifApi?.map((item: any) => (
              <MenuItem
                key={item.id}
                sx={styles.menuItem}
                onClick={() => onClickReadNotification(item.id, item.url)}
              >
                <Box
                  css={
                    item.isRead === true ? styles.menuBox : styles.menuBoxActive
                  }
                >
                  <Typography variant="body2" css={styles.notifText}>
                    {item.message}
                  </Typography>
                  <Typography css={styles.notifDate} variant="body2">
                    {dayjs(item.createdAt).fromNow()}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
        </Box>
        <Divider />
        <Box css={styles.boxFooter}>
          <Typography
            variant="subtitle2"
            css={styles.markRead}
            onClick={onClickReadAllNotification}
          >
            mark all as read
          </Typography>
        </Box>
      </Menu>
    </>
  )
}

const styles = {
  menuItem: {
    display: 'block',
    '&.MuiMenuItem-root:hover': {
      backgroundColor: 'secondary.light',
      color: '#fff',
    },
    borderBottom: '1px dashed rgba(0, 0, 0, 0.15)',
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  iconBtn: css`
    margin-left: 0.5em;
    border-radius: 10px;
    border: 1px solid #c7ccd3;
    &:hover {
      border: 1px solid #0f3b68;
    }
  `,
  boxHeader: css`
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 0.1em;
    padding-bottom: 0.2em;
  `,
  boxFooter: css`
    padding-top: 0.3em;
    padding-bottom: 0.2em;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  boxMain: css`
    overflow-x: hidden;
    max-height: 300px;
  `,
  menuBox: css`
    display: block;
    opacity: 0.4;
    &:hover {
      opacity: 0.8;
    }
  `,
  menuBoxActive: css`
    display: block;
  `,
  notifText: css`
    white-space: break-spaces;
    font-weight: bolder;
  `,
  notifDate: css`
    font-size: 0.7em;
    text-align: right;
  `,
  markRead: css`
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    &:hover {
      transform: scale(1.05);
      font-weight: bolder;
    }
  `,
}

export default NotificationMenu
