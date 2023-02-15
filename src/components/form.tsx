import { useState } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { CheckMarkIcon } from '../commons/icons'
import WeightInput from '../components/weightInput'

export default function Form() {
  const [weight, setWeight] = useState('')
  const [isLoading, setLoading] = useState(false)

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setLoading(true)

    const date = moment().format('YYYY-MM-DD')

    try {
      await fetch('/api/weight-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, weight })
      })

      setLoading(false)
    } catch(error) {
      console.error('error', error)
    }
  }

  return (
    <>
      <MainForm
        onSubmit={handleSubmit}
      >
        <FormLabel>enter your today&apos;s log:</FormLabel>

        <InputWrapper>
          <WeightInput
            setWeight={setWeight}
          />

          <FormText>
            kg
          </FormText>

          {!isLoading && (
            <FormButton>
              <CheckMarkIcon />
            </FormButton>
          )}
        </InputWrapper>
      </MainForm>
    </>
  )
}

const MainForm = styled.form`
  margin: 0 auto;
  max-width: 240px;
  text-align: center;
  padding: 64px 0;
  font-size: 18px;
`

const FormLabel = styled.p`
  margin-bottom: 16px;
  line-height: 32px;
`

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const FormText = styled.span`
  margin: 0 16px;
  font-weight: 700;
`

const FormButton = styled.button`
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #8ac926;

  svg {
    width: 16px;
    color: #fff;
  }
`