"use client"
import { Product } from "@/app/api/products/route";
import HomeButton from "@/components/homeButton";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Alert } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

export default function EditProduct() {
    const { control, handleSubmit, reset } = useForm<Product>();
    const [regsResult, setRegsResult] = useState("");
    const router = useRouter();
    const params = useParams();
    const id = params.slug as string;

    async function onSubmit(formData: Product) {
        const res = await fetch(`/api/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await res.json();
        setRegsResult(formData.name);
        setTimeout(() => {
            router.push("/");
        }, 3000);
        return data;
    }

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`/api/products/${id}`);
            const data = await res.json();
            reset(data);
        }
        fetchData();
    }, [id, reset]);

    return (
        <>
            <section className="flex flex-col dark:bg-[#18181B] bg-[#D4D4D8] gap-4 w-[40dvw] absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-fit mx-auto p-8 rounded-sm">
                <HomeButton />
                <h1 className="text-3xl text-center mb-2">Edit customer</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <Controller name="name" control={control} render={({ field }) => (
                        <Input {...field} size="lg" label="Product name" radius="sm" />
                    )} />
                    <span className="flex gap-2">
                        <Controller name="size" control={control} render={({ field }) => (
                            <Input {...field} size="lg" label="Size" radius="sm" value={field.value?.toString()} onChange={(e) => field.onChange(Number(e.target.value))} />
                        )} />
                        <Controller name="unitPrice" control={control} render={({ field }) => (
                            <Input {...field} size="lg" label="Unit price" radius="sm" value={field.value?.toString()} onChange={(e) => field.onChange(Number(e.target.value))} />
                        )} />
                    </span>
                    <Controller name="description" control={control} render={({ field }) => (
                        <Input {...field} size="lg" label="Description" radius="sm" value={field.value ?? ""} />
                    )} />
                    <Button size="lg" type="submit" radius="sm" color="primary">Save</Button>
                </form>
            </section>

            {regsResult && (
                <Alert
                    className="fixed top-2 left-1/2 -translate-x-1/2 w-fit"
                    color="success"
                    title={`Customer ${regsResult} successfully edited. Returning...`}
                />
            )}
        </>
    );
}
