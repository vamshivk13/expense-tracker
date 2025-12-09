"use client";
import DateSelect from "@/app/components/DateSelect";
import EditExpenseDialog from "@/app/components/EditExpenseDialog";
import Transactions from "@/app/components/transactions/Transactions";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-select";
import { set } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function ViewTransactions({
  transactions,
  goTo,
  setCurrentExpense,
  setHistory,
  history,
}) {
  const [transactionsByDate, setTransactionsByDate] = React.useState([]);
  useEffect(() => {
    if (transactions.length === 0) {
      return;
    }
    console.log(
      "Start Array of Transaction objects represented by date as object key",
      transactions
    );
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
      });
    }
    console.log("Transactions grouped by date:", groupedTransactions);
    setTransactionsByDate(groupedTransactions);
  }, [transactions]);
  return (
    <div className="px-6 h-[100vh] sm:px-16 lg:px-16 overflow-y-auto">
      <div className="z-20 bg-(--background) p-4 pt-8 pl-0 flex gap-3 sticky top-0 items-center ">
        <div className="text-lg bg-background gap-x-3 grid grid-cols-4 w-full items-center">
          <div className="flex gap-2 col-span-3 mr-auto ">
            <ArrowLeft onClick={() => goTo(null)} />
            <div>Your Transactions</div>
          </div>
          <div className="ml-auto">
            <DateSelect />
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-4 mb-4 overflow-y-auto gap-6">
        <div className="flex flex-col gap-4 overflow-y-auto">
          {transactionsByDate.map((group) => (
            <div key={group.date} className="flex flex-col gap-4">
              <div className="font-semibold text-(--foreground) mainLabel2">
                {group.date}
              </div>
              <div className="flex flex-col gap-4">
                {group.transactions.map((expense) => (
                  <div key={expense.id}>
                    <div className="hidden sm:block">
                      <EditExpenseDialog>
                        <Transactions expense={expense} />
                      </EditExpenseDialog>
                    </div>
                    <div
                      className="sm:hidden block"
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
    </div>
  );
}
