import { Button } from "@heroui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ name, item, id, setDeleted }: { name: string, item: string, id: string, setDeleted: any }) {
    const router = useRouter();
    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/${item}/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const error = await res.json();
                alert({ error });
                return;
            }

            setDeleted(name ?? item.replace(/s$/, ""))
            setTimeout(() => {
                router.push("/home");
            }, 3000);
        } catch (err) {
            alert(`Couldn't delete ${item.replace(/s$/, "")}` + err);
        }
    };
    return (
        <Popover>
            <PopoverTrigger>
                <Button radius="sm" color="danger" className="sm:h-12 sm:mt-0 mt-2 h-9 w-full">Delete</Button>
            </PopoverTrigger>
            <PopoverContent>
                <div className="px-1 py-2 flex flex-col">
                    <p className="text-md font-bold -mb-1">Are you sure you want to delete {name}?</p>
                    <p className="text-sm font-bold text-gray-500 text-center">This action is irreversible</p>
                    <Button className="px-1 mx-auto gap-1 w-fit mt-2" color="danger" size="md" onPress={handleDelete}>
                        Delete
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}