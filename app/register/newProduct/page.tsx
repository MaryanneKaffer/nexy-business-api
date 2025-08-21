"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller, FieldErrors } from "react-hook-form";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Alert } from "@heroui/react";
import HomeButton from "@/components/homeButton";

export default function NewProduct() {
    const { control, handleSubmit } = useForm();
    const [regsResult, setRegsResult] = useState("")
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");

    async function onSubmit(data: any) {
        setErrorMessage("")
        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error("Couldn't register product");
            }

            setRegsResult(data.name)
            setTimeout(() => {
                router.push("/");
            }, 3000);
        } catch (error) {
            setRegsResult(`${error}`)
        }
    }

    function onError(errors: FieldErrors) {
        const messages = `The required fields are missing:${Object.values(errors).map((err: any) => err?.message)}.`;
        setErrorMessage(messages)
    }

    return (
        <>
            <section className="flex flex-col dark:bg-[#18181B] bg-[#D4D4D8] gap-4 w-[40dvw] absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-fit mx-auto p-8 rounded-lg">
                <HomeButton />
                <h1 className="text-3xl text-center">Register new Product</h1>
                <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col gap-4">
                    <span className="flex gap-2">
                        <Controller name="name" control={control} rules={{ required: " product name" }} render={({ field }) => (
                            <Input size="lg" {...field} label="Product name" radius="sm" />
                        )} />
                    </span>
                    <span className="flex gap-2">
                        <Controller name="size" control={control} rules={{ required: " size" }} render={({ field }) => (
                            <Input size="lg" {...field} label="Size" radius="sm" />
                        )} />
                        <Controller name="unitPrice" control={control} rules={{ required: " unit price" }} render={({ field }) => (
                            <Input type="number" size="lg" {...field} label="Unit price" radius="sm" />
                        )} />
                    </span>
                    <Controller name="description" control={control} render={({ field }) => (
                        <Input size="lg" {...field} label="Description" radius="sm" />
                    )} />
                    <Button size="lg" type="submit" radius="sm" color="primary">Register</Button>
                </form>
            </section>
            {errorMessage && <Alert className="fixed top-2 left-1/2 -translate-x-1/2 w-fit" color="danger" title={errorMessage} />}
            {regsResult.includes("error") ? <Alert className="fixed top-2 left-1/2 -translate-x-1/2 w-fit" color="danger" title={regsResult} />
                :
                regsResult && <Alert className="fixed top-2 left-1/2 -translate-x-1/2 w-fit" color="success" title={`Product ${regsResult} successfully registered. Returning...`} />
            }
        </>
    )
}
