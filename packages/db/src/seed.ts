import { prisma } from "../src";

async function main() {
  console.log("🌱 Seeding database...");

  const userId = "user-1";

  // Clean existing data
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.refund.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();

  // --- Order 1: Delivered ---
  const order1 = await prisma.order.create({
    data: {
      userId,
      status: "delivered",
      trackingNumber: "TRK-2024-001",
      total: 149.97,
      items: {
        create: [
          { name: "Mechanical Keyboard", quantity: 1, price: 89.99 },
          { name: "Mouse Pad XL", quantity: 1, price: 24.99 },
          { name: "USB-C Hub", quantity: 1, price: 34.99 },
        ],
      },
      invoice: {
        create: {
          amount: 149.97,
          paid: true,
          paidAt: new Date("2024-12-01"),
          dueDate: new Date("2024-12-15"),
        },
      },
    },
  });

  // --- Order 2: Shipped ---
  const order2 = await prisma.order.create({
    data: {
      userId,
      status: "shipped",
      trackingNumber: "TRK-2024-002",
      total: 59.99,
      items: {
        create: [{ name: "Wireless Earbuds", quantity: 1, price: 59.99 }],
      },
      invoice: {
        create: {
          amount: 59.99,
          paid: true,
          paidAt: new Date("2025-01-10"),
          dueDate: new Date("2025-01-25"),
        },
      },
    },
  });

  // --- Order 3: Pending with unpaid invoice ---
  const order3 = await prisma.order.create({
    data: {
      userId,
      status: "pending",
      total: 299.99,
      items: {
        create: [{ name: '27" Monitor', quantity: 1, price: 299.99 }],
      },
      invoice: {
        create: {
          amount: 299.99,
          paid: false,
          dueDate: new Date("2025-02-15"),
        },
      },
    },
  });

  // --- Order 4: Cancelled with refund ---
  const order4 = await prisma.order.create({
    data: {
      userId,
      status: "cancelled",
      total: 199.99,
      items: {
        create: [{ name: "Standing Desk Mat", quantity: 2, price: 99.995 }],
      },
      invoice: {
        create: {
          amount: 199.99,
          paid: true,
          paidAt: new Date("2024-11-20"),
          dueDate: new Date("2024-12-05"),
        },
      },
      refund: {
        create: {
          amount: 199.99,
          status: "processed",
          reason: "Customer changed mind",
        },
      },
    },
  });

  // --- A previous conversation for context ---
  await prisma.conversation.create({
    data: {
      userId,
      title: "Order tracking inquiry",
      messages: {
        create: [
          {
            role: "user",
            content: "Where is my keyboard order?",
            intent: "order",
            agentType: "order",
          },
          {
            role: "assistant",
            content: `Your order with the Mechanical Keyboard has been delivered! Tracking number: TRK-2024-001.`,
            intent: "order",
            agentType: "order",
          },
        ],
      },
    },
  });

  console.log("✅ Seeded:");
  console.log(
    `   4 orders (IDs: ${order1.id}, ${order2.id}, ${order3.id}, ${order4.id})`,
  );
  console.log(`   4 invoices, 1 refund`);
  console.log(`   1 conversation with history`);
  console.log(`   User ID: ${userId}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
