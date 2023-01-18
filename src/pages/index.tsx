import { useRef } from 'react'
import Head from 'next/head'
import styled from 'styled-components'
import { PlusIcon } from '../icons'

import { Modal } from '../components/modal'

interface IModal {
  open: () => void
}

export default function Home() {
  const onAddActionHandler = () => {
    modalRef.current?.open()
  }

  const modalRef = useRef<IModal>()

  return (
    <>
      <Head>
        <title>Weight Log</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        <h1>welcome</h1>

        <ActionButton
          onClick={onAddActionHandler}
        >
          <PlusIcon />
        </ActionButton>

        <Modal ref={modalRef}>
          <p>enter your today's log:</p>
        </Modal>
      </Main>
    </>
  )
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 6rem;
  min-height: 100vh;
`

const ActionButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  background-color: #d00;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 4px #666;

  svg {
    width: 16px;
    margin: 0 auto;
    color: #fff;
  }
`
