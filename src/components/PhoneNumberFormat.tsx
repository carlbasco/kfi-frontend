import { forwardRef } from 'react'
import NumberFormat from 'react-number-format'

const PhoneNumberFormat = forwardRef<NumberFormat, Props>(
  function PesoNumberFormat(props, ref) {
    const { onChange, ...other } = props

    return (
      <NumberFormat
        {...other}
        format="+63 ### ### ####"
        placeholder="+63 ### ### ####"
        mask="_"
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          })
        }}
      />
    )
  }
)

interface Props {
  onChange: (event: { target: { name: string; value: string } }) => void
  name: string
}

export default PhoneNumberFormat
