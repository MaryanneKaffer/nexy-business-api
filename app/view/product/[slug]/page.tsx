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
    const [loaded, setLoaded] = useState(false)

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
        setLoaded(true);
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
        <div className="sm:p-8 p-5 mx-auto lg:w-[40%] w-full dark:bg-default/60 bg-[#D4D4D8] gap-3 rounded-sm relative min-h-[400px]">
            <HomeButton />
            {!loaded &&
                <Button isLoading size="lg" className="w-full h-full bg-transparent transition-all duration-700" />
            }
            {data && (
                <div className="h-full flex flex-col sm:gap-3 gap-2">
                    <span>
                        <h1 className="sm:text-2xl text-xl text-center mx-auto">{data.name}</h1>
                        <h2 className="sm:text-xl text-lg font-bold text-center text-gray-500">Id: {data.id}</h2>
                    </span>
                    <div className={`grid grid-cols-2 sm:gap-3 gap-2`}>
                        {Object.entries(data).filter(([key, _]) => key !== "id").map(([key, value]) => (
                            <Input key={key} label={key.toUpperCase()} readOnly radius="sm" className="sm:h-14 h-12" classNames={{ inputWrapper: "dark:bg-[#1F1F21]" }}
                                value={String(value)}
                            />
                        ))}
                    </div>
                    <Input readOnly radius="sm" label="TOTAL SOLD" value={String(totalSellings())} className="sm:h-14 h-12" classNames={{ inputWrapper: "dark:bg-[#1F1F21]" }} />
                    <Input readOnly radius="sm" label="TOTAL REVENUE" value={String(totalRevenue())} className="sm:h-14 h-12" classNames={{ inputWrapper: "dark:bg-[#1F1F21]" }} />
                    <span className="flex gap-3 w-full">
                        <Button radius="sm" color="primary" className="sm:h-12 sm:mt-0 mt-2 h-9 w-full" onPress={() => router.push(`/edit/product/${id}`)}>Edit</Button>
                        <DeleteButton name={data.name} item="products" id={id} setDeleted={setDeleted} />
                    </span>
                </div>)}
            {deleted && (
                <span className="w-[100dvw] h-[100dvh] absolute top-0 left-0 z-100">
                    <Alert className="fixed top-2 left-1/2 -translate-x-1/2 w-[80dvw]" color="primary"
                        title={`${deleted} deleted. Returning...`}
                    />
                </span>
            )}
        </div >
    );
}
