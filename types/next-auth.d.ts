import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      userId: string
      username: string
    }
  }

  interface User {
    id: string
    username: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string
    username: string
  }
}
