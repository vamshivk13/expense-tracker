"use client";

import * as React from "react";
import { Plus } from "lucide-react";

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
import { Input } from "@/components/ui/input";

export function AddDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          className={
            "absolute bottom-0 left-[50%] transform translate-y-[50%] translate-x-[-50%] rounded-full bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-300"
          }
          size={"icon"}
        >
          <Plus></Plus>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full h-lvh z-1500 max-w-sm">
          <DrawerHeader>
            <DrawerTitle className={"mr-auto"}>New Expense</DrawerTitle>
          </DrawerHeader>
          <div className="flex">
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" type="text" />
            </div>
          </div>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
