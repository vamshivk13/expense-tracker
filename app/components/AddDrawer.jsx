"use client";

import * as React from "react";
import { Check, Plus } from "lucide-react";
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
import CalenderDrawer from "./CalenderDrawer";
import { Categories, expenseCategories } from "./Categories";
import { ca } from "date-fns/locale";
import { getFormattedAmount, getFormattedDate } from "../util/DateUtility";
import { Arrow } from "@radix-ui/react-select";

export function AddDrawer({ setTransactions, suggestedTagsProp }) {
  const [expenseAmount, setExpenseAmount] = React.useState("0");
  const [note, setNote] = React.useState("");
  const [category, setCategory] = React.useState("Other");
  const [tag, setTag] = React.useState("");
  const [allTags, setAllTags] = React.useState([]);
  const [date, setDate] = React.useState(new Date());
  const [mode, setMode] = React.useState("amountEntry");
  const [Icon, setCategoryIcon] = React.useState(null);
  const categoryIcons = expenseCategories;
  const [suggestedTags, setSuggestedTags] = React.useState(
    suggestedTagsProp || []
  );

  React.useEffect(() => {
    setSuggestedTags(suggestedTagsProp || []);
  }, [suggestedTagsProp]);
  const handleAddExpense = () => {
    const newExpense = {
      amount: parseFloat(expenseAmount),
      description: note || category + " Expense",
      category: category,
      tags: allTags,
      date: date,
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
    setCategory("Other");
    setTag("");
    setAllTags([]);
    setSuggestedTags(suggestedTagsProp || []);
    setDate(new Date());
  };

  React.useEffect(() => {
    // Update category icon based on selected category
    if (category) {
      const foundCategory = categoryIcons.find((cat) => cat.name === category);
      if (foundCategory) {
        setCategoryIcon(foundCategory.icon);
      } else {
        const otherCategory = categoryIcons.find((cat) => cat.name === "Other");
        setCategoryIcon(otherCategory.icon);
      }
    }
  }, [category]);

  return (
    <Drawer
      className="p-0"
      onOpenChange={(open) => {
        if (open) {
        } else {
          resetFields();
          setMode("amountEntry");
        }
      }}
    >
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
          <div className="flex h-full flex-col gap-5">
            {/* Amount Display */}
            <div className="w-full mb-6 p-1 rounded-sm hover:bg-secondary/60 items-center flex space-x-4 flex-col">
              {mode == "categoryTagEntry" && (
                <div className="flex flex-col items-center gap-2">
                  <div className="p-2 bg-muted/10 border-[0.3] rounded-full flex justify-center items-center">
                    <Icon className="size-10" strokeWidth={1} />
                  </div>
                  <div className="flex justify-center items-center mt-2 text-center ">
                    <div className="mainLabel">₹</div>
                    <span className="text-foreground mainHeading">
                      {expenseAmount}
                    </span>
                  </div>

                  <Categories setCategory={setCategory}>
                    <div className="subLabel2 mt-2 border-1 border-blue-400 px-2 py-1">
                      {category}
                    </div>
                  </Categories>
                </div>
              )}
              {mode == "amountEntry" && (
                <div className="w-full flex items-center">
                  <div
                    className={
                      "outline-none p-2 rounded-none border-none w-full shadow-none ml-auto mainHeading4xl text-left focus:ring-0 focus:ring-offset-0 text-5xl sm:text-6xl"
                    }
                    style={{
                      width: `${
                        mode == "categoryTagEntry" ? "fit-content" : "100%"
                      }`,
                      marginRight: `${
                        mode == "categoryTagEntry" ? "auto" : "0"
                      }`,
                    }}
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
              )}
              {/* Note and Category */}
            </div>
            {/* Amount Numbers Gird */}
            {mode == "categoryTagEntry" && (
              <div className="h-full flex flex-col">
                <div className="flex-grow p-0 border-none mt-1 mb-6">
                  <div className="py-1 flex flex-col gap-4 px-2">
                    <div className="flex items-center gap-2 ">
                      <div className="flex w-full flex-col gap-3 flex-1">
                        <label className="subLabel2" htmlFor="note">
                          Add Date
                        </label>
                        <div className="subLabel3 mr-auto">
                          {getFormattedDate(date)}
                        </div>
                      </div>
                      <CalenderDrawer date={date} setDate={setDate} />
                    </div>
                    <div className="flex w-full gap-2">
                      <div className="flex w-full flex-col gap-2 flex-1">
                        <label className="subLabel2" htmlFor="note">
                          Add Note
                        </label>
                        <input
                          id="note"
                          className="outline-none w-full py-2 rounded-sm sm:subLabel subLabel2 border-none shadow-none"
                          placeholder="coffee, groceries .."
                          onChange={(e) => setNote(e.target.value)}
                        ></input>
                      </div>
                    </div>
                    {/* Tag */}
                    <div className="w-full relative grid grid-cols-3 items-center gap-2">
                      <label className="subLabel2 col-span-3" htmlFor="note">
                        Add Tag
                      </label>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (tag && !allTags.includes(tag)) {
                            setAllTags((prev) => [...prev, tag]);
                            setTag("");
                          }
                        }}
                      >
                        <div className="flex w-full flex-col gap-2 flex-1">
                          <input
                            id="tag"
                            className="outline-none self-end w-full py-2 rounded-sm sm:subLabel subLabel2 border-none shadow-none"
                            placeholder="kfc, shopping .."
                            onChange={(e) => setTag(e.target.value)}
                          ></input>
                        </div>
                      </form>
                      <div className="flex col-span-2">
                        <div className="flex gap-1 relative items-center overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                          <div className="flex gap-1  overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            {allTags.map((tagItem, index) => (
                              <div
                                onClick={() => {
                                  setAllTags((prev) =>
                                    prev.filter((t) => t !== tagItem)
                                  );
                                  //replace to suggested tags
                                  let tagIndex = suggestedTagsProp.findIndex(
                                    (t) => t === tagItem
                                  );
                                  if (tagIndex !== -1) {
                                    setSuggestedTags((prev) => {
                                      const newSuggested = [...prev];
                                      newSuggested.splice(tagIndex, 0, tagItem);
                                      return newSuggested;
                                    });
                                  }
                                }}
                                key={tagItem}
                                className="border bg-foreground text-background  border-(--border-color) rounded-full px-2 py-1 subLabel2 hover:bg-secondary/60 cursor-pointer"
                              >
                                {tagItem}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1  col-span-3 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        {suggestedTags.map((tagItem, index) => (
                          <div
                            onClick={() => {
                              if (!allTags.includes(tagItem)) {
                                setAllTags((prev) => [...prev, tagItem]);
                                setSuggestedTags((prev) =>
                                  prev.filter((t) => t !== tagItem)
                                );
                              }
                            }}
                            key={tagItem}
                            className="border bg-secondary/30 border-(--border-color) rounded-full px-2 py-1 subLabel2 hover:bg-secondary/60 cursor-pointer"
                          >
                            {tagItem}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {mode == "categoryTagEntry" && (
              <div className="flex mt-auto justify-between">
                <DrawerClose asChild>
                  <Button
                    onClick={handleAddExpense}
                    variant="outline"
                    className="rounded-full h-14 w-14 subLabel bg-gray-400 flex-col font-semibold text-md active:scale-95 active:bg-secondary transition-all duration-300"
                  >
                    <ArrowLeft />
                  </Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button
                    onClick={handleAddExpense}
                    variant="outline"
                    className="rounded-full h-14 w-14 subLabel bg-orange-300 flex-col font-semibold text-md active:scale-95 active:bg-secondary transition-all duration-300"
                  >
                    <Check />
                  </Button>
                </DrawerClose>
              </div>
            )}
            {mode == "amountEntry" && (
              <div className="flex-grow flex mt-6 items-stretch px-2 pb-4">
                <div className="w-full grid grid-cols-3 gap-4">
                  <div className="grid col-span-3 grid-cols-3 gap-x-3 gap-y-2 place-items-center">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0].map((item) => (
                      <Button
                        key={item}
                        className="h-20 w-20 rounded-full font-semibold text-xl active:scale-95 active:bg-secondary transition-all duration-300"
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

                    <Button
                      onClick={() => {
                        setMode("categoryTagEntry");
                      }}
                      variant="outline"
                      className="h-20 w-20 rounded-full mainLabel bg-orange-400 flex-col font-semibold text-md active:scale-95 active:bg-secondary transition-all duration-300"
                    >
                      <ArrowRight></ArrowRight>
                    </Button>
                    {/* <DrawerClose asChild>
                    <Button
                      onClick={handleAddExpense}
                      variant="outline"
                      className="h-20 w-20 rounded-full mainLabel bg-orange-400 flex-col font-semibold text-md active:scale-95 active:bg-secondary transition-all duration-300"
                    >
                      Save
                    </Button>
                  </DrawerClose> */}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
