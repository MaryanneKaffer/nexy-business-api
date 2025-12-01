import { Order } from "@/app/api/orders/route";
import { Cards } from "@/components/cards";
import { Input } from "@heroui/input";

export default function ProductList({ data }: { data: Order }) {
    return (
        <div className="sm:p-5 p-3 mx-auto lg:w-[60%] h-[90dvh] dark:bg-default/60 bg-[#D4D4D8] gap-3 rounded-sm flex flex-col sm:mb-0 mb-6">
            <h1 className="sm:text-2xl text-xl text-center mx-auto">Products</h1>
            <div className="dark:bg-default/20 bg-[#E4E4E7] rounded-sm flex flex-col lg:h-[82%] h-[72dvh]">
                <div className="h-full w-full overflow-y-scroll flex flex-col gap-3 sm:px-5 px-3 py-5">
                    {data?.items.map((item) => (
                        <Cards key={item.productId} title={item.product.name} id={String(item.product.id)} 
                        content1={item.product.description ?? ""} 
                        content2={String(item.product.size)} type="product"
                            rightContent1={`Total: ${Number(item.itemTotal).toFixed(2)}`} 
                            rightContent2={window.innerWidth > 790 ? `Quantity: ${item.quantity}` : ""} />
                    ))}
                </div>
            </div>
            <Input label={"TOTAL"} classNames={{ inputWrapper: "dark:bg-[#1F1F21]" }} value={Number(data?.total).toFixed(2)} readOnly radius="sm" className="sm:h-14 h-12 mt-auto" />
        </div>
    )
}