import { useState } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import classNames from 'classnames'
import { CheckMarkIcon } from '../commons/icons'

import WeightInput from '@/components/weightInput'
import RingLoader from '@/components/ringLoader'


export default function Form() {
  const [weight, setWeight] = useState('')
  const [isLoading, setLoading] = useState(false)

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setLoading(true)

    const date = moment().format('YYYY-MM-DD')

    window.setTimeout(() => {
      setLoading(false)

      window.$toastService.alert('successfully saved!')
    }, 2000)

    return

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


          <FormButton
            className={classNames({
              '-is-disabled': isLoading
            })}
            disabled={isLoading}
          >
            {isLoading && (
              <RingLoader
                color='#ffffff'
                size='24px'
              />
            )}

            {!isLoading && (
              <CheckMarkIcon />
            )}
          </FormButton>

      </InputWrapper>
    </MainForm>
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
  transition: background-color 125ms;
  cursor: pointer;
  font-size: 24px;

  &.-is-disabled {
    background-color: #c0f170;
  }

  svg {
    height: 24px;
    color: #fff;
  }

  .ring-loader {
    margin: 2px 0 -2px 0;
  }
`