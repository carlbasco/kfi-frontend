import { css } from '@emotion/react'

const drawerWidth = 240
const styles = {
  drawerColorSelected: css`
    color: #fff;
  `,
  drawerColorDefault: css`
    color: #000;
  `,
  listItemButton: {
    pt: '1em',
    pb: '1em',
    '&.Mui-selected ': {
      backgroundColor: 'secondary.main',
    },
    '&.MuiListItem-root:hover': {
      backgroundColor: 'primary.light',
    },
    '&.Mui-selected:hover': {
      backgroundColor: 'secondary.main',
    },
  },
  listItemButtonNested: {
    pl: '2.5em',
    pt: '.5em',
    pb: '.5em',
    '&.Mui-selected ': {
      backgroundColor: 'secondary.main',
    },
    '&.MuiListItem-root:hover': {
      backgroundColor: 'primary.light',
    },
    '&.Mui-selected:hover': {
      backgroundColor: 'secondary.main',
    },
  },
  appBar: {
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.72)',
    boxShadow: 'none',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    ml: { md: `${drawerWidth}` },
    width: { md: `calc(100% - ${drawerWidth}px)` },
  },
  menuIcon: {
    ml: 0.1,
    mr: 2,
    display: { md: 'none' },
  },
  companyName: {
    color: 'secondary.main',
    pl: '.5em',
    display: { xs: 'none', sm: 'block' },
    lineHeight: 1,
  },
  boxDrawerMain: {
    width: { md: drawerWidth },
    flexShrink: { md: 0 },
  },
  drawerMobile: {
    display: { xs: 'block', md: 'none' },
    '& .MuiDrawer-paper': {
      boxSizing: 'border-box',
      width: drawerWidth,
      backgroundColor: '#d4dfeb',
    },
  },
  drawer: {
    display: { xs: 'none', sm: 'none', md: 'block' },
    '& .MuiDrawer-paper': {
      boxSizing: 'border-box',
      width: drawerWidth,
      backgroundColor: '#d4dfeb70',
    },
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

  iconBtn: css`
    border-radius: 10px;
    border: 1px solid #c7ccd3;
    :hover {
      border: 1px solid #0f3b68;
    }
  `,
  accountCircle: css`
    margin-top: 0.5em;
    margin-right: 0.5em;
    color: #fff;
  `,
  accountBox: css`
    margin-top: 1em;
  `,
  accountTypography: css`
    /* color: #fff; */
  `,
  accountRole: css`
    display: block;
    line-height: 1.2em;
  `,
  list: css`
    margin-top: 0.5em;
  `,
  itemIconBlack: css`
    color: #000;
  `,
  itemIconWhite: css`
    color: #fff;
  `,
  toolbar: css`
    display: flex;
  `,
  aLink: css`
    display: flex;
    text-decoration: none;
    align-items: center;
  `,
}
export default styles
