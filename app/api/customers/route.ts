import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Order } from "../orders/route";

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
    address: string;
    totalSpent?: number;
    orders: Order[];
};

async function ensureDeletedCustomer() {
    const exists = await prisma.customer.findUnique({ where: { id: 0 } });
    if (!exists) {
        await prisma.customer.create({
            data: {
                id: 0,
                corporateName: "Deleted Customer",
                email: "",
                phone: "",
                ssn: "",
                postcode: "",
                address: "",
                city: "",
                state: "",
                stateRegistration: "",
                district: "",
                totalSpent: 0
            }
        });
    }
}

ensureDeletedCustomer();

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
            },
        });

        return NextResponse.json(customer, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Couldn't register customer" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const customers = await prisma.customer.findMany({
            where: { id: { not: 0 } },
            orderBy: { id: "desc" },
        });

        return NextResponse.json(customers);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
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