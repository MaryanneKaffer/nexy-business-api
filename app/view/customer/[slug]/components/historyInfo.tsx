import { Customer } from "@/app/api/customers/route";
import { Order } from "@/app/api/orders/route";
import { Product } from "@/app/api/products/route";
import { Cards } from "@/components/cards";

interface ProductTotals {
    [productId: number]: { quantity: number; total: number };
}

export default function HistoryInfo({ productTotal, products, data }: { productTotal: ProductTotals, products: Product[], data?: Customer }) {
    return (
        <div className="p-5 mx-auto lg:w-[60%] w-full lg:h-[86dvh] h-[140dvh] dark:bg-[#18181B] bg-[#D4D4D8] gap-3 rounded-sm flex flex-col">
            <div className="dark:bg-[#202022] bg-[#E4E4E7] sm:gap-3 gap-2 rounded-sm flex flex-col p-5 h-[49%] overflow-y-scroll">
                <span className="flex justify-between">
                    <h1 className="sm:text-xl w-[75%]">Orders from {data?.corporateName}</h1>
                    <h1 className="sm:text-xl text-gray-500">Total: {data?.orders?.length ?? 0}</h1>
                </span>
                <div className="flex flex-col gap-3">
                    {data?.orders && data.orders.map((o) => (
                        <Cards key={o.id} title={o.date} id={o.id} content1={`Products: ${o.items.length}`} rightContent1={`Total: ${Number(o.total).toFixed(2)}`} type="order" />
                    ))}
                </div>
            </div>
            <div className="dark:bg-[#202022] bg-[#E4E4E7] gap-3 rounded-sm flex flex-col p-5 h-[49%] overflow-y-scroll">
                <span className="flex justify-between">
                    <h1 className="sm:text-xl w-[75%]">Most bought products from {data?.corporateName}</h1>
                    <h1 className="sm:text-xl text-gray-500">Total: {products.length}</h1>
                </span>
                <div className="flex flex-col gap-3">
                    {products && products.map((item) => (
                        <Cards key={item.id} title={item.name} id={`${item.id} | included in ${data?.orders.filter((order: Order) => order.items.some(i => Number(i.productId) === item.id)).length} orders`} content1={item.description ?? ""}
                            content2={String(item.size)} rightContent1={`Total: ${productTotal[item.id].total.toFixed(2)}`} rightContent2={`Quantity: ${productTotal[item.id].quantity}`} type="product" />
                    ))}
                </div>
            </div>
        </div>
    )
}