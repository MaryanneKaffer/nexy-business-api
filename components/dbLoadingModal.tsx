import { Button } from "@heroui/button";
import { useEffect, useState } from "react";

export default function LoadingModal({ onClose }: { onClose: any }) {
    const [loadState, setLoadState] = useState("Loading...")
    const [close, setClose] = useState(false);

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
        if (close) onClose();
    }, [close]);

    if (close) return null;

    return (
        <div className="h-full w-full absolute z-100 bg-default/85 top-0 left-0 flex items-center justify-center">
            <div className={`flex flex-col bg-white dark:bg-black justify-center transition-all duration-700 p-3 rounded-lg ${loadState === "Done!" ? "size-[400px]" : "size-[200px]"}`}>
                <Button isLoading size="lg" className={`h-full flex-col bg-transparent transition-all duration-700 ${loadState !== "Done!" ? "opacity-100" : "opacity-0"}`}>
                    {loadState}
                </Button>
                <Button color="primary" radius="sm" className={`mt-auto transition-all duration-700 ${loadState === "Done!" ? "opacity-100" : "opacity-0"}`} onPress={() => setClose(true)}>Close</Button>
            </div>
        </div >
    )
}