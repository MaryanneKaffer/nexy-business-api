import { Button } from "@heroui/button"
import { useRouter } from "next/navigation"

export default function ViewButton({ id, type }: { id: number, type: string }) {
    const router = useRouter()

    const handleView = () => {
        router.push(`/view/${type.replace(/s$/, "")}/${id}`)
    }
    return (
        <Button className="ml-auto w-[140px] group-hover:opacity-100 opacity-0 transition-all duration-200" radius="sm" onPress={() => handleView()}>View</Button>
    )
}