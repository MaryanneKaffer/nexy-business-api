import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const customer = await prisma.customer.findUnique({
            where: { id: Number(params.id) },
        });

        if (!customer) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(customer);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const body = await req.json();

    const customer = await prisma.customer.update({
        where: { id: Number(params.id) },
        data: {
            corporateName: body.corporateName,
            email: body.email,
            phone: body.phone,
            ssn: body.ssn,
            postcode: body.postcode,
            address: body.address,
            city: body.city,
            state: body.state,
            stateRegistration: body.stateRegistration,
            district: body.district,
            totalSpent: body.totalSpent ?? 0
        },
    });

    return NextResponse.json(customer);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const customer = await prisma.customer.delete({
            where: { id: Number(params.id) },
        });

        return NextResponse.json({ message: "Customer deleted successfully", customer });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
    }
}