-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'SCHEDULED';

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "country" SET DEFAULT 'India';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "discount" DOUBLE PRECISION,
ADD COLUMN     "promoCode" TEXT,
ADD COLUMN     "scheduledFor" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "currency" SET DEFAULT 'INR';
