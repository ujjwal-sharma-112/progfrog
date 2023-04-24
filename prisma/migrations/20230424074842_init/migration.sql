-- CreateTable
CREATE TABLE "User" (
    "u__id" TEXT NOT NULL,
    "username" VARCHAR(60) NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "password" TEXT NOT NULL,
    "dob" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("u__id")
);

-- CreateTable
CREATE TABLE "Post" (
    "p__id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "u__id" TEXT NOT NULL,
    "c__id" TEXT,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("p__id")
);

-- CreateTable
CREATE TABLE "Community" (
    "c__id" TEXT NOT NULL,
    "c_name" VARCHAR(60) NOT NULL,
    "owner__id" TEXT NOT NULL,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("c__id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Community_c_name_key" ON "Community"("c_name");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_u__id_fkey" FOREIGN KEY ("u__id") REFERENCES "User"("u__id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_c__id_fkey" FOREIGN KEY ("c__id") REFERENCES "Community"("c__id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Community" ADD CONSTRAINT "Community_owner__id_fkey" FOREIGN KEY ("owner__id") REFERENCES "User"("u__id") ON DELETE RESTRICT ON UPDATE CASCADE;
