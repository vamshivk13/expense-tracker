"use client";
import { Categories } from "@/app/components/Categories";
import DateSelect from "@/app/components/DateSelect";
import EditExpenseDialog from "@/app/components/EditExpenseDialog";
import Transactions from "@/app/components/transactions/Transactions";
import { getFormattedAmount } from "@/app/util/DateUtility";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-select";
import { set } from "date-fns";
import { ArrowLeft, Check, CircleSmall, Cross, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function ViewTransactions({
  transactions,
  goTo,
  setCurrentExpense,
  setHistory,
  history,
  setCurMonth,
  setCurYear,
  curMonth,
}) {
  const [transactionsByDate, setTransactionsByDate] = React.useState([]);
  const [categoryFilter, setCategoryFilter] = React.useState(null);
  console.log("TRANS", transactions);

  function setTransactionsByDateState(transactions) {
    const sortedTransactions = transactions.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    const transactionsByDate = sortedTransactions.reduce((acc, transaction) => {
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

    const groupedTransactions = [];
    for (const date in transactionsByDate) {
      groupedTransactions.push({
        date: date,
        transactions: transactionsByDate[date],
        totalAmount: transactionsByDate[date].reduce(
          (acc, curr) => acc + curr.amount,
          0
        ),
      });
    }
    console.log("Transactions grouped by date:", groupedTransactions);
    setTransactionsByDate(groupedTransactions);
  }
  useEffect(() => {
    setTransactionsByDateState(transactions);
  }, [transactions]);

  useEffect(() => {
    if (categoryFilter) {
      const filteredTransactions = transactions.filter(
        (tx) => tx.category === categoryFilter
      );
      const sortedTransactions = filteredTransactions.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });

      const transactionsByDate = sortedTransactions.reduce(
        (acc, transaction) => {
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
        },
        {}
      );

      const groupedTransactions = [];
      for (const date in transactionsByDate) {
        groupedTransactions.push({
          date: date,
          transactions: transactionsByDate[date],
          totalAmount: transactionsByDate[date].reduce(
            (acc, curr) => acc + curr.amount,
            0
          ),
        });
      }
      setTransactionsByDate(groupedTransactions);
    }
  }, [transactions, categoryFilter]);

  function handleClearFilters() {
    setCategoryFilter(null);
    setTransactionsByDateState(transactions);
  }

  return (
    <div className="px-6 h-[100vh] sm:px-16 lg:px-16 overflow-y-auto">
      <div className="z-20 bg-(--background) p-4 pt-8 pl-0 flex gap-3 sticky top-0 items-center ">
        <div className="text-lg bg-background relative flex w-full items-center">
          <ArrowLeft
            className="absolute top-[50%] translate-y-[-50%]"
            onClick={() => goTo(null)}
          />
          <div className="mx-auto subLabel px-4 py-2 rounded-full border-[0.3px] border-blue-400">
            Your Transactions
          </div>
          <div className="">
            <DateSelect
              curMonth={curMonth}
              setCurMonth={setCurMonth}
              setCurYear={setCurYear}
            />
          </div>
        </div>
      </div>
      {transactionsByDate.length == 0 ? (
        <div className="subLabel2 bg-secondary/50 p-4 rounded-md text-center text-gray-700 dark:text-gray-400">
          You dont have any transactions yet, Add some to see them here.
        </div>
      ) : (
        <div className="flex flex-col mt-4 mb-1 overflow-y-auto gap-2">
          <div className="flex truncate overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden gap-2 my-2">
            <Categories setCategory={setCategoryFilter}>
              <div
                className={
                  "cursor-pointer flex items-center subLabel2 text-background bg-muted-foreground px-2 py-1 rounded-full"
                }
              >
                <div>category</div>
                {categoryFilter && (
                  <div className="subLabel3 flex items-center gap-1 !text-background  ml-1">
                    <Check className="inline-block ml-1 w-3 h-3 stroke-(--background)" />
                    {categoryFilter}
                  </div>
                )}
              </div>
            </Categories>
            <div
              className={
                "cursor-pointer subLabel2 text-background bg-muted-foreground px-2 py-1 rounded-full"
              }
            >
              tag
            </div>
            <div
              className={
                "cursor-pointer subLabel2 text-background bg-muted-foreground px-2 py-1 rounded-full"
              }
            >
              amount
            </div>
            <div
              className={
                "cursor-pointer subLabel2 text-background bg-muted-foreground px-2 py-1 rounded-full"
              }
            >
              date
            </div>
          </div>
          <div className={"cursor-pointer mb-10 mr-auto "}>
            <div>
              {categoryFilter && (
                <div
                  onClick={handleClearFilters}
                  className="subLabel2 flex text-background bg-foreground px-2 py-1 rounded-full"
                >
                  <p>Clear Filters</p>
                  <X className="inline-block ml-1 w-3 h-3 stroke-(--background)" />
                </div>
              )}
            </div>
          </div>
          {categoryFilter && (
            <div className="mb-4 flex gap-1 items-center subLabel2">
              <CircleSmall strokeWidth={1} size={14}></CircleSmall>
              <div> Total Amount Spent on {categoryFilter} is</div>
              <div className="subLabel2 font-semibold">
                {getFormattedAmount(
                  transactionsByDate.reduce(
                    (total, group) => total + group.totalAmount,
                    0
                  )
                )}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-6 overflow-y-auto">
            {transactionsByDate.map((group) => (
              <div key={group.date} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-8 justify-between items-center">
                    <div className="mainLabel2 col-span-6">{group.date}</div>
                    <div className="font-medium col-span-2 subLabel place-self-center text-(--foreground)/90">
                      {getFormattedAmount(group?.totalAmount?.toFixed(2))}
                    </div>
                  </div>
                  <Separator className="border-[0.1px]" />
                </div>

                <div className="flex flex-col gap-4">
                  {group.transactions.map((expense) => (
                    <div key={expense.id}>
                      <div
                        className="block"
                        onClick={() => {
                          setCurrentExpense(expense);
                          setHistory([...history, "viewTransactions"]);
                          goTo("editTransaction");
                        }}
                      >
                        <Transactions expense={expense} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
