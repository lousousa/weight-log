import { forwardRef, useImperativeHandle, useState, ReactNode } from 'react'
import styled from 'styled-components'
import { CloseIcon } from '../icons'

interface IProps {
  children: ReactNode
}

export const Modal = forwardRef((props: IProps, ref: any) => {
  const [isVisible, setVisible] = useState<Boolean>(false)
  const { children } = props

  useImperativeHandle(ref, () => ({
    open() {
      setVisible(true)
    },
    close() {
      setVisible(false)
    }
  }))

  return (<>
    {isVisible &&
      <ModalWrapper>
        <InnerWrapper>
          <ModalHeader>
            <CloseButton
              onClick={ref?.current?.close}
            >
              <CloseIcon />
            </CloseButton>
          </ModalHeader>

          {children}
        </InnerWrapper>
      </ModalWrapper>
    }
  </>)
})

const ModalWrapper = styled.main`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, .5);
  display: flex;
  justify-content: center;
  align-items: center;
`

const InnerWrapper = styled.div`
  background-color: #fff;
  max-width: 1100px;
  border-radius: 4px;
  padding: 20px;
`

const ModalHeader = styled.header`
  display: flex;
  justify-content: right;
`

const CloseButton = styled.button`
  font-size: 0;
  padding: 10px;
  border: none;
  background-color: #d00;
  color: #fff;
  border-radius: 50%;
  cursor: pointer;

  svg {
    width: 12px;
  }
`