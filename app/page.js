"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DateSelect from "./components/DateSelect";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp } from "lucide-react";
import { ArrowRightLeft } from "lucide-react";
import { MoveDownLeft } from "lucide-react";
import { MoveUpRight } from "lucide-react";

import {
  getFormattedAmount,
  getFormattedDate,
  getFormattedDateShort,
} from "./util/DateUtility";

import { BadgeDollarSign, NotepadTextDashed, HandCoins } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Utensils } from "lucide-react";
import { ChartGantt } from "lucide-react";
import { BadgeInfo } from "lucide-react";

import { useRouter } from "next/navigation";
import AddExpenseDialog from "./components/AddExpenseDialog";
import EditExpenseDialog from "./components/EditExpenseDialog";
import Transactions from "./components/transactions/Transactions";
import { stringToDarkHSL, stringToHSL } from "./util/ColorUtility";
import { Arrow } from "@radix-ui/react-select";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ChartBarDefault } from "./components/Chart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const router = useRouter();

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

  const [opacity, setOpacity] = useState(1);
  const [hasScrolledToTarget, setHasScrolledToTarget] = useState(false);
  const greetingRef = useRef();

  const targetRef = useRef(null);
  const [showFloating, setShowFloating] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!targetRef.current) return;
      const rect = targetRef.current.getBoundingClientRect();
      console.log("TOP", rect);
      setShowFloating(rect.top <= 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run once on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

        // if (!isClicked && newOpacity < 0.5 && !hasScrolledToTarget) {
        //   console.log("Scrolling to view ", hasScrolledToTarget);
        //   const yOffset = -105; // scroll 100px above
        //   const y =
        //     menuRef.current?.getBoundingClientRect().top +
        //     window.pageYOffset +
        //     yOffset;

        //   window.scrollTo({ top: y, behavior: "smooth" });
        //   setHasScrolledToTarget(true);
        // }

        // if (newOpacity >= 0.6 && hasScrolledToTarget) {
        //   window.scrollTo({ top: 0, behavior: "smooth" });
        //   setHasScrolledToTarget(false);
        // }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasScrolledToTarget, isClicked]);

  console.log("TOP", showFloating);
  console.log("Opactity", opacity);

  const titleRef = useRef([]);
  const valueRef = useRef([]);

  const [connectorStyle1, setConnectorStyle1] = useState(null);
  const [connectorStyle, setConnectorStyle] = useState(null);

  useEffect(() => {
    const updateConnector = (titleRef, valueRef, type) => {
      console.log("UPDATING CONNECTOR", titleRef, valueRef);
      if (!titleRef || !valueRef) return;
      const container = titleRef.closest(".connector-wrap") || document.body;
      const containerRect = container.getBoundingClientRect();
      const a = titleRef.getBoundingClientRect();
      const b = valueRef.getBoundingClientRect();
      const left = Math.round(a.right - containerRect.left);
      const right = Math.round(b.left - containerRect.left);
      const width = Math.max(0, right - left);
      const top = Math.round((a.top + a.bottom) / 2 - containerRect.top);
      console.log("CALCULATED CONNECTOR", { left, right, width, top });
      if (type == "type1") {
        setConnectorStyle1({
          left: `${left + 4}px`,
          width: `${width - 4}px`,
        });
      } else {
        setConnectorStyle({
          left: `${left + 4}px`,
          width: `${width - 4}px`,
        });
      }

      console.log("CONNECTOR UPDATED");
    };

    const toRemove = [];
    titleRef?.current.forEach((_, index) => {
      console.log("SETTING UP CONNECTOR FOR INDEX", index);
      const updateConnector1 = () =>
        updateConnector(
          titleRef.current[index],
          valueRef.current[index],
          "type" + index
        );
      updateConnector1();
      window.addEventListener("resize", updateConnector1);
      window.addEventListener("scroll", updateConnector1, { passive: true });
      toRemove.push(updateConnector1);
    });
    return () => {
      toRemove.forEach((_, index) => {
        window.removeEventListener("resize", toRemove[index]);
        window.removeEventListener("scroll", toRemove[index], {
          passive: true,
        });
      });
    };
  }, [titleRef, valueRef]);

  console.log("CONNECTOR STYLE", connectorStyle);
  console.log("TITLE REF", titleRef.current);
  console.log("VALUE REF", valueRef.current);

  return (
    <div>
      <div className="w-full px-6 sm:px-16 lg:px-16 py-3 flex flex-col gap-4 border border-gray-200/30 dark:border-white/5 dark:bg-[#3D3D3D] bg-[#EFEFEF] rounded-b-2xl">
        <div
          className="flex items-center justify-around gap-2 mt-3 mb-6 my-3 sticky h-[50px] z-40"
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

        {/* <div className={"flex mb-1 gap-4"}>
          <div className="flex items-center bg-[#E0E0E0] gap-2 rounded-2xl border-1 py-1 px-2 border-(--border-color)">
            <div className="aspect-square size-5 flex items-center justify-center rounded-full">
              <HandCoins />
            </div>
            <div className="text-sm font-light text-gray-700 dark:text-gray-400">
              Expenses
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border-1 py-1 px-2 border-(--border-color)">
            <div className="aspect-square size-5 flex items-center justify-center rounded-full">
              <BanknoteArrowUp />
            </div>
            <div className="text-sm font-light text-gray-700 dark:text-gray-400">
              Income
            </div>
          </div>
        </div> */}
        <Card
          className={
            "rounded-none bg-[] py-2 gap-0 dark:bg-[#3D3D3D] bg-[#EFEFEF] border-1 border-[#8A8A8A] "
          }
        >
          <CardContent
            className={"flex py-1 px-1 justify-around items-center gap-4"}
          >
            <div className="flex items-center gap-2">
              <MoveDownLeft
                className="aspect-square text-green-700"
                strokeWidth={2}
                size={18}
              />
              <p className="subLabel">Income</p>
            </div>
            <div>
              <div className="text-2xl font-extrabold">₹ 45,000</div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={
            "rounded-none bg-[] py-2 gap-0 dark:bg-[#3D3D3D] bg-[#EFEFEF] border-1 border-[#8A8A8A] "
          }
        >
          <CardContent
            className={"flex py-1 px-1 justify-around items-center gap-4"}
          >
            <div className="flex items-center gap-2">
              <MoveUpRight
                className="aspect-square text-red-700"
                strokeWidth={2}
                size={18}
              />
              <p className="subLabel">Expenses</p>
            </div>
            <div>
              <div className="text-2xl font-extrabold">₹ 95,000</div>
            </div>
          </CardContent>
        </Card>
        {/* Overview */}
        {/* <div className="flex sm:col-span-10 col-span-2 flex-col sm:items-stretch gap-2 items-center sm:mt-0 ">
          <div className="self-start mb-2 text-sm font-bold text-gray-700 dark:text-gray-400">
            Overview
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 items-center gap-5">
            <div className="flex col-span-1 justify-center">
              <h3
                ref={(el) => (titleRef.current[0] = el)}
                className="text-sm text-gray-700 dark:text-gray-400"
              >
                Today's Expenses
              </h3>
            </div>
            <div
              ref={(el) => (valueRef.current[0] = el)}
              className="border-1 border-[#8A8A8A] col-span-2 sm:col-span-5 flex-1 grid grid-cols-2 text-center gap-2 p-2 sm:justify-around items-center"
            >
              <div className="">Rs 96,000</div>
              <div className="text-sm font-thin flex items-center  justify-center text-gray-700 dark:text-gray-400 ">
                <BadgeInfo className="h-3" />
                Rs 100 <ArrowUp className="h-4" />
              </div>
            </div>
            {connectorStyle && (
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  height: "1px",
                  background: "#8A8A8A",
                  ...connectorStyle,
                  zIndex: 1,
                }}
              />
            )}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 items-center gap-5">
            <div className="flex col-span-1 justify-center">
              <h3
                ref={(el) => (titleRef.current[1] = el)}
                className="text-sm text-gray-700 dark:text-gray-400"
              >
                Fixed Expenses
              </h3>
            </div>
            <div
              ref={(el) => (valueRef.current[1] = el)}
              className="border-1 border-[#8A8A8A] col-span-2 sm:col-span-5 flex-1 grid grid-cols-2 text-center gap-2 p-2 sm:justify-around items-center"
            >
              <div className="">Rs 96,000</div>
              <div className="text-sm font-thin flex items-center  justify-center text-gray-700 dark:text-gray-400 ">
                <BadgeInfo className="h-3" />
                70% of Income <ArrowUp className="h-4" />
              </div>
            </div>
            {connectorStyle1 && (
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  height: "1px",
                  background: "#8A8A8A",
                  ...connectorStyle1,
                  zIndex: 1,
                }}
              />
            )}
          </div>
        </div> */}

        {/* Menu */}
        <div ref={targetRef} className="sticky mt-2 px-3 top-0 z-30">
          <div
            ref={menuRef}
            className="h-[75px] py-3 grid grid-cols-3 justify-items-center text-sm text-gray-700 dark:text-gray-400"
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
        </div>
      </div>
      {/* Quick Actions */}
      <div className="flex flex-col gap-2 mt-6 mb-2 px-8 sm:px-16 lg:px-16">
        <div
          className={
            "mr-auto font-bold mb-3 text-sm mainLabelWide text-gray-700 dark:text-gray-400 "
          }
        >
          Quick Actions
        </div>
        <div className="-mx-8 sm:-mx-16 lg:-mx-16 overflow-x-auto relative">
          <div className="px-8 sm:px-16 lg:px-16 overflow-x-auto flex gap-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-gray-700 dark:text-gray-400">
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
      <div className="mx-auto px-8 sm:px-16 lg:px-16 py-3 flex flex-col gap-4">
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
            <div className="grid grid-cols-4 gap-x-3 h-[44px] flex items-center text-gray-700 dark:text-gray-400 bg-(--background) sticky top-[75px]">
              <div className="text-sm col-span-3 sm:col-span-2">Expense</div>
              <div className="text-sm hidden sm:block text-center">Date</div>
              <div className="text-sm text-center">Amount</div>
              <Separator className={"absolute bottom-0"} />
            </div>
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
                <Separator />
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
              onClick={() => {
                router.push("/view/budgets");
              }}
            >
              view all
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="z-20 grid grid-cols-4 gap-x-3 h-[44px] items-center text-gray-700 dark:text-gray-400 bg-(--background) sticky top-[75px]">
              <div className="text-sm col-span-3">Category</div>
              <div className="text-sm text-center">Amount</div>
              <Separator className={"absolute bottom-0"} />
            </div>

            {budgets.slice(0, 5).map((budget) => {
              const lightColor = stringToHSL(budget.category);
              const darkColor = stringToDarkHSL(budget.category);
              return (
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
                            <div
                              className="flex-shrink-0 bg-(--color-muted) p-2 rounded-full text-[var(--color)] dark:text-[var(--dark-color)]"
                              style={{
                                "--color": lightColor,
                                "--dark-color": darkColor,
                              }}
                            >
                              <Utensils />
                            </div>
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
                  <Separator />
                </div>
              );
            })}
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
          className={"flex flex-col my-3 pb-15"}
          ref={(el) => (sectionRefs.current[3] = el)}
          data-section={"expenses"}
        >
          <div className="my-5 text-lg z-20  bg-(--background) h-[55px] gap-x-3 grid grid-cols-4 items-center">
            <div className={"col-span-3"}>Fixed Expenses</div>
            <div
              className={
                "text-center mx-auto text-sm text-gray-700 dark:text-gray-400 border-b-2 border-blue-500 pb-1 cursor-pointer"
              }
              onClick={() => {
                router.push("/view/expenses");
              }}
            >
              view all
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-4 gap-x-3 h-[44px] items-center text-gray-700 dark:text-gray-400 bg-(--background) sticky top-[75px]">
              <div className="text-sm col-span-3 sm:col-span-2">Expense</div>
              <div className="text-sm hidden sm:block text-center">Date</div>
              <div className="text-sm text-center">Amount</div>
              <Separator className={"absolute bottom-0"} />
            </div>

            {transactions.slice(0, 5).map((expense) => {
              const lightColor = stringToHSL(expense.description);
              const darkColor = stringToDarkHSL(expense.description);

              return (
                <div key={expense.date}>
                  <div className="grid gap-x-3 grid-cols-4  mb-3">
                    <div className=" col-span-3 sm:col-span-2">
                      <div className="flex items-center gap-4">
                        <div
                          className="flex-shrink-0 bg-(--color-muted) p-2 rounded-full text-[var(--color)] dark:text-[var(--dark-color)]"
                          style={{
                            "--color": lightColor,
                            "--dark-color": darkColor,
                          }}
                        >
                          <Utensils />
                        </div>
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
                      <div className=" sm:block hidden">
                        {getFormattedAmount(expense.amount)}
                      </div>
                      <div className="sm:hidden block">{expense.amount}</div>
                      <div className="text-sm block sm:hidden text-gray-700 dark:text-gray-400">
                        {getFormattedDateShort(expense.date)}
                      </div>
                    </div>
                  </div>
                  <Separator />
                </div>
              );
            })}
          </div>
          <Button
            variant="outline"
            className={"mr-auto mt-7 p-1 rounded-none border-0"}
          >
            <div className={"border-1 border-(--foreground) p-1"}>View All</div>
          </Button>
        </div>
        <div className="fixed bottom-8 right-8 h-18 w-18 z-50 bg-muted/90 rounded-full sm:hidden flex justify-center items-center">
          <Button
            className={
              "z-50 flex rounded-full h-13 w-13 bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-300"
            }
            size={"icon"}
            onClick={() => {
              router.push("/add");
            }}
          >
            <Plus className="size-5"></Plus>
          </Button>
        </div>
      </div>
    </div>
  );
}
