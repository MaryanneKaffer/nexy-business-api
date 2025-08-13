import { Card, CardBody } from "@heroui/react";
import { useState, useEffect } from "react";
import {
    Customer

} from "@/app/api/customers/route";
export default function ApiContent({ type }: { type: string }) {
    const [customers, setCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        if (!type) return;
        async function fetchData() {
            const res = await fetch(`/api/${type}`);
            const data = await res.json();
            if (type === "customers") { setCustomers(data) }
        }
        fetchData();
    }, [type]);

    return (
        <div className="w-full h-full overflow-y-scroll bg-[#27272A] rounded-lg p-6">
            {type === "customers" && customers.map((item, index) => (
                <Card key={index} className="h-[100px]">
                    <CardBody>
                        <p>{item.corporateName}</p>
                    </CardBody>
                </Card>
            ))}
        </div>
    )
}