import { forwardRef, useImperativeHandle, useState, ReactNode, useRef } from 'react'
import styled from 'styled-components'
import { CloseIcon } from '@/commons/icons'
import { fadeIn, fadeOut, slideUp, slideDown } from '@/commons/animations'

interface IProps {
  title?: String,
  content: ReactNode
}

const Modal = forwardRef((props: IProps, ref: any) => {
  const [isVisible, setVisible] = useState<Boolean>(false)
  const wrapperRef = useRef<HTMLElement | null>(null)
  const { title, content } = props

  useImperativeHandle(ref, () => ({
    open() {
      setVisible(true)
    },
    close() {
      wrapperRef.current?.classList.add('-is-leaving')

      window.setTimeout(() => {
        setVisible(false)
      }, 125)
    },
    closeCheckingTarget(e: MouseEvent) {
      if (e.target !== e.currentTarget) return
      ref.current.close()
    }
  }))

  return (<>
    {isVisible &&
      <ModalWrapper
        ref={wrapperRef}
        onClick={ref?.current?.closeCheckingTarget}
      >
        <InnerWrapper>
          <ModalHeader>
            <TitleWrapper>
              {title}
            </TitleWrapper>

            <CloseButton
              onClick={ref?.current?.close}
            >
              <CloseIcon />
            </CloseButton>
          </ModalHeader>

          <ModalContent>
            {content}
          </ModalContent>
        </InnerWrapper>
      </ModalWrapper>
    }
  </>)
})

Modal.displayName = 'Modal'

export default Modal

const ModalWrapper = styled.main`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, .5);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  animation: ${fadeIn} 125ms forwards;

  > div {
    animation: ${slideUp} 125ms forwards;
  }

  &.-is-leaving {
    animation: ${fadeOut} 125ms forwards;

    > div {
      animation: ${slideDown} 125ms forwards;
    }
  }
`

const InnerWrapper = styled.div`
  background-color: #fff;
  width: 100%;
  max-width: 480px;
  border-radius: 4px;
`

const ModalHeader = styled.header`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #bbb;
  padding: 16px;
`

const TitleWrapper = styled.div`
  width: 100%;
  font-size: 20px;
  line-height: 24px;
  font-weight: 700;
`

const CloseButton = styled.button`
  font-size: 0;
  padding: 8px;
  border: none;
  background-color: #bbb;
  color: #fff;
  border-radius: 50%;
  cursor: pointer;

  svg {
    width: 12px;
  }
`

const ModalContent = styled.div`
  padding: 16px;
`