import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";

const Header = () => {
  return (
    <header className="w-full h-(--header-height) border-b p-2 flex items-center ">
      <div className="flex items-center gap-1">
        <RiMoneyRupeeCircleFill className={"text-[1.2rem] "} />
        <h1 className="text-base font-medium">Expense Tracker</h1>
      </div>
      <Avatar className={"ml-auto"}>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </header>
  );
};

export default Header;
