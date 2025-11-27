import { useEffect, useState } from "react";
import { IoAlertCircleOutline } from "react-icons/io5";
import { Button } from "@heroui/button";
import { motion } from "framer-motion";

export default function LoadingModal({ onLoad }: { onLoad: any }) {
    const [loadState, setLoadState] = useState("Loading...")
    const [close, setClose] = useState(false);
    const [loaded, setLoaded] = useState(false)

    const alertMessage = "This demo includes some sample data.\n Any information you add will be deleted.\n Do not store real or sensitive data.\n"

    useEffect(() => {
        setLoadState("Refreshing Database...");
        fetch("/api/reset", { method: "POST" })
            .catch(err => console.error("Reset error:", err));

        setLoadState("Generating Example Data...");
        fetch("/api/seed", { method: "POST" })
            .catch(err => console.error("Reset error:", err));

        setTimeout(() => {
            setLoadState("Done!");
            setLoaded(true);
        }, 2000);
    }, []);

    useEffect(() => {
        if (loaded === true) onLoad();
    }, [loadState]);

    if (close) return null;

    return (
        <div className="h-full w-full absolute z-100 bg-default/85 top-0 left-0 flex items-center justify-center">
            <div className={`flex flex-col bg-white dark:bg-black items-center transition-all duration-700 sm:p-5 p-3 rounded-lg 
                ${loaded ? "sm:h-[300px] h-[220px] sm:w-[450px] w-[80dvw]" : "size-[240px]"}`}>
                {!loaded && <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.5 }} className="flex h-full">
                    <Button isLoading size="lg" className="my-auto h-full flex-col bg-transparent transition-all duration-700">
                        {loadState}
                    </Button>
                </motion.div>}
                {loaded && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="flex flex-col transition-all duration-700 size-full items-center">
                    <IoAlertCircleOutline color="orange" className="sm:size-20 size-15" />
                    <p className="whitespace-pre-line my-auto text-center sm:text-lg text-sm">{alertMessage}</p>
                    <Button color="primary" radius="sm" className="mt-auto" onPress={() => setClose(true)}>Close</Button>
                </motion.div>}
            </div>
        </div >
    )
}