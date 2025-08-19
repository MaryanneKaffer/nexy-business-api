import ViewButton from "@/components/viewButton";
import { Card, CardBody } from "@heroui/react";
import { AiOutlineProduct } from "react-icons/ai";
import { CgNotes } from "react-icons/cg";
import { IoPerson } from "react-icons/io5";

export function Cards({ title, id, content1, content2, rightContent1, rightContent2, type }: { title: string; id: string; content1: string, content2?: string, rightContent1: string, rightContent2?: string, type: string }) {
    const icon = type === "order" ? <CgNotes size={60} className="my-auto" /> : type === "product" ? <AiOutlineProduct size={60} className="my-auto" /> : <IoPerson size={60} className="my-auto" />
    return (
        <Card className="h-[114px] p-3 hover:scale-[1.02] group" radius="sm">
            <CardBody>
                <div className="flex gap-3 h-full">
                    {icon}
                    <span className="flex flex-col text-md leading-tight">
                        <p className="text-xl">{title}
                            <span className="text-gray-400 !text-sm"> id: {id} </span>
                        </p>
                        <p className="text-gray-400 text">{content1}</p>
                        {content2 && <p className="text-gray-400">{content2}</p>}
                    </span>
                    <span className="flex flex-col ml-auto text-md leading-tight">
                        <p className="text-xl text-right">{rightContent1}</p>
                        {rightContent2 && <p className="text-xl text-right">{rightContent2}</p>}
                        <ViewButton id={Number(id)} type={type} />
                    </span>
                </div>
            </CardBody>
        </Card>
    )
}