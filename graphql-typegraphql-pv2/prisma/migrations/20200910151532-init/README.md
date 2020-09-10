# Migration `20200910151532-init`

This migration has been generated by cq-m-ali at 9/10/2020, 8:15:32 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."Post" (
"id" SERIAL,
"title" text   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"content" text   NOT NULL ,
"published" boolean   NOT NULL DEFAULT false,
"authorId" integer   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."User" (
"id" SERIAL,
"name" text   NOT NULL ,
"email" text   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE UNIQUE INDEX "User.email_unique" ON "public"."User"("email")

ALTER TABLE "public"."Post" ADD FOREIGN KEY ("authorId")REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200910151532-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,25 @@
+generator client {
+  provider = "prisma-client-js"
+}
+
+datasource db {
+  provider = "postgresql"
+  url = "***"
+}
+
+model Post {
+  id        Int      @default(autoincrement()) @id
+  title     String
+  createdAt DateTime @default(now())
+  content   String
+  published Boolean  @default(false)
+  authorId  Int
+  author    User     @relation(fields: [authorId], references: [id])
+}
+
+model User {
+  id    Int    @default(autoincrement()) @id
+  name  String
+  email String @unique
+  post  Post[]
+}
```

