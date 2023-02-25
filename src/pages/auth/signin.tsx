import type { GetServerSidePropsContext, InferGetServerSidePropsType  } from 'next'
import { getProviders, signIn, getSession } from 'next-auth/react'
import styled from 'styled-components'

export default function SignIn({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      {Object.values(providers).map((provider) => (
        <Wrapper key={provider.name}>
          <button onClick={() => signIn(provider.id)}>
            sign in with {provider.name.toLowerCase()}
          </button>
        </Wrapper>
      ))}
    </>
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

const Wrapper = styled.div`
  padding: 20px;
`