import { Avatar } from "@/components/ui/avatar";
import { Toggle } from "@/components/ui/toggle";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { Lightbulb } from "lucide-react";
import { LightbulbOff } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full h-(--header-height) border-b p-2 flex items-center ">
      <div className="flex items-center gap-1">
        <RiMoneyRupeeCircleFill className={"text-[1.75rem] "} />
        <h1 className="text-base font-medium">Expense Tracker</h1>
      </div>
      <Toggle className={"ml-auto mr-4 rounded-2xl"}>
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
