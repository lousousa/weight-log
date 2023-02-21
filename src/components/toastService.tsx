import { forwardRef, useImperativeHandle, useState } from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import { fadeIn, fadeOut, slideUp, slideDown } from '@/commons/animations'

enum DisplayState {
  IsShowing = 1,
  IsLeaving = 2
}

type Message = {
  key: number
  content: string
  type: string
  animationState: DisplayState
}

const ToastService = forwardRef((_, ref) => {
  const [currentKey, setCurrentKey] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])

  useImperativeHandle(ref, () => ({
    alert(message: string, type = 'is-success', duration = 3000) {
      if (!message) return

      if (!['is-success', 'is-info', 'is-warning', 'is-error'].includes(type)) return

      setCurrentKey(currentKey + 1)

      messages.push({
        key: currentKey,
        content: message,
        type,
        animationState: 1
      })

      setMessages([...messages])

      setTimeout(() => {
        const message = messages.find(message => message.key === currentKey)

        if (message) {
          message.animationState = 2
          setMessages([...messages])
        }
      }, duration)

      setTimeout(() => {
        setMessages(messages.filter(message => message.key !== currentKey))
      }, duration + 150)
    }
  }))

  return (<ToastWrapper>
    {messages.map((message, idx) => (
      <ToastMessage
        className={`-${ message.type } `.concat(classNames({
          '-is-showing': message.animationState === 1,
          '-is-leaving': message.animationState === 2
        }))}
        key={`toast_message_${idx}`}
      >
        <span>{message.content}</span>
      </ToastMessage>
    ))}
  </ToastWrapper>)
})

const ToastWrapper = styled.div`
  position: fixed;
  inset: 100vh 0 0;
`

const ToastMessage = styled.div`
  position: absolute;
  inset: auto 16px 16px;
  padding: 12px;
  border-radius: 3px;
  background-color: #222;
  color: #fff;
  max-width: 480px;
  margin: 0 auto;

  &.-is-showing {
    animation: ${slideUp} 150ms forwards, ${fadeIn} 150ms forwards;
  }

  &.-is-leaving {
    animation: ${slideDown} 150ms forwards, ${fadeOut} 150ms forwards;
  }

  &.-is-success {
    background-color: #81BB24;
  }

  &.-is-info {
    background-color: #0096c7;
  }

  &.-is-warning {
    background-color: #C9B426;
  }

  &.-is-error {
    background-color: #FF3E45;
  }
`

ToastService.displayName = 'ToastService'

export default ToastService