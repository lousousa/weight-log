import { useRef, useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import styled from 'styled-components'
import moment from 'moment'
import { PlusIcon } from '@/commons/icons'
import { ILogEntry } from '@/types'
import { fadeIn, slideUp } from '../commons/animations'

import Modal from '@/components/modal'
import Form from '@/components/form'
import RingLoader from '@/components/ringLoader'
import ToastService from '@/components/toastService'
import Chart from '@/components/chart'

interface IModal {
  open: () => void
  close: () => void
}

export default function Home() {
  const modalRef = useRef<IModal>()
  const toastServiceRef = useRef()
  const modalTitle = moment().format('ll')
  const [isLoading, setLoading] = useState(true)
  const [content, setContent] = useState([])

  const onAddActionHandler = () => modalRef.current?.open()

  const fetchContent = useCallback(async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/weight-log')
      const data = await response.json()

      data.sort((a: ILogEntry, b: ILogEntry) => a.date > b.date ? -1 : 1)

      setContent(data)
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    window.$toastService = toastServiceRef.current

    fetchContent()
  }, [fetchContent])

  const onFormSubmit = () => {
    modalRef.current?.close()
    window.$toastService.alert('data was successfully saved!', 'is-success')
    fetchContent()
  }

  return (
    <>
      <Head>
        <title>Weight Log</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        {isLoading && (
          <RingLoader
            color='#0096c7'
            size='64px'
          />
        )}

        {!isLoading && (
          <ContentSection>
            <h1>welcome</h1>

            <Chart data={content} />

            <ActionButton
              onClick={onAddActionHandler}
            >
              <PlusIcon />
            </ActionButton>
          </ContentSection>
        )}

        <Modal
          ref={modalRef}
          title={modalTitle}
          content={<Form onSubmit={onFormSubmit} />}
        />

        <ToastService
          ref={toastServiceRef}
        />
      </Main>
    </>
  )
}

const Main = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  min-height: 100vh;
`

const ContentSection = styled.div`
  text-align: center;
  animation: ${fadeIn} 250ms forwards, ${slideUp} 125ms forwards;
`

const ActionButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin: 0 auto;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  background-color: #FF3E45;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 4px #666;

  svg {
    width: 16px;
    margin: 0 auto;
    color: #fff;
  }
`