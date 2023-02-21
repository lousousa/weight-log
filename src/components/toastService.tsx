import { forwardRef, useImperativeHandle, useState } from 'react'
import styled from 'styled-components'

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

      setMessages([...messages, {
        key: currentKey,
        content: message,
        type,
        animationState: 1
      }])

      setTimeout(() => {
        const message = messages.find(message => message.key === currentKey)
        if (message) message.animationState = 2
      }, duration)

      setTimeout(() => {
        setMessages(messages.filter(message => message.key !== currentKey))
      }, duration + 150)
    }
  }))

  return (<ToastWrapper>
    {messages.map((message, idx) => (
      <ToastMessage
        className={`-${ message.type }`}
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
  padding: 12px 8px;
  border-radius: 3px;
  background-color: #222;
  color: #fff;

  &.-is-success {
    background-color: #8ac926;
    color: #222;
  }
`

ToastService.displayName = 'ToastService'

export default ToastService