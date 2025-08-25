"use client"
import { Order } from "@/app/api/orders/route";
import HomeButton from "@/components/homeButton";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";
import CustomerCard from "../components/customerCard";
import ProductList from "../components/productsList";

export default function ViewPage() {
    const params = useParams();
    const id = params.slug as string;
    const [data, setData] = useState<Order>();
    const router = useRouter();
    const excludeOrderKeys = ["id", "total", "customerId", "customer"];

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`/api/orders/${id}`);
            const data = await res.json();
            setData(data)
            if (!res.ok) {
                const error = await res.json();
                alert(error.error);
                return;
            }
        }
        fetchData();
    }, [id]);

    const handleCopy = () => router.push(`/register/newOrder/${data?.id}`);

    return (
        <section className="flex gap-2 lg:flex-row flex-col">
            <div className="sm:p-8 p-5 mx-auto lg:w-[40%] w-full dark:bg-[#18181B] bg-[#D4D4D8] gap-3 rounded-sm flex">
                <HomeButton />
                {data && (
                    <div className="h-full w-full flex flex-col gap-3">
                        <h1 className="sm:text-2xl text-xl text-center mx-auto mb-1">Order id: {data.id}</h1>
                        <div className={`flex flex-col gap-3`}>
                            {Object.entries(data).filter(([key, _]) => !excludeOrderKeys.includes(key)).map(([key, value]) => (
                                <React.Fragment key={key}>
                                    {!Array.isArray(value) && value && (
                                        <Input
                                            className="sm:h-14 h-12"
                                            key={key}
                                            label={key.toUpperCase()}
                                            value={String(value)}
                                            readOnly
                                            radius="sm"
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                        {data.customer && (
                            <CustomerCard data={data} />
                        )}
                        <span className="flex gap-3 w-full mt-auto">
                            <Popover>
                                <PopoverTrigger>
                                    <Button radius="sm" color="primary" className="sm:h-14 h-10 w-full">Copy</Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <div className="px-1 py-2 flex flex-col">
                                        <p className="text-lg font-bold mb-2">Do you want to create a new order with these informations?</p>
                                        <Button className="px-1 mx-auto gap-1 w-fit mt-2 sm:h-14 h-12" color="primary" onPress={handleCopy}>
                                            Proceed
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </span>
                    </div>
                )}
            </div>
            {data && <ProductList data={data} />}
        </section >
    );
}