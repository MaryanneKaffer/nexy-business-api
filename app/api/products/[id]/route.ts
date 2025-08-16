import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const product = await prisma.product.findUnique({
            where: { id: Number(params.id) },
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const body = await req.json();

    const product = await prisma.product.update({
        where: { id: Number(params.id) },
        data: {
            unitPrice: body.unitPrice,
            name: body.name,
            description: body.description,
            size: body.size
        },
    });

    return NextResponse.json(product);
}