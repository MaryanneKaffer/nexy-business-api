import { Order } from "@/app/api/orders/route";
import { Cards } from "@/components/cards";
import { Input } from "@heroui/input";

export default function ProductList({ data }: { data: Order }) {
    return (
        <div className="sm:p-8 p-5 mx-auto lg:w-[60%] h-[86dvh] dark:bg-[#18181B] bg-[#D4D4D8] gap-3 rounded-sm flex flex-col">
            <h1 className="sm:text-2xl text-xl text-center mx-auto mb-1">Products</h1>
            <div className="dark:bg-[#202022] bg-[#E4E4E7] gap-3 rounded-sm flex flex-col lg:h-[82%] h-full">
                <div className="h-full w-full overflow-y-scroll flex-1 sm:px-7 px-4 py-5">
                    {data?.items.map((item) => (
                        <Cards key={item.productId} title={item.product.name} id={String(item.product.id)} content1={item.product.description ?? ""} content2={String(item.product.size)} type="product"
                            rightContent1={`Total: ${Number(item.itemTotal).toFixed(2)}`} rightContent2={`Quantity: ${item.quantity}`} />
                    ))}
                </div>
            </div>
            <Input label={"TOTAL"} value={Number(data?.total).toFixed(2)} readOnly radius="sm" className="sm:h-14 h-12 mt-auto" />
        </div>
    )
}