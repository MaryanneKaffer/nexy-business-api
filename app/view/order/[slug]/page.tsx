"use client"
import { Order } from "@/app/api/orders/route";
import { Cards } from "@/components/cards";
import HomeButton from "@/components/homeButton";
import ViewButton from "@/components/viewButton";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";
import { IoPerson } from "react-icons/io5";

export default function ViewPage() {
    const params = useParams();
    const id = params.slug as string;
    const [data, setData] = useState<Order>();
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`/api/orders/${id}`);
            const data = await res.json();
            setData(data)
        }
        fetchData();
    }, [id]);

    const handleCopy = () => router.push(`/register/newOrder/${data?.id}`);

    return (
        <section className="flex gap-2">
            <div className="p-8 mx-auto w-[40%] dark:bg-[#18181B] bg-[#D4D4D8] gap-3 rounded-sm relative">
                <HomeButton />
                {data && (
                    <div className="h-full flex flex-col gap-3">
                        <h1 className="text-2xl font-bold text-center mb-3">Order id: {data.id}</h1>
                        <div className={`flex flex-col gap-3`}>
                            {Object.entries(data).filter(([key, _]) => !["id", "total", "customerId", "customer"].includes(key)).map(([key, value]) => (
                                <React.Fragment key={key}>
                                    {!Array.isArray(value) && value && (
                                        <Input
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
                        <div className="bg-gray-500 h-[2px]" />
                        <h1 className="text-xl font-bold">Customer</h1>
                        {data.customer && (
                            <Card className="h-fit p-3 group hover:scale-102 w-full" radius="sm">
                                <CardBody >
                                    <div className="flex flex-col gap-3 h-full">
                                        <span className="flex items-center gap-3">
                                            <IoPerson size={60} />
                                            <span className="flex flex-col leading-tight">
                                                <p className="text-xl">{data.customer.corporateName}</p>
                                                <p className="text-gray-400">{data.customer.email}</p>
                                                <p className="text-gray-400">Id: {data.customer.id}</p>
                                            </span>
                                            <ViewButton id={data.customer.id} type={"customer"} />
                                        </span>
                                        {data.customer.id > 0 && <span className="grid grid-cols-2 text-md leading-tight">
                                            {Object.entries(data.customer).filter(([key, _]) => !["email", "id", "totalSpent", "corporateName"].includes(key)).map(([key, value]) => (
                                                <p key={key} className="text-md mt-2">{key.toUpperCase()}: {String(value)}</p>
                                            ))}
                                        </span>}
                                    </div>
                                </CardBody>
                            </Card>
                        )}
                        <span className="flex gap-3 w-full mt-auto">
                            <Popover>
                                <PopoverTrigger>
                                    <Button radius="sm" color="primary" className="w-full">Copy</Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <div className="px-1 py-2 flex flex-col">
                                        <p className="text-lg font-bold mb-2">Do you want to create a new order with these informations?</p>
                                        <Button className="px-1 mx-auto gap-1 w-fit mt-2" color="primary" size="md" onPress={handleCopy}>
                                            Proceed
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </span>
                    </div>
                )}
            </div>
            <div className="p-8 mx-auto w-[60%] h-[86dvh] dark:bg-[#18181B] bg-[#D4D4D8] gap-3 rounded-sm flex flex-col">
                <h1 className="text-2xl font-bold text-center mb-1">Products</h1>
                <div className="dark:bg-[#202022] bg-[#E4E4E7] gap-3 rounded-sm flex flex-col h-[82%]">
                    <div className="h-full w-full overflow-y-scroll flex-1 px-7 py-5">
                        {data?.items.map((item) => (
                            <Cards key={item.productId} title={item.product.name} id={String(item.product.id)} content1={item.product.description ?? ""} content2={String(item.product.size)} type="product"
                                rightContent1={`Total: ${Number(item.itemTotal).toFixed(2)}`} rightContent2={`Quantity: ${item.quantity}`} />
                        ))}
                    </div>
                </div>
                <Input label={"TOTAL"} value={Number(data?.total).toFixed(2)} className="mt-auto sticky" readOnly radius="sm" size="lg" />
            </div>
        </section>
    );
}