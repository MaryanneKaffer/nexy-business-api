import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type Customer = {
    id: number;
    corporateName: string;
    email: string;
    phone: string;
    ssn: string;
    postcode: string;
    city: string;
    state: string;
    stateRegistration: string;
    district: string;
    totalSpent?: number;
};

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const customer = await prisma.customer.create({
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

        return NextResponse.json(customer, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Couldn't register customer" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const customers = await prisma.customer.findMany({
            orderBy: { id: "desc" },
        });

        return NextResponse.json(customers);
    } catch (error) {
        console.error("Error fetching customers:", error);
        return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
    }
}
