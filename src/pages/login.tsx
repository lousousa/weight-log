import {useSession, signIn, signOut} from 'next-auth/react'

export default function Login() {
  const {data: session} = useSession()

  if (session)
    return (
      <div>
        <h1>welcome, {session.user?.name}</h1>
        <button onClick={() => signOut()}>sign out</button>
      </div>
    )

  return (
    <div>
      <h1>you're not signed in.</h1>
      <button onClick={() => signIn()}>sign in</button>
    </div>
  )
}