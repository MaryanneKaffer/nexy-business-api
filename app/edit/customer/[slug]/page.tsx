"use client"
import { Customer } from "@/app/api/customers/route";
import HomeButton from "@/components/homeButton";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Alert } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

export default function EditCustomer() {
    const { control, handleSubmit, reset } = useForm<Customer>();
    const [customer, setCustomer] = useState<Customer>()
    const [regsResult, setRegsResult] = useState("");
    const router = useRouter();
    const params = useParams();
    const id = params.slug as string;

    async function onSubmit(formData: Customer) {
        const res = await fetch(`/api/customers/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await res.json();
        setRegsResult(formData.corporateName);
        setTimeout(() => {
            router.push("/home");
        }, 3000);
        return data;
    }

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`/api/customers/${id}`);
            const data = await res.json();
            setCustomer(data)
            reset(data);
        }
        fetchData();
    }, [id, reset]);

    return (
        <>
            <section className="flex flex-col bg-[#0F0F0F] gap-4 w-[40dvw] absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-fit mx-auto p-8 rounded-sm">
                <HomeButton />
                <h1 className="text-3xl text-center mb-2">Edit {customer?.corporateName}</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <span className="flex gap-2">
                        <Controller name="corporateName" control={control} render={({ field }) => (
                            <Input {...field} size="lg" label="Corporate name" radius="sm" />
                        )} />
                        <Controller name="phone" control={control} render={({ field }) => (
                            <Input {...field} size="lg" label="Phone number" radius="sm" />
                        )} />
                    </span>
                    <span className="flex gap-2">
                        <Controller name="email" control={control} render={({ field }) => (
                            <Input {...field} size="lg" type="email" label="Email" radius="sm" />
                        )} />
                        <Controller name="ssn" control={control} render={({ field }) => (
                            <Input {...field} size="lg" label="Social Security Number" radius="sm" />
                        )} />
                    </span>
                    <span className="flex gap-2">
                        <Controller name="city" control={control} render={({ field }) => (
                            <Input {...field} size="lg" label="City" radius="sm" />
                        )} />
                        <Controller name="state" control={control} render={({ field }) => (
                            <Input {...field} size="lg" label="State" radius="sm" />
                        )} />
                    </span>
                    <span className="flex gap-2">
                        <Controller name="district" control={control} render={({ field }) => (
                            <Input {...field} size="lg" label="District" radius="sm" />
                        )} />
                        <Controller name="stateRegistration" control={control} render={({ field }) => (
                            <Input {...field} size="lg" label="State registration" radius="sm" />
                        )} />
                    </span>
                    <span className="flex gap-2">
                        <Controller name="address" control={control} render={({ field }) => (
                            <Input {...field} size="lg" label="Address" radius="sm" />
                        )} />
                        <Controller name="postcode" control={control} render={({ field }) => (
                            <Input {...field} size="lg" label="Postcode" radius="sm" />
                        )} />
                    </span>
                    <Button size="lg" type="submit" radius="sm">Save</Button>
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
