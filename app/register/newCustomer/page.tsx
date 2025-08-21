"use client"
import HomeButton from "@/components/homeButton";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Alert } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller, FieldErrors } from "react-hook-form";

export default function NewCustomer() {
    const { control, handleSubmit } = useForm();
    const [regsResult, setRegsResult] = useState("")
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");

    async function onSubmit(data: any) {
        setErrorMessage("")
        try {
            const res = await fetch("/api/customers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error("Couldn't register customer");
            }

            setRegsResult(data.corporateName)
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
            <section className="flex flex-col dark:bg-[#18181B] bg-[#D4D4D8] gap-4 w-[40dvw] absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-fit mx-auto p-8 rounded-sm">
                <HomeButton />
                <h1 className="text-3xl text-center mb-2">Register new Customer</h1>
                <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col gap-4">
                    <span className="flex gap-2">
                        <Controller name="corporateName" control={control} rules={{ required: " corporate name" }} render={({ field }) => (
                            <Input size="lg" {...field} label="Corporate name" radius="sm" />
                        )} />
                        <Controller name="phone" control={control} rules={{ required: " phone number" }} render={({ field }) => (
                            <Input size="lg" {...field} label="Phone number" radius="sm" />
                        )} />
                    </span>
                    <span className="flex gap-2">
                        <Controller name="email" control={control} rules={{ required: " e-mail" }} render={({ field }) => (
                            <Input size="lg" {...field} label="Email" type="email" radius="sm" />
                        )} />
                        <Controller name="ssn" control={control} rules={{ required: " social security number" }} render={({ field }) => (
                            <Input size="lg" {...field} label="Social Security Number" radius="sm" />
                        )} />
                    </span>
                    <span className="flex gap-2">
                        <Controller name="city" control={control} rules={{ required: " city" }} render={({ field }) => (
                            <Input size="lg" {...field} label="City" radius="sm" />
                        )} />
                        <Controller name="state" control={control} rules={{ required: " state" }} render={({ field }) => (
                            <Input size="lg" {...field} label="State" radius="sm" />
                        )} />
                    </span>
                    <span className="flex gap-2">
                        <Controller name="district" control={control} rules={{ required: " district" }} render={({ field }) => (
                            <Input size="lg" {...field} label="District" radius="sm" />
                        )} />
                        <Controller name="stateRegistration" control={control} rules={{ required: " state registration" }} render={({ field }) => (
                            <Input size="lg" {...field} label="State registration" radius="sm" />
                        )} />
                    </span>
                    <span className="flex gap-2">
                        <Controller name="address" control={control} rules={{ required: " address" }} render={({ field }) => (
                            <Input size="lg" {...field} label="Address" radius="sm" />
                        )} />
                        <Controller name="postcode" control={control} rules={{ required: " postcode" }} render={({ field }) => (
                            <Input size="lg" {...field} label="Postcode" radius="sm" />
                        )} />
                    </span>
                    <Button size="lg" type="submit" radius="sm" color="primary">Register</Button>
                </form>
            </section>
            {errorMessage && <Alert className="fixed top-2 left-1/2 -translate-x-1/2 w-fit" color="danger" title={errorMessage} />}
            {regsResult.includes("error") ? <Alert className="fixed top-2 left-1/2 -translate-x-1/2 w-fit" color="danger" title={regsResult} />
                :
                regsResult && <Alert className="fixed top-2 left-1/2 -translate-x-1/2 w-fit" color="success" title={`Customer ${regsResult} successfully registered. Returning...`} />
            }
        </>
    )
}
