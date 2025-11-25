import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
    try {
        const customers = await prisma.customer.createMany({
            data: [
                {
                    corporateName: "Blue Ocean Industries",
                    email: "contact@blueocean.com",
                    phone: "+1 555-7812",
                    ssn: "123-45-6789",
                    postcode: "90210",
                    address: "123 Sunset Blvd",
                    city: "Los Angeles",
                    state: "CA",
                    stateRegistration: "REG-839201",
                    district: "Beverly Hills",
                    totalSpent: 0
                },
                {
                    corporateName: "Evergreen Supplies",
                    email: "hello@evergreen.io",
                    phone: "+1 555-4921",
                    ssn: "987-65-4321",
                    postcode: "60603",
                    address: "44 North Street",
                    city: "Chicago",
                    state: "IL",
                    stateRegistration: "REG-222113",
                    district: "Downtown",
                    totalSpent: 0
                },
                {
                    corporateName: "NovaTech Labs",
                    email: "support@novatech.com",
                    phone: "+1 555-9442",
                    ssn: "111-22-3333",
                    postcode: "75201",
                    address: "890 Tech Avenue",
                    city: "Dallas",
                    state: "TX",
                    stateRegistration: "REG-119944",
                    district: "Central District",
                    totalSpent: 0
                }
            ]
        });

        const c1 = await prisma.customer.findFirst({ where: { email: "contact@blueocean.com" } });
        const c2 = await prisma.customer.findFirst({ where: { email: "hello@evergreen.io" } });

        // ---------- PRODUCTS ----------
        const products = await prisma.product.createMany({
            data: [
                {
                    name: "Premium Notebook",
                    description: "Hardcover, 200 pages",
                    size: "Medium",
                    unitPrice: 12.99
                },
                {
                    name: "Wireless Mouse",
                    description: "Ergonomic design",
                    size: "One Size",
                    unitPrice: 25.50
                },
                {
                    name: "Mechanical Keyboard",
                    description: "Blue switches",
                    size: "Full Size",
                    unitPrice: 69.99
                },
                {
                    name: "USB-C Cable",
                    description: "Fast charging 1m",
                    size: "1m",
                    unitPrice: 9.49
                },
                {
                    name: "LED Desk Lamp",
                    description: "Adjustable brightness",
                    size: "One Size",
                    unitPrice: 34.90
                }
            ]
        });

        return NextResponse.json({ message: "Seed completed successfully!" });

    } catch (error: any) {
        console.error("SEED ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
