import { prisma } from "../src";

async function main() {
  // clean database (dev only)
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.refund.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.order.deleteMany();

  // ---------------- USERS ----------------
  const user1 = "user_1";
  const user2 = "user_2";

  // ---------------- CONVERSATIONS ----------------
  const conversation1 = await prisma.conversation.create({
    data: {
      userId: user1,
      messages: {
        create: [
          {
            role: "user",
            content: "Hi, I placed an order yesterday",
          },
          {
            role: "assistant",
            content: "Sure! Can you provide your order id?",
          },
          {
            role: "user",
            content: "I don't know the id, can you check?",
          },
        ],
      },
    },
  });

  const conversation2 = await prisma.conversation.create({
    data: {
      userId: user2,
      messages: {
        create: [
          {
            role: "user",
            content: "Why was I charged twice?",
          },
          {
            role: "assistant",
            content: "Let me check your invoice details.",
          },
        ],
      },
    },
  });

  // ---------------- ORDERS ----------------
  const order1 = await prisma.order.create({
    data: {
      userId: user1,
      status: "shipped",
      trackingNumber: "TRK123456IN",
      total: 1499,
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: user2,
      status: "delivered",
      trackingNumber: "TRK654321IN",
      total: 2599,
    },
  });

  // ---------------- INVOICES ----------------
  await prisma.invoice.createMany({
    data: [
      {
        orderId: order1.id,
        amount: 1499,
        paid: true,
      },
      {
        orderId: order2.id,
        amount: 2599,
        paid: true,
      },
    ],
  });

  // ---------------- REFUNDS ----------------
  await prisma.refund.create({
    data: {
      orderId: order2.id,
      status: "processing",
    },
  });

  console.log("🌱 Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
