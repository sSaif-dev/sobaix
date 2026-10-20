-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Admin', 'SuperAdmin');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CashOnDelivery', 'Visa');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Pending', 'Accepted', 'Cancelled');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled');

-- CreateTable
CREATE TABLE "User" (
    "Id" SERIAL NOT NULL,
    "UserName" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "CustomerProfile" (
    "Id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "PhoneNumber" TEXT NOT NULL,
    "UserId" INTEGER NOT NULL,

    CONSTRAINT "CustomerProfile_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "CustomerAddress" (
    "Id" SERIAL NOT NULL,
    "CustomerProfileId" INTEGER NOT NULL,
    "Label" TEXT NOT NULL,
    "RecipientName" TEXT NOT NULL,
    "RecipientPhone" TEXT NOT NULL,
    "AddressLine" TEXT NOT NULL,
    "City" TEXT NOT NULL,
    "Governorate" TEXT NOT NULL,
    "PostalCode" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerAddress_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Category" (
    "Id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Item" (
    "Id" SERIAL NOT NULL,
    "Title" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Price" DECIMAL(12,2) NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    "CreatedBy" INTEGER NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "ItemImage" (
    "Id" SERIAL NOT NULL,
    "ItemColourId" INTEGER NOT NULL,
    "Url" TEXT NOT NULL,
    "SortIndex" INTEGER NOT NULL,
    "AltText" TEXT NOT NULL,

    CONSTRAINT "ItemImage_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "ItemColour" (
    "Id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "ItemId" INTEGER NOT NULL,
    "HexCode" TEXT NOT NULL,

    CONSTRAINT "ItemColour_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "ItemSize" (
    "Id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "ItemId" INTEGER NOT NULL,

    CONSTRAINT "ItemSize_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "ItemVariant" (
    "Id" SERIAL NOT NULL,
    "ItemId" INTEGER NOT NULL,
    "ItemSizeId" INTEGER NOT NULL,
    "ItemColourId" INTEGER NOT NULL,
    "Quantity" INTEGER NOT NULL,

    CONSTRAINT "ItemVariant_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "Id" SERIAL NOT NULL,
    "OrderId" INTEGER NOT NULL,
    "ItemVariantId" INTEGER NOT NULL,
    "ProductTitle" TEXT NOT NULL,
    "SizeName" TEXT NOT NULL,
    "ColourName" TEXT NOT NULL,
    "Quantity" INTEGER NOT NULL,
    "UnitPrice" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Order" (
    "Id" SERIAL NOT NULL,
    "OrderNumber" TEXT NOT NULL,
    "CustomerProfileId" INTEGER NOT NULL,
    "RecipientName" TEXT NOT NULL,
    "RecipientPhone" TEXT NOT NULL,
    "AddressLine" TEXT NOT NULL,
    "City" TEXT NOT NULL,
    "Governorate" TEXT NOT NULL,
    "PostalCode" TEXT,
    "PaymentMethod" "PaymentMethod" NOT NULL,
    "PaymentStatus" "PaymentStatus" NOT NULL,
    "Status" "Status" NOT NULL,
    "SubTotal" DECIMAL(12,2) NOT NULL,
    "DeliveryFees" DECIMAL(12,2) NOT NULL,
    "Discount" DECIMAL(12,2) NOT NULL,
    "TotalAmount" DECIMAL(12,2) NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "_CategoryToItem" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CategoryToItem_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_UserName_key" ON "User"("UserName");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerProfile_UserId_key" ON "CustomerProfile"("UserId");

-- CreateIndex
CREATE UNIQUE INDEX "ItemColour_ItemId_Name_key" ON "ItemColour"("ItemId", "Name");

-- CreateIndex
CREATE UNIQUE INDEX "ItemSize_ItemId_Name_key" ON "ItemSize"("ItemId", "Name");

-- CreateIndex
CREATE UNIQUE INDEX "ItemVariant_ItemId_ItemSizeId_ItemColourId_key" ON "ItemVariant"("ItemId", "ItemSizeId", "ItemColourId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_OrderNumber_key" ON "Order"("OrderNumber");

-- CreateIndex
CREATE INDEX "_CategoryToItem_B_index" ON "_CategoryToItem"("B");

-- AddForeignKey
ALTER TABLE "CustomerProfile" ADD CONSTRAINT "CustomerProfile_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerAddress" ADD CONSTRAINT "CustomerAddress_CustomerProfileId_fkey" FOREIGN KEY ("CustomerProfileId") REFERENCES "CustomerProfile"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_CreatedBy_fkey" FOREIGN KEY ("CreatedBy") REFERENCES "User"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemImage" ADD CONSTRAINT "ItemImage_ItemColourId_fkey" FOREIGN KEY ("ItemColourId") REFERENCES "ItemColour"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemColour" ADD CONSTRAINT "ItemColour_ItemId_fkey" FOREIGN KEY ("ItemId") REFERENCES "Item"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemSize" ADD CONSTRAINT "ItemSize_ItemId_fkey" FOREIGN KEY ("ItemId") REFERENCES "Item"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemVariant" ADD CONSTRAINT "ItemVariant_ItemId_fkey" FOREIGN KEY ("ItemId") REFERENCES "Item"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemVariant" ADD CONSTRAINT "ItemVariant_ItemSizeId_fkey" FOREIGN KEY ("ItemSizeId") REFERENCES "ItemSize"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemVariant" ADD CONSTRAINT "ItemVariant_ItemColourId_fkey" FOREIGN KEY ("ItemColourId") REFERENCES "ItemColour"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_OrderId_fkey" FOREIGN KEY ("OrderId") REFERENCES "Order"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_ItemVariantId_fkey" FOREIGN KEY ("ItemVariantId") REFERENCES "ItemVariant"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_CustomerProfileId_fkey" FOREIGN KEY ("CustomerProfileId") REFERENCES "CustomerProfile"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToItem" ADD CONSTRAINT "_CategoryToItem_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToItem" ADD CONSTRAINT "_CategoryToItem_B_fkey" FOREIGN KEY ("B") REFERENCES "Item"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
