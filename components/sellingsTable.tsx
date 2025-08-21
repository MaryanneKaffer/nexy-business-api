import { Customer } from "@/app/api/customers/route"
import { Order } from "@/app/api/orders/route"
import { Product } from "@/app/api/products/route"
import { useMemo } from "react"

export default function SellingsTable({ orders, products, customers }: { orders: Order[], products: Product[], customers: Customer[] }) {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
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

    const bestCustomers = customers.sort((a, b) => (b.totalSpent ?? 0) - (a.totalSpent ?? 0))

    const content = [
        {
            name: "Earnings", value: [`This month: $${month.reduce((acc, o) => acc + Number(o.total), 0).toFixed(2)}`,
            `This year: $${year.reduce((acc, o) => acc + Number(o.total), 0).toFixed(2)}`,
            `All time: $${orders.reduce((acc, o) => acc + Number(o.total), 0).toFixed(2)}`]
        },
        { name: "Best selling", value: bestSelling.slice(0, 3).map(p => `${p.name}: $${p.revenue.toFixed(2)}`) },
        { name: "Best customers", value: bestCustomers.slice(0, 3).map(c => `${c.corporateName}: $${Number(c.totalSpent).toFixed(2)}`) }
    ]

    return (
        <div className="w-[295px] h-full dark:bg-[#27272A] bg-[#D4D4D8] rounded-lg p-5">
            {content.map((item, index) => (
                <span key={item.name + index}>
                    <p className="text-blue-500 text-xl">{item.name}</p>
                    {item.value.map((value, i) => (
                        <p key={i} className="dark:text-gray-300 ml-3 text-md my-1">{String(value)}</p>
                    ))}
                </span>
            ))}
        </div>
    )
}