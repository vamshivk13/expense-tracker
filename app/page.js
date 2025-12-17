"use client";

import { Button } from "@/components/ui/button";
import DateSelect from "./components/DateSelect";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ChevronRight, Moon, Sun } from "lucide-react";
import { ArrowRightLeft } from "lucide-react";

import {
  getFormattedAmount,
  getFormattedDate,
  getFormattedDateShort,
} from "./util/DateUtility";

import { NotepadTextDashed, HandCoins } from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Utensils } from "lucide-react";
import { ChartGantt } from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";
import EditExpenseDialog from "./components/EditExpenseDialog";
import Transactions from "./components/transactions/Transactions";
import {
  ref,
  onValue,
  db,
  update,
  query,
  orderByChild,
  startAt,
  endAt,
} from "./firebaseConfig";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AddDrawer } from "./components/AddDrawer";
import { Spinner } from "@/components/ui/spinner";
import EditExpense from "./components/EditExpense";
import ViewTransactions from "./view/transactions/ViewTransactions";
import { ThemeProvider, useTheme } from "next-themes";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(true);
  const [todaysExpense, setTodaysExpense] = useState(0);
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [history, setHistory] = useState([]);
  const [curYear, setCurYear] = useState(null);
  const [curMonth, setCurMonth] = useState(null);
  useEffect(() => {
    // Calculate today's expenses
    const today = new Date();
    const todayString = today.toLocaleString();
    console.log("Calculating today's expenses for date:", todayString);
    for (const tx of transactions) {
      console.log("Transaction date:", new Date(tx.date).toLocaleString());
    }
    const total = transactions
      .filter(
        (tx) =>
          new Date(tx.date).toLocaleString().split(",")[0] ==
          todayString.split(",")[0]
      )
      .reduce((sum, tx) => sum + tx.amount, 0);

    setTodaysExpense(total);
  }, [transactions]);

  useEffect(() => {
    let month = new Date().getMonth();
    let year = new Date().getFullYear();
    setCurMonth(month);
    setCurYear(year);
  }, []);

  useEffect(() => {
    if (curMonth == null || curYear == null) return;
    const mm = String(curMonth + 1).padStart(2, "0");

    const start = `${curYear}-${mm}-01T00:00:00.000Z`;
    const end = `${curYear}-${mm}-31T23:59:59.999Z`;

    const q = query(
      ref(db, `expenses`),
      orderByChild("date"),
      startAt(start),
      endAt(end)
    );

    const unsubscribe = onValue(q, (snapshot) => {
      const data = snapshot.val();
      const loadedItems = [];
      for (const key in data) {
        loadedItems.push({ id: key, data: data[key] });
      }
      console.log("Loaded items:", loadedItems);
      setTransactions(
        loadedItems
          .map(({ id, data }) => ({
            id: id,
            amount: data.amount,
            description: data.description,
            category: data.category,
            date: data.date,
            tags: data.tags,
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date))
      );
      const tags = loadedItems.reduce((acc, curr) => {
        if (curr.data.tags && Array.isArray(curr.data.tags)) {
          curr.data.tags.forEach((tag) => {
            tag = tag.toUpperCase();
            if (!acc.has(tag)) {
              acc.set(tag, 0);
            } else {
              acc.set(tag, acc.get(tag) + 1);
            }
          });
        }
        return acc;
      }, new Map());

      console.log("Tags map:", tags);

      const sortedTags = Array.from(tags.entries())
        .sort((a, b) => b[1] - a[1])
        .map((entry) => entry[0]);

      console.log("Sorted tags:", sortedTags);
      setSuggestedTags(sortedTags);

      setIsTransactionsLoading(false);
    });

    return () => unsubscribe();
  }, [curMonth, curYear]);

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

  const [mode, setMode] = useState("main");
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  const goTo = (view) => {
    if (view == null) {
      router.push(`/`);
    } else router.push(`?view=${view}`);
  };

  const goBack = () => {
    if (history.length > 0) {
      const newHistory = [...history];
      const lastView = newHistory.shift();
      setHistory(newHistory);
      goTo(lastView);
    } else {
      goTo(null);
    }
  };

  const { theme, setTheme } = useTheme();
  let themebgColor = theme === "dark" ? "black" : "#e2e8f0";

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {view == null && (
        <div className="w-full ">
          <div className="w-full pb-3 border-none z-30 py-3 relative flex flex-col gap-4 bg-(--top-container-color)">
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `
        linear-gradient(to right, ${themebgColor} 1px, transparent 1px),
        linear-gradient(to bottom, ${themebgColor} 1px, transparent 1px)
      `,
                backgroundSize: "20px 30px",
                WebkitMaskImage:
                  "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
                maskImage:
                  "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
              }}
            />

            <div
              className="flex px-6 sm:px-16 lg:px-16 items-center border-none justify-around gap-2 mt-3 mb-6 my-3 sticky h-[50px] z-30"
              ref={greetingRef}
            >
              <div className="h-full aspect-square p-1/2 bg-black rounded-full">
                <Avatar
                  className={"min-h-full min-w-full  bg-(--foreground) p-1"}
                >
                  <AvatarFallback className={"font-bold"}>V</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <div>Hi,</div>
                <span className="text-xl">Vamshi</span>
              </div>
              <div className="cursor-pointer flex items-center justify-center rounded-full aspect-square ml-auto hover:bg-secondary/50 scale-95 active:bg-secondary/50 transition-all duration-150">
                {theme == "light" ? (
                  <Moon
                    strokeWidth={1.5}
                    className="ml-auto mr-3 "
                    onClick={() => {
                      setTheme(theme === "dark" ? "light" : "dark");
                    }}
                  />
                ) : (
                  <Sun
                    strokeWidth={1.5}
                    className="ml-auto mr-3"
                    onClick={() => {
                      setTheme(theme === "dark" ? "light" : "dark");
                    }}
                  ></Sun>
                )}
              </div>
              <DateSelect
                setCurMonth={setCurMonth}
                setCurYear={setCurYear}
                curMonth={curMonth}
              />
            </div>

            <div className="border-none gap-2 flex-col flex my-3">
              <div className={"border-none flex flex-col my-3 py-1 px-1 gap-5"}>
                <div className="flex items-center justify-center">
                  <div className="flex flex-col gap-3 justify-center items-center">
                    <p className="subLabel2 text-center">Today's Expenses</p>
                    <div className="text-2xl flex font-bold mainLabel justify-center items-center">
                      <div className="text-3xl tracking-wide font-semibold text-center">
                        <span className="font-normal">₹</span>
                        {todaysExpense}
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
            className="px-10 border-none border-b-[0.3px] bg-(--top-container-color) rounded-b-sm sm:px-16 lg:px-16 sticky top-0 z-30"
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
                "mr-auto px-6 sm:px-16 lg:px-16 font-bold mb-3 text-sm mainLabelWide text-gray-700 dark:text-gray-400 "
              }
            >
              Quick Actions
            </div>
            <div className="overflow-x-auto relative">
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
              <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-8 sm:w-16 z-20 bg-gradient-to-r from-white/90 to-transparent dark:from-[black]/40 dark:to-transparent" />
              <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-8 sm:w-16 z-20 bg-gradient-to-l from-white/90 to-transparent dark:from-[black]/40 dark:to-transparent" />
            </div>
          </div>
          <div className="bg-(--background) z-20 px-6 sm:px-16 lg:px-16  ">
            <div className="mx-auto py-3 flex flex-col gap-4">
              {/* Transactions  */}
              <div
                className={"flex flex-col mt-2 mb-2"}
                ref={(el) => (sectionRefs.current[1] = el)}
                data-section={"transactions"}
              >
                <div className="my-5 text-lg h-[55px] gap-x-3 grid grid-cols-7 items-center">
                  <h4 className={"col-span-5 mainLabelWide2"}>
                    your transactions
                  </h4>
                  {transactions != null &&
                    transactions.length != 0 &&
                    !isTransactionsLoading && (
                      <div
                        className={
                          "text-center place-items-center col-span-2 mx-auto subLabel2 text-sm text-gray-700 dark:text-gray-400 border-b-2 border-blue-500 pb-1 cursor-pointer"
                        }
                        onClick={() => {
                          goTo("viewTransactions");
                        }}
                      >
                        view all
                      </div>
                    )}
                </div>
                {isTransactionsLoading && (
                  <div className="flex w-full subLabel2 gap-2 justify-center items-center">
                    <Spinner />
                    <div> Loading transactions...</div>
                  </div>
                )}

                {!isTransactionsLoading && transactions.length == 0 ? (
                  <div className="subLabel2 bg-secondary/50 p-4 rounded-md text-center text-gray-700 dark:text-gray-400">
                    You dont have any transactions yet, Add some to see them
                    here.
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {transactions.slice(0, 5).map((expense) => (
                      <div key={expense.id}>
                        <div className="hidden sm:block">
                          <EditExpenseDialog>
                            <Transactions expense={expense} />
                          </EditExpenseDialog>
                        </div>
                        <div
                          className="sm:hidden block"
                          onClick={() => {
                            setMode("editTransaction");
                            setCurrentExpense(expense);
                            goTo("editTransaction");
                          }}
                        >
                          <Transactions expense={expense} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {transactions != null && transactions.length != 0 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      goTo("viewTransactions");
                    }}
                    className={"mr-auto mt-10 p-1 rounded-none border-0"}
                  >
                    <div
                      className={
                        "border-1 border-(--foreground) p-2 mainLabel2"
                      }
                    >
                      View All
                    </div>
                  </Button>
                )}
              </div>
              {/* Budgets  */}
              <div
                className={"flex flex-col my-3"}
                ref={(el) => (sectionRefs.current[2] = el)}
                data-section={"budgets"}
              >
                <div className="my-5 text-lg h-[55px] gap-x-3 grid grid-cols-4 items-center">
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
                                    String(
                                      (budget.spent / budget.budget) * 100
                                    ) + "%"
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
                  className={"mr-auto mt-10 p-1 rounded-none border-0"}
                >
                  <div
                    className={"border-1 border-(--foreground) p-2 mainLabel2"}
                  >
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
                <div className="my-5 mb-8 text-lg h-[55px] gap-x-3 grid grid-cols-4 items-center">
                  <div className={"col-span-3 mainLabelWide2"}>
                    Fixed Expenses
                  </div>
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
                      <div key={expense.id} className="">
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
                  className={"mr-auto mt-10 p-1 rounded-none border-0"}
                >
                  <div
                    className={"border-1 border-(--foreground) p-2 mainLabel2"}
                  >
                    View All
                  </div>
                </Button>
              </div>
            </div>
          </div>
          <AddDrawer
            setTransactions={setTransactions}
            suggestedTagsProp={[...suggestedTags]}
          />
        </div>
      )}
      <div
        className={`
    fixed inset-x-0 bottom-0 z-40] 
    h-full w-full bg-background 
    transition-transform duration-300 ease-in-out
    rounded-t-2xl shadow-lg
    ${view == "editTransaction" ? "translate-y-0" : "translate-y-full"}
  `}
      >
        <div className="">
          <EditExpense
            goBack={goBack}
            expense={currentExpense}
            goTo={goTo}
            setTransactions={setTransactions}
          />
        </div>
      </div>

      <div
        className={`
    fixed inset-x-0 bottom-0 z-40 
    h-full w-full bg-background 
    transition-transform duration-400 ease-in-out
    rounded-t-2xl shadow-lg
    ${view == "viewTransactions" ? "translate-y-0" : "translate-y-full"}
  `}
      >
        <div className="">
          <ViewTransactions
            setCurMonth={setCurMonth}
            setCurYear={setCurYear}
            curMonth={curMonth}
            setHistory={setHistory}
            history={history}
            transactions={transactions}
            goTo={goTo}
            setTransactions={setTransactions}
            setCurrentExpense={setCurrentExpense}
          />
        </div>
      </div>
    </Suspense>
  );
}
