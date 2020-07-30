import { Prisma } from './generated/prisma-client'

export interface Context {
  prisma: Prisma
  request: {
    request: any,
    connection: any
  }
}
