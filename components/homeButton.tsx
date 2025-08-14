"use client";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { GoHomeFill } from "react-icons/go";

export default function HomeButton() {
    const router = useRouter();

    function handleRedirect() {
        router.push("/");
    }

    return (
        <Button className="absolute top-2 left-2 bg-transparent max-w-12" size="lg" onPress={handleRedirect}>
            <GoHomeFill />
        </Button>
    );
}
