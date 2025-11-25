"use client"

import LoadingModal from "@/components/dbLoadingModal";
import { useState } from "react";
import HomePage from "./home/page";

export default function Home() {
    const [showLoading, setShowLoading] = useState(true);

    return (
        <>
            {showLoading ? <LoadingModal onClose={() => setShowLoading(false)} /> : (<HomePage />)}
        </>
    )
}