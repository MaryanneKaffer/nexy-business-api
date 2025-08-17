"use client"
import { Order } from "@/app/api/orders/route";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Alert } from "@heroui/react";
import { useParams } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";

export default function ViewPage() {
    const params = useParams();
    const id = params.slug as string;
    const [data, setData] = useState<Order>();

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`/api/orders/${id}`);
            const data = await res.json();

            setData(data)
        }
        fetchData();
    }, [id]);

    return (
        <div className="p-8 mx-auto w-[45%] dark:bg-[#27272A] bg-[#D4D4D8] gap-3 rounded-sm">
            {data && (
                <>
                    <h1 className="text-2xl font-bold text-center mb-8">Order id: {data.id}</h1>
                    <div className={`grid grid-cols-2 gap-3`}>

                    </div>
                    <span className="flex gap-3 w-full mt-8">
                        <Button radius="sm" color="primary" className="w-full" >Copy</Button>
                    </span>
                </>
            )}
        </div>
    );
}
