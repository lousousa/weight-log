import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH2_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_OAUTH2_CLIENT_SECRET || ''
    })
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    async signIn({ user }) {
      const allowList = process.env.ALLOW_LIST?.split(',')
      if (allowList)
        return allowList.includes(user.email || '')

      return false
    },
    async jwt({ token }) {
      return token
    }
  },
  theme: {
    colorScheme: 'light'
  },
  pages: {
    signIn: '/auth/signin'
  }
})