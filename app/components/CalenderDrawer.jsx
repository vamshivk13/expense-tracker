import { Calendar } from "@/components/ui/calendar";
import React from "react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Calendar1, Check } from "lucide-react";

const CalenderDrawer = ({ date, setDate }) => {
  return (
    <Drawer className="p-0 z-[150]">
      <DrawerTrigger asChild className="">
        <div className=" z-[150] rounded-full sm:hidden flex justify-center items-center">
          <button
            className={"z-50 flex rounded-full"}
            size={"icon"}
            onClick={() => {
              console.log("clicked");
            }}
          >
            <Calendar1 className="size-5"></Calendar1>
          </button>
        </div>
      </DrawerTrigger>
      <DrawerContent className={"p-0"}>
        <div className="mx-auto h-lvh z-[150] w-full max-w-md flex-col overflow-y-auto p-6">
          <div className="flex h-full flex-col gap-1">
            {/* Calender Content Here */}
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-lg border-none w-full"
            />
            <DrawerClose className="mt-auto active:bg-secondary transition-all duration-150 ml-auto flex p-4 rounded-full bg-secondary/80 active:scale-95 border-[0.4px] border-gray-300">
              <Check />
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CalenderDrawer;
