"use client"
import { Order } from "@/app/api/orders/route";
import HomeButton from "@/components/homeButton";
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
    const router = useRouter();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState<number>();
    const [selectedProducts, setSelectedProducts] = useState<(Product | null)[]>([null, null, null, null, null, null, null, null]);
    const [quantity, setQuantity] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0]);
    const [itemTotal, setItemTotal] = useState<number[]>([]);
    const copyId = (params.slug as string) === "default" ? "" : (params.slug as string);
    const [copied, setCopied] = useState<Order>()
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loaded, setLoaded] = useState(false)
    const [registerLoad, setRegisterLoad] = useState(false)

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
        setTimeout(() => {
            setLoaded(true);
        }, 1500);
    }, []);

    async function onSubmit(formData: any) {
        setErrorMessage("")
        setRegisterLoad(true)
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
                date: new Date().toISOString().slice(0, 19).replace("T", " "),
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

            setSuccessMessage(selectedCustomer?.corporateName || "");
            setRegisterLoad(false)
            setTimeout(() => router.push("/home"), 3000);
        } catch (error) {
            setRegisterLoad(false)
            setErrorMessage(`${error}`);
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
                observation: copied.observation ?? "",
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
            <section className="h-[190dvh] w-full">
                <form onSubmit={handleSubmit(onSubmit, onError)} className="h-full w-full flex lg:flex-row flex-col gap-2 lg:justify-between">
                    <div className={`lg:w-[35dvw] sm:px-8 sm:py-6 p-3 dark:bg-default/60 bg-[#D4D4D8] md:gap-4 gap-2 rounded-sm flex flex-col transition-all duration-300 ${selectedCustomer ? "lg:h-[86.6dvh] md:h-[115dvh] h-[90dvh]" : "md:h-44 h-32"}`}>
                        {!loaded ?
                            <Button isLoading size="lg" className="w-full h-full bg-transparent transition-all duration-700" />
                            : <>
                                <span className="flex relative items-center w-full">
                                    <HomeButton />
                                    <h1 className="sm:text-2xl text-xl text-center mx-auto">Select a customer</h1>
                                </span>
                                <Controller name="customerId" control={control} render={({ field }) => (
                                    <Autocomplete variant="bordered" classNames={{ base: "dark:bg-[#1F1F21] bg-default rounded-xl" }}
                                        className="sm:h-14 h-12"
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
                                            <Input classNames={{ inputWrapper: "dark:bg-[#1F1F21]" }}
                                                className="sm:h-14 h-12"
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
                                            <Input radius="sm" className="mt-auto sm:h-14 h-12" {...field} label="DELIVERY ADDRESS" classNames={{ inputWrapper: "dark:bg-[#1F1F21]" }} />
                                        )} />
                                        <Controller name="observation" control={control} render={({ field }) => (
                                            <Input radius="sm" {...field} label="OBSERVATION" className="sm:h-14 h-12" classNames={{ inputWrapper: "dark:bg-[#1F1F21]" }} />
                                        )} />
                                        <span className="flex gap-2">
                                            <Controller name="total" control={control} rules={{ required: " total" }} render={({ field }) => (
                                                <Input radius="sm" className="sm:h-14 h-12" {...field} label="TOTAL" readOnly value={field.value ? Number(field.value).toFixed(2) : "0.00"} classNames={{ inputWrapper: "dark:bg-[#1F1F21]" }} />
                                            )} />
                                            <Controller name="paymentType" control={control} rules={{ required: " payment type" }} render={({ field }) => (
                                                <Input radius="sm" className="sm:h-14 h-12" {...field} label="PAYMENT TYPE" classNames={{ inputWrapper: "dark:bg-[#1F1F21]" }} />
                                            )} />
                                        </span>
                                        <Button radius="sm" className="sm:h-12 sm:mt-0 mt-1" color="primary" type="submit">Register order</Button>
                                    </>
                                )}
                            </>}
                    </div>
                    {loaded && (
                        <div className="sm:px-8 sm:py-6 p-3 lg:w-[62%] dark:bg-default/60 bg-[#D4D4D8] lg:h-[86.6dvh] rounded-sm overflow-y-scroll md:h-[70dvh] h-[95dvh]">
                            <h1 className="sm:text-2xl text-xl text-center mb-3">Products</h1>
                            <span className="grid md:grid-cols-2 grid-cols-1 gap-2">
                                {selectedProducts.map((product, index) => (
                                    <div key={index} className={`dark:bg-[#1F1F21] bg-[#E4E4E7] transition-all md:h-[365px] h-[325px] duration-200 ${index === 2 || index === 3 && "lg:mb-6"} rounded-sm sm:p-5 p-3 flex flex-col gap-3`}>
                                        <Controller name={`products.${index}.productId`} control={control} rules={index === 0 ? { required: "at least 1 product" } : {}} render={({ field }) => (
                                            <Autocomplete
                                                {...field}
                                                radius="sm" className="sm:h-14 h-12"
                                                defaultItems={products}
                                                label="Product" placeholder="Search a product"
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
                                                    readOnly radius="sm"
                                                    className="sm:h-14 h-12"
                                                />
                                            ))}
                                            {product && <Controller name={`quantity_${index}`} control={control} rules={{ required: ` product ${index} quantity` }} render={({ field }) => (
                                                <Input radius="sm" {...field} className="sm:h-14 h-12" label="QUANTITY" onChange={(e) => { handleQuantityChange(index, Number(e.target.value)); field.onChange(Number(e.target.value)); }} />
                                            )} />}
                                        </span>
                                        {product && <Controller name={`itemTotal_${index}`} control={control} rules={{ required: ` product ${index} total` }} render={({ field }) => (
                                            <Input radius="sm" {...field} className="sm:h-14 h-12" label="TOTAL" readOnly value={field.value ? Number(field.value).toFixed(2) : "0.00"} />
                                        )} />}
                                    </div>
                                ))}
                            </span>
                        </div>
                    )}
                </form>
            </section>
            {errorMessage && (
                <Alert className="fixed top-2 left-1/2 -translate-x-1/2 sm:w-fit w-[80dvw]"
                    color="danger"
                    title={errorMessage} />
            )}

            {registerLoad && (
                <span className="w-[100dvw] h-[100dvh] fixed top-0 left-0 z-100 bg-default/70">
                    <Button isLoading size="lg" className="w-full h-full bg-transparent transition-all duration-700" />
                </span>
            )}

            {successMessage && (
                <span className="w-[100dvw] h-[100dvh] absolute top-0 left-0 z-100">
                    <Alert className="fixed top-2 left-1/2 -translate-x-1/2 sm:w-fit w-[80dvw]"
                        color="success"
                        title={`Order from ${successMessage} successfully registered. Returning...`} />
                </span>
            )}
        </>
    )
}
