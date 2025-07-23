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

  const sectionRefs = useRef([]);
  const menuRef = useRef();
  const [activeSection, setActiveSection] = useState(null);

  console.log("active session", activeSection);
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
    const yOffset = -165; // scroll 100px above
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
    const yOffset = -175; // scroll 100px above
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
    const yOffset = -175; // scroll 100px above
    const y =
      sectionRefs.current[3].getBoundingClientRect().top +
      window.pageYOffset +
      yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
    setTimeout(() => {
      setIsClicked(false);
    }, 2000);
  };

  const [opacity, setOpacity] = useState(1);
  const [hasScrolledToTarget, setHasScrolledToTarget] = useState(false);
  const greetingRef = useRef();
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRefs.current[0]) {
        const fadeStart = 50; // px from top where fade starts
        const fadeEnd = 250; // px from top where fade ends

        const currentScroll = window.scrollY;

        let newOpacity = 1;
        if (currentScroll <= fadeStart) {
          newOpacity = 1;
        } else if (currentScroll >= fadeEnd) {
          newOpacity = 0;
        } else {
          const scrolled = currentScroll - fadeStart;
          newOpacity = 1 - scrolled / (fadeEnd - fadeStart);
        }

        setOpacity(newOpacity);

        if (!isClicked && newOpacity < 0.5 && !hasScrolledToTarget) {
          console.log("Scrolling to view ", hasScrolledToTarget);
          const yOffset = -105; // scroll 100px above
          const y =
            menuRef.current?.getBoundingClientRect().top +
            window.pageYOffset +
            yOffset;

          window.scrollTo({ top: y, behavior: "smooth" });
          setHasScrolledToTarget(true);
        }

        console.log(
          "OPACITY",
          newOpacity,
          hasScrolledToTarget,
          newOpacity >= 0.6 && hasScrolledToTarget
        );
        // Optional: Reset the flag when scrolled back up
        if (newOpacity >= 0.6 && hasScrolledToTarget) {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setHasScrolledToTarget(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasScrolledToTarget, isClicked]);

  console.log("Opactity", opacity);

  return (
    <div className="sm:container mx-auto px-8 sm:px-16 lg:px-16 py-3 flex flex-col gap-4">
      <div
        className="flex items-center my-3 sticky top-[50px] h-[50px] bg-(--background) z-60"
        ref={greetingRef}
      >
        <div>
          Hi, <span className="text-xl">Vamshi Thatikonda</span>
        </div>
        <DateSelect />
      </div>
      <div
        data-section="overview"
        ref={(el) => (sectionRefs.current[0] = el)}
        className="flex gap-5 mt-5 mb-2 transition-opacity duration-700"
        style={{ opacity }}
      >
        <Card className={"rounded-[5px] relative flex-1/2 sm:py-10"}>
          <Badge
            className={
              "absolute top-0 transform translate-y-[-50%] left-5 bg-blue-500"
            }
          >
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
      <div
        ref={menuRef}
        className="sticky top-[100px] h-[75px] py-3 z-30 bg-(--background) grid grid-cols-3 mt-2 mb-4 text-sm text-gray-700 dark:text-gray-400"
      >
        <div
          className={
            `flex flex-col items-center cursor-pointer mx-auto` +
            (activeSection == "transactions"
              ? " text-(--foreground) border-b-3 border-(--foreground)"
              : "")
          }
          onClick={handleScrollToTransactions}
        >
          <BadgeDollarSign />
          <div className="pointer-events-none select-none">Transactions</div>
        </div>
        <div
          onClick={handleScrollToBudgets}
          className={
            `flex flex-col items-center cursor-pointer mx-auto` +
            (activeSection == "budgets"
              ? " text-(--foreground)  border-b-3 border-(--foreground)"
              : "")
          }
        >
          <NotepadTextDashed />
          <div className="pointer-events-none select-none">Budgets</div>
        </div>
        <div
          onClick={handleScrollToExpenses}
          className={
            `flex flex-col items-center cursor-pointer mx-auto` +
            (activeSection == "expenses"
              ? " text-(--foreground)  border-b-3 border-(--foreground)"
              : "")
          }
        >
          <HandCoins />
          <div className="pointer-events-none select-none">Expenses</div>
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
      <div
        className={"flex flex-col mt-1 mb-3"}
        ref={(el) => (sectionRefs.current[1] = el)}
        data-section={"transactions"}
      >
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
          <div className="grid grid-cols-4 gap-x-3 h-[34px] flex items-center text-gray-700 dark:text-gray-400 bg-(--background) sticky top-[175px]">
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
      <div
        className={"flex flex-col my-3"}
        ref={(el) => (sectionRefs.current[2] = el)}
        data-section={"budgets"}
      >
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
          <div className="z-20 grid grid-cols-4 gap-x-3 h-[34px] flex items-center text-gray-700 dark:text-gray-400 bg-(--background) sticky top-[175px]">
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
      <div
        className={"flex flex-col my-3"}
        ref={(el) => (sectionRefs.current[3] = el)}
        data-section={"expenses"}
      >
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
          <div className="grid grid-cols-4 gap-x-3 h-[34px] flex items-center text-gray-700 dark:text-gray-400 bg-(--background) sticky top-[175px]">
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
