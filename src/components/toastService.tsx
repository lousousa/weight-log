import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import { fadeIn, fadeOut, slideUp, slideDown } from '@/commons/animations'

enum DisplayState {
  IsShowing = 1,
  IsLeaving = 2
}

type Message = {
  id: number
  content: string
  type: string
  animationState: DisplayState,
  duration: number
}

const ToastService = forwardRef((_, ref) => {
  const messages = useRef<Message[]>([])
  const [tick, setTick] = useState(0)

  const forceUpdate = () => {
    setTick(tick => tick + 1)
  }

  const removeMessage = (id: number) => {
    messages.current = messages.current.filter(message => message.id !== id)
    forceUpdate()
  }

  const runToast = (id: number) => {
    const current = messages.current.find(message => message.id === id)
    if (!current) return

    forceUpdate()

    setTimeout(() => {
      current.animationState = 2
      forceUpdate()
    }, current.duration)

    setTimeout(() => {
      removeMessage(id)
    }, current.duration + 150)
  }

  useImperativeHandle(ref, () => ({
    alert(content: string, type = 'is-success', duration = 3000) {
      if (!content) return

      if (!['is-success', 'is-info', 'is-warning', 'is-error'].includes(type)) return

      const id = new Date().valueOf()

      messages.current.push({
        id,
        content,
        type,
        animationState: 1,
        duration
      })

      runToast(id)
    }
  }))

  return (<ToastSection>
    {messages.current.map((message) => (
      <ToastMessageWrapper
        key={`toast_message_${message.id}`}
      >
        <ToastMessage
          className={`-${ message.type } `.concat(classNames({
            '-is-showing': message.animationState === 1,
            '-is-leaving': message.animationState === 2
          }))}
        >
          <span>{message.content}</span>
        </ToastMessage>
      </ToastMessageWrapper>
    ))}
  </ToastSection>)
})

const ToastSection = styled.div`
  position: fixed;
  inset: auto 0 0;
  display: grid;
  grid-template-columns: 1fr;
`

const ToastMessageWrapper = styled.div`
  padding: 0 20px 20px;
`

const ToastMessage = styled.div`
  position: relative;
  z-index: 999;
  padding: 12px;
  border-radius: 3px;
  background-color: #222;
  color: #fff;
  max-width: 480px;
  width: fit-content;
  margin: 0 auto;
  font-size: 16px;
  line-height: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .6);

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