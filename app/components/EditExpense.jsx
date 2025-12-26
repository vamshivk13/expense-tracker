"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Arrow, Separator } from "@radix-ui/react-select";
import {
  ArrowLeft,
  ArrowRight,
  Calendar1,
  CalendarDays,
  IndianRupee,
  Save,
  Trash,
} from "lucide-react";
import { Shapes } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { Notebook } from "lucide-react";
import { Tag } from "lucide-react";
import React, { useEffect } from "react";
import { db, push, ref, remove, update } from "../firebaseConfig";
import { Calendar } from "@/components/ui/calendar";
import CalenderDrawer from "./CalenderDrawer";
import { getFormattedDateShort } from "../util/DateUtility";
import { da } from "date-fns/locale";
import { Categories } from "./Categories";

export default function EditExpense({
  expense,
  goTo,
  setTransactions,
  goBack,
}) {
  const [amount, setAmount] = React.useState(expense?.amount || 0);
  const [category, setCategory] = React.useState(expense?.category || "Other");
  const [description, setDescription] = React.useState(
    expense?.description || ""
  );
  const [tags, setTags] = React.useState(expense?.tags || []);
  const [currentTag, setCurrentTag] = React.useState("");
  const [date, setDate] = React.useState(new Date(expense?.date) || new Date());

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount || 0);
      setCategory(expense.category || "Other");
      setDescription(expense.description || "");
      setTags(expense.tags || []);
      setDate(new Date(expense.date) || new Date());
    }
  }, [expense]);

  const handleEditExpense = () => {
    const updatedExpense = {
      ...expense,
      amount: parseFloat(amount),
      category: category,
      description: description,
      tags: tags,
      date: date.toISOString(),
    };

    setTransactions((prev) => {
      return prev.map((tx) => (tx.id === expense.id ? updatedExpense : tx));
    });

    const expensesRef = ref(db, "expenses/" + expense.id);
    update(expensesRef, {
      amount: parseFloat(amount),
      category: category,
      description: description,
      tags: tags,
      date: date.toISOString(),
    }).catch((err) => console.error("Failed to update expense:", err));
    goBack();
  };

  const handleDeleteExpense = (expenseId) => {
    setTransactions((prev) => {
      return prev.filter((tx) => tx.id !== expenseId);
    });

    const expenseRef = ref(db, "expenses/" + expenseId);
    remove(expenseRef).catch((err) =>
      console.error("Failed to delete expense:", err)
    );
    goBack();
  };

  const openCalender = () => {};
  return (
    <div
      className={
        "flex flex-col gap-5 sm:container mx-auto px-8 sm:px-16 lg:px-16 py-3"
      }
    >
      <div className="text-lg bg-background py-4 w-full">
        <div className="flex gap-2 col-span-3 items-center relative">
          <ArrowLeft
            className="absolute top-[50%] translate-y-[-50%]"
            onClick={() => goBack()}
          />
          <div className="mx-auto subLabel px-4 py-2 rounded-full border-[0.3px] border-blue-400">
            Your Transactions
          </div>
          <img
            src={"/dustbin.png"}
            alt="delete"
            className="h-6 w-6 cursor-pointer"
            onClick={() => {
              handleDeleteExpense(expense.id);
            }}
          />
        </div>
      </div>
      <div className="grid w-full gap-2">
        <div className="flex flex-col gap-1">
          <Label
            className="text-sm subLabel2 text-gray-700 dark:text-gray-400"
            htmlFor="amount"
          >
            Amount
          </Label>
          <div className="flex items-center">
            <input
              className={
                "text-lg mainLabel2 p-1 border-none dark:bg-(--background) bg-(--background) focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
              }
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              id="amount"
              placeHolder="0"
            />
          </div>
        </div>
      </div>
      <Separator className="p-0 border-b" />
      <div className="flex flex-col w-full gap-2">
        <Label
          className="text-sm subLabel2 text-gray-700 dark:text-gray-400"
          htmlFor="category"
        >
          Category
        </Label>
        <div className="flex gap-2 items-center cursor-pointer" id="category">
          <Categories setCategory={setCategory}>
            <div className="subLabel2 flex items-center justify-between gap-2 mt-2 border-1 border-blue-400 px-2 py-1">
              <div className="">{category}</div>
              <ChevronRight strokeWidth={1} size={12} className="h-5" />
            </div>
          </Categories>
        </div>
      </div>
      <Separator className="border-b" />
      {/* Description */}
      <div className="flex flex-col w-full gap-2">
        <Label
          className="text-sm subLabel2 text-gray-700 dark:text-gray-400"
          htmlFor="amount"
        >
          Description
        </Label>
        <div className="flex gap-2 items-center cursor-pointer" id="category">
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id="description"
            placeHolder="write a description"
            className={
              "text-sm mainLabel2 w-full p-1 dark:bg-(--background) bg-(--background) resize-none min-h-2 border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
            }
          />
        </div>
      </div>
      <Separator className="border-b" />
      {/* tags */}
      <div className="flex flex-col w-full gap-2">
        <Label
          className="text-sm subLabel2 text-gray-700 dark:text-gray-400"
          htmlFor="amount"
        >
          Tags
        </Label>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (currentTag.trim() !== "") {
              setTags((prev) => [...prev, currentTag.trim()]);
              setCurrentTag("");
            }
          }}
          className="flex gap-2 items-center cursor-pointer"
          id="category"
        >
          <input
            placeHolder="add tags"
            type="text"
            className={
              "text-sm p-1 mainLabel2 w-full dark:bg-(--background) bg-(--background) resize-none min-h-2 border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
            }
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
          />
          <Button
            variant={"outline"}
            onClick={() => {
              if (currentTag.trim() !== "") {
                setTags((prev) => [...prev, currentTag.trim()]);
              }
            }}
            className={"h-8 w-8 rounded-full"}
          >
            <ArrowRight />
          </Button>
        </form>
        <div className="flex gap-1 my-2 flex-wrap">
          {tags.map((tag) => {
            return (
              <div
                onClick={() => {
                  setTags((prev) => prev.filter((t) => t !== tag));
                }}
                className={
                  "cursor-pointer subLabel2 text-background bg-foreground px-2 py-1 rounded-full"
                }
                key={tag.id}
              >
                {tag}
              </div>
            );
          })}
        </div>
        <Separator className="p-0 border-b" />
        <div
          className="flex gap-2 mt-4 mb-2 items-center cursor-pointer"
          id="category"
        >
          <input
            value={getFormattedDateShort(date)}
            onChange={(e) => setDate(new Date(e.target.value))}
            id="description"
            readOnly
            placeHolder="write a description"
            className={
              "text-sm mainLabel2 w-full p-1 dark:bg-(--background) bg-(--background) resize-none min-h-2 border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
            }
          />
          <CalenderDrawer date={date} setDate={setDate} />
        </div>
        <Separator className="p-0 border-b" />
      </div>

      <div className="fixed bottom-10 right-10 flex-1/4 flex items-center">
        <Button
          className={
            "ml-auto rounded-full h-14 w-14 bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-300"
          }
          size={"icon"}
          onClick={handleEditExpense}
        >
          <Save></Save>
        </Button>
      </div>
    </div>
  );
}
