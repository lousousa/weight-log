import * as React from 'react'
import styled from 'styled-components'

export const Modal = () => {
  return (
    <ModalWrapper>
      <InnerWrapper>
        <h1>modal</h1>
      </InnerWrapper>
    </ModalWrapper>
  )
}

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