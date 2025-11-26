-- AlterTable
ALTER TABLE "public"."client" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."client" ADD CONSTRAINT "client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
