import { prisma } from "../db/client";

type MediaItem = {
  url: string;
  ClassTypeArray: { ClassType: Array<{ classTypeName: string }> };
};

export async function saveAllProductImages(
  productIdStr: string,
  mediaArr: MediaItem[]
) {
  // 1) upsert the Product
  const product = await prisma.product.upsert({
    where: { productId: productIdStr },
    create: { productId: productIdStr },
    update: {},
  });

  // 2) delete old images
  await prisma.productImage.deleteMany({ where: { productId: product.id } });

  // 3) upsert each media item to avoid duplicates
  const ops = mediaArr.map((m) =>
    prisma.productImage.upsert({
      // you’ll need a compound unique index in your schema:
      // @@unique([productId, url])
      where: {
        productId_url: {
          productId: product.id,
          url: m.url,
        },
      },
      create: {
        productId: product.id,
        url: m.url,
        classTypeName: m.ClassTypeArray.ClassType[0]?.classTypeName,
      },
      update: {}, // no changes if already exists
    })
  );

  return prisma.$transaction(ops);
}
