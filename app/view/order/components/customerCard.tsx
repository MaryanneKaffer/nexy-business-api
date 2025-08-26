import { Order } from "@/app/api/orders/route";
import { Card, CardBody } from "@heroui/react";
import { IoPerson } from "react-icons/io5";
import ViewButton from "../../components/viewButton";

export default function CustomerCard({ data }: { data: Order }) {
    const excludeCustomerKeys = ["email", "id", "totalSpent", "corporateName"];

    return (
        <>
            <div className="bg-gray-500 sm:h-[2px] h-[1px]" />
            <h1 className="sm:text-xl text-lg font-bold">Customer</h1>
            <Card className="h-fit p-3 group hover:scale-102 w-full" radius="sm">
                <CardBody >
                    <div className="flex flex-col gap-3 h-full">
                        <span className="flex items-center gap-3">
                            <IoPerson className="my-auto lg:size-[60px] md:size-[45px] size-[35]" />
                            <span className="flex flex-col leading-tight">
                                <p className="sm:text-xl text-lg">{data.customer.corporateName}</p>
                                <p className="text-gray-400 sm:text-md text-sm">{data.customer.email}</p>
                                <p className="text-gray-400 sm:text-md text-sm">Id: {data.customer.id}</p>
                            </span>
                            <span className="sm:block hidden ml-auto"><ViewButton id={data.customer.id} type={"customer"} /></span>
                            <span className="absolute sm:hidden right-[3dvw]"><ViewButton id={data.customer.id} type={"customer"} /></span>
                        </span>
                        {data.customer.id > 0 && <span className="grid grid-cols-2 text-md leading-tight gap-x-3">
                            {Object.entries(data.customer).filter(([key, _]) => !excludeCustomerKeys.includes(key)).map(([key, value]) => (
                                <p key={key} className="sm:text-md text-[13px] mt-2">{key.toUpperCase()}: {String(value)}</p>
                            ))}
                        </span>}
                    </div>
                </CardBody>
            </Card>
        </>
    )
}