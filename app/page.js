"use client";

import { Button } from "@/components/ui/button";
import DateSelect from "./components/DateSelect";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { ArrowRightLeft } from "lucide-react";

import {
  getFormattedAmount,
  getFormattedDate,
  getFormattedDateShort,
} from "./util/DateUtility";

import { NotepadTextDashed, HandCoins } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Utensils } from "lucide-react";
import { ChartGantt } from "lucide-react";

import { useRouter } from "next/navigation";
import EditExpenseDialog from "./components/EditExpenseDialog";
import Transactions from "./components/transactions/Transactions";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AddDrawer } from "./components/AddDrawer";

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

  const sectionRefs = useRef([]);
  const menuRef = useRef();
  const [activeSection, setActiveSection] = useState("transactions");
  const router = useRouter();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.dataset.section);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const [isClicked, setIsClicked] = useState(false);

  const handleScrollToTransactions = () => {
    setIsClicked(true);
    const yOffset = -105; // scroll 100px above
    const y =
      sectionRefs.current[1].getBoundingClientRect().top +
      window.pageYOffset +
      yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
    setTimeout(() => {
      setIsClicked(false);
    }, 2000);
  };

  const handleScrollToBudgets = () => {
    setIsClicked(true);
    const yOffset = -75; // scroll 100px above
    const y =
      sectionRefs.current[2].getBoundingClientRect().top +
      window.pageYOffset +
      yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
    setTimeout(() => {
      setIsClicked(false);
    }, 2000);
  };

  const handleScrollToExpenses = () => {
    setIsClicked(true);
    const yOffset = -105; // scroll 100px above
    const y =
      sectionRefs.current[3].getBoundingClientRect().top +
      window.pageYOffset +
      yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
    setTimeout(() => {
      setIsClicked(false);
    }, 2000);
  };

  const greetingRef = useRef();

  const targetRef = useRef(null);

  return (
    <div className="w-full ">
      <div className="w-full pb-3 border-none z-40 py-3 relative flex flex-col gap-4 bg-(--top-container-color)">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
        linear-gradient(to right, #e2e8f0 1px, transparent 1px),
        linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
      `,
            backgroundSize: "20px 30px",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          }}
        />

        <div
          className="flex px-6 sm:px-16 lg:px-16 items-center justify-around gap-2 mt-3 mb-6 my-3 sticky h-[50px] z-40"
          ref={greetingRef}
        >
          <div className="h-full aspect-square p-1/2 bg-black rounded-full">
            <Avatar className={"min-h-full min-w-full  bg-(--foreground) p-1"}>
              <AvatarFallback className={"font-bold"}>V</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <div>Hi,</div>
            <span className="text-xl">Vamshi</span>
          </div>
          <DateSelect />
        </div>

        <div className="gap-2 flex-col flex my-3">
          <div className={" border-none flex flex-col my-3 py-1 px-1 gap-5"}>
            <div className="flex items-center justify-center">
              <div className="flex flex-col gap-3 justify-center items-center">
                <p className="subLabel2 text-center">Today's Expenses</p>
                <div className="text-2xl flex font-bold mainLabel justify-center items-center">
                  <div className="text-3xl tracking-wide font-semibold text-center">
                    <span className="font-normal">₹</span>95,000
                  </div>
                  <ChevronRight className="" size={24} strokeWidth={1} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* MENU   */}
      <div
        ref={targetRef}
        className="px-10 border-b-[0.3px] bg-(--top-container-color) rounded-b-sm sm:px-16 lg:px-16 sticky top-0 z-40"
      >
        <div className="h-[8px]"></div>
        <div
          ref={menuRef}
          className="h-[75px] relative flex-1 py-3 grid grid-cols-3 justify-items-center text-sm text-gray-700 dark:text-gray-400"
        >
          <div
            className={
              `flex flex-col items-center justify-center cursor-pointer mx-auto gap-2` +
              (activeSection == "transactions"
                ? " text-(--foreground) font-bold"
                : "")
            }
            onClick={handleScrollToTransactions}
          >
            <ArrowRightLeft strokeWidth={1} />
            <div className="relative pointer-events-none subLabel2 select-none">
              Transactions
            </div>
            {activeSection == "transactions" && (
              <div className="absolute bottom-1 h-1 w-7 bg-(--foreground)"></div>
            )}
          </div>
          <div
            onClick={handleScrollToBudgets}
            className={
              `flex flex-col items-center justify-center cursor-pointer mx-auto gap-2` +
              (activeSection == "budgets"
                ? " text-(--foreground) font-bold"
                : "")
            }
          >
            <NotepadTextDashed strokeWidth={1} />
            <div className="pointer-events-none subLabel2 select-none">
              Budgets
            </div>
            {activeSection == "budgets" && (
              <div className="absolute bottom-1 h-1 w-7 bg-(--foreground)"></div>
            )}
          </div>
          <div
            onClick={handleScrollToExpenses}
            className={
              `flex flex-col justify-center items-center cursor-pointer mx-auto gap-2` +
              (activeSection == "expenses"
                ? " text-(--foreground) font-bold"
                : "")
            }
          >
            <HandCoins strokeWidth={1} />
            <div className="pointer-events-none select-none subLabel2 ">
              Expenses
            </div>
            {activeSection == "expenses" && (
              <div className="absolute bottom-1 h-1 w-7 bg-(--foreground)"></div>
            )}
          </div>
        </div>
        <div className="h-[8px]"></div>
      </div>
      <div className="flex flex-col gap-2 mt-8 mb-2">
        <div
          className={
            "mr-auto px-6 font-bold mb-3 text-sm mainLabelWide text-gray-700 dark:text-gray-400 "
          }
        >
          Quick Actions
        </div>
        <div className="sm:-mx-16 lg:-mx-16 overflow-x-auto relative">
          <div className="px-6 sm:px-16 lg:px-16 overflow-x-auto flex gap-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-gray-700 dark:text-gray-400">
            <Badge
              variant={"secondary"}
              className={
                "p-2 border-1 border-(--border-color) sm:text-sm rounded-2xl bg-(--color-muted)"
              }
            >
              <Plus /> Add Expenses
            </Badge>
            <Badge
              variant={"secondary"}
              className={
                "p-2 border-1 border-(--border-color) sm:text-sm rounded-2xl bg-(--color-muted)"
              }
            >
              <ChartGantt /> Update Budgets
            </Badge>
            <Badge
              variant={"secondary"}
              className={
                "p-2 border-1 border-(--border-color) sm:text-sm rounded-2xl bg-(--color-muted) "
              }
            >
              <HandCoins /> Modify Fixed Expenses
            </Badge>
          </div>
        </div>
        <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-8 sm:w-16 z-20 bg-gradient-to-r from-white/90 to-transparent dark:from-[#3D3D3D]/90 dark:to-transparent" />
        <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-8 sm:w-16 z-20 bg-gradient-to-l from-white/90 to-transparent dark:from-[#3D3D3D]/90 dark:to-transparent" />
      </div>
      <div className="bg-(--background) z-20 px-6 sm:px-16 lg:px-16  ">
        <div className="mx-auto py-3 flex flex-col gap-4">
          {/* Transactions  */}
          <div
            className={"flex flex-col mt-2 mb-2"}
            ref={(el) => (sectionRefs.current[1] = el)}
            data-section={"transactions"}
          >
            <div className="my-5 text-lg z-20  bg-(--background) h-[55px] gap-x-3 grid grid-cols-4 items-center">
              <h4 className={"col-span-3 mainLabelWide2"}>your transactions</h4>
              <div
                className={
                  "text-center mx-auto subLabel2 text-sm text-gray-700 dark:text-gray-400 border-b-2 border-blue-500 pb-1 cursor-pointer"
                }
                onClick={() => {
                  router.push("/view/transactions");
                }}
              >
                view all
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {transactions.slice(0, 5).map((expense) => (
                <div key={expense.date}>
                  <div className="hidden sm:block">
                    <EditExpenseDialog>
                      <Transactions expense={expense} />
                    </EditExpenseDialog>
                  </div>
                  <div
                    className="sm:hidden block"
                    onClick={() => router.push("/edit")}
                  >
                    <Transactions expense={expense} />
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className={"mr-auto mt-7 p-1 rounded-none border-0"}
            >
              <div className={"border-1 border-(--foreground) p-1"}>
                View All
              </div>
            </Button>
          </div>
          {/* Budgets  */}
          <div
            className={"flex flex-col my-3"}
            ref={(el) => (sectionRefs.current[2] = el)}
            data-section={"budgets"}
          >
            <div className="my-5 text-lg z-20 bg-(--background) h-[55px] gap-x-3 grid grid-cols-4 items-center">
              <div className={"col-span-3 mainLabelWide2"}>Budgets</div>
              <div
                className={
                  "text-center subLabel2 mx-auto text-sm text-gray-700 dark:text-gray-400 border-b-2 border-blue-500 pb-1 cursor-pointer"
                }
                onClick={() => {
                  router.push("/view/budgets");
                }}
              >
                view all
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {budgets.slice(0, 5).map((budget) => {
                return (
                  <div key={budget.category}>
                    <div className="grid gap-x-3 grid-cols-4  mb-3">
                      <div className="col-span-3">
                        <div className="flex items-center gap-4">
                          <div
                            style={{
                              "--progress": `${
                                String((budget.spent / budget.budget) * 100) +
                                "%"
                              }`,
                            }}
                            className={`h-10 w-10 flex-shrink-0 rounded-4xl  bg-[conic-gradient(#3b82f6_var(--progress),#e5e7eb_0%)] relative`}
                          >
                            <div className="h-8 w-8 rounded-4xl bg-(--background) flex justify-center items-center absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%]">
                              <div className="border border-(--border-color)/30 flex-shrink-0 bg-(--color-muted) p-2 rounded-full text-[var(--color)] dark:text-[var(--dark-color)]">
                                <Utensils />
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col truncate gap-1">
                            <div className="truncate text customLabel">
                              {budget.category}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row justify-center">
                        <div>
                          <div className="flex flex-col text-gray-700 dark:text-gray-400 belowLabel text-sm">
                            {getFormattedAmount(budget.spent)} /
                          </div>
                          <div className="block customLabel">
                            {budget.budget}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button
              variant="outline"
              className={"mr-auto mt-7 p-1 rounded-none border-0"}
            >
              <div className={"border-1 border-(--foreground) p-1"}>
                View All
              </div>
            </Button>
          </div>
          {/* Fixed Expenses  */}
          <div
            className={"flex flex-col my-3 pb-15"}
            ref={(el) => (sectionRefs.current[3] = el)}
            data-section={"expenses"}
          >
            <div className="my-5 mb-8 text-lg z-20  bg-(--background) h-[55px] gap-x-3 grid grid-cols-4 items-center">
              <div className={"col-span-3 mainLabelWide2"}>Fixed Expenses</div>
              <div
                className={
                  "text-center subLabel2 mx-auto text-sm text-gray-700 dark:text-gray-400 border-b-2 border-blue-500 pb-1 cursor-pointer"
                }
                onClick={() => {
                  router.push("/view/expenses");
                }}
              >
                view all
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {transactions.slice(0, 5).map((expense) => {
                return (
                  <div key={expense.date} className="">
                    <div className="grid gap-x-3 grid-cols-4  mb-3">
                      <div className=" col-span-3 sm:col-span-2">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 bg-(--color-muted) p-2 rounded-full text-[var(--color)] dark:text-[var(--dark-color)]">
                            <Utensils />
                          </div>
                          <div className="flex flex-col gap-1 truncate">
                            <div className="truncate customLabel">
                              {expense.description}
                            </div>
                            <div className="text-sm text-gray-700 dark:text-gray-400 belowLabel">
                              {expense.category}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="hidden sm:block text-center customLabel">
                        {getFormattedDate(expense.date)}
                      </div>
                      <div className="flex flex-col text-center gap-1">
                        <div className=" sm:block hidden customLabel">
                          {getFormattedAmount(expense.amount)}
                        </div>
                        <div className="sm:hidden block customLabel">
                          {getFormattedAmount(expense.amount)}
                        </div>
                        <div className="text-sm block sm:hidden belowLabel text-gray-700 dark:text-gray-400">
                          {getFormattedDateShort(expense.date)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button
              variant="outline"
              className={"mr-auto mt-7 p-1 rounded-none border-0"}
            >
              <div className={"border-1 border-(--foreground) p-1"}>
                View All
              </div>
            </Button>
          </div>
        </div>
      </div>
      <AddDrawer />
    </div>
  );
}
