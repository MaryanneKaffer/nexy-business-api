"use client";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { TbArrowBackUp } from "react-icons/tb";

export default function HomeButton() {
    const router = useRouter();

    function handleRedirect() {
        router.push("/home");
    }

    return (
        <Button className="bg-transparent w-fit md:size-[40px] size-[25px] p-0 absolute" onPress={handleRedirect} aria-label="home button">
            <TbArrowBackUp className="md:size-[40px] size-[25px]" />
        </Button>
    );
}