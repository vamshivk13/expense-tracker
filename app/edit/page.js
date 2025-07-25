"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AddExpense from "../components/AddExpense";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export default function Page() {
  return (
    <div className="h-[calc(100dvh-50px)]">
      <div className="flex ml-auto  px-8 sm:px-16 lg:px-16 py-3">
        <div className="text-gray-700 dark:text-gray-400 text-lg border-b border-gray-500 ">
          Edit Expense
        </div>
      </div>
      <AddExpense />
      <div className="absolute bottom-10 right-10 flex-1/4 flex items-center">
        <Button
          className={
            "ml-auto rounded-full h-14 w-14 bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-300"
          }
          size={"icon"}
        >
          <Save></Save>
        </Button>
      </div>
    </div>
  );
}
