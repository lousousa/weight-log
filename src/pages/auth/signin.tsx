import type { GetServerSidePropsContext, InferGetServerSidePropsType  } from 'next'
import { getProviders, signIn, getSession } from 'next-auth/react'
import styled from 'styled-components'
import { GoogleLogoIcon } from '@/commons/icons'
import RingLoader from '@/components/ringLoader'
import { useState } from 'react'

export default function SignIn({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isLoading, setLoading] = useState(false)

  const handleSignIn = (providerId: string) => {
    setLoading(true)
    signIn(providerId)
  }

  return (
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
        <div>
          {Object.values(providers).map((provider) => (
            <div
              key={provider.name}
            >
              <SignInButton
                onClick={() => handleSignIn(provider.id)}
              >
                <GoogleLogoIcon />
                <span>
                  sign in with <b>{provider.name.toLowerCase()}</b>
                </span>
              </SignInButton>
            </div>
          ))}
        </div>
      )}
    </Main>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  if (session)
    return {
      redirect: {
        destination: '/'
      }
    }

  const providers = await getProviders()

  return {
    props: {
      providers: providers ?? []
    }
  }
}

const Main = styled.main`
  height: 100vh;
  background-color: #477cff;
  display: flex;
  justify-content: center;
  align-items: center;
`

const SignInButton = styled.button`
  padding: 12px 24px;
  border: none;
  background-color: #fff;
  color: #222;
  font-size: 14px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;

  > svg {
    height: 32px;
  }
`

const RingLoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`