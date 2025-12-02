"use client";

import * as React from "react";
import { Grid, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

export function AddDrawer() {
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
          <div className="flex h-full flex-col justify-between ">
            {/* Amount Display */}
            <div className="w-full p-3 rounded-sm hover:bg-secondary flex items-center space-x-4">
              <input
                type="text"
                className={
                  " outline-none rounded-none border-none w-full shadow-none ml-auto mainHeading4xl text-right focus:ring-0 focus:ring-offset-0 text-5xl sm:text-6xl"
                }
                reverse={true}
                autoFocus
                placeholder="0"
              />
              <div className="p-2 rounded-full cursor-pointer">
                <ArrowLeft className="size-6 text-muted-foreground" />
              </div>
            </div>
            {/* Amount Numbers Gird */}
            <div>
              <div className="w-full grid grid-cols-4 gap-4">
                <div className="grid col-span-3 grid-cols-3 gap-4 place-items-center">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0, "Save"].map((item) => (
                    <Button
                      key={item}
                      variant="outline"
                      className="h-16 w-16 rounded-md text-2xl active:scale-95 active:bg-secondary transition-all duration-300"
                    >
                      {item}
                    </Button>
                  ))}
                </div>
                <div className="grid gird-cols-1 grid-rows-4 place-self-center gap-4">
                  <Button
                    variant="outline"
                    className="h-16 w-16 rounded-md text-2xl"
                  >
                    Date
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
