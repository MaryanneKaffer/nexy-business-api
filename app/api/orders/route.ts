import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type Order = {
    id: string;
    customerId: string;
    date: string;
    paymentType: string;
    deliveryAddress: string;
    total: number;
    observation: string;
    items: {
        productId: string;
        quantity: number;
        unitPrice: number;
        itemTotal: number;
    }[]
}

export async function POST(req: Request) {
    try {
        const data = await req.json();

        const newOrder = await prisma.order.create({
            data: {
                customerId: data.customerId,
                date: data.date,
                paymentType: data.paymentType,
                deliveryAddress: data.deliveryAddress,
                total: data.total,
                observation: data.observation,
                items: {
                    create: data.items.map((item: any) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        itemTotal: item.itemTotal,
                    })),
                },
            },
            include: {
                customer: true,
                items: {
                    include: { product: true },
                },
            },
        });

        return NextResponse.json(newOrder, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { id: "desc" },
            include: {
                customer: true,
                items: {
                    include: { product: true },
                },
            },
        });

        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}