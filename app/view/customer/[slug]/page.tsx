"use client"
import { Customer } from "@/app/api/customers/route";
import { Order } from "@/app/api/orders/route";
import { Product } from "@/app/api/products/route";
import ViewButton from "@/components/viewButton";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Alert, Card, CardBody, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";
import { AiOutlineProduct } from "react-icons/ai";
import { CgNotes } from "react-icons/cg";

interface ProductTotals {
    [productId: number]: { quantity: number; total: number };
}

export default function ViewCustomer() {
    const params = useParams();
    const id = params.slug as string;
    const [data, setData] = useState<Customer>();
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [deleted, setDeleted] = useState("")
    const [productTotal, setProductTotal] = useState<ProductTotals>({});
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`/api/customers/${id}`);
            const resO = await fetch(`/api/orders`);
            const resP = await fetch(`/api/products`);

            const productsData = await resP.json();
            const ordersData = await resO.json();
            const data = await res.json();

            const customerOrders = ordersData.filter(
                (order: Order) => order.customerId === data.id
            );

            const allItems = customerOrders.flatMap((order: Order) => order.items);

            const productIds = customerOrders.flatMap((order: Order) =>
                order.items.map((item: any) => item.productId)
            );

            const customerProducts = productsData.filter((product: Product) =>
                productIds.includes(product.id)
            );

            const totals: { [productId: number]: { quantity: number; total: number } } = {};

            allItems.forEach((item: any) => {
                const product = productsData.find((p: Product) => p.id === item.productId);
                if (!product) return;

                if (!totals[item.productId]) {
                    totals[item.productId] = { quantity: 0, total: 0 };
                }

                totals[item.productId].quantity += Number(item.quantity);
                totals[item.productId].total += Number(item.itemTotal);
            });

            const customerProductsWithTotal = customerProducts.map((product: Product) => ({
                ...product,
                quantity: totals[product.id].quantity,
                total: totals[product.id].total,
            }));

            customerProductsWithTotal.sort((a: any, b: any) => b.total - a.total);

            setProducts(customerProductsWithTotal);
            setOrders(customerOrders);
            setData(data)
            setProductTotal(totals);
        }
        fetchData();
    }, [id]);

    const handleRedirect = () => router.push(`/edit/customer/${data?.id}`);

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/customers/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const error = await res.json();
                alert(`Erro: ${error.error}`);
                return;
            }

            setDeleted(data?.corporateName ?? "customer")
            setTimeout(() => {
                router.push("/");
            }, 3000);
        } catch (err) {
            alert("Couldn't delete customer");
        }
    };

    return (
        <section className="flex gap-2">
            <div className="p-8 mx-auto w-[40%] dark:bg-[#18181B] bg-[#D4D4D8] gap-3 rounded-sm">
                {data && (
                    <div className="h-full flex flex-col">
                        <h1 className="text-2xl font-bold text-center">{data.corporateName}</h1>
                        <h1 className="text-xl font-bold text-center mb-5 text-gray-500">Id: {data.id}</h1>
                        <div className={`grid grid-cols-2 gap-3`}>
                            {Object.entries(data).filter(([key, _]) => key !== "id" && key !== "totalSpent").map(([key, value]) => (
                                <Input
                                    key={key}
                                    label={key.toUpperCase()}
                                    value={String(value)}
                                    isDisabled
                                    radius="sm"
                                />
                            ))}
                        </div>
                        <Input
                            className="mt-3"
                            label="TOTAL SPENT"
                            value={`$${String(Number(data.totalSpent ?? 0).toFixed(2))}`}
                            isDisabled
                            radius="sm"
                        />
                        <span className="flex gap-3 w-full mt-auto">
                            <Button radius="sm" color="primary" className="w-full" onPress={handleRedirect}>Edit</Button>
                            <Popover>
                                <PopoverTrigger>
                                    <Button radius="sm" color="danger" className="w-full">Delete</Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <div className="px-1 py-2 flex flex-col">
                                        <p className="text-md font-bold -mb-1">Are you sure you want to delete {data.corporateName}?</p>
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
            </div>
            <div className="p-5 mx-auto w-[60%] h-[86dvh] dark:bg-[#18181B] bg-[#D4D4D8] gap-3 rounded-sm flex flex-col">
                <div className="dark:bg-[#202022] bg-[#E4E4E7] gap-3 rounded-sm flex flex-col p-5 h-[49%] overflow-y-scroll">
                    <span className="flex justify-between">
                        <h1 className="text-xl">Orders from {data?.corporateName}</h1>
                        <h1 className="text-xl text-gray-500">Total: {orders.length}</h1>
                    </span>
                    <div className="flex flex-col gap-3">
                        {orders && orders.map((item) => (
                            <Card key={item.id} className="h-[114px] p-3 hover:scale-[1.02] group" radius="sm">
                                <CardBody>
                                    <div className="flex gap-3 h-full">
                                        <CgNotes size={60} className="my-auto" />
                                        <span className="flex flex-col text-md leading-tight">
                                            <p className="text-gray-400">Date: {item.date}</p>
                                            <p className="text-gray-400">Products: {item.items.length}</p>
                                            <p className="text-gray-400">Id: {item.id}</p>
                                        </span>
                                        <span className="flex flex-col ml-auto text-md leading-tight">
                                            <p className="text-xl">Total: ${Number(item.total).toFixed(2)}</p>
                                            <ViewButton id={Number(item.id)} type={"order"} />
                                        </span>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>
                <div className="dark:bg-[#202022] bg-[#E4E4E7] gap-3 rounded-sm flex flex-col p-5 h-[49%] overflow-y-scroll">
                    <span className="flex justify-between">
                        <h1 className="text-xl">Most bought products from {data?.corporateName}</h1>
                        <h1 className="text-xl text-gray-500">Total: {products.length}</h1>
                    </span>
                    <div className="flex flex-col gap-3">
                        {products && products.map((item) => (
                            <Card key={item.id} className="h-[114px] p-3 hover:scale-[1.02] group" radius="sm">
                                <CardBody>
                                    <div className="flex gap-3 h-full">
                                        <AiOutlineProduct size={60} className="my-auto" />
                                        <span className="flex flex-col text-md leading-tight">
                                            <p className="text-xl">{item.name} <span className="text-gray-400 !text-sm">id: {item.id} | included in {orders.filter((order: Order) => order.items.some(i => Number(i.productId) === item.id)).length} orders</span></p>
                                            <p className="text-gray-400">Description: {item.description}</p>
                                            <p className="text-gray-400">Size: {item.size}</p>
                                        </span>
                                        <span className="flex flex-col ml-auto text-md leading-tight">
                                            <p className="text-xl text-right">Total: ${productTotal[item.id].total.toFixed(2)}</p>
                                            <p className="text-xl text-gray-400 text-right transition-all group-hover:h-0 h-2 group-hover:opacity-0 opacity-100 transition-500">Quantity: {productTotal[item.id].quantity}</p>
                                            <ViewButton id={item.id} type={"product"} />
                                        </span>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
            {deleted && (
                <Alert
                    className="fixed top-2 left-1/2 -translate-x-1/2 w-fit"
                    color="primary"
                    title={`Customer ${deleted} deleted. Returning...`}
                />
            )}
        </section>
    );
}
