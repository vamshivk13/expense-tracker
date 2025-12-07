"use client";
import DateSelect from "@/app/components/DateSelect";
import EditExpenseDialog from "@/app/components/EditExpenseDialog";
import Transactions from "@/app/components/transactions/Transactions";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-select";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ViewTransactions({
  transactions,
  goTo,
  setCurrentExpense,
  setHistory,
  history,
}) {
  return (
    <div className="px-6 h-[100vh] sm:px-16 lg:px-16 overflow-y-auto">
      <div className="z-20 bg-(--background) p-4 pt-8 pl-0 flex gap-3 sticky top-0 items-center ">
        <div className="text-lg bg-background gap-x-3 grid grid-cols-4 w-full">
          <div className="flex gap-2 col-span-3">
            <ArrowLeft onClick={() => goTo(null)} />
            <div>Your Transactions</div>
          </div>
          <DateSelect />
        </div>
      </div>
      <div className="flex flex-col mt-4 mb-4 overflow-y-auto gap-6">
        <div className="flex flex-col gap-4 overflow-y-auto">
          {transactions.map((expense) => (
            <div key={expense.date}>
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
    </div>
  );
}
