"use client";
import { Avatar } from "@/components/ui/avatar";
import { Toggle } from "@/components/ui/toggle";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { Lightbulb } from "lucide-react";
import { useTheme } from "next-themes";

const Header = () => {
  const { value, setTheme } = useTheme();
  return (
    <header className="w-full h-(--header-height) p-2 flex items-center sticky top-0 z-50 bg-(--background)">
      <div className="flex items-center gap-1">
        <RiMoneyRupeeCircleFill className={"text-[1.75rem] "} />
        <h1 className="text-base font-medium">Expense Tracker</h1>
      </div>
      <Toggle
        defaultPressed={value == "dark" ? true : false}
        onPressedChange={(e) => setTheme(e ? "light" : "dark")}
        className={"ml-auto mr-4 rounded-2xl"}
      >
        <Lightbulb />
      </Toggle>
      <Avatar className={""}>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </header>
  );
};

export default Header;
