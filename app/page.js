"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DateSelect from "./components/DateSelect";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { getFormattedAmount, getFormattedDate } from "./util/DateUtility";
import { Utensils } from "lucide-react";

export default function Home() {
  const transactions = [
    {
      description: "Grocery shopping at Reliance Fresh",
      tag: "groceries",
      amount: 2200.5,
      date: "2025-07-10",
      category: "Food & Essentials",
    },
    {
      description: "Uber to office",
      tag: "commute",
      amount: 185.75,
      date: "2025-07-11",
      category: "Transport",
    },
    {
      description: "Monthly Netflix subscription",
      tag: "entertainment",
      amount: 649.0,
      date: "2025-07-01",
      category: "Subscriptions",
    },
    {
      description: "Lunch at Café Madras",
      tag: "dining",
      amount: 430.0,
      date: "2025-07-12",
      category: "Food & Dining",
    },
    {
      description: "Mobile recharge - Airtel",
      tag: "utilities",
      amount: 299.0,
      date: "2025-07-05",
      category: "Utilities",
    },
    {
      description: "Bought React course on Udemy",
      tag: "education",
      amount: 1299.0,
      date: "2025-07-07",
      category: "Learning",
    },
    {
      description: "Domino's Friday treat",
      tag: "dining",
      amount: 799.0,
      date: "2025-07-13",
      category: "Food & Dining",
    },
    {
      description: "Medicines from Apollo Pharmacy",
      tag: "health",
      amount: 560.25,
      date: "2025-07-08",
      category: "Healthcare",
    },
    {
      description: "Internet bill - JioFiber",
      tag: "utilities",
      amount: 999.0,
      date: "2025-07-03",
      category: "Utilities",
    },
    {
      description: "Gift for friend's birthday",
      tag: "gift",
      amount: 1500.0,
      date: "2025-07-09",
      category: "Personal",
    },
  ];
  return (
    <div className="sm:container mx-auto px-8 sm:px-16 lg:px-16 py-3 flex flex-col gap-4">
      <div className="flex items-center my-3">
        <div>
          Hi, <span className="text-xl">Vamshi Thatikonda</span>
        </div>
        <DateSelect />
      </div>
      <div className="flex gap-5 my-5">
        <Card className={"rounded-[5px] relative flex-1/2 sm:py-10"}>
          <Badge className={"absolute -top-2 left-5"}>Overview</Badge>
          <CardContent>
            <div className="grid md:grid-cols-4 grid-cols-2 gap-x-3 gap-y-5">
              <div className="">
                <h3 className="text-sm text-gray-700 dark:text-gray-400">
                  Monthly Income
                </h3>
                <div className="mt-2">Rs 96,000</div>
              </div>
              <div>
                <h3 className="text-sm text-gray-700 dark:text-gray-400">
                  Monthly Expense
                </h3>
                <div className="mt-2">Rs 96,000</div>
              </div>
              <div>
                <h3 className="text-sm text-gray-700 dark:text-gray-400">
                  Todays's Expense
                </h3>
                <div className="mt-2">Rs 96,000</div>
              </div>
              <div
                className={"flex items-center md:justify-center"}
                size="icon"
              >
                <Button className={"rounded-4xl"}>
                  <Plus></Plus>
                  <div>Add Expense</div>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <div className="my-7">Your Transactions</div>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-x-3 text-gray-700 dark:text-gray-400">
            <div className="text-sm col-span-3 sm:col-span-2">Expense</div>
            <div className="text-sm hidden sm:block">Date</div>
            <div className="text-sm">Amount</div>
          </div>
          <Separator />
          {transactions.map((expense) => (
            <div key={expense.date}>
              <div className="grid gap-x-3 grid-cols-4  mb-3">
                <div className=" col-span-3 sm:col-span-2">
                  <div className="flex items-center gap-4">
                    <Utensils className="flex-shrink-0" />
                    <div className="flex flex-col truncate">
                      <div className="truncate">{expense.description}</div>
                      <div className="text-sm text-gray-700 dark:text-gray-400">
                        {expense.category}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block">
                  {getFormattedDate(expense.date)}
                </div>
                <div className="flex flex-col">
                  <div>{getFormattedAmount(expense.amount)}</div>
                  <div className="text-sm block sm:hidden text-gray-700 dark:text-gray-400">
                    {getFormattedDate(expense.date)}
                  </div>
                </div>
              </div>
              <Separator />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
