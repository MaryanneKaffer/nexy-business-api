"use client"
import HomeButton from "@/components/homeButton";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Alert } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function NewProduct() {
    const { register, handleSubmit } = useForm();
    const [regsResult, setRegsResult] = useState("")
    const router = useRouter();

    async function onSubmit(data: any) {
        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error("Couldn't register product");
            }

            const result = await res.json();
            setRegsResult(data.name)
            setTimeout(() => {
                router.push("/");
            }, 3000);
        } catch (error) {
            setRegsResult(`${error}`)
        }
    }

    return (
        <>
            <section className="flex flex-col bg-[#0F0F0F] gap-4 w-[40dvw] absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-fit mx-auto p-8 rounded-lg">
                <h1 className="text-3xl text-center">Register new Product</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <span className="flex gap-2">
                        <Input size="lg" {...register("name")} label="Product name" />
                    </span>
                    <span className="flex gap-2">
                        <Input size="lg" {...register("size")} label="Size" />
                        <Input size="lg" {...register("unitPrice")} label="Unit price" />
                    </span>

                    <Input size="lg" {...register("description")} label="description" />
                    <Button size="lg" type="submit">Register</Button>
                </form>
            </section>
            {regsResult.includes("error") ? <Alert className="fixed top-2 left-1/2 -translate-x-1/2 w-fit" color="danger" title={regsResult} />
                :
                regsResult && <Alert className="fixed top-2 left-1/2 -translate-x-1/2 w-fit" color="success" title={`Product ${regsResult} successfully registered. Returning...`} />
            }
        </>
    )
}
