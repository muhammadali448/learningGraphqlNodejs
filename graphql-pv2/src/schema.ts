import { intArg, makeSchema, objectType, stringArg } from '@nexus/schema'
import { nexusPrismaPlugin } from 'nexus-prisma'

const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.email()
    t.model.posts({
      pagination: false,
    })
    t.model.profile()
  },
})

const Profile = objectType({
  name: 'Profile',
  definition(t) {
    t.model.id()
    t.model.bio()
    t.model.user()
  },
})

const Post = objectType({
  name: 'Post',
  definition(t) {
    t.model.id()
    t.model.title()
    t.model.content()
    t.model.published()
    t.model.author()
  },
})

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.crud.post()

    t.list.field('feed', {
      type: 'Post',
      resolve: (_parent, _args, ctx) => {
        return ctx.prisma.post.findMany({
          where: { published: true },
        })
      },
    })

    t.list.field('filterPosts', {
      type: 'Post',
      args: {
        searchString: stringArg({ nullable: true }),
      },
      resolve: (_, { searchString }, ctx) => {
        return ctx.prisma.post.findMany({
          where: {
            OR: [
              { title: { contains: searchString } },
              { content: { contains: searchString } },
            ],
          },
        })
      },
    })
  },
})

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.crud.deleteOnePost()
    t.field('createUser', {
      type: 'User',
      args: {
        email: stringArg({ nullable: false }),
        name: stringArg({ nullable: false }),
        bio: stringArg({ nullable: false }),
      },
      resolve: (_, { email, name, bio }, ctx) => {
        return ctx.prisma.user.create({
          data: {
            email,
            name,
            profile: {
              create: {
                bio,
              },
            },
          },
        })
      },
    })
    t.field('updateUserBio', {
      type: 'User',
      args: {
        email: stringArg({ nullable: false }),
        bio: stringArg({ nullable: false }),
      },
      resolve: (_, { email, bio }, ctx) => {
        return ctx.prisma.user.update({
          where: {
            email,
          },
          data: {
            profile: {
              update: {
                bio,
              },
            },
          },
        })
      },
    })
    t.field('createDraft', {
      type: 'Post',
      args: {
        title: stringArg({ nullable: false }),
        content: stringArg(),
        authorEmail: stringArg({ nullable: false }),
      },
      resolve: (_, { title, content, authorEmail }, ctx) => {
        return ctx.prisma.post.create({
          data: {
            title,
            content,
            published: false,
            author: {
              connect: { email: authorEmail },
            },
          },
        })
      },
    })
    t.field('createProfile', {
      type: 'Profile',
      args: {
        bio: stringArg({ nullable: false }),
        authorEmail: stringArg({ nullable: false }),
      },
      resolve: (_, { bio, authorEmail }, ctx) => {
        return ctx.prisma.profile.create({
          data: {
            bio,
            User: {
              connect: {
                email: authorEmail,
              },
            },
          },
        })
      },
    })

    t.field('publish', {
      type: 'Post',
      nullable: true,
      args: {
        id: intArg(),
      },
      resolve: (_, { id }, ctx) => {
        return ctx.prisma.post.update({
          where: { id: Number(id) },
          data: { published: true },
        })
      },
    })
  },
})

export const schema = makeSchema({
  types: [Query, Mutation, Post, User, Profile],
  plugins: [nexusPrismaPlugin()],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  typegenAutoConfig: {
    contextType: 'Context.Context',
    sources: [
      {
        source: '@prisma/client',
        alias: 'prisma',
      },
      {
        source: require.resolve('./context'),
        alias: 'Context',
      },
    ],
  },
})
