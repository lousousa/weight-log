import { forwardRef, useImperativeHandle, useState } from 'react'
import styled from 'styled-components'

export const Modal = forwardRef((_, ref: any) => {
  const [isVisible, setVisible] = useState<Boolean>(false)

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
            <button
              onClick={ref?.current?.close}
            >
              close
            </button>

            <h1>modal</h1>
          </InnerWrapper>
        </ModalWrapper>
      }
    </>
  )
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