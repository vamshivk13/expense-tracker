"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Arrow } from "@radix-ui/react-select";
import { ArrowLeft, ArrowRight, IndianRupee, Save, Trash } from "lucide-react";
import { Shapes } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { Notebook } from "lucide-react";
import { Tag } from "lucide-react";
import React, { useEffect } from "react";
import { db, push, ref, remove, update } from "../firebaseConfig";

export default function EditExpense({
  expense,
  goTo,
  setTransactions,
  goBack,
}) {
  const [amount, setAmount] = React.useState(expense?.amount || 0);
  const [category, setCategory] = React.useState(expense?.category || "Others");
  const [description, setDescription] = React.useState(
    expense?.description || ""
  );
  const [tags, setTags] = React.useState(expense?.tags || []);
  const [currentTag, setCurrentTag] = React.useState("");

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount || 0);
      setCategory(expense.category || "Others");
      setDescription(expense.description || "");
      setTags(expense.tags || []);
    }
  }, [expense]);

  const handleEditExpense = () => {
    const updatedExpense = {
      ...expense,
      amount: parseFloat(amount),
      category: category,
      description: description,
      tags: tags,
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
    }).catch((err) => console.error("Failed to update expense:", err));
    goTo(null);
  };

  const handleDeleteExpense = (expenseId) => {
    setTransactions((prev) => {
      return prev.filter((tx) => tx.id !== expenseId);
    });

    const expenseRef = ref(db, "expenses/" + expenseId);
    remove(expenseRef).catch((err) =>
      console.error("Failed to delete expense:", err)
    );
    goTo(null);
  };

  return (
    <div
      className={
        "flex flex-col gap-5 sm:container mx-auto px-8 sm:px-16 lg:px-16 py-3"
      }
    >
      <div className="text-lg bg-background py-4 w-full">
        <div className="flex gap-2 col-span-3 items-center">
          <ArrowLeft onClick={() => goBack()} />
          <div>Your Transaction</div>
          <img
            src={"/bin.png"}
            alt="delete"
            className="ml-auto h-6 w-6 cursor-pointer"
            onClick={() => {
              handleDeleteExpense(expense.id);
            }}
          />
        </div>
      </div>
      <div className="grid w-full gap-1">
        <div className="flex flex-col gap-1">
          <Label
            className="text-sm text-gray-700 dark:text-gray-400"
            htmlFor="amount"
          >
            Amount
          </Label>
          <div className="flex items-center">
            <IndianRupee className={"h-5"} />
            <Input
              className={
                "text-lg border-none dark:bg-(--background) bg-(--background) focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
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
      <div className="flex flex-col w-full gap-1">
        <Label
          className="text-sm text-gray-700 dark:text-gray-400"
          htmlFor="category"
        >
          Category
        </Label>
        <div className="flex gap-2 items-center cursor-pointer" id="category">
          <Shapes className={"h-5"} />
          <div className="text-lg">{category}</div>
          <ChevronRight className="h-5 ml-auto" />
        </div>
      </div>
      {/* Description */}
      <div className="flex flex-col w-full gap-1">
        <Label
          className="text-sm text-gray-700 dark:text-gray-400"
          htmlFor="amount"
        >
          Description
        </Label>
        <div className="flex gap-2 items-center cursor-pointer" id="category">
          <Notebook className={"h-5"} />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id="description"
            placeHolder="write a description"
            className={
              "text-sm dark:bg-(--background) bg-(--background) resize-none min-h-2 border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
            }
          />
        </div>
      </div>

      {/* tags */}
      <div className="flex flex-col w-full gap-1">
        <Label
          className="text-sm text-gray-700 dark:text-gray-400"
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
          <Tag className={"h-5"} />
          <Input
            placeHolder="add tags"
            type="text"
            className={
              "text-sm dark:bg-(--background) bg-(--background) resize-none min-h-2 border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
            }
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
          />
          <Button
            variant={"outline"}
            onClick={() => {
              if (currentTag.trim() !== "") {
                setTags((prev) => [...prev, currentTag.trim()]);
                setCurrentTag("");
              }
            }}
          >
            <ArrowRight />
          </Button>
        </form>
        <div className="flex gap-1 mt-2 flex-wrap">
          {tags.map((tag) => {
            return (
              <Badge className={"cursor-pointer"} key={tag.id}>
                {tag}
              </Badge>
            );
          })}
        </div>
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
