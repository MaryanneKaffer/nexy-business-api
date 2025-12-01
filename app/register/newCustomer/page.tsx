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
    const router = useRouter();
    const [successMessage, setSuccessMessage] = useState("");
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

            setSuccessMessage(data.corporateName)
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

    const fields = [
        { name: "corporateName", label: "Corporate name" },
        { name: "phone", label: "Phone number" },
        { name: "email", label: "Email", type: "email" },
        { name: "ssn", label: "Social Security Number" },
        { name: "city", label: "City" },
        { name: "state", label: "State" },
        { name: "district", label: "District" },
        { name: "stateRegistration", label: "State registration" },
        { name: "address", label: "Address" },
        { name: "postcode", label: "Postcode" },
    ];

    return (
        <section className="h-full flex">
            <div className="flex my-auto flex-col dark:bg-default/60 bg-[#D4D4D8] relative md:gap-4 gap-2 xl:w-[40dvw] lg:w-[60dvw] w-full h-fit mx-auto md:p-5 p-3 rounded-sm">
                <HomeButton />
                <h1 className="xl:text-3xl md:text-2xl text-center mb-2">Register new Customer</h1>
                <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col gap-4">
                    <span className="grid grid-cols-2 md:gap-4 gap-2">
                        {fields.map((item, i) => (
                            <span key={i} className="flex gap-2">
                                <Controller
                                    key={item.name}
                                    name={item.name}
                                    control={control}
                                    rules={{ required: ` ${item.label.toLowerCase()}` }}
                                    render={({ field }) => (
                                        <Input classNames={{inputWrapper: "dark:bg-[#1F1F21]"}}
                                            {...field}
                                            label={item.label}
                                            radius="sm"
                                            type={item.type || "text"}
                                            className="lg:h-14"
                                        />
                                    )}
                                />
                            </span>
                        ))}
                    </span>
                    <Button className="lg:h-12" type="submit" radius="sm" color="primary">Register</Button>
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
                        title={`Customer ${successMessage} successfully registered. Returning...`} />
                </span>
            )}
        </section>
    )
}