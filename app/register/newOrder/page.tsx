"use client"
import HomeButton from "@/components/homeButton";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Alert, Autocomplete, AutocompleteItem } from "@heroui/react";
import { Customer, Product } from "@prisma/client";
import { useRouter } from "next/navigation";
import { type } from "os";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function NewOrder() {
    const { register, handleSubmit } = useForm();
    const [regsResult, setRegsResult] = useState("")
    const router = useRouter();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState<number>();
    const [selectedProducts, setSelectedProducts] = useState<(Product | null)[]>([null, null, null, null]);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`/api/customers`);
            const res2 = await fetch(`/api/products`);
            const data = await res.json();
            const data2 = await res2.json();
            setCustomers(data)
            setProducts(data2)
        }
        fetchData();
    }, []);

    async function onSubmit(formData: any) {
        try {
            const items = selectedProducts
                .filter((p) => p !== null)
                .map((product, index) => ({
                    productId: product!.id,
                    quantity: Number(formData[`quantity_${index}`]),
                    unitPrice: Number(product!.unitPrice),
                    itemTotal: Number(formData[`itemTotal_${index}`]),
                }));

            const orderPayload = {
                customerId: selectedCustomerId,
                date: `${new Date().getFullYear()}-` +
                    `${(new Date().getMonth() + 1).toString().padStart(2, "0")}-` +
                    `${new Date().getDate().toString().padStart(2, "0")} ` +
                    `${new Date().getHours().toString().padStart(2, "0")}:` +
                    `${new Date().getMinutes().toString().padStart(2, "0")}:` +
                    `${new Date().getSeconds().toString().padStart(2, "0")}`, 
                    paymentType: formData.paymentType,
                deliveryAddress: selectedCustomer?.address ?? "",
                total: Number(formData.total),
                observation: formData.observation || null,
                items,
            };

            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderPayload),
            });

            if (!res.ok) throw new Error("Couldn't register order");

            const result = await res.json();
            setRegsResult(selectedCustomer?.corporateName || "");
            setTimeout(() => router.push("/"), 3000);
        } catch (error) {
            setRegsResult(`error: ${error}`);
        }
    }

    const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
    const handleProduct = (index: number, id: number) => {
        const product = products.find((p) => p.id === id) || null;
        setSelectedProducts((prev) => {
            const newArr = [...prev];
            newArr[index] = product;
            return newArr;
        });
    };

    return (
        <>
            <section className="h-full w-full">
                <form onSubmit={handleSubmit(onSubmit)} className="h-full w-full flex gap-2 justify-between">
                    <div className={`w-[35dvw] p-8 bg-[#0F0F0F] gap-4 rounded-sm flex flex-col transition-all duration-300 ${selectedCustomer ? "h-full" : "h-44"}`}>
                        <h1 className="text-3xl text-center">Select a customer</h1>
                        <Autocomplete
                            {...register("customerId")}
                            radius="sm"
                            defaultItems={customers}
                            label="Customer"
                            placeholder="Search a customer"
                            onSelectionChange={(key) => setSelectedCustomerId(Number(key))}
                        >
                            {customers.map((item) => <AutocompleteItem key={item.id}>{item.corporateName}</AutocompleteItem>)}
                        </Autocomplete>
                        <span className="grid grid-cols-2 gap-3">
                            {selectedCustomer && Object.entries(selectedCustomer).map(([key, value]) => (
                                key !== "corporateName" && key !== "totalSpent" && (
                                    <Input
                                        key={key}
                                        label={key.toUpperCase()}
                                        value={String(value ?? "")}
                                        isDisabled
                                        radius="sm"
                                    />)
                            ))}
                        </span>
                        {selectedCustomer && (
                            <>
                                <Input radius="sm" className="mt-auto" {...register("deliveryAddress")} label="DELIVERY ADDRESS" />
                                <Input radius="sm" {...register("observation")} label="OBSERVATION" />
                                <span className="flex gap-2">
                                    <Input radius="sm" {...register("total")} label="TOTAL" />
                                    <Input radius="sm" {...register("paymentType")} label="PAYMENT TYPE" />
                                </span>
                                <Button radius="sm" size="lg" className="bg-[#27272A]" type="submit">Register order</Button>
                            </>
                        )}
                    </div>
                    <div className="p-8 w-[62%] bg-[#0F0F0F] gap-3 rounded-sm grid grid-cols-2 ">
                        {selectedProducts.map((product, index) => (
                            <div key={index} className={`bg-[#171717] transition-all max-h-[380px] duration-200 ${product ? "h-full" : "h-24"} rounded-sm p-5 flex flex-col gap-3`}>
                                <Autocomplete
                                    {...register("auau")}
                                    radius="sm"
                                    defaultItems={products}
                                    label="Product"
                                    placeholder="Search a product"
                                    onSelectionChange={(key) =>
                                        handleProduct(index, Number(key))
                                    }                                >
                                    {products.map((item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>)}
                                </Autocomplete>
                                <span className="grid grid-cols-2 gap-3">
                                    {product && Object.entries(product).map(([key, value]) => (
                                        <Input
                                            key={key}
                                            label={key.toUpperCase()}
                                            value={String(value ?? "")}
                                            isDisabled
                                            radius="sm"
                                        />
                                    ))}
                                    {product && <Input radius="sm" {...register(`quantity_${index}`)} label="QUANTITY" />}
                                </span>
                                {product && < Input radius="sm" className=""  {...register(`itemTotal_${index}`)} label="TOTAL" />}
                            </div>
                        ))}
                    </div>
                </form>
            </section>
            {regsResult.includes("error") ? <Alert className="fixed top-2 left-1/2 -translate-x-1/2 w-fit" color="danger" title={regsResult} />
                :
                regsResult && <Alert className="fixed top-2 left-1/2 -translate-x-1/2 w-fit" color="success" title={`Order from ${regsResult} successfully registered. Returning...`} />
            }
        </>
    )
}
