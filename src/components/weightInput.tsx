import { useRef } from 'react'
import styled from 'styled-components'

interface IProps {
  setWeight: React.Dispatch<React.SetStateAction<string>>
  maxLength?: number
}

export default function WeightInput({ setWeight, maxLength = 5 }:IProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const inputCaretToLastPosition = (e: any) => {
    const pos = e.target.value.length
    e.target.focus()
    e.target.setSelectionRange(pos, pos)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    if (!value) return
    value = value.replace(/\D/g, '')
    if (value.length > maxLength - 1) value = value.substring(0, maxLength - 1)
    if (value.length > 1) value = `${ value.substring(0, value.length - 1) }.${ value.substring(value.length - 1) }`

    if (inputRef.current) inputRef.current.value = value
    setWeight(parseFloat(value).toFixed(1))
  }

  return (
    <FormInput
      ref={inputRef}
      type="tel"
      onKeyUp={inputCaretToLastPosition}
      onClick={inputCaretToLastPosition}
      onChange={handleChange}
      placeholder="00.0"
    />
  )
}

const FormInput = styled.input`
  border: none;
  border-bottom: 1px solid #222;
  font-size: 24px;
  font-weight: 700;
  outline: none;
  text-align: center;
  width: 96px;
`