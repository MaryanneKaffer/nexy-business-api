"use client"
import { Customer } from "@/app/api/customers/route"
import { Order } from "@/app/api/orders/route"
import { Product } from "@/app/api/products/route"
import { Button } from "@heroui/button"
import { useEffect, useMemo, useState } from "react"

export default function SellingsTable({ orders, products, customers }: { orders: Order[], products: Product[], customers: Customer[] }) {
    const [now, setNow] = useState<Date | null>(new Date());
    const currentMonth = now?.getUTCMonth()
    const currentYear = now?.getUTCFullYear()
    const [mobile, setMobile] = useState(false);
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => setMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const month = orders.filter(o => {
        const orderDate = new Date(o.date)
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
    })
    const year = orders.filter(o => {
        const orderDate = new Date(o.date)
        return orderDate.getFullYear() === currentYear
    })

    const bestSelling = useMemo(() => {
        const revenueByProduct: Record<number, number> = {}

        orders.forEach(o => {
            o.items?.forEach(item => {
                const productId = Number(item.productId)
                revenueByProduct[productId] = (revenueByProduct[productId] || 0) + Number(item.itemTotal)
            })
        })

        return products
            .map(p => ({
                ...p,
                revenue: revenueByProduct[p.id] || 0
            }))
            .sort((a, b) => b.revenue - a.revenue)
    }, [orders, products])

    const bestCustomers = [...customers].sort((a, b) => (b.totalSpent ?? 0) - (a.totalSpent ?? 0));

    const content = [
        {
            name: "Earnings", value: [`This month: $${month.reduce((acc, o) => acc + Number(o.total), 0).toFixed(2)}`,
            `This year: $${year.reduce((acc, o) => acc + Number(o.total), 0).toFixed(2)}`,
            `All time: $${orders.reduce((acc, o) => acc + Number(o.total), 0).toFixed(2)}`]
        },
        { name: "Best selling", value: bestSelling.slice(0, 6).map(p => `${p.name}: $${p.revenue.toFixed(2)}`) },
        { name: "Best customers", value: bestCustomers.slice(0, 6).map(c => `${c.corporateName}: $${Number(c.totalSpent).toFixed(2)}`) }
    ]

    const hasAnyContent = content.some(item =>
        item.value.some(v => !v.includes("0.00"))
    );

    return (
        <>
            {mobile &&
                <Button className="h-12 w-full dark:bg-[#27272A] bg-[#D4D4D8] justify-start" radius="sm" onPress={() => setOpen(!isOpen)}>
                    {isOpen ? "Close sellings" : "Open sellings"}
                </Button>
            }
            <div className={`xl:w-[305px] sm:gap-3 gap-1 z-10 sm:static absolute top-9 transition-all flex flex-col sm:w-[30%] sm:h-full dark:bg-[#27272A] bg-default sm:bg-[#D4D4D8] sm:rounded-lg rounded-b-lg xl:p-5 p-3
             ${mobile ? (isOpen ? "opacity-100 w-full" : "max-h-0 opacity-0") : "opacity-100"}`}>
                <p className="dark:text-blue-400 text-blue-500 xl:text-xl sm:text-lg text-sm leading-tight sm:block hidden">Sellings table</p>
                {!hasAnyContent && (
                    <p className="text-gray-500 text-sm">Nothing here yet...</p>
                )}
                {content.map((item, index) => (
                    <span key={item.name + index}>
                        {!item.value[0]?.includes("0.00") && (<>
                            <p className="dark:text-blue-400 text-blue-500 xl:text-xl sm:text-lg text-[14px] leading-tight">{item.name}</p>
                            {item.value.map((value, i) => (
                                <p key={i} className="dark:text-gray-300 ml-1 sm:my-1 xl:text-[16px] sm:text-sm text-[12px] leading-tight">{!value.includes("0.00") && String(value)}</p>
                            ))}
                        </>)}
                    </span>
                ))}
            </div>
        </>
    )
}