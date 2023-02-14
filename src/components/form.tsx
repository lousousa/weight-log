import { useState } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { CheckMarkIcon } from '../commons/icons'

export default function Form() {
  const [weight, setWeight] = useState('')

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()

    const date = moment().format('YYYY-MM-DD')

    fetch('/api/weight-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, weight })
    })
      .then(response => response.json())
      .then(data => console.log('success', data))
      .catch(error => console.error('error', error))
  }

  return (
    <>
      <MainForm
        onSubmit={handleSubmit}
      >
        <FormLabel>enter your today's log:</FormLabel>

        <InputWrapper>
          <FormInput
            onChange={e => setWeight(e.target.value)}
          />

          <FormText>
            kg
          </FormText>

          <FormButton>
            <CheckMarkIcon />
          </FormButton>
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

const FormInput = styled.input`
  border: none;
  border-bottom: 1px solid #222;
  font-size: 24px;
  font-weight: 700;
  outline: none;
  text-align: center;
  width: 96px;
`

const FormText = styled.span`
  margin: 0 16px;
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