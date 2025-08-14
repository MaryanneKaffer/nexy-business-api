import { Card, CardBody } from "@heroui/react";
import { useState, useEffect } from "react";
import { Customer } from "@/app/api/customers/route";
import { Product } from "@/app/api/products/route";
import { Order } from "@/app/api/orders/route";

export default function ApiContent({ type }: { type: string }) {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        if (!type) return;
        async function fetchData() {
            const res = await fetch(`/api/${type}`);
            const data = await res.json();
            if (type === "customers") { setCustomers(data) }
            else if (type === "products") { setProducts(data) }
            else setOrders(data)
        }
        fetchData();
    }, [type]);

    return (
        <div className="w-full h-full overflow-y-scroll bg-[#27272A] rounded-sm p-6">
            {type === "customers" && customers.map((item, index) => (
                <Card key={index} className="h-[100px]" radius="sm">
                    <CardBody>
                        <p>{item.corporateName}</p>
                    </CardBody>
                </Card>
            ))}
            {type === "products" && products.map((item, index) => (
                <Card key={index} className="h-[100px]" radius="sm">
                    <CardBody>
                        <p>{item.name}</p>
                        <p>{item.size}</p>
                        <p>{item.id}</p>
                    </CardBody>
                </Card>
            ))}
            {type === "orders" && orders.map((item, index) => (
                <Card key={index} className="h-[100px]" radius="sm">
                    <CardBody>
                        <p>{item.customerId}</p>
                    </CardBody>
                </Card>
            ))}
        </div>
    )
}