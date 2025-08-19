"use client"
import { Order } from "@/app/api/orders/route";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Alert, Autocomplete, AutocompleteItem } from "@heroui/react";
import { Customer, Product } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm, FieldErrors } from "react-hook-form";

export default function NewOrder() {
    const params = useParams();
    const { control, handleSubmit, setValue, reset } = useForm();
    const [regsResult, setRegsResult] = useState("")
    const router = useRouter();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState<number>();
    const [selectedProducts, setSelectedProducts] = useState<(Product | null)[]>([null, null, null, null, null, null, null, null]);
    const [errorMessage, setErrorMessage] = useState("");
    const [quantity, setQuantity] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0]);
    const [itemTotal, setItemTotal] = useState<number[]>([]);
    const copyId = (params.slug as string) === "default" ? "" : (params.slug as string);
    const [copied, setCopied] = useState<Order>()

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`/api/customers`);
            const res2 = await fetch(`/api/products`);
            const data = await res.json();
            const data2 = await res2.json();
            if (copyId !== "") {
                const resCopy = await fetch(`/api/orders/${copyId}`);
                const dataCopy = await resCopy.json();
                setCopied(dataCopy)
            }
            setCustomers(data)
            setProducts(data2)
        }
        fetchData();
    }, []);

    async function onSubmit(formData: any) {
        setErrorMessage("")
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

            const updateRes = await fetch(`/api/customers/${selectedCustomerId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ totalSpent: (selectedCustomer?.totalSpent ?? 0) + formData.total }),
            });

            if (!updateRes.ok) throw new Error("Couldn't update customer's totalSpent");

            setRegsResult(selectedCustomer?.corporateName || "");
            setTimeout(() => router.push("/"), 3000);
        } catch (error) {
            setRegsResult(`error: ${error}`);
        }
    }

    function onError(errors: FieldErrors) {
        const messages = `The required fields are missing:${Object.values(errors).map((err: any) => err?.message)}.`;
        setErrorMessage(messages)
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

    const handleQuantityChange = (index: number, value: number) => {
        setQuantity(prev => {
            const newQuantities = [...prev];
            newQuantities[index] = value;
            return newQuantities;
        });
    };

    useEffect(() => {
        const newTotals = selectedProducts.map((product, index) => {
            const qty = quantity[index] || 0;
            const price = product?.unitPrice || 0;
            const total = qty * Number(price);
            setValue(`itemTotal_${index}`, total);

            return total;
        });
        setItemTotal(newTotals);
    }, [quantity, selectedProducts]);

    useEffect(() => {
        const orderTotal = itemTotal.reduce((acc, val) => acc + (val || 0), 0);
        setValue("total", orderTotal);
    }, [itemTotal, setValue]);

    useEffect(() => {
        if (copied && Array.isArray(copied.items)) {
            const defaultValues: any = {
                customerId: copied.customerId,
                deliveryAddress: copied.deliveryAddress,
                observation: copied.observation,
                total: copied.total,
                paymentType: copied.paymentType,
            };

            copied.items.forEach((item, index) => {
                defaultValues[`products.${index}.productId`] = item.productId;
                defaultValues[`quantity_${index}`] = item.quantity;
                defaultValues[`itemTotal_${index}`] = item.itemTotal;
            });

            reset(defaultValues);

            setSelectedCustomerId(Number(copied.customerId));
            setSelectedProducts(prev => {
                const newArr = [...prev];
                copied.items.forEach((item, index) => {
                    const product = products.find(p => p.id === Number(item.productId)) || null;
                    newArr[index] = product;
                });
                return newArr;
            });
            setQuantity(copied.items.map(i => i.quantity));
            setItemTotal(copied.items.map(i => i.itemTotal));
        }
    }, [copied, products, reset]);


    return (
        <>
            <section className="h-full w-full">
                <form onSubmit={handleSubmit(onSubmit, onError)} className="h-full w-full flex gap-2 justify-between">
                    <div className={`w-[35dvw] p-8 dark:bg-[#18181B] bg-[#D4D4D8] gap-4 rounded-sm flex flex-col transition-all duration-300 ${selectedCustomer ? "h-full" : "h-44"}`}>
                        <h1 className="text-3xl text-center">Select a customer</h1>
                        <Controller name="customerId" control={control} render={({ field }) => (
                            <Autocomplete
                                {...field}
                                radius="sm"
                                selectedKey={field.value ? String(field.value) : null}
                                defaultItems={customers}
                                label="Customer"
                                placeholder="Search a customer"
                                onSelectionChange={(key) => {
                                    const id = key ? Number(key) : undefined;
                                    field.onChange(id);
                                    field.onBlur();
                                    setSelectedCustomerId(id);
                                }}
                            >
                                {customers.map((item) => <AutocompleteItem key={item.id}>{item.corporateName}</AutocompleteItem>)}
                            </Autocomplete>
                        )} />
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
                                <Controller name="deliveryAddress" control={control} rules={{ required: " delivery address" }} render={({ field }) => (
                                    <Input radius="sm" className="mt-auto" {...field} label="DELIVERY ADDRESS" />
                                )} />
                                <Controller name="observation" control={control} rules={{ required: " observation" }} render={({ field }) => (
                                    <Input radius="sm" {...field} label="OBSERVATION" />
                                )} />
                                <span className="flex gap-2">
                                    <Controller name="total" control={control} rules={{ required: " total" }} render={({ field }) => (
                                        <Input radius="sm" {...field} label="TOTAL" readOnly value={field.value ? Number(field.value).toFixed(2) : "0.00"} />
                                    )} />
                                    <Controller name="paymentType" control={control} rules={{ required: " payment type" }} render={({ field }) => (
                                        <Input radius="sm" {...field} label="PAYMENT TYPE" />
                                    )} />
                                </span>
                                <Button radius="sm" size="lg" color="primary" type="submit">Register order</Button>
                            </>
                        )}
                    </div>
                    <div className="p-8 w-[62%] dark:bg-[#18181B] bg-[#D4D4D8] h-[86.5dvh] gap-3 rounded-sm grid grid-cols-2 overflow-y-scroll">
                        {selectedProducts.map((product, index) => (
                            <div key={index} className={`dark:bg-[#1F1F21] bg-[#E4E4E7] transition-all h-[380px] duration-200 ${index === 2 || index === 3 && "mb-6"} rounded-sm p-5 flex flex-col gap-3`}>
                                <Controller name={`products.${index}.productId`} control={control} rules={index === 0 ? { required: "at least 1 product" } : {}} render={({ field }) => (
                                    <Autocomplete
                                        {...field}
                                        radius="sm"
                                        defaultItems={products}
                                        label="Product"
                                        placeholder="Search a product"
                                        selectedKey={field.value ? String(field.value) : null}
                                        onSelectionChange={(key) => {
                                            const id = key ? Number(key) : null;
                                            field.onChange(id);
                                            field.onBlur();
                                            handleProduct(index, Number(key))
                                        }}                          >
                                        {products.map((item) => <AutocompleteItem isDisabled={selectedProducts.includes(item)} key={item.id}>{item.name}</AutocompleteItem>)}
                                    </Autocomplete>
                                )} />
                                <span className="grid grid-cols-2 gap-3">
                                    {product && Object.entries(product).map(([key, value]) => (
                                        <Input
                                            key={key}
                                            label={key.toUpperCase()}
                                            value={String(value ?? "")}
                                            readOnly
                                            radius="sm"
                                        />
                                    ))}
                                    {product && <Controller name={`quantity_${index}`} control={control} rules={{ required: ` product ${index} quantity` }} render={({ field }) => (
                                        <Input radius="sm" {...field} label="QUANTITY" onChange={(e) => { handleQuantityChange(index, Number(e.target.value)); field.onChange(Number(e.target.value)); }} />
                                    )} />}
                                </span>
                                {product && <Controller name={`itemTotal_${index}`} control={control} rules={{ required: ` product ${index} total` }} render={({ field }) => (
                                    <Input radius="sm" {...field} label="TOTAL" readOnly value={field.value ? Number(field.value).toFixed(2) : "0.00"} />
                                )} />}
                            </div>
                        ))}
                    </div>
                </form>
            </section>
            {errorMessage && <Alert className="fixed top-2 left-1/2 -translate-x-1/2 w-fit" color="danger" title={errorMessage} />}
            {regsResult.includes("error") ? <Alert className="fixed top-2 left-1/2 -translate-x-1/2 w-fit" color="danger" title={regsResult} />
                :
                regsResult && <Alert className="fixed top-2 left-1/2 -translate-x-1/2 w-fit" color="success" title={`Order from ${regsResult} successfully registered. Returning...`} />
            }
        </>
    )
}
