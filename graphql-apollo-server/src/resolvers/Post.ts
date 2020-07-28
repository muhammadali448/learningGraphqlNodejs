import { prismaObjectType } from 'nexus-prisma'
import { PrismaObjectTypeNames } from 'nexus-prisma/dist/types'

export const Post = prismaObjectType<"Post">({
    name: 'Post',
    definition(t) {
        t.prismaFields(['*'])
    },
})