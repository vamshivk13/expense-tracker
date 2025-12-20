"use client";

import * as React from "react";
import { Check, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ref, onValue, db, update, push, set } from "../firebaseConfig";

import CalenderDrawer from "./CalenderDrawer";
import { Badge } from "@/components/ui/badge";
import { getFormattedDate, getFormattedDateShort } from "../util/DateUtility";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

export function AddExpenseBill({ setBills }) {
  const [date, setDate] = React.useState(new Date());
  const [expense, setExpense] = React.useState("");
  const [amount, setAmount] = React.useState(null);

  function handleAddExpenseBill() {
    const newBill = {
      date: date,
      expense: expense,
      amount: amount,
      isPaid: false,
    };
    setBills((prev) => {
      return [newBill, ...prev];
    });
    const billsRef = ref(db, "bills/");
    const newBillsRef = push(billsRef);
    const dataToSave = { ...newBill, date: newBill.date.toISOString() };
    set(newBillsRef, dataToSave).catch((err) =>
      console.error("Failed to save expense:", err)
    );
  }
  function resetFields() {
    setExpense("");
    setAmount(0);
    setDate(new Date());
  }

  return (
    <Drawer
      className="p-0"
      onOpenChange={(open) => {
        if (open) {
        } else {
          resetFields();
        }
      }}
    >
      <DrawerTrigger asChild className="">
        <Badge
          variant={"secondary"}
          className={
            "p-2 cursor-pointer select-none border-1 subLabel2 border-gray-500/40 flex items-center gap-2 sm:text-sm rounded-2xl bg-background"
          }
        >
          <Plus strokeWidth={2} />
          <div>Add Bill</div>
        </Badge>
      </DrawerTrigger>
      <DrawerContent className={"p-0"}>
        <div className="mx-auto h-lvh z-150 w-full max-w-md flex-col overflow-y-auto p-6">
          <div className="flex h-full flex-col gap-5">
            <div className="h-full flex flex-col">
              <div className="flex-grow p-0 border-none mt-1 mb-6">
                <div className="py-1 flex flex-col gap-4 px-2">
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="date"
                      className="text-sm subLabel2 text-gray-700 dark:text-gray-400"
                    >
                      Bill Description
                    </label>
                    <div className="grid mt-4 mb-2 w-full gap-2">
                      <div
                        className="flex gap-2 items-center cursor-pointer"
                        id="category"
                      >
                        <input
                          value={expense}
                          onChange={(e) => setExpense(e.target.value)}
                          id="description"
                          placeHolder="add expense"
                          className={
                            "text-sm subLabel w-full p-1 dark:bg-(--background) bg-(--background) resize-none min-h-2 border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <Separator className="border-b" />
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="date"
                      className="text-sm subLabel2 text-gray-700 dark:text-gray-400"
                    >
                      Amount
                    </label>
                    <div className="grid mt-4 mb-2 w-full gap-2">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center">
                          <input
                            className={
                              "text-lg subLabel p-1 border-none dark:bg-(--background) bg-(--background) focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                            }
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            type="number"
                            id="amount"
                            placeHolder="Add Amount"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <Separator className="p-0 border-b" />
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="date"
                      className="text-sm subLabel2 text-gray-700 dark:text-gray-400"
                    >
                      Date
                    </label>
                    <div
                      className="flex gap-2 mt-4 mb-2 items-center cursor-pointer"
                      id="date"
                    >
                      <input
                        value={getFormattedDateShort(date)}
                        onChange={(e) => setDate(new Date(e.target.value))}
                        id="date"
                        readOnly
                        placeHolder="write a description"
                        className={
                          "text-sm subLabel w-full p-1 dark:bg-(--background) bg-(--background) resize-none min-h-2 border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                        }
                      />
                      <CalenderDrawer date={date} setDate={setDate} />
                    </div>
                  </div>
                  <Separator className="p-0 border-b" />
                </div>
              </div>
            </div>
            <div className="flex mt-auto justify-between">
              <DrawerClose asChild>
                <Button
                  onClick={handleAddExpenseBill}
                  variant="outline"
                  className="rounded-full ml-auto h-14 w-14 subLabel bg-orange-300 flex-col font-semibold text-md active:scale-95 active:bg-secondary transition-all duration-300"
                >
                  <Check />
                </Button>
              </DrawerClose>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
