import { Customer } from "@/app/api/customers/route";
import { Product } from "@/app/api/products/route";
import { Order } from "@/app/api/orders/route";
import { Cards } from "./cards";

export default function ApiContent({ type, filter, orders, products, customers }: { type: string, filter: string, orders: Order[], products: Product[], customers: Customer[] }) {

    function getCount() {
        if (type === "customers") {
            return filter
                ? customers.filter(c => c.corporateName.includes(filter)).length
                : customers.length;
        }

        if (type === "products") {
            return filter
                ? products.filter(p => p.name.includes(filter)).length
                : products.length;
        }

        if (type === "orders") {
            return filter
                ? orders.filter(o => {
                    const name = customers.find(c => String(c.id) === o.customerId)?.corporateName || "";
                    return name.includes(filter) || String(o.id).includes(filter);
                }).length
                : orders.length;
        }

        return 0;
    }

    return (
        <div className="w-full h-full overflow-y-scroll scroll-hidden dark:bg-[#27272A] bg-[#D4D4D8] rounded-lg lg:px-6 lg:py-3 md:p-4.5 p-3">
            <div className="flex flex-col gap-2">
                <p className="ml-auto">{getCount() + " " + type}</p>
                {type === "customers" && customers && customers.length > 0 ? (filter ? customers.filter((c: Customer) => (c.corporateName.includes(filter))) : customers).map((item) => (
                    <Cards key={item.id} title={item.corporateName} id={String(item.id)} content1={item.email} content2={item.ssn}
                        rightContent1={`Orders: ${orders.filter(o => Number(o.customerId) === item.id)?.length ?? 0}`} type="customer" />
                )) : type === "customers" && <div className="mx-auto">No customers registered</div>}

                {type === "products" && products && products.length > 0 ? (filter ? products.filter((p: Product) => (p.name.includes(filter))) : products).map((item) => (
                    <Cards key={item.id} title={item.name} id={String(item.id)} content1={item.description ?? ""} content2={String(item.size)} rightContent1={`Unit price: $${Number(item.unitPrice).toFixed(2)}`} type="product" />
                )) : type === "products" && <div className="mx-auto">No products registered</div>}

                {type === "orders" && orders && orders.length > 0 ? (filter ? orders.filter((o: Order) => ((customers.find(c => String(c.id) === o.customerId)?.corporateName) || String(o.id)).includes(filter)) : orders).map((item, index) => (
                    <Cards key={index} title={`Order from ${customers.find(c => c.id === Number(item.customerId))?.corporateName}`} id={item.id} content1={`Products: ${item.items.length}`}
                        content2={item.observation} rightContent1={`Total: $${Number(item.total).toFixed(2)}`} type="order" />
                )) : type === "orders" && <div className="mx-auto">No orders registered</div>}

                {!type && <div className="mx-auto">Nothing selected</div>}
            </div>
        </div>
    )
}