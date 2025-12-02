"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { CalendarDays } from "lucide-react";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ArrowLeft } from "lucide-react";

export function AddDrawer() {
  const [expenseAmount, setExpenseAmount] = React.useState("0");

  return (
    <Drawer>
      <DrawerTrigger asChild className="fixed bottom-8 right-8">
        <div className=" h-18 w-18 z-50 bg-muted/90 rounded-full sm:hidden flex justify-center items-center">
          <Button
            className={
              "z-50 flex rounded-full h-13 w-13 bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-300"
            }
            size={"icon"}
          >
            <Plus className="size-5"></Plus>
          </Button>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto h-lvh z-150 w-full max-w-md flex-col space-y-6 overflow-y-auto p-6">
          <div className="flex h-full flex-col justify-between gap-1">
            {/* Amount Display */}
            <div className="w-full p-1 rounded-sm hover:bg-secondary/60 flex items-center space-x-4">
              <div
                className={
                  "outline-none p-2 rounded-none border-none w-full shadow-none ml-auto mainHeading4xl text-left focus:ring-0 focus:ring-offset-0 text-5xl sm:text-6xl"
                }
              >
                ₹ <span className="text-foreground">{expenseAmount}</span>
              </div>
              <div className="p-2 flex items-center z-10 active:bg-secondary transition-all duration-150 justify-center rounded-sm h-full aspect-square cursor-pointer hover:bg-secondary">
                <ArrowLeft
                  className="size-6 text-muted-foreground"
                  onClick={() => {
                    setExpenseAmount((prev) => {
                      return prev.length === 1 ? "0" : prev.slice(0, -1);
                    });
                  }}
                />
              </div>
            </div>
            <div>
              <div className="border border-(--border-color) rounded-full px-4 py-2 w-max subLabel2 text-muted-foreground hover:bg-secondary/60 cursor-pointer mb-4">
                Others
              </div>
            </div>
            {/* Amount Numbers Gird */}
            <div>
              <div className="w-full grid grid-cols-4 gap-4">
                <div className="grid col-span-3 grid-cols-3 gap-4 place-items-center">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0].map((item) => (
                    <Button
                      key={item}
                      className="h-16 w-16 rounded-full font-semibold text-xl active:scale-95 active:bg-secondary transition-all duration-300"
                      onClick={() => {
                        setExpenseAmount((prev) => {
                          return prev === "0"
                            ? item.toString()
                            : prev + item.toString();
                        });
                      }}
                    >
                      {item}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    className="h-16 w-16 rounded-md subLabel2 flex flex-col justify-center items-center space-y-1 active:scale-95 active:bg-secondary transition-all duration-300"
                  >
                    <Check size={24} strokeWidth={2} />
                    <div>Save</div>
                  </Button>
                </div>

                <div className="grid gird-cols-1 grid-rows-4 place-self-center gap-4">
                  <Button
                    variant="outline"
                    className="h-16 w-16 rounded-md subLabel2 flex flex-col justify-center items-center space-y-1 active:scale-95 active:bg-secondary transition-all duration-300"
                  >
                    <CalendarDays size={24} strokeWidth={2} />
                    <div>Today</div>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
