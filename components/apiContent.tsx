import { Button, Card, CardBody } from "@heroui/react";
import { useState, useEffect } from "react";
import { Customer } from "@/app/api/customers/route";
import { Product } from "@/app/api/products/route";
import { Order } from "@/app/api/orders/route";
import { IoPerson } from "react-icons/io5";
import { CgNotes } from "react-icons/cg";
import { AiOutlineProduct } from "react-icons/ai";
import { useRouter } from "next/navigation";

export default function ApiContent({ type }: { type: string }) {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const router = useRouter()

    useEffect(() => {
        async function fetchData() {
            const resC = await fetch("/api/customers");
            const resP = await fetch("/api/products");
            const resO = await fetch("/api/orders");

            const dataC = await resC.json();
            const dataP = await resP.json();
            const dataO = await resO.json();

            setCustomers(dataC)
            setProducts(dataP)
            setOrders(dataO)
        }
        fetchData();
    }, []);

    const ViewButton = ({ id }: { id: number }) => {
        const handleView = () => {
            router.push(`/view/${type.replace(/s$/, "")}-${id}`)
        }
        return (
            <Button className="ml-auto w-[140px] group-hover:opacity-100 opacity-0 transition-all duration-200" radius="sm" onPress={() => handleView()}>View</Button>
        )
    }

    return (
        <div className="w-full h-full overflow-y-scroll scroll-hidden dark:bg-[#27272A] bg-[#D4D4D8] rounded-sm p-6">
            <div className="flex flex-col gap-2">
                {type === "customers" && customers.map((item, index) => (
                    <Card key={index} className="h-[114px] p-3 group hover:scale-102" radius="sm">
                        <CardBody >
                            <div className="flex gap-3 h-full">
                                <IoPerson size={60} className="my-auto" />
                                <span className="flex flex-col text-md leading-tight">
                                    <p className="text-xl">{item.corporateName}</p>
                                    <p className="text-gray-400">{item.email}</p>
                                    <p className="text-gray-400">Id: {item.id}</p>
                                </span>
                                <span className="flex flex-col ml-auto text-md leading-tight">
                                    <p className="text-xl text-gray-400 text-center">Orders: {orders.filter(o => Number(o.customerId) === item.id)?.length ?? 0}</p>
                                    <ViewButton id={item.id} />
                                </span>
                            </div>
                        </CardBody>
                    </Card>
                ))}
                {type === "products" && products.map((item, index) => (
                    <Card key={index} className="h-[114px] p-3 hover:scale-102 group" radius="sm">
                        <CardBody>
                            <div className="flex gap-3 h-full">
                                <AiOutlineProduct size={60} className="my-auto" />
                                <span className="flex flex-col text-md leading-tight">
                                    <p className="text-xl">{item.name} <span className="text-gray-400 !text-sm">id: {item.id}</span></p>
                                    <p className="text-gray-400">Description: {item.description}</p>
                                    <p className="text-gray-400">Size: {item.size}</p>
                                </span>
                                <span className="flex flex-col ml-auto text-md leading-tight">
                                    <p className="text-xl text-gray-400 text-center">Unit price: {Number(item.unitPrice).toFixed(2)}</p>
                                    <ViewButton id={item.id} />
                                </span>
                            </div>
                        </CardBody>
                    </Card>
                ))}
                {type === "orders" && orders.map((item, index) => (
                    <Card key={index} className="h-[114px] p-3 hover:scale-102 group" radius="sm">
                        <CardBody>
                            <div className="flex gap-3 h-full">
                                <CgNotes size={60} className="my-auto" />
                                <span className="flex flex-col text-md leading-tight">
                                    <p className="text-xl">Order from {customers.find(c => c.id === Number(item.customerId))?.corporateName ?? "Unknown customer"}</p>
                                    <p className="text-gray-400">Products: {item.items.length}</p>
                                    <p className="text-gray-400">Id: {item.id}</p>
                                </span>
                                <span className="flex flex-col ml-auto text-md leading-tight">
                                    <p className="text-lg">Total: ${Number(item.total).toFixed(2)}</p>
                                    <ViewButton id={Number(item.id)} />
                                </span>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    )
}