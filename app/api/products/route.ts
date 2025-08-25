import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export type Product = {
    id: number;
    unitPrice: number | Decimal;
    name: string;
    description: string | null;
    size: string | number | null
};

async function ensureDeletedProduct() {
    const exists = await prisma.product.findUnique({ where: { id: 0 } });
    if (!exists) {
        await prisma.product.create({
            data: {
                id: 0,
                unitPrice: 0.00,
                name: "Deleted product",
                description: "",
                size: "",
            }
        });
    }
}

ensureDeletedProduct();

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
        const products = await prisma.product.findMany({
            where: { id: { not: 0 } },
            orderBy: { id: "desc" },
        });

        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}