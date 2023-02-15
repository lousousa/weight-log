import { useRef, useState, useEffect } from 'react'
import Head from 'next/head'
import styled from 'styled-components'
import moment from 'moment'
import { PlusIcon } from '@/commons/icons'
import { ILogEntry } from '@/types'

import Modal from '@/components/modal'
import Form from '@/components/form'

interface IModal {
  open: () => void
}

export default function Home() {
  const modalRef = useRef<IModal>()
  const modalTitle = moment().format('ll')
  const [isLoading, setLoading] = useState(true)
  const [content, setContent] = useState([])
  const dataFetchedRef = useRef(false)

  const onAddActionHandler = () => modalRef.current?.open()

  useEffect(() => {
    const fetchContent = async () => {
      if (dataFetchedRef.current) return
      dataFetchedRef.current = true

      try {
        const response = await fetch('/api/weight-log')
        const data = await response.json()

        data.sort((a: ILogEntry, b: ILogEntry) => a.date > b.date ? -1 : 1)

        setContent(data)
        setLoading(false)
      } catch (error) {
        console.error(error)
      }
    }

    fetchContent()
  })

  return (
    <>
      <Head>
        <title>Weight Log</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        {!isLoading && (<>
          <h1>welcome</h1>

          <DataSection>
            {content.map((item: ILogEntry, idx) => (
              <p key={`log_entry_${idx}`}>
                <b>{moment(item.date).format('DD/MM/YYYY')}:</b> {item.weight}
              </p>
            ))}
          </DataSection>

          <ActionButton
            onClick={onAddActionHandler}
          >
            <PlusIcon />
          </ActionButton>
        </>)}

        <Modal
          ref={modalRef}
          title={modalTitle}
          content={Form()}
        />
      </Main>
    </>
  )
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  min-height: 100vh;
`

const DataSection = styled.section`
  margin: 16px 0%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 8px 16px;
`

const ActionButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  background-color: #ef233c;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 4px #666;

  svg {
    width: 16px;
    margin: 0 auto;
    color: #fff;
  }
`