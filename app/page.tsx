"use client"

import LoadingModal from "@/components/dbLoadingModal";
import { useState } from "react";
import HomePage from "./home/page";

export default function Home() {
    const [loaded, setLoaded] = useState(false);

    return (
        <>
            <LoadingModal onLoad={() => setLoaded(true)} />
            {loaded && <HomePage />}
        </>
    )
}