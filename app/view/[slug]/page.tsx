"use client"
import { Customer } from "@/app/api/customers/route";
import { Order } from "@/app/api/orders/route";
import { Product } from "@/app/api/products/route";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Alert } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";

export default function ViewPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [data, setData] = useState<Customer | Product | Order | null>(null);
    const [deleted, setDeleted] = useState("")
    const [type, id] = slug.split("-");
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`/api/${type}s`);
            const data = await res.json();
            const item = data.find((item: any) => item.id === Number(id));

            setData(item)
        }
        fetchData();
    }, [type, id]);

    function handleRedirect() {
        router.push(`/edit/${type}/${data?.id}`);
    }
    console.log(data)


    return (
        <div className="p-8 mx-auto w-[45%] bg-[#0F0F0F] gap-3 rounded-sm">
            {data && (
                <>
                    <h1 className="text-2xl font-bold text-center mb-8">{type === "customer"
                        ? (data as Customer).corporateName
                        : type === "product"
                            ? (data as Product).name
                            : `Order id: ${(data as Order).id}`}</h1>
                    <div className={`grid ${Object.entries(data).length === 5 ? "" : "grid-cols-2"} gap-3`}>
                        {Object.entries(data).map(([key, value]) => (
                            <React.Fragment key={key}>
                                {Array.isArray(value) ? (
                                    value.map((item, index) => (
                                        <Input
                                            key={`${key}-${index}`}
                                            label={`PRODUCT ${index + 1}`}
                                            value={`Id: ${item.productId} - total: $${Number(item.itemTotal).toFixed(2)} - quantity: ${item.quantity}`}
                                            isDisabled
                                            radius="sm"
                                        />
                                    ))
                                ) : (
                                    type !== "order" ? (
                                        <Input
                                            key={key}
                                            label={key.toUpperCase()}
                                            value={String(value)}
                                            isDisabled
                                            radius="sm"
                                        />)
                                        : key !== "id" && (
                                            <Input
                                                key={key}
                                                label={key.toUpperCase()}
                                                value={key === "total" ? `$${Number(value).toFixed(2)}` : String(value)}
                                                isDisabled
                                                radius="sm"
                                            />
                                        )
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                    {type !== "order" && <span className="flex gap-3 w-full mt-8">
                        <Button radius="sm" className="w-full" onPress={handleRedirect}>Edit</Button>
                        <Button radius="sm" color="danger" className="w-full">Delete</Button>
                    </span>}
                </>
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
