import { Card, CardBody } from "@heroui/react";
import { AiOutlineProduct } from "react-icons/ai";
import { CgNotes } from "react-icons/cg";
import { IoPerson } from "react-icons/io5";
import ViewButton from "@/app/view/components/viewButton";

export function Cards({ title, id, content1, content2, rightContent1, rightContent2, type }: { title: string; id: string; content1: string, content2?: string, rightContent1: string, rightContent2?: string, type: string }) {
    const icon = type === "order" ? <CgNotes className="my-auto lg:size-[60px] md:size-[45px] sm:block hidden" /> :
        type === "product" ? <AiOutlineProduct className="my-auto lg:size-[60px] md:size-[45px] sm:block hidden" /> :
            <IoPerson className="my-auto lg:size-[60px] md:size-[45px] sm:block hidden" />
    return (
        <Card className="h-[114px] md:p-3 p-2 hover:scale-[1.02] group" radius="sm">
            <CardBody>
                <div className="flex md:gap-3 gap-2 h-full">
                    {icon}
                    <span className="flex flex-col sm:text-md leading-tight sm:w-auto w-[68%]">
                        <p className="lg:text-xl md:text-lg text-[15px]">{title}
                            <span className="text-gray-400 text-sm"> id: {id} </span>
                        </p>
                        <p className="text-gray-400 md:text-md text-[14px]">{content1}</p>
                        {content2 && <p className="text-gray-400 md:text-md text-[14px]">{content2}</p>}
                    </span>
                    <span className="flex flex-col gap-1 ml-auto text-md leading-tight sm:w-auto w-[30%]">
                        <p className="lg:text-xl text-right text-sm">{rightContent1}</p>
                        {rightContent2 && <p className="lg:text-xl text-sm text-gray-400 text-right transition-all group-hover:h-0 h-2 group-hover:opacity-0 opacity-100 transition-500">{rightContent2}</p>}
                        <ViewButton id={Number(id)} type={type} />
                    </span>
                </div>
            </CardBody>
        </Card>
    )
}