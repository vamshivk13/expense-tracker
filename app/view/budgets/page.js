"use client";
import { getFormattedAmount } from "@/app/util/DateUtility";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Utensils } from "lucide-react";
import { Pencil } from "lucide-react";
import { Check } from "lucide-react";
import { useState } from "react";

export default function BudgetsView() {
  const [mode, setMode] = useState("edit");
  const budgets = [
    {
      category: "Groceries",
      budget: 12000,
      spent: 8500,
      tags: ["vegetables", "snacks", "milk", "fruits", "meat"],
    },
    {
      category: "Transport",
      budget: 4000,
      spent: 2900,
      tags: ["fuel", "cab", "metro", "parking", "toll"],
    },
    {
      category: "Dining Out",
      budget: 6000,
      spent: 4800,
      tags: ["restaurants", "coffee", "fast food", "desserts", "takeout"],
    },
    {
      category: "Utilities",
      budget: 5000,
      spent: 4200,
      tags: ["electricity", "water", "internet", "gas", "mobile recharge"],
    },
    {
      category: "Entertainment",
      budget: 3000,
      spent: 2700,
      tags: ["movies", "subscriptions", "games", "music", "events"],
    },
    {
      category: "Shopping",
      budget: 8000,
      spent: 6200,
      tags: ["clothing", "electronics", "gifts", "home decor", "accessories"],
    },
    {
      category: "Health",
      budget: 3500,
      spent: 1800,
      tags: ["medicines", "doctor", "gym", "supplements", "therapy"],
    },
    {
      category: "Category1",
      budget: 8000,
      spent: 6200,
      tags: ["clothing", "electronics", "gifts", "home decor", "accessories"],
    },
    {
      category: "Category2",
      budget: 3500,
      spent: 1800,
      tags: ["medicines", "doctor", "gym", "supplements", "therapy"],
    },
  ];

  function handleEditAndSave() {
    setMode((prev) => {
      if (prev == "edit") return "save";
      else return "edit";
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-20 lg:px-20 pb-2">
      <div className="text-lg z-20 bg-(--background) h-[55px] mb-2 sticky top-[50px] gap-x-3 grid grid-cols-4 items-center">
        <div className={"col-span-3"}>Budgets</div>
        <Button
          variant="outline"
          className={"ml-auto rounded-xl bg-blue-500"}
          onClick={handleEditAndSave}
        >
          {mode == "edit" ? <Pencil /> : <Check />} {mode}
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {budgets.map((budget) => (
          <div
            key={budget.category}
            className="flex flex-col gap-3 border-1 px-2 py-3 rounded-xl"
          >
            <div className="grid gap-x-3 items-center grid-cols-6">
              <div className="col-span-3">
                <div className="flex items-center gap-4">
                  <Utensils className="flex-shrink-0" />
                  <div className="flex flex-col truncate gap-1">
                    <div className="truncate text">{budget.category}</div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  "--progress": `${
                    String((budget.spent / budget.budget) * 100) + "%"
                  }`,
                }}
                className={`h-10 w-10 flex-shrink-0 rounded-4xl  bg-[conic-gradient(#3b82f6_var(--progress),#e5e7eb_0%)] relative`}
              >
                <div className="h-8 w-8 rounded-4xl bg-(--background) text-sm flex justify-center items-center absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%]">
                  {String(Math.floor((budget.spent / budget.budget) * 100)) +
                    "%"}
                </div>
              </div>
              <div className="flex flex-row col-span-2 justify-center">
                {mode == "edit" ? (
                  <div>
                    <div className="flex flex-col text-gray-700 dark:text-gray-400 text-sm">
                      {getFormattedAmount(budget.spent)}/
                    </div>
                    <div className="block">{budget.budget}</div>
                  </div>
                ) : (
                  <div>
                    <Input type="number" />
                  </div>
                )}
              </div>
            </div>
            <Progress
              className="h-[5px]"
              value={(budget.spent / budget.budget) * 100}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
