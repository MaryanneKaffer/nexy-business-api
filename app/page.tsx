"use client"
import React, { useEffect, useState } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Input, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { FaIdCard } from "react-icons/fa6";
import { IoBagHandleSharp } from "react-icons/io5";
import { MdOutlinePayments } from "react-icons/md";
import { FaCaretDown } from "react-icons/fa";
import { SearchIcon } from "@/components/searchIcon";
import ApiContent from "@/components/apiContent";
import SellingsTable from "@/components/sellingsTable";
import { useRouter } from "next/navigation";
import { ThemeSwitch } from "@/components/theme-switch";
import { Customer } from "./api/customers/route";
import { Product } from "./api/products/route";
import { Order } from "./api/orders/route";

export default function Home() {
  const keys = [{ icon: <FaIdCard />, content: "Customers" }, { icon: <MdOutlinePayments />, content: "Orders" }, { icon: <IoBagHandleSharp />, content: "Products" }];
  const [selectedKeys, setSelectedKeys] = useState(new Set(["Select"]));
  const [value, setValue] = useState("")
  const [filter, setFilter] = useState("")
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [resC, resP, resO] = await Promise.all([
        fetch("/api/customers"),
        fetch("/api/products"),
        fetch("/api/orders")
      ]);
      const [dataC, dataP, dataO] = await Promise.all([
        resC.json(),
        resP.json(),
        resO.json()
      ])
      setCustomers(dataC)
      setProducts(dataP)
      setOrders(dataO)
    }
    fetchData();
  }, []);

  function handleRedirect() {
    router.push(`/register/new${selectedValue.replace(/s$/, "")}${selectedValue === "Orders" ? "/default" : ""}`);
  }

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
    [selectedKeys],
  );

  return (
    <section className="flex flex-col gap-4 w-full h-full">
      <div className="flex gap-2">
        <span className="flex items-center"><ThemeSwitch /></span>
        <span>
          <Dropdown className="text-2xl">
            <DropdownTrigger>
              <Button radius="sm" className="px-3 w-[145px] gap-1 dark:bg-[#27272A]" size="lg" endContent={<FaCaretDown size={16} />}>
                {selectedValue}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Single selection example"
              selectedKeys={selectedValue}
              selectionMode="single"
              variant="flat"
              onSelectionChange={(keys) => {
                if (keys !== "all") {
                  const newValue = Array.from(keys).join(", ").replace(/_/g, "").toLowerCase();
                  setSelectedKeys(new Set(keys as Set<string>));
                  setValue(newValue);
                }
              }}          >
              {keys.map((item) => (
                <DropdownItem startContent={item.icon} key={item.content}>{item.content}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </span>
        <Popover placement="bottom">
          <PopoverTrigger>
            <Button disabled={selectedValue === "Select"} radius="sm" className="gap-1 px-5 min-w-[45px]" color="primary" size="lg">
              New
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2 flex flex-col gap-2">
              <div className="text-md font-bold">Register new {selectedValue.replace(/s$/, "")}?</div>
              <Button className="px-1 mx-auto gap-1 w-fit" size="md" onPress={() => handleRedirect()}>
                Confirm
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <Input
          isClearable
          classNames={{
            label: "text-black/50 dark:text-white/90",
            inputWrapper: [
              "hover:bg-default-200/70",
              "dark:hover:bg-default",
              "dark:bg-default-200/70",
              "bg-default",
            ],
          }}
          className="w-full"
          placeholder="Type to search..."
          radius="sm"
          size="lg"
          onChange={(e) => setFilter(e.target.value)}
          startContent={<SearchIcon />}
        />
      </div>
      <div className="flex gap-2 w-full h-[79dvh]">
        <SellingsTable orders={orders} products={products} customers={customers} />
        <ApiContent type={value} filter={filter} orders={orders} products={products} customers={customers} />
      </div>
    </section >
  );
}

