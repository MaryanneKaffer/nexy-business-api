"use client"
import React from "react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Customer } from "@/app/api/customers/route";
import { Order } from "@/app/api/orders/route";
import { Product } from "@/app/api/products/route";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Alert } from "@heroui/react";
import HomeButton from "@/components/homeButton";
import DeleteButton from "../../components/deleteButton";
import HistoryInfo from "./components/historyInfo";
import { OrderItems } from "@prisma/client";

interface ProductTotals {
    [productId: number]: { quantity: number; total: number };
}

export default function ViewCustomer() {
    const params = useParams();
    const id = params.slug as string;
    const [data, setData] = useState<Customer>();
    const [products, setProducts] = useState<Product[]>([]);
    const [deleted, setDeleted] = useState("")
    const [productTotal, setProductTotal] = useState<ProductTotals>({});
    const router = useRouter();
    const excludedKeys = ["totalSpent", "orders", "id"]
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        async function fetchData() {
            const [resC, resP] = await Promise.all([
                fetch(`/api/customers/${id}`),
                fetch(`/api/products`),
            ]);

            const [customer, productsData] = await Promise.all([
                resC.json(),
                resP.json(),
            ]);

            const allItems = (customer.orders ?? []).flatMap((order: Order) => order.items);

            const productIds = (customer.orders ?? []).flatMap((order: Order) =>
                order.items.map((item: any) => item.productId)
            );

            const customerProducts = productsData.filter((product: Product) =>
                productIds.includes(product.id)
            );

            const totals: { [productId: number]: { quantity: number; total: number } } = {};

            allItems.forEach((item: OrderItems) => {
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
            setData(customer)
            setProductTotal(totals);
        }
        fetchData();
        setLoaded(true);
    }, [id]);

    return (
        <section className="flex lg:flex-row flex-col gap-2 relative">
            <div className="sm:p-8 p-5 mx-auto lg:w-[40%] w-full dark:bg-default/60 bg-[#D4D4D8] gap-3 rounded-sm relative flex-1">
                <HomeButton />
                {!loaded &&
                    <Button isLoading size="lg" className="w-full h-full bg-transparent transition-all duration-700" />
                }
                {data && (
                    <div className="h-full flex flex-col sm:gap-3 gap-2">
                        <span>
                            <h1 className="sm:text-2xl text-xl text-center mx-auto">{data.corporateName}</h1>
                            <h2 className="sm:text-xl text-lg font-bold text-center text-gray-500">Id: {data.id}</h2>
                        </span>
                        <div className={`grid grid-cols-2 sm:gap-3 gap-2`}>
                            {Object.entries(data).filter(([key, _]) => !excludedKeys.includes(key)).map(([key, value]) => (
                                <Input key={key} label={key.toUpperCase()} readOnly radius="sm" className="sm:h-14 h-12" classNames={{ inputWrapper: "dark:bg-[#1F1F21]" }}
                                    value={String(value)}
                                />
                            ))}
                        </div>
                        <Input className="sm:h-14 h-12 " label="TOTAL SPENT" readOnly radius="sm" classNames={{ inputWrapper: "dark:bg-[#1F1F21]" }}
                            value={`$${String(Number(data.totalSpent ?? 0).toFixed(2))}`}
                        />
                        <span className="flex gap-3 w-full mt-auto place-center">
                            <Button radius="sm" color="primary" className="sm:h-12 sm:mt-0 mt-2 h-9 w-full" onPress={() => router.push(`/edit/customer/${data?.id}`)}>Edit</Button>
                            <DeleteButton name={data.corporateName} item="customers" id={id} setDeleted={setDeleted} />
                        </span>
                    </div>
                )}
            </div>
            <HistoryInfo productTotal={productTotal} products={products} data={data} />
            {deleted && (
                <span className="w-[100dvw] h-[100dvh] absolute top-0 left-0 z-100">
                    <Alert className="fixed top-2 left-1/2 -translate-x-1/2 w-[80dvw]" color="primary"
                        title={`Customer ${deleted} deleted. Returning...`}
                    />
                </span>
            )}
        </section>
    );
}
