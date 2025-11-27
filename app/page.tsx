"use client"

import { useState } from "react";
import HomePage from "./home/page";
import LoadingModal from "@/components/dbLoadingModal";

export default function Home() {
    const [loaded, setLoaded] = useState(false);

    return (
        <>
            <LoadingModal onLoad={() => setLoaded(true)} />
            {loaded && <HomePage />}
        </>
    )
}