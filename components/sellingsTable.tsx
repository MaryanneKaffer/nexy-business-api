export default function SellingsTable() {
    const preview = [
        { name: "Earnings", value: ["Monthly: $0.00", "Yearly: $0.00", "All time: $0.00"] },
        { name: "Best selling", value: ["Product 1: $0.00", "Product 2: $0.00", "Product 3: $0.00"] },
        { name: "Best customers", value: ["Customer 1: $0.00", "Customer 2: $0.00", "Customer 3: $0.00"] }
    ]
    return (
        <div className="w-[295px] h-full dark:bg-[#27272A] bg-[#D4D4D8] rounded-lg p-5">
            {preview.map((item, index) => (
                <span key={index}>
                    <p className="text-blue-500 text-xl">{item.name}</p>
                    {item.value.map((value) => (
                        <p key={value} className="dark:text-gray-300 ml-3 text-md my-1">{value}</p>
                    ))}
                </span>
            ))}
        </div>
    )
}