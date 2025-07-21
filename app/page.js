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
import { BadgeDollarSign, NotepadTextDashed, HandCoins } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  ];
  const [isVisible, setIsVisible] = useState(null);
  const [isBudgetsVisible, setIsBudgetsVisible] = useState(null);
  const [isExpensesVisible, setIsExpensesVisible] = useState(null);

  const transactionRef = useRef();
  const expensesRef = useRef();

  const budgetsRef = useRef();
  console.log("isVisible", isVisible);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.7 } // Adjust based on how much should be visible
    );

    if (transactionRef.current) observer.observe(transactionRef.current);

    return () => {
      if (transactionRef.current) observer.unobserve(transactionRef.current);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsBudgetsVisible(entry.isIntersecting);
      },
      { threshold: 0.6 } // Adjust based on how much should be visible
    );

    if (budgetsRef.current) observer.observe(budgetsRef.current);

    return () => {
      if (budgetsRef.current) observer.unobserve(budgetsRef.current);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsExpensesVisible(entry.isIntersecting);
      },
      { threshold: 0.2 } // Adjust based on how much should be visible
    );

    if (expensesRef.current) observer.observe(expensesRef.current);

    return () => {
      if (expensesRef.current) observer.unobserve(expensesRef.current);
    };
  }, []);

  const handleScrollToTransactions = () => {
    const yOffset = -125; // scroll 100px above
    const y =
      transactionRef.current.getBoundingClientRect().top +
      window.pageYOffset +
      yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const handleScrollToBudgets = () => {
    const yOffset = -125; // scroll 100px above
    const y =
      budgetsRef.current.getBoundingClientRect().top +
      window.pageYOffset +
      yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const handleScrollToExpenses = () => {
    const yOffset = -125; // scroll 100px above
    const y =
      expensesRef.current.getBoundingClientRect().top +
      window.pageYOffset +
      yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div className="sm:container mx-auto px-8 sm:px-16 lg:px-16 py-3 flex flex-col gap-4">
      <div className="flex items-center my-3">
        <div>
          Hi, <span className="text-xl">Vamshi Thatikonda</span>
        </div>
        <DateSelect />
      </div>
      <div className="flex gap-5 mt-5 mb-2">
        <Card className={"rounded-[5px] relative flex-1/2 sm:py-10"}>
          <Badge className={"absolute -top-2 left-5 bg-blue-500"}>
            Overview
          </Badge>
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
              <div>
                <h3 className="text-sm text-gray-700 dark:text-gray-400">
                  Fixed Expenses
                </h3>
                <div className="mt-2">Rs 96,000</div>
              </div>

              <Button
                className={
                  "absolute bottom-0 left-[50%] transform translate-y-[50%] translate-x-[-50%] rounded-full bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-300"
                }
                size={"icon"}
              >
                <Plus></Plus>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu */}
      <div className="sticky top-[50px] h-[75px] py-3 z-30 bg-(--background) grid grid-cols-3 mt-2 mb-4 text-sm text-gray-700 dark:text-gray-400">
        <div
          className={
            `flex flex-col items-center cursor-pointer mx-auto` +
            (isVisible
              ? " text-(--foreground) border-b-3 border-(--foreground)"
              : "")
          }
          onClick={handleScrollToTransactions}
        >
          <BadgeDollarSign />
          <div>Transactions</div>
        </div>
        <div
          onClick={handleScrollToBudgets}
          className={
            `flex flex-col items-center cursor-pointer mx-auto` +
            (isBudgetsVisible
              ? " text-(--foreground)  border-b-3 border-(--foreground)"
              : "")
          }
        >
          <NotepadTextDashed />
          <div>Budgets</div>
        </div>
        <div
          onClick={handleScrollToExpenses}
          className={
            `flex flex-col items-center cursor-pointer mx-auto` +
            (isExpensesVisible
              ? " text-(--foreground)  border-b-3 border-(--foreground)"
              : "")
          }
        >
          <HandCoins />
          <div>Expenses</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col gap-2 mt-2 mb-2">
        <div className={"mr-auto text-sm text-gray-700 dark:text-gray-400"}>
          QUICK ACTIONS
        </div>
        <div className="rounded-2xl overflow-x-auto flex gap-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-gray-700 dark:text-gray-400">
          <Badge variant={"secondary"} className={"p-2 rounded-2xl"}>
            Add Expenses
          </Badge>
          <Badge variant={"secondary"} className={"p-2 rounded-2xl"}>
            Update Budgets
          </Badge>
          <Badge variant={"secondary"} className={"p-2 rounded-2xl"}>
            Modify Fixed Expenses
          </Badge>
        </div>
      </div>
      {/* Transactions  */}
      <div className={"flex flex-col mt-1 mb-3"} ref={transactionRef}>
        <div className="my-5 text-lg z-20  bg-(--background) h-[55px] gap-x-3 grid grid-cols-4 items-center">
          <div className={"col-span-3"}>Your Transactions</div>
          <div
            className={
              "text-center mx-auto text-sm text-gray-700 dark:text-gray-400 border-b-2 border-blue-500 pb-1 cursor-pointer"
            }
          >
            view all
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-x-3 h-[34px] flex items-center text-gray-700 dark:text-gray-400 bg-(--background) sticky top-[125px]">
            <div className="text-sm col-span-3 sm:col-span-2">Expense</div>
            <div className="text-sm hidden sm:block text-center">Date</div>
            <div className="text-sm text-center">Amount</div>
            <Separator className={"absolute bottom-0"} />
          </div>

          {transactions.slice(0, 5).map((expense) => (
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
                <div className="hidden sm:block text-center">
                  {getFormattedDate(expense.date)}
                </div>
                <div className="flex flex-col text-center">
                  <div>{getFormattedAmount(expense.amount)}</div>
                  <div className="text-sm block sm:hidden text-gray-700 dark:text-gray-400">
                    {getFormattedDate(expense.date)}
                  </div>
                </div>
              </div>
              {/* <Separator /> */}
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          className={"mr-auto mt-7 p-1 rounded-none border-0"}
        >
          <div className={"border-1 border-(--foreground) p-1"}>View All</div>
        </Button>
      </div>

      {/* Budgets  */}
      <div className={"flex flex-col my-3"} ref={budgetsRef}>
        <div className="my-5 text-lg z-20 bg-(--background) h-[55px] gap-x-3 grid grid-cols-4 items-center">
          <div className={"col-span-3"}>Budgets</div>
          <div
            className={
              "text-center mx-auto text-sm text-gray-700 dark:text-gray-400 border-b-2 border-blue-500 pb-1 cursor-pointer"
            }
          >
            view all
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="z-20 grid grid-cols-4 gap-x-3 h-[34px] flex items-center text-gray-700 dark:text-gray-400 bg-(--background) sticky top-[125px]">
            <div className="text-sm col-span-3">Category</div>
            <div className="text-sm text-center">Amount</div>
            <Separator className={"absolute bottom-0"} />
          </div>

          {budgets.slice(0, 5).map((budget) => (
            <div key={budget.category}>
              <div className="grid gap-x-3 grid-cols-4  mb-3">
                <div className="col-span-3">
                  <div className="flex items-center gap-4">
                    <div
                      style={{
                        "--progress": `${
                          String((budget.spent / budget.budget) * 100) + "%"
                        }`,
                      }}
                      className={`h-10 w-10 flex-shrink-0 rounded-4xl  bg-[conic-gradient(#3b82f6_var(--progress),#e5e7eb_0%)] relative`}
                    >
                      <div className="h-8 w-8 rounded-4xl bg-(--background) flex justify-center items-center absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%]">
                        <Utensils className="flex-shrink-0" />
                      </div>
                    </div>

                    <div className="flex flex-col truncate gap-1">
                      <div className="truncate text">{budget.category}</div>
                      {/* <div className="rounded-2xl text-sm overflow-x-auto flex gap-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-gray-700 dark:text-gray-400">
                        {budget.tags.map((tag) => (
                          <Badge>{tag}</Badge>
                        ))}
                      </div> */}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row justify-center">
                  <div>
                    <div className="flex flex-col text-gray-700 dark:text-gray-400 text-sm">
                      {getFormattedAmount(budget.spent)} /
                    </div>
                    <div className="block">{budget.budget}</div>
                  </div>
                </div>
              </div>
              {/* <Separator /> */}
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          className={"mr-auto mt-7 p-1 rounded-none border-0"}
        >
          <div className={"border-1 border-(--foreground) p-1"}>View All</div>
        </Button>
      </div>
      {/* Fixed Expenses  */}
      <div className={"flex flex-col my-3"} ref={expensesRef}>
        <div className="my-5 text-lg z-20  bg-(--background) h-[55px] gap-x-3 grid grid-cols-4 items-center">
          <div className={"col-span-3"}>Fixed Expenses</div>
          <div
            className={
              "text-center mx-auto text-sm text-gray-700 dark:text-gray-400 border-b-2 border-blue-500 pb-1 cursor-pointer"
            }
          >
            view all
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-x-3 h-[34px] flex items-center text-gray-700 dark:text-gray-400 bg-(--background) sticky top-[125px]">
            <div className="text-sm col-span-3 sm:col-span-2">Expense</div>
            <div className="text-sm hidden sm:block text-center">Date</div>
            <div className="text-sm text-center">Amount</div>
            <Separator className={"absolute bottom-0"} />
          </div>

          {transactions.slice(0, 5).map((expense) => (
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
                <div className="hidden sm:block text-center">
                  {getFormattedDate(expense.date)}
                </div>
                <div className="flex flex-col text-center">
                  <div>{getFormattedAmount(expense.amount)}</div>
                  <div className="text-sm block sm:hidden text-gray-700 dark:text-gray-400">
                    {getFormattedDate(expense.date)}
                  </div>
                </div>
              </div>
              {/* <Separator /> */}
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          className={"mr-auto mt-7 p-1 rounded-none border-0"}
        >
          <div className={"border-1 border-(--foreground) p-1"}>View All</div>
        </Button>
      </div>
    </div>
  );
}
