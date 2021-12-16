import {
    SnackbarOrigin,
    SnackbarProvider,
    useSnackbar,
    VariantType,
    WithSnackbarProps
} from 'notistack'
import { FC } from 'react'

interface InterfaceSnackBarProps {
  setUseSnackbarRef: (showSnackbar: WithSnackbarProps) => void
}

const InnerSnackbarUtilsConfigurator: FC<InterfaceSnackBarProps> = (
  props: InterfaceSnackBarProps
) => {
  props.setUseSnackbarRef(useSnackbar())
  return null
}

let useSnackbarRef: WithSnackbarProps
const setUseSnackbarRef = (useSnackbarRefProp: WithSnackbarProps) => {
  useSnackbarRef = useSnackbarRefProp
}

const SnackbarConfig = () => {
  return (
    <InnerSnackbarUtilsConfigurator setUseSnackbarRef={setUseSnackbarRef} />
  )
}

const SnackBar = {
  success(msg: string) {
    this.toast(msg, 'success')
  },
  warning(msg: string) {
    this.toast(msg, 'warning')
  },
  info(msg: string) {
    this.toast(msg, 'info')
  },
  error(msg: string) {
    this.toast(msg, 'error')
  },
  toast(msg: string, variant: VariantType = 'default') {
    useSnackbarRef.enqueueSnackbar(msg, { variant })
  },
}

const anchorOrigin: SnackbarOrigin = {
  vertical: 'bottom',
  horizontal: 'right',
}

const NotiStackProvider: FC = ({ children }) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={5000}
      anchorOrigin={anchorOrigin}
    >
      <SnackbarConfig />
      {children}
    </SnackbarProvider>
  )
}

export { NotiStackProvider }
export default SnackBar
