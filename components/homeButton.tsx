"use client";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { TbArrowBackUp } from "react-icons/tb";

export default function HomeButton() {
    const router = useRouter();

    function handleRedirect() {
        router.push("/");
    }

    return (
        <Button className="absolute top-6 left-2 bg-transparent max-w-12" size="lg" onPress={handleRedirect}>
            <TbArrowBackUp size={40}/>
        </Button>
    );
}
