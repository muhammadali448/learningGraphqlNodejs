# Migration `20200908172926-init`

This migration has been generated by cq-m-ali at 9/8/2020, 10:29:26 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "dev"."User" (
"email" text   NOT NULL ,
"id" SERIAL,
"name" text   ,
PRIMARY KEY ("id")
)

CREATE TABLE "dev"."Post" (
"authorId" integer   ,
"content" text   ,
"id" SERIAL,
"published" boolean   NOT NULL DEFAULT false,
"title" text   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE UNIQUE INDEX "User.email_unique" ON "dev"."User"("email")

ALTER TABLE "dev"."Post" ADD FOREIGN KEY ("authorId")REFERENCES "dev"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200908172926-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,24 @@
+generator client {
+  provider = "prisma-client-js"
+}
+
+datasource db {
+  provider = "postgresql"
+  url = "***"
+}
+
+model User {
+  email String  @unique
+  id    Int     @default(autoincrement()) @id
+  name  String?
+  posts Post[]
+}
+
+model Post {
+  authorId  Int?
+  content   String?
+  id        Int     @default(autoincrement()) @id
+  published Boolean @default(false)
+  title     String
+  author    User?   @relation(fields: [authorId], references: [id])
+}
```


