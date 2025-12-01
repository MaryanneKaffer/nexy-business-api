import { Customer } from "@/app/api/customers/route";
import { Order } from "@/app/api/orders/route";
import { Product } from "@/app/api/products/route";
import { Cards } from "@/components/cards";

interface ProductTotals {
    [productId: number]: { quantity: number; total: number };
}

export default function HistoryInfo({ productTotal, products, data }: { productTotal: ProductTotals, products: Product[], data?: Customer }) {
    return (
        <div className="sm:p-5 p-3 mx-auto lg:w-[60%] w-full lg:h-[86dvh] h-[90dvh] dark:bg-default/60 bg-[#D4D4D8] gap-3 rounded-sm flex flex-col mb-3 sm:mb-0">
            <div className="dark:bg-[#202022] bg-[#E4E4E7] sm:gap-3 gap-2 rounded-sm flex flex-col sm:p-5 p-3 h-[49%] overflow-y-scroll">
                <span className="flex justify-between">
                    <h1 className="sm:text-xl w-[75%]">Orders</h1>
                    <h1 className="sm:text-xl text-gray-500">Total: {data?.orders?.length ?? 0}</h1>
                </span>
                <div className="flex flex-col gap-3">
                    {data?.orders && data.orders.map((o) => (
                        <Cards key={o.id} title={o.date} id={o.id} content1={`Products: ${o.items.length}`} rightContent1={`Total: ${Number(o.total).toFixed(2)}`} type="order" />
                    ))}
                </div>
            </div>
            <div className="dark:bg-[#1F1F21] bg-[#E4E4E7] gap-3 rounded-sm flex flex-col sm:p-5 p-3 h-[49%] overflow-y-scroll">
                <span className="flex justify-between">
                    <h1 className="sm:text-xl w-[75%]">Most bought products</h1>
                    <h1 className="sm:text-xl text-gray-500">Total: {products.length}</h1>
                </span>
                <div className="flex flex-col gap-3">
                    {products && products.map((item) => (
                        <Cards key={item.id} title={item.name}
                            id={`${item.id} ${window.innerWidth > 790 ? `| included in ${data?.orders.filter((order: Order) => order.items.some(i => Number(i.productId) === item.id)).length} orders` : ""} `}
                            content1={item.description ?? ""}
                            content2={String(item.size)}
                            rightContent1={`Total: ${productTotal[item.id].total.toFixed(2)}`}
                            rightContent2={window.innerWidth > 790 ? `Quantity: ${productTotal[item.id].quantity}` : ""}
                            type="product" />
                    ))}
                </div>
            </div>
        </div>
    )
}