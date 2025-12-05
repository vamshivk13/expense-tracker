"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { CalendarDays } from "lucide-react";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ArrowLeft } from "lucide-react";
import { ChevronsUpDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ref, onValue, db, update, push, set } from "../firebaseConfig";

export function AddDrawer({ setTransactions }) {
  const [expenseAmount, setExpenseAmount] = React.useState("0");
  const [note, setNote] = React.useState("");
  const [category, setCategory] = React.useState("Others");
  const [tag, setTag] = React.useState("");
  const [allTags, setAllTags] = React.useState([]);

  const handleAddExpense = () => {
    const newExpense = {
      amount: parseFloat(expenseAmount),
      description: note || category + " Expense",
      category: category,
      tags: allTags,
      date: new Date(),
    };
    setTransactions((prev) => [newExpense, ...prev]);

    // ADD TO FIREBASE REALTIME DATABASE
    const expensesRef = ref(db, "expenses/");
    const newExpenseRef = push(expensesRef);
    const dataToSave = { ...newExpense, date: newExpense.date.toISOString() };
    set(newExpenseRef, dataToSave).catch((err) =>
      console.error("Failed to save expense:", err)
    );

    // Reset fields
    resetFields();
  };

  const resetFields = () => {
    setExpenseAmount("0");
    setNote("");
    setCategory("Others");
    setTag("");
    setAllTags([]);
  };

  return (
    <Drawer className="p-0">
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
      <DrawerContent className={"p-0"}>
        <div className="mx-auto h-full z-150 w-full max-w-md flex-col overflow-y-auto p-6">
          <div className="flex h-full flex-col gap-1">
            {/* Amount Display */}
            <div className="w-full p-1 rounded-sm hover:bg-secondary/60 flex space-x-4 flex-col">
              <div className="w-full flex items-center">
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
              {/* Note and Category */}
              <Card className=" bg-secondary/70 p-0 border-none mt-4 mb-6">
                <CardContent className="py-1 px-2">
                  <div className="my-1 flex w-full gap-2">
                    <div className="flex w-full flex-1">
                      <input
                        className="outline-none w-full p-3 rounded-sm sm:subLabel subLabel2 border-none shadow-none"
                        placeholder="Add Note"
                        onChange={(e) => setNote(e.target.value)}
                      ></input>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="border border-(--border-color) rounded-full px-2 py-1 sm:subLabel subLabel2 bg-foreground text-background hover:bg-secondary/60 cursor-pointer">
                        Others
                      </div>
                    </div>
                  </div>
                  {/* Tag */}
                  <div className="w-full relative grid grid-cols-3 items-center my-1 gap-2">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (tag && !allTags.includes(tag)) {
                          setAllTags((prev) => [...prev, tag]);
                          setTag("");
                        }
                      }}
                    >
                      <input
                        className="outline-none p-3 rounded-sm subLabel2 border-none w-full shadow-none"
                        placeholder="Add Tag"
                        onChange={(e) => setTag(e.target.value)}
                      ></input>
                    </form>
                    <div className="flex col-span-2">
                      <div className="flex gap-1 relative items-center overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        <div className="flex gap-1  overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                          {allTags.map((tagItem, index) => (
                            <div
                              key={tagItem}
                              className="border bg-foreground text-background border-(--border-color) rounded-full px-2 py-1 subLabel2 hover:bg-secondary/60 cursor-pointer"
                            >
                              {tagItem}
                            </div>
                          ))}
                        </div>
                        {/* <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-1 sm:w-4 z-5 bg-gradient-to-l from-white/90 to-transparent dark:from-[#3D3D3D]/90 dark:to-transparent" /> */}
                      </div>
                      {allTags != null && allTags.length != 0 && (
                        <div className="aspect-square px-1 border  rounded-r-full py-1 items-center flex ">
                          <ChevronsUpDown size={12} />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Amount Numbers Gird */}
            <div className="flex-grow flex items-stretch pb-4">
              <div className="w-full grid grid-cols-3 gap-4">
                <div className="grid col-span-3 grid-cols-3 gap-3 place-items-center">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0].map((item) => (
                    <Button
                      key={item}
                      className="h-18 w-18 rounded-full font-semibold text-xl active:scale-95 active:bg-secondary transition-all duration-300"
                      onClick={() => {
                        setExpenseAmount((prev) => {
                          if (prev.includes(".") && item === ".") {
                            return prev;
                          }
                          return prev == "0"
                            ? item.toString()
                            : prev + item.toString();
                        });
                      }}
                    >
                      {item}
                    </Button>
                  ))}
                  <DrawerClose asChild>
                    <Button
                      onClick={handleAddExpense}
                      variant="outline"
                      className="h-20 w-20 rounded-full mainLabel bg-orange-400 flex-col font-semibold text-md active:scale-95 active:bg-secondary transition-all duration-300"
                    >
                      Save
                    </Button>
                  </DrawerClose>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
