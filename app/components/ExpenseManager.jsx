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
  ArrowLeft,
  ArrowRight,
  Calendar1,
  Check,
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
import { getFormattedAmount } from "../util/DateUtility";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AddExpenseBill } from "./AddExpenseBill";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

export function ExpenseManager({ bills, budget, setBudget, setBills, goBack }) {
  const [billsByDate, setBillsByDate] = React.useState(bills);
  const [date, setDate] = React.useState(new Date());
  const [currentBudget, setCurrentBudget] = React.useState(budget);
  const [isBudgetEditMode, setIsBudgetEditMode] = React.useState(false);

  function handleDeleteBill(id) {
    setBills((prev) => {
      return prev.filter((tx) => tx.id !== id);
    });

    const billsRef = ref(db, "bills/" + id);
    remove(billsRef).catch((err) =>
      console.error("Failed to delete expense:", err)
    );
  }

  function handleEditBudget() {
    setBudget(currentBudget);
    const budgetRef = ref(db, "budget/");
    update(budgetRef, { val: currentBudget }).catch((err) =>
      console.log("budget error", err)
    );
    setIsBudgetEditMode(false);
  }

  function handleIsPaidBill(id) {
    const curBill = { ...bills.filter((tx) => tx.id == id)[0] };

    setBills((prev) => {
      return prev.map((bill) => {
        if (bill.id == id) {
          return {
            ...bill,
            isPaid: !bill.isPaid,
          };
        } else {
          return bill;
        }
      });
    });

    const billsRef = ref(db, "bills/" + id);
    update(billsRef, { ...curBill, isPaid: !curBill.isPaid }).catch((err) =>
      console.error("Failed to delete expense:", err)
    );
  }

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
        date: date,
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

  return (
    <div
      className={
        "flex flex-col h-dvh gap-5 sm:container mx-auto px-4 sm:px-16 lg:px-16 py-3"
      }
    >
      <div className="flex flex-col h-full gap-4 text-lg bg-background py-4 w-full">
        <div className="flex gap-2 px-2 col-span-3 items-center ">
          <ArrowLeft className=" " onClick={() => goBack()} />
          <div className="mx-auto subLabel px-4 py-2 rounded-full border-[0.3px] border-blue-400">
            Expenses Manager
          </div>
          <AddExpenseBill setBills={setBills} />
        </div>
        <Card
          className={
            "p-1 my-4 mb-2 rounded-sm shadow-[0_px_1px_rgb(0,0,0,0.2)] bg-secondary/50"
          }
        >
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex flex-col max-w-full my-3 gap-4">
                <div className="flex flex-col gap-2">
                  <div className="belowLabel uppercase">Total Amount</div>
                  <div className="mainHeading">
                    {getFormattedAmount(
                      bills.reduce((acc, bill) => {
                        return acc + Number(bill.amount);
                      }, 0)
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="belowLabel uppercase flex gap-2 items-center">
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
                          "text-sm p-1 mainHeading w-full border-b-1 resize-none min-h-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
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
              </div>
              <div className="bg-background flex justify-center items-center border border-(--border-color)/60 p-3 rounded-full text-[var(--color)] dark:text-[var(--dark-color)]">
                <Calendar1 strokeWidth={1} />
              </div>
            </div>
          </CardContent>
        </Card>
        {billsByDate.length == 0 ? (
          <div className="subLabel2 bg-secondary/50 p-4 rounded-md text-center text-gray-700 dark:text-gray-400">
            You dont have any transactions yet, Add some to see them here.
          </div>
        ) : (
          <div className="overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {/* <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-lg border-none w-full"
          />  */}
            {billsByDate.map((group) => (
              <div className="mt-6 flex flex-col gap-4">
                <div className="flex mb-1 flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="mainLabel2 col-span-6">{group.date}</div>
                    <div className="font-medium col-span-2 subLabel place-self-center text-(--foreground)/90">
                      {getFormattedAmount(group.totalAmount)}
                    </div>
                  </div>
                </div>
                {group?.bills?.map((bill) => {
                  return (
                    <Card
                      key={bill.id}
                      className={
                        "rounded-sm px-3 py-3 shadow-[0_px_1px_rgb(0,0,0,0.2)]"
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

                          <div className="flex ml-auto gap-1 col-span-2">
                            <Badge
                              onClick={() => {
                                handleIsPaidBill(bill.id);
                              }}
                              className={
                                "rounded-full bg-secondary/50 text-foreground w-8 h-8 col-span-1 subLabel2"
                              }
                            >
                              {bill.isPaid ? (
                                <X strokeWidth={2} />
                              ) : (
                                <Check strokeWidth={2} />
                              )}
                            </Badge>
                            <Badge
                              onClick={() => {
                                handleDeleteBill(bill.id);
                              }}
                              className={
                                "rounded-full bg-secondary/50  text-foreground w-8 h-8 subLabel2"
                              }
                            >
                              <Trash strokeWidth={2} />
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
