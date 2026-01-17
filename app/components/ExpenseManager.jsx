"use client";

import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowDownUp,
  ArrowLeft,
  ArrowRight,
  Calendar1,
  Check,
  ClipboardCopy,
  Cross,
  Delete,
  DeleteIcon,
  Edit,
  LucideDelete,
  Plus,
  Receipt,
  RecycleIcon,
  Trash,
  UtilityPole,
  UtilityPoleIcon,
  X,
} from "lucide-react";
import { ref, onValue, db, remove, update, push, set } from "../firebaseConfig";
import { getFormattedAmount, getFormattedDate } from "../util/DateUtility";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AddExpenseBill } from "./AddExpenseBill";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { EditExpenseBill } from "./EditExpenseBill";
import { endAt, get, orderByChild, query, startAt } from "firebase/database";
import { Progress } from "@/components/ui/progress";

export function ExpenseManager({
  bills,
  budget,
  setBudget,
  setBills,
  goBack,
  curMonth,
}) {
  const [billsByDate, setBillsByDate] = React.useState(bills);
  const [billsByCategory, setBillsByCategroy] = React.useState(bills);
  const [date, setDate] = React.useState(new Date());
  const [currentBudget, setCurrentBudget] = React.useState(budget);
  const [isBudgetEditMode, setIsBudgetEditMode] = React.useState(false);
  const [currentData, setCurrentData] = React.useState([]);

  const [viewMode, setViewMode] = React.useState(["By Date", "By Category"]);

  React.useEffect(() => {
    if (viewMode[0] == "By Date") {
      setCurrentData(billsByDate);
    } else if (viewMode[0] == "By Category") {
      setCurrentData(billsByCategory);
    }
  }, [viewMode[0], billsByCategory, billsByDate]);

  function handleEditBudget() {
    setBudget(currentBudget);
    const budgetRef = ref(db, "budget/");
    update(budgetRef, { val: currentBudget }).catch((err) =>
      console.log("budget error", err)
    );
    setIsBudgetEditMode(false);
  }

  function handleCopyPreviousMonthBills() {
    const curDate = new Date();
    let curMth = curMonth - 1;

    let curYear = curDate.getFullYear();
    if (curMth < 0) {
      curMth = 11; // December
      curYear = curYear - 1; // Previous year
    }
    if (curMth == null || curYear == null) return;
    const mm = curMth + 1;

    const startDate = new Date(curYear, mm - 1, 1, 0, 0, 0);
    const endDate = new Date(curYear, mm, 0, 23, 59, 59, 999);

    const start = new Date(
      startDate.getTime() - 5.5 * 60 * 60 * 1000
    ).toISOString();
    const end = new Date(
      endDate.getTime() - 5.5 * 60 * 60 * 1000
    ).toISOString();

    const q = query(
      ref(db, `bills`),
      orderByChild("date"),
      startAt(start),
      endAt(end)
    );

    console.log("GETTING PREVIOUS BILLS");

    get(q)
      .then((snapshot) => {
        const data = snapshot.val();
        const loadedItems = [];
        for (const key in data) {
          loadedItems.push({ id: key, data: data[key] });
        }
        console.log("Loaded Bills:", loadedItems);

        const curBills = loadedItems
          .filter(
            ({ data }) =>
              bills.findIndex((bill) => bill.expense == data.expense) == -1
          )
          .map(({ id, data }) => ({
            amount: data.amount,
            expense: data.expense,
            date: new Date(
              new Date(
                curDate.getFullYear(),
                curMonth,
                new Date(data.date).getDate(),
                new Date(data.date).getHours(),
                new Date(data.date).getMinutes(),
                new Date(data.date).getSeconds()
              )
            ).toISOString(),
            isPaid: false,
            category: data.category || "Other",
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        setBills((prev) => [...prev, ...curBills]);

        curBills.forEach((bill) => {
          push(ref(db, `bills`), bill).catch((err) =>
            console.error("Failed to copy previous month bills:", err)
          );
        });
      })
      .catch((error) => {
        console.log("Error fetching previous month bills:", error);
      });
  }

  console.log("BILLS IN MANAGER", bills);

  React.useEffect(() => {
    const sortedBills = bills.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    const billsByDate = sortedBills.reduce((acc, transaction) => {
      const date = new Date(transaction.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction);
      return acc;
    }, {});

    const groupedBills = [];
    for (const date in billsByDate) {
      groupedBills.push({
        key: date,
        bills: billsByDate[date],
        totalAmount: billsByDate[date].reduce(
          (acc, curr) => acc + Number(curr.amount),
          0
        ),
      });
    }
    console.log("Transactions grouped by date:", groupedBills);
    setBillsByDate(groupedBills);
  }, [bills]);

  React.useEffect(() => {
    const sortedBills = bills.sort((a, b) => {
      return a.category - b.category;
    });

    const billsByCategory = sortedBills.reduce((acc, transaction) => {
      const category = transaction?.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(transaction);
      return acc;
    }, {});
    const groupedBills = [];
    for (const category in billsByCategory) {
      groupedBills.push({
        key: category,
        bills: billsByCategory[category],
        totalAmount: billsByCategory[category]?.reduce(
          (acc, curr) => acc + Number(curr.amount),
          0
        ),
      });
    }
    console.log("CATEGORY GROUPED", groupedBills);
    setBillsByCategroy(groupedBills);
  }, [bills]);

  function getStatusByLocalDay(target) {
    const startOfLocalDay = (d) => {
      const copy = new Date(d);
      copy.setHours(0, 0, 0, 0); // local midnight
      return copy.getTime();
    };

    const todayStart = startOfLocalDay(new Date());
    const targetStart = startOfLocalDay(new Date(target));

    if (targetStart === todayStart) return "today";
    return targetStart > todayStart ? "upcoming" : "overdue";
  }
  const totalBill = bills.reduce((acc, bill) => {
    return acc + Number(bill.amount);
  }, 0);
  const totalBillPaid = bills.reduce((acc, bill) => {
    if (bill.isPaid) return acc + Number(bill.amount);
    else {
      return acc;
    }
  }, 0);
  const totalBillUnPaid = totalBill - totalBillPaid;
  const remaining = budget - totalBill;

  const percentage = Math.min((totalBill / budget) * 100, 100);

  const status = remaining > 0 ? "within" : remaining === 0 ? "exact" : "over";

  const progressStyles = {
    within: "bg-green-600",
    exact: "bg-blue-600",
    over: "bg-red-600",
  };

  return (
    <div
      className={
        "flex flex-col h-[100vh] gap-5 sm:container mx-auto px-4 sm:px-16 lg:px-16"
      }
    >
      <div className="flex flex-col h-full gap-4 text-lg bg-background w-full">
        <div className="flex gap-2 pt-4 px-2 items-center relative">
          <ArrowLeft className="left-2 absolute" onClick={() => goBack()} />
          <div className="mx-auto subLabel px-4 py-2 rounded-full border-[0.3px] border-blue-400">
            Expenses Manager
          </div>
        </div>
        <Card className="bg-card-light dark:bg-card-dark p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 ">
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex flex-col max-w-full my-3 gap-4">
                <div className="flex flex-col gap-2">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Total Amount
                  </div>
                  <div className="text-4xl font-bold tracking-tight">
                    {getFormattedAmount(totalBill)}
                  </div>
                </div>
              </div>
              <div className="bg-background flex justify-center items-center border border-(--border-color)/60 p-3 rounded-full text-[var(--color)] dark:text-[var(--dark-color)]">
                <Calendar1 strokeWidth={1} />
              </div>
            </div>
            <div
              className={`
    my-2`}
            >
              <div className="flex flex-col gap-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex gap-2 items-center">
                  <p>Total Budget</p>
                  <Edit
                    onClick={() => setIsBudgetEditMode((prev) => !prev)}
                    className="text-gray-700"
                    strokeWidth={1}
                    size={13}
                  />
                </div>
                {isBudgetEditMode ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleEditBudget();
                    }}
                    className="flex gap-2 items-center cursor-pointer"
                    id="category"
                  >
                    <p>₹</p>
                    <input
                      placeholder="0"
                      type="number"
                      className={
                        "text-xl font-semibold text-slate-700 dark:text-slate-300 w-full border-b-1 resize-none min-h-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                      }
                      value={currentBudget}
                      onChange={(e) => setCurrentBudget(e.target.value)}
                    />
                    <Button
                      onClick={() => {
                        handleEditBudget();
                      }}
                      variant={"outline"}
                      className={"h-8 w-8 rounded-full"}
                    >
                      <ArrowRight />
                    </Button>
                  </form>
                ) : (
                  <div className="mainHeading ">
                    {getFormattedAmount(budget)}
                  </div>
                )}
              </div>
              <div class="text-right">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  {status === "within"
                    ? "Within Budget"
                    : status === "exact"
                    ? "Exact Budget"
                    : "Over Budget"}
                </span>
              </div>
            </div>
            <Progress
              value={percentage}
              className={`
    my-2
    [&_[data-state=complete]]:bg-transparent
    ${status === "within" && "[&>div]:bg-blue-600"}
    ${status === "exact" && "[&>div]:bg-orange-600"}
    ${status === "over" && "[&>div]:bg-red-600"}
  `}
              // indicatorClassName={progressStyles[status]}
            />
            <div class="flex justify-between text-[11px] font-medium">
              <span class="text-slate-400">
                {Math.floor(percentage)}% of limit used
              </span>
              <span class="text-emerald-500 font-bold">
                {getFormattedAmount(remaining)} Left
              </span>
            </div>

            <div class="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
              <p class="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Paid <span class="text-primary font-bold">{totalBillPaid}</span>{" "}
                • Due{" "}
                <span class="text-amber-500 font-bold">{totalBillUnPaid}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="!p-0 flex  mb-1 mt-2 justify-center items-center gap-1 px-6 pb-3 sm:pb-0">
          <AddExpenseBill setBills={setBills} />

          <div
            onClick={() => {
              setViewMode((prev) => {
                const prev1 = [...prev];
                const toRear = prev1.shift();
                return [...prev1, toRear];
              });
            }}
            className="subLabel cursor-pointer select-none text-gray-600 ml-auto"
          >
            <ArrowDownUp strokeWidth={1} size={16} />
          </div>
          <div
            onClick={handleCopyPreviousMonthBills}
            className="subLabel cursor-pointer select-none text-gray-600 ml-2"
          >
            <ClipboardCopy strokeWidth={1} size={16} />
          </div>
        </div>
        {billsByDate.length == 0 ? (
          <div className="subLabel2 bg-secondary/50 p-4 rounded-md text-center text-gray-700 dark:text-gray-400">
            You dont have any transactions yet, Add some to see them here.
          </div>
        ) : (
          <div className="overflow-y-auto h-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {/* <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-lg border-none w-full"
          />  */}
            {currentData.map((group) => (
              <div className=" mt-6 mb-4 flex flex-col gap-4">
                <div className="flex mb-1 flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="mainLabel2 col-span-6">{group.key}</div>
                    <div className="font-medium col-span-2 subLabel place-self-center text-(--foreground)/90">
                      {getFormattedAmount(group.totalAmount)}
                    </div>
                  </div>
                </div>
                {group?.bills?.map((bill) => {
                  return (
                    <EditExpenseBill setBills={setBills} currentBill={bill}>
                      <Card
                        key={bill.id}
                        className={
                          "bg-card-light dark:bg-card-dark p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all gap-4"
                        }
                      >
                        <CardContent className={"p-0"}>
                          <div className="grid grid-cols-6 items-center">
                            <div className="col-span-4 flex place-self-start items-center gap-4">
                              <div className="bg-background border border-(--border-color)/60 p-2 rounded-full text-[var(--color)] dark:text-[var(--dark-color)]">
                                <Receipt strokeWidth={1} />
                              </div>
                              <div className="mr-auto flex gap-2 flex-col">
                                <div className="subLabel2">{bill.expense}</div>
                                <div className="col-span-1 mainHeading uppercase !text-sm">
                                  {getFormattedAmount(bill.amount)}
                                </div>
                                <div className="subLabel3">
                                  {viewMode[0] == "By Date"
                                    ? bill.category
                                    : getFormattedDate(bill.date)}
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2 ml-auto">
                              {bill.isPaid ? (
                                <div className="subLabel3 !text-green-500">
                                  Bill Paid
                                </div>
                              ) : getStatusByLocalDay(bill.date) ==
                                "upcoming" ? (
                                <div className="subLabel3 !text-blue-700">
                                  Upcoming
                                </div>
                              ) : getStatusByLocalDay(bill.date) ==
                                "overdue" ? (
                                <div className="subLabel3 !text-red-700">
                                  OverDue
                                </div>
                              ) : (
                                <div className="subLabel3 !text-yellow-600">
                                  Today
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </EditExpenseBill>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
