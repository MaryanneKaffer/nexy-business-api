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
    const router = useRouter();
    const [successMessage, setSuccessMessage] = useState("");
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

            setSuccessMessage(data.name)
            setTimeout(() => {
                router.push("/home");
            }, 3000);
        } catch (error) {
            setErrorMessage(`${error}`)
        }
    }

    function onError(errors: FieldErrors) {
        const messages = `The required fields are missing:${Object.values(errors).map((err: any) => err?.message)}.`;
        setErrorMessage(messages)
    }

    return (
        <section className="h-full flex">
            <div className="flex my-auto flex-col dark:bg-default/50 bg-[#D4D4D8] relative md:gap-4 gap-2 xl:w-[40dvw] lg:w-[60dvw] w-full h-fit mx-auto md:p-8 p-5 rounded-sm">
                <HomeButton />
                <h1 className="xl:text-3xl md:text-2xl text-center mb-2">Register new Product</h1>
                <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col md:gap-4 gap-2">
                    <span className="flex gap-2">
                        <Controller name="name" control={control} rules={{ required: " product name" }} render={({ field }) => (
                            <Input className="lg:h-14" {...field} label="Product name" radius="sm" />
                        )} />
                    </span>
                    <span className="flex gap-2">
                        <Controller name="size" control={control} rules={{ required: " size" }} render={({ field }) => (
                            <Input className="lg:h-14" {...field} label="Size" radius="sm" />
                        )} />
                        <Controller name="unitPrice" control={control} rules={{ required: " unit price" }} render={({ field }) => (
                            <Input type="number" {...field} label="Unit price" radius="sm" className="lg:h-14" />
                        )} />
                    </span>
                    <Controller name="description" control={control} render={({ field }) => (
                        <Input className="lg:h-14"{...field} label="Description" radius="sm" />
                    )} />
                    <Button className="lg:h-14 md:mt-0 mt-1" type="submit" radius="sm" color="primary">Register</Button>
                </form>
            </div>
            {errorMessage && (
                <Alert className="fixed top-2 left-1/2 -translate-x-1/2 sm:w-fit w-[80dvw]"
                    color="danger"
                    title={errorMessage} />
            )}
            {successMessage && (
                <span className="w-[100dvw] h-[100dvh] absolute top-0 left-0 z-100">
                    <Alert className="fixed top-2 left-1/2 -translate-x-1/2 sm:w-fit w-[80dvw]"
                        color="success"
                        title={`Product ${successMessage} successfully registered. Returning...`} />
                </span>
            )}
        </section>
    )
}
