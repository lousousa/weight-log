import styled from 'styled-components'
import { CheckMarkIcon } from '../commons/icons'

export default function Form() {
  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()

    fetch('/api/weight-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: '2023-02-13', weight: 84.5 })
    })
      .then(response => response.json())
      .then(data => console.log('success', data))
      .catch(error => console.error('error', error))
  }

  return (
    <>
      <MainForm
        onSubmit={onSubmit}
      >
        <FormLabel>enter your today's log:</FormLabel>

        <InputWrapper>
          <FormInput />

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