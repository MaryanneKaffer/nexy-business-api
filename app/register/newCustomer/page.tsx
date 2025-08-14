"use client"
import HomeButton from "@/components/homeButton";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Alert } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function NewCustomer() {
    const { register, handleSubmit } = useForm();
    const [regsResult, setRegsResult] = useState("")
    const router = useRouter();

    async function onSubmit(data: any) {
        try {
            const res = await fetch("/api/customers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error("Couldn't register customer");
            }

            const result = await res.json();
            setRegsResult(data.corporateName)
            setTimeout(() => {
                router.push("/");
            }, 3000);
        } catch (error) {
            setRegsResult(`${error}`)
        }
    }

    return (
        <>
            <section className="flex flex-col bg-[#0F0F0F] gap-4 w-[40dvw] absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-fit mx-auto p-8 rounded-sm">
                <h1 className="text-3xl text-center mb-2">Register new Customer</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <span className="flex gap-2">
                        <Input size="lg" {...register("corporateName")} label="Corporate name" radius="sm" />
                        <Input size="lg" {...register("phone")} label="Phone number" radius="sm" />
                    </span>
                    <span className="flex gap-2">
                        <Input size="lg" {...register("email")} label="Email" type="email" radius="sm" />
                        <Input size="lg" {...register("ssn")} label="Social Security Number" radius="sm" />
                    </span>
                    <span className="flex gap-2">
                        <Input size="lg" {...register("city")} label="City" radius="sm" />
                        <Input size="lg" {...register("state")} label="State" radius="sm" />
                    </span>
                    <span className="flex gap-2">
                        <Input size="lg" {...register("district")} label="District" radius="sm"/>
                        <Input size="lg" {...register("stateRegistration")} label="State registration" radius="sm" />
                    </span>
                    <span className="flex gap-2">
                        <Input size="lg" {...register("address")} label="Address" radius="sm" />
                        <Input size="lg" {...register("postcode")} label="Postcode" radius="sm" />
                    </span>
                    <Button size="lg" type="submit" radius="sm">Register</Button>
                </form>
            </section>
            {regsResult.includes("error") ? <Alert className="fixed top-2 left-1/2 -translate-x-1/2 w-fit" color="danger" title={regsResult} />
                :
                regsResult && <Alert className="fixed top-2 left-1/2 -translate-x-1/2 w-fit" color="success" title={`Customer ${regsResult} successfully registered. Returning...`} />
            }
        </>
    )
}
