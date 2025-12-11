import { Button } from "@/components/ui/button";
import { DrawerContent, DrawerTrigger, Drawer } from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DateSelect = () => {
  const months = [
    { value: 0, name: "Jan" },
    { value: 1, name: "Feb" },
    { value: 2, name: "Mar" },
    { value: 3, name: "Apr" },
    { value: 4, name: "May" },
    { value: 5, name: "Jun" },
    { value: 6, name: "Jul" },
    { value: 7, name: "Aug" },
    { value: 8, name: "Sep" },
    { value: 9, name: "Oct" },
    { value: 10, name: "Nov" },
    { value: 11, name: "Dec" },
  ];
  const years = () => {
    const current = new Date().getFullYear();
    const list = [];

    for (let i = 0; i < 20; i++) {
      list.push(current - i);
    }

    return list;
  };

  console.log("YEARS", years());

  return (
    <Drawer
      className="p-0"
      onOpenChange={(open) => {
        if (open) {
        } else {
        }
      }}
    >
      <DrawerTrigger asChild className="border-b-2 border-blue-500">
        <div className="flex justify-center items-center">June</div>
      </DrawerTrigger>
      <DrawerContent className={"p-1"}>
        <div className="flex justify-around items-center p-3">
          <div
            className={
              "text-base h-60 overflow-y-auto overflow-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            }
          >
            {months.map((month) => (
              <div className="h-20 flex items-center justify-center">
                <div>{month.name}</div>
              </div>
            ))}
          </div>
          <div
            className={
              "text-base h-60 overflow-y-auto overflow-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            }
          >
            {years().map((year) => (
              <div className="h-20 flex items-center justify-center">
                <div>{year}</div>
              </div>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DateSelect;
