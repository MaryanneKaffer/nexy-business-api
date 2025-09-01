import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: Record<string, string> }) {
    const { id } = params;

    try {
        const customer = await prisma.customer.findUnique({
            where: { id: Number(id) },
            include: {
                orders: {
                    include: {
                        items: {
                            include: { product: true }
                        }
                    }
                }
            }
        });

        if (!customer) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 });
        }

        return NextResponse.json(customer);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch Customer" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Record<string, string> }) {
    const body = await req.json();
    const { id } = params;

    const customer = await prisma.customer.update({
        where: { id: Number(id) },
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

export async function DELETE(req: NextRequest, { params }: { params: Record<string, string> }) {
    const { id } = params;

    try {
        await prisma.order.updateMany({
            where: { customerId: Number(id) },
            data: { customerId: 0 },
        });

        const customer = await prisma.customer.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({
            message: "Customer deleted and orders reassigned",
            customer
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
    }
}