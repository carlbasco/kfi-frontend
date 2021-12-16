/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { ListItem, ListItemIcon, ListItemText } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'

const CustomListItem = ({ link, label, icon, nested }: CustomListItemProps) => {
  const router = useRouter()
  return (
    <Link href={link} passHref>
      <ListItem
        button
        sx={nested ? styles.listItemButtonNested : styles.listItemButton}
        selected={router.pathname === link ? true : false}
      >
        <ListItemIcon
          css={
            router.pathname === link
              ? styles.itemIconWhite
              : styles.itemIconBlack
          }
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={label}
          sx={router.pathname === link ? { color: '#fff' } : { color: '#000' }}
        />
      </ListItem>
    </Link>
  )
}

interface CustomListItemProps {
  link: string
  label: string
  icon: JSX.Element
  nested?: boolean
}

const styles = {
  listItemButton: {
    pt: '1em',
    pb: '1em',
    '&.Mui-selected ': {
      backgroundColor: 'primary.main',
    },
    '&.MuiListItem-root:hover': {
      backgroundColor: 'primary.light',
    },
    '&.Mui-selected:hover': {
      backgroundColor: 'primary.main',
    },
  },
  listItemButtonNested: {
    pl: '2.5em',
    pt: '.5em',
    pb: '.5em',
    '&.Mui-selected ': {
      backgroundColor: 'primary.main',
    },
    '&.MuiListItem-root:hover': {
      backgroundColor: 'primary.light',
    },
    '&.Mui-selected:hover': {
      backgroundColor: 'primary.main',
    },
  },
  itemIconBlack: css`
    color: #000;
  `,
  itemIconWhite: css`
    color: #fff;
  `,
}

export default CustomListItem
