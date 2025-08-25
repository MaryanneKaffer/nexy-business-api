"use client"
import { Order } from "@/app/api/orders/route";
import { Product } from "@/app/api/products/route";
import HomeButton from "@/components/homeButton";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Alert } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";
import DeleteButton from "../../components/deleteButton";

export default function ViewPage() {
    const params = useParams();
    const id = params.slug as string;
    const [data, setData] = useState<Product>();
    const [ordersData, setOrdersData] = useState<Order[]>([]);
    const [deleted, setDeleted] = useState("")
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            const [res, resO] = await Promise.all([
                fetch(`/api/products/${id}`),
                fetch(`/api/orders`)
            ]);
            const [data, dataO] = await Promise.all([
                res.json(),
                resO.json()
            ]);
            setData(data)
            setOrdersData(dataO)
        }
        fetchData();
    }, [id]);

    const totalSellings = () => {
        return ordersData.reduce((total, order) => {
            return (
                total + order.items
                    .filter((item) => Number(item.productId) === Number(id))
                    .reduce((sum, item) => sum + Number(item.quantity), 0)
            )
        }, 0)
    };

    const totalRevenue = () => {
        return ordersData.reduce((total, order) => {
            return (
                total +
                order.items
                    .filter((item) => Number(item.productId) === Number(id))
                    .reduce((sum, item) => sum + Number(item.itemTotal), 0)
            )
        }, 0).toFixed(2)
    };

    return (
        <div className="p-8 mx-auto h-full w-[40%] dark:bg-[#18181B] bg-[#D4D4D8] gap-3 rounded-sm relative">
            <HomeButton />
            {data && (
                <div className="h-full flex flex-col">
                    <h1 className="text-2xl font-bold text-center">{data.name}</h1>
                    <h1 className="text-xl font-bold text-center mb-5 text-gray-500">Id: {data.id}</h1>
                    <div className={`grid grid-cols-2 gap-3`}>
                        {Object.entries(data).filter(([key, _]) => key !== "id").map(([key, value]) => (
                            <Input
                                key={key}
                                label={key.toUpperCase()}
                                value={String(value)}
                                readOnly
                                radius="sm"
                            />
                        ))}
                    </div>
                    <Input className="mt-3" readOnly radius="sm" label="TOTAL SOLD" value={String(totalSellings())} />
                    <Input className="mt-3" readOnly radius="sm" label="TOTAL REVENUE" value={String(totalRevenue())} />
                    <span className="flex gap-3 w-full mt-auto">
                        <Button radius="sm" color="primary" className="w-full" onPress={() => router.push(`/edit/product/${id}`)}>Edit</Button>
                        <DeleteButton name={data.name} item="products" id={id} setDeleted={setDeleted} />
                    </span>
                </div>)}
            {deleted && (
                <span className="w-[100dvw] h-[100dvh] absolute top-0 left-0 z-100">
                    <Alert className="fixed top-2 left-1/2 -translate-x-1/2 w-fit" color="primary"
                        title={`${deleted} deleted. Returning...`}
                    />
                </span>
            )}
        </div >
    );
}
