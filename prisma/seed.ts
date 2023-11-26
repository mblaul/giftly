import { User, WishList } from "@prisma/client";
import { prisma } from "../src/server/db";
import { env } from "~/env.mjs";

async function seedUsers() {
  const seedUser = {
    name: "Test User",
    email: "testuser@cl9ebqhxk00003b600tymydhotest.com",
    emailVerified: new Date(),
    image: null,
  };
  const user = await prisma.user.upsert({
    where: {
      email: seedUser.email,
    },
    create: seedUser,
    update: {},
  });
  return user;
}

async function seedWishLists(wishListUser: User) {
  return await prisma.wishList.create({
    data: {
      name: "Test User's Wishlist",
      userId: wishListUser.id,
    },
  });
}

async function seedGifts(wishList: WishList) {
  const gifts = [];
  for (let i = 0; i <= 5; i++) {
    const position = i + 1;
    const gift = await prisma.gift.create({
      data: {
        name: `Gift #${position}`,
        link: `https://www.google.com/search?q=${position}`,
        userId: wishList.userId,
        wishListId: wishList.id,
        wishListPosition: position,
      },
    });
    gifts.push(gift);
  }
  return gifts;
}
async function seedSharedUsersOnWishList(wishList: WishList) {
  const userToShareWith = await prisma.user.findFirst({
    where: { email: env.ADMIN_USER_EMAIL },
  });

  if (!userToShareWith) throw new Error("no user found");

  await prisma.sharedUsersOnWishLists.create({
    data: {
      wishListId: wishList.id,
      sharedUserId: userToShareWith.id,
    },
  });
}

async function main() {
  const user = await seedUsers();
  const wishList = await seedWishLists(user);
  const gifts = await seedGifts(wishList);
  await seedSharedUsersOnWishList(wishList);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
