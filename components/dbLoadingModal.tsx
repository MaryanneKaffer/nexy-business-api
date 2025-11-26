import { Button } from "@heroui/button";
import { useEffect, useState } from "react";
import { IoAlertCircleOutline } from "react-icons/io5";

export default function LoadingModal({ onLoad }: { onLoad: any }) {
    const [loadState, setLoadState] = useState("Loading...")
    const [close, setClose] = useState(false);

    const alertMessage = "This demo includes some sample data.\n Any information you add will be deleted.\n Do not store real or sensitive data.\n"

    useEffect(() => {
        setLoadState("Refreshing Database...");
        fetch("/api/reset", { method: "POST" })
            .catch(err => console.error("Reset error:", err));

        setLoadState("Generating Example Data...");
        fetch("/api/seed", { method: "POST" })
            .catch(err => console.error("Reset error:", err));

        setLoadState("Done!");
    }, []);

    useEffect(() => {
        if (loadState === "Done!") onLoad();
    }, [loadState]);

    if (close) return null;

    return (
        <div className="h-full w-full absolute z-100 bg-default/85 top-0 left-0 flex items-center justify-center">
            <div className={`flex flex-col bg-white dark:bg-black items-center transition-all duration-700 sm:p-5 p-3 rounded-lg ${loadState === "Done!" ? "sm:h-[300px] h-[220px] sm:w-[450px] w-[80dvw]" : "size-[200px]"}`}>
                <Button isLoading size="lg" className={`h-full flex-col bg-transparent transition-all duration-700 ${loadState !== "Done!" ? "opacity-100" : "opacity-0 size-0"}`}>
                    {loadState}
                </Button>
                <div className={`flex flex-col transition-all duration-700 size-full items-center ${loadState === "Done!" ? "opacity-100" : "opacity-0 size-0"}`}>
                    <IoAlertCircleOutline color="orange" className="sm:size-20 size-15" />
                    <p className="whitespace-pre-line my-auto text-center sm:text-lg text-sm">{alertMessage}</p>
                    <Button color="primary" radius="sm" className="mt-auto" onPress={() => setClose(true)}>Close</Button>
                </div>
            </div>
        </div >
    )
}