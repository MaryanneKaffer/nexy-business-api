"use client"
import { Order } from "@/app/api/orders/route";
import { Product } from "@/app/api/products/route";
import HomeButton from "@/components/homeButton";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Alert, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";

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

    function handleRedirect() {
        router.push(`/edit/product/${id}`);
    }

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const error = await res.json();
                alert({ error });
                return;
            }

            setDeleted(data?.name ?? "product")
            setTimeout(() => {
                router.push("/");
            }, 3000);
        } catch (err) {
            console.error(err);
        }
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
                        <Button radius="sm" color="primary" className="w-full" onPress={handleRedirect}>Edit</Button>
                        <Popover>
                            <PopoverTrigger>
                                <Button radius="sm" color="danger" className="w-full">Delete</Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <div className="px-1 py-2 flex flex-col">
                                    <p className="text-md font-bold -mb-1">Are you sure you want to delete {data.name}?</p>
                                    <p className="text-sm font-bold text-gray-500 text-center">This action is irreversible</p>
                                    <Button className="px-1 mx-auto gap-1 w-fit mt-2" color="danger" size="md" onPress={handleDelete}>
                                        Delete
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </span>
                </div>

            )}
            {deleted && (
                <Alert
                    className="fixed top-2 left-1/2 -translate-x-1/2 w-fit"
                    color="primary"
                    title={`${deleted} deleted. Returning...`}
                />
            )}
        </div>
    );
}
