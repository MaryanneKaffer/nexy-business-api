"use client"
import { Customer } from "@/app/api/customers/route";
import { Order } from "@/app/api/orders/route";
import { Product } from "@/app/api/products/route";
import ViewButton from "@/components/viewButton";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { OrderItems } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";
import { AiOutlineProduct } from "react-icons/ai";
import { IoPerson } from "react-icons/io5";

export default function ViewPage() {
    const params = useParams();
    const id = params.slug as string;
    const [data, setData] = useState<Order>();
    const [customer, setCustomer] = useState<Customer>();
    const [products, setProducts] = useState<Product[]>([])
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`/api/orders/${id}`);
            const data = await res.json();
            setData(data)

            const resP = await fetch(`/api/products`);
            const resC = await fetch(`/api/customers/${data.customerId}`);
            const dataP = await resP.json();
            const dataC = await resC.json();
            setProducts(dataP.filter((product: Product) => data.items.some((item: OrderItems) => item.productId === product.id)));
            setCustomer(dataC)
        }
        fetchData();
    }, [id]);

    const handleCopy = () => router.push(`/register/newOrder/${data?.id}`);

    return (
        <section className="flex gap-2">
            <div className="p-8 mx-auto w-[40%] dark:bg-[#18181B] bg-[#D4D4D8] gap-3 rounded-sm">
                {data && (
                    <div className="h-full flex flex-col gap-3">
                        <h1 className="text-2xl font-bold text-center mb-3">Order id: {data.id}</h1>
                        <div className={`flex flex-col gap-3`}>
                            {Object.entries(data).filter(([key, _]) => key !== "id" && key !== "total" && key !== "customerId").map(([key, value]) => (
                                <React.Fragment key={key}>
                                    {!Array.isArray(value) && (
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
                        {customer && (
                            <Card className="h-fit p-3 group hover:scale-102 w-full" radius="sm">
                                <CardBody >
                                    <div className="flex flex-col gap-3 h-full">
                                        <span className="flex items-center gap-3">
                                            <IoPerson size={60} />
                                            <span className="flex flex-col leading-tight">
                                                <p className="text-xl">{customer.corporateName}</p>
                                                <p className="text-gray-400">{customer.email}</p>
                                                <p className="text-gray-400">Id: {customer.id}</p>
                                            </span>
                                            <ViewButton id={customer.id} type={"customer"} />
                                        </span>
                                        <span className="grid grid-cols-2 text-md leading-tight">
                                            {Object.entries(customer).filter(([key, _]) => !["email", "id", "totalSpent", "corporateName"].includes(key)).map(([key, value]) => (
                                                <p key={key} className="text-md mt-2">{key.toUpperCase()}: {String(value)}</p>
                                            ))}
                                        </span>
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
                        {products.map((item) => (
                            <Card key={item.id} className="h-[114px] p-3 hover:scale-102 group my-3" radius="sm">
                                <CardBody>
                                    <div className="flex gap-3 h-full">
                                        <AiOutlineProduct size={60} className="my-auto" />
                                        <span className="flex flex-col text-md leading-tight">
                                            <p className="text-xl">{item.name} <span className="text-gray-400 !text-sm">id: {item.id}</span></p>
                                            <p className="text-gray-400">Description: {item.description}</p>
                                            <p className="text-gray-400">Size: {item.size}</p>
                                        </span>
                                        <span className="flex flex-col ml-auto text-md leading-tight">
                                            <p className="text-xl text-right">
                                                Total: ${Number(data?.items.find((orderItem: any) => orderItem.productId === item.id)?.itemTotal ?? "0.00").toFixed(2)}
                                            </p>
                                            <p className="text-xl text-gray-400 text-right transition-all group-hover:h-0 h-2 group-hover:opacity-0 opacity-100 transition-500">
                                                Quantity: {data?.items.find((orderItem: any) => orderItem.productId === item.id)?.quantity ?? 0}
                                            </p>
                                            <ViewButton id={item.id} type={"product"} />
                                        </span>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>
                <Input label={"TOTAL"} value={Number(data?.total).toFixed(2)} className="mt-auto sticky" readOnly radius="sm" size="lg" />
            </div>
        </section>
    );
}
