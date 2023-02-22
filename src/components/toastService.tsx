import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
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
  duration: number,
  run?: () => void
}

const ToastService = forwardRef((_, ref) => {
  const [queueId, setQueueId] = useState<number[]>([])
  const [messages, setMessages] = useState<Message[]>([])

  useImperativeHandle(ref, () => ({
    alert(content: string, type = 'is-success', duration = 3000) {
      if (!content) return

      if (!['is-success', 'is-info', 'is-warning', 'is-error'].includes(type)) return

      messages.push({
        id: new Date().valueOf(),
        content,
        type,
        animationState: 1,
        duration
      })

      setMessages([...messages])
    }
  }))

  useEffect(() => {
    if (queueId.length) {
      setTimeout(() => {
        const filtered = messages.filter(message => !queueId.includes(message.id))
        setMessages([...filtered])
      }, 150)
    }
  }, [queueId])

  useEffect(() => {
    if (messages.length) {
      const current = messages[messages.length - 1]
      if (queueId.includes(current.id)) return

      current.run = () => {
        setTimeout(() => {
          current.animationState = 2

          queueId.push(current.id)
          setQueueId([...queueId])
        }, current.duration)
      }

      current.run()
    }
  }, [messages])

  return (<ToastSection>
    {messages.map((message) => (
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

  &.-is-removing {
    display: none;
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