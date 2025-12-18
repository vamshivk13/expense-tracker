import { Button } from "@/components/ui/button";
import {
  DrawerContent,
  DrawerTrigger,
  Drawer,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const DateSelect = ({ setCurMonth, setCurYear, curMonth }) => {
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

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const yearRefs = useRef(Object.create(null));

  const itemRefs = useRef(Object.create(null));

  useEffect(() => {
    setTimeout(() => {
      const node = itemRefs.current[selectedMonth];
      if (node) {
        console.log("NODE", node);
        node.scrollIntoView({
          behavior: "smooth",
          block: "center", // center the selected item within the container
          inline: "nearest",
        });
      }
    }, 100);
  }, [selectedMonth]);

  useEffect(() => {
    const node = yearRefs.current[selectedYear];
    if (node) {
      console.log("NODE", node);
      node.scrollIntoView({
        behavior: "smooth",
        block: "center", // center the selected item within the container
        inline: "nearest",
      });
    }
  }, [selectedYear]);

  const setItemRef = (value, el) => {
    itemRefs.current[value] = el;
  };

  const setYearRef = (value, el) => {
    yearRefs.current[value] = el;
  };
  console.log("YEARS", years());

  return (
    <Drawer
      className="p-0"
      onOpenChange={(open) => {
        if (open) {
          setSelectedMonth(new Date().getMonth());
          setSelectedYear(new Date().getFullYear());
        } else {
          setSelectedMonth(null);
          setSelectedYear(null);
        }
      }}
    >
      <DrawerTrigger asChild className="border-b-2 border-blue-500">
        <div className="flex subLabel justify-center items-center">
          {months.find((month) => month.value == curMonth)?.name}
        </div>
      </DrawerTrigger>
      <DrawerContent className={"p-1"}>
        <div className="flex justify-around items-center p-3">
          <div
            className={
              "bg-secondary/50 rounded-full w-[30%] text-base h-60 overflow-y-auto overflow-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            }
          >
            {months.map((month) => (
              <div
                key={month.value}
                onClick={() => setSelectedMonth(month.value)}
                ref={(el) => setItemRef(month.value, el)}
                className={`h-20 flex items-center justify-center active:scale-95 transition-all duration-300
    ${
      selectedMonth == month.value
        ? "bg-black text-white dark:bg-foreground/80 dark:text-black"
        : "bg-transparent text-foreground hover:bg-foreground/5 active:bg-foreground/10"
    }`}
              >
                <div>{month.name}</div>
              </div>
            ))}
          </div>
          <div
            className={
              "bg-secondary/50 rounded-full w-[30%] text-base h-60 overflow-y-auto overflow-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            }
          >
            {years().map((year) => (
              <div
                key={year}
                onClick={() => setSelectedYear(year)}
                ref={(el) => setYearRef(year, el)}
                className={`h-20 flex items-center justify-center active:scale-95 transition-all duration-300
    ${
      selectedYear == year
        ? "bg-black text-white dark:bg-foreground/80 dark:text-black"
        : "bg-transparent text-foreground hover:bg-foreground/5 active:bg-foreground/10"
    }`}
              >
                <div>{year}</div>
              </div>
            ))}
          </div>
          <DrawerClose>
            <Button
              className="rounded-full h-14 w-14 subLabel bg-gray-500 flex-col font-semibold text-md active:scale-95 active:bg-secondary transition-all duration-300"
              onClick={() => {
                setCurMonth(selectedMonth);
                setCurYear(selectedYear);
              }}
            >
              <ArrowRight></ArrowRight>
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DateSelect;
