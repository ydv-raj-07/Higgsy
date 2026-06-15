-- CreateEnum
CREATE TYPE "avatarImageType" AS ENUM ('User', 'Model');

-- CreateEnum
CREATE TYPE "statusType" AS ENUM ('Pending', 'Done', 'Error');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avatar" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Avatar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avatarImage" (
    "id" TEXT NOT NULL,
    "avatarId" TEXT NOT NULL,
    "type" "avatarImageType" NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "avatarImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avatarVideo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "startFrame" TEXT,
    "endFrame" TEXT,
    "duration" INTEGER NOT NULL,
    "Width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "status" "statusType" NOT NULL,

    CONSTRAINT "avatarVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avatarVideoReferences" (
    "id" TEXT NOT NULL,
    "avatarVideoId" TEXT NOT NULL,
    "avatarId" TEXT NOT NULL,

    CONSTRAINT "avatarVideoReferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_password_key" ON "User"("password");

-- AddForeignKey
ALTER TABLE "Avatar" ADD CONSTRAINT "Avatar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avatarImage" ADD CONSTRAINT "avatarImage_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Avatar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avatarVideo" ADD CONSTRAINT "avatarVideo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avatarVideoReferences" ADD CONSTRAINT "avatarVideoReferences_avatarVideoId_fkey" FOREIGN KEY ("avatarVideoId") REFERENCES "avatarVideo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avatarVideoReferences" ADD CONSTRAINT "avatarVideoReferences_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Avatar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
