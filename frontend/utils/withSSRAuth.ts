import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { destroyCookie, parseCookies } from "nookies"
import { AuthTokenError } from "../errors/AuthTokenError"

export function withSSRAuth<P>(fn: GetServerSideProps<P>): GetServerSideProps {
  return async(ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx) //Passar o primeiro parametro o contexto, porque esta do lado do servidor
    const token = cookies['nextauth.token']
  
    if (!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        }
      }
    }

    try {
      return await fn(ctx);
    } catch (err) {
      if (err instanceof AuthTokenError) {
        destroyCookie(ctx, 'nextauth.token')
        destroyCookie(ctx, 'nextauth.refreshToken')
        
        return {
          redirect: {
            destination: '/',
            permanent: false,
          }
        }
      }
    }
  }
}