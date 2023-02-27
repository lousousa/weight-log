import { useRef, useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import styled from 'styled-components'
import moment from 'moment'
import { PlusIcon } from '@/commons/icons'
import { ILogEntry } from '@/types'
import { fadeIn, slideUp } from '../commons/animations'
import { getSession, useSession, signOut } from 'next-auth/react'
import { DefaultSession } from 'next-auth'
import Image from 'next/image'

import Modal from '@/components/modal'
import Form from '@/components/form'
import RingLoader from '@/components/ringLoader'
import ToastService from '@/components/toastService'
import Chart from '@/components/chart'
import MonthlyAverage from '@/components/monthlyAverage'
import { GetServerSidePropsContext } from 'next'

interface IModal {
  open: () => void
  close: () => void
}

export default function Home() {
  const modalRef = useRef<IModal>()
  const toastServiceRef = useRef()
  const modalTitle = moment().format('ll').toLowerCase()
  const [isLoading, setLoading] = useState(true)
  const [content, setContent] = useState([])
  const [user, setUser] = useState<DefaultSession['user'] | null | undefined>(null)
  const { data: session } = useSession()

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

  useEffect(() => {
    if (session) {
      setUser(session.user)
    }
  }, [session])

  const onFormSubmit = () => {
    modalRef.current?.close()
    window.$toastService.alert('data was successfully saved!', 'is-success')
    fetchContent()
  }

  const handleSignOut = () => {
    setLoading(true)
    signOut()
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
          <RingLoaderWrapper>
            <RingLoader
              color='#e4e7f5'
              size='64px'
            />
          </RingLoaderWrapper>
        )}

        {!isLoading && (
          <ContentSection>
            <ContentHeader>
              <TitleText>
                overview
              </TitleText>

              <SignOutWrapper>
                {user?.image && (
                  <UserImageWrapper>
                    <Image
                      src={user.image}
                      alt=''
                      width={40}
                      height={40}
                    />
                  </UserImageWrapper>
                )}

                <SignOutButton
                  onClick={() => handleSignOut()}
                >
                  sign out
                </SignOutButton>
              </SignOutWrapper>
            </ContentHeader>

            <Chart data={content} />

            <MonthlyAverage data={content} />

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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  if (!session)
    return {
      redirect: {
        destination: '/auth/signin'
      }
    }

  return {
    props: { session }
  }
}

const Main = styled.main`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #222222;

  @media screen and (min-width: 600px) {
    padding: 40px 0;
    background-color: #477cff;
  }
`

const ContentSection = styled.div`
  width: 1280px;
  max-width: 100%;
  height: fit-content;
  animation: ${fadeIn} 250ms forwards, ${slideUp} 125ms forwards;
  background-color: #fff;
  padding: 16px;

  @media screen and (min-width: 600px) {
    padding: 40px;
    border-radius: 12px;
  }
`

const TitleText = styled.h1`
  font-size: 24px;
  line-height: 32px;
`

const ContentHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`

const UserImageWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
`

const SignOutWrapper = styled.div`
  width: 60px;
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
`

const SignOutButton = styled.button`
  height: fit-content;
  border: none;
  background: none;
  cursor: pointer;
  color: #2146d1;
  margin-top: 4px;
  display: none;
`

const ActionButton = styled.button`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  margin: 24px auto 0;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  background-color: #7209b7;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 4px #666;

  svg {
    width: 16px;
    margin: 0 auto;
    color: #fff;
  }
`

const RingLoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`