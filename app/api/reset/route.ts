import { NextResponse } from "next/server";
import { Client } from "@neondatabase/serverless";

export async function POST() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    try {
        const result = await client.query(`
            SELECT tablename
            FROM pg_tables
            WHERE schemaname = 'public';
        `);

        const tables = result.rows as { tablename: string }[];

        if (tables.length === 0) {
            return NextResponse.json({ message: "No tables found" });
        }

        const tableNames = tables
            .map(t => `"${t.tablename}"`)
            .join(", ");

        await client.query(`
            TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE;
        `);

        return NextResponse.json({ message: "Success reset" });
    } catch (error: any) {
        console.error("RESET ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        await client.end();
    }
}
