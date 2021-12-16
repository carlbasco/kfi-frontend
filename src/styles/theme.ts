import { createTheme, responsiveFontSizes } from '@mui/material/styles'

let theme = createTheme({
  palette: {
    primary: {
      light: '#FADBA2',
      main: '#EC851E',
      dark: '#793008',
    },
    secondary: {
      light: '#4283AE',
      main: '#0F3B68',
      dark: '#061F46',
    },
    success: {
      light: '#C8FACD',
      main: '#00AB55',
      dark: '#007B55',
    },
    info: {
      light: '#D0F2FF',
      main: '#32D6E5',
      dark: '#04297A',
    },
    warning: {
      light: '#FFF7CD',
      main: '#FFC107',
      dark: '#B56F1F',
    },
    error: {
      light: '#FFE7D9',
      main: '#DB2023',
      dark: '#B72136',
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: 'Lato, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
          padding: 0,
          margin: 0,
        },
        html: {
          scrollBehavior: 'smooth',
        },
        body: {
          backgroundColor: '#F3F6F9',
          '&::-webkit-scrollbar, *::-webkit-scrollbar': {
            width: '.3em',
            height: '.3em',
          },
          '&::-webkit-scrollbar-thumb, *::-webkit-scrollbar-thumb': {
            border: 'none',
            borderRadius: '1em',
            backgroundColor: 'rgba(0,0,0,.54)',
          },
        },
        ul: { listStyleType: 'none' },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: '10px' },
      },
    },
    MuiButton: {
      styleOverrides: { root: { borderRadius: '10px' } },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        li: {
          fontFamily: 'Montserrat, sans-serif',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          margin: '1em',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: { root: { padding: '0 1.5em' } },
    },
    MuiDialogActions: {
      styleOverrides: { root: { padding: '1em 1.5em' } },
    },
  },
})

theme = responsiveFontSizes(theme)

export default theme
