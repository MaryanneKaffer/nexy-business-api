import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    try {
        const product = await prisma.product.findUnique({
            where: { id: Number(id) },
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const body = await req.json();

    const product = await prisma.product.update({
        where: { id: Number(id) },
        data: {
            unitPrice: body.unitPrice,
            name: body.name,
            description: body.description,
            size: body.size
        },
    });

    return NextResponse.json(product);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    try {
        await prisma.orderItems.updateMany({
            where: { productId: Number(id) },
            data: { productId: 0 },
        });

        const product = await prisma.product.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ message: "Product deleted and orders reassigned", product });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}