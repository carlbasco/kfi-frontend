/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Close, Visibility, VisibilityOff } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    TextField
} from '@mui/material'
import { Auth, ReduxState } from '@redux'
import {
    ChangePasswordDefaultValues,
    ChangePasswordForm,
    ChangePasswordFormYup
} from '@validation'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'


const ChangePasswordDialog = ({ open, handleDialog }: Props) => {
  const dispatch = useDispatch()
  const authState = useSelector((state: ReduxState) => state.auth)

  const [showOldPassword, setShowOldPassword] = useState(false)
  const handleClickShowOldPassword = () => {
    setShowOldPassword(!showOldPassword)
  }
  const [showNewPassword, setShowNewPassword] = useState(false)
  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword)
  }
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: ChangePasswordDefaultValues,
    resolver: yupResolver(ChangePasswordFormYup),
  })

  const handleCloseDialog = () => {
    reset()
    handleDialog()
  }

  const onSubmit: SubmitHandler<ChangePasswordForm> = (values) => {
    dispatch(Auth.changePassword(values))
    handleCloseDialog()
  }

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="xs"
        open={open}
        onClose={handleCloseDialog}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle css={styles.dialogTitle}>
            Change Password
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Controller
              name="oldPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="oldPassword"
                  margin="dense"
                  label="Old Password"
                  error={Boolean(errors.oldPassword)}
                  helperText={errors.oldPassword?.message}
                  type={showOldPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          css={styles.iconBtn}
                          onClick={handleClickShowOldPassword}
                        >
                          {showOldPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="newPassword"
                  margin="dense"
                  label="New Password"
                  error={Boolean(errors.newPassword)}
                  helperText={errors.newPassword?.message}
                  type={showNewPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          css={styles.iconBtn}
                          onClick={handleClickShowNewPassword}
                        >
                          {showNewPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="confirmPassword"
                  margin="dense"
                  label="Confirm Password"
                  error={Boolean(errors.confirmPassword)}
                  helperText={errors.confirmPassword?.message}
                  type={showConfirmPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          css={styles.iconBtn}
                          onClick={handleClickShowConfirmPassword}
                        >
                          {showConfirmPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </DialogContent>
          <DialogActions css={styles.dialogAction}>
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={authState.fetchRequest}
            >
              Change Password
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

interface Props {
  open: boolean
  handleDialog: () => void
}

const styles = {
  dialogTitle: css`
    margin: 0;
    padding: 1em;
  `,

  iconBtn: css`
    border: none;
  `,

  dialogAction: css`
    padding: 8px 24px 16px;
  `,
}

export default ChangePasswordDialog
