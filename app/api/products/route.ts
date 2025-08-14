import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type Product = {
    id: number;
    unitPrice: number;
    name: string;
    description: string;
    size: number;
};

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const product = await prisma.product.create({
            data: {
                unitPrice: body.unitPrice,
                name: body.name,
                description: body.description,
                size: body.size
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Couldn't register product" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const customers = await prisma.product.findMany({
            orderBy: { id: "desc" },
        });

        return NextResponse.json(customers);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}
