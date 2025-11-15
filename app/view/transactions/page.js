"use client";
import DateSelect from "@/app/components/DateSelect";
import EditExpenseDialog from "@/app/components/EditExpenseDialog";
import Transactions from "@/app/components/transactions/Transactions";
import { Separator } from "@radix-ui/react-select";
import { useRouter } from "next/navigation";

export default function ExpensesView() {
  const router = useRouter();
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
  return (
    <div className="px-6 sm:px-16 lg:px-16 pb-2">
      <div className="text-lg z-20 bg-(--background) h-[55px] sticky top-0 gap-x-3 grid grid-cols-4 items-center">
        <div className={"col-span-3"}>Your Transactions</div>
        <DateSelect />
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-x-3 h-[34px] flex items-center text-gray-700 dark:text-gray-400 bg-(--background) sticky top-[55px]">
          <div className="text-sm col-span-3 sm:col-span-2">Expense</div>
          <div className="text-sm hidden sm:block text-center">Date</div>
          <div className="text-sm text-center">Amount</div>
          <Separator className={"absolute bottom-0"} />
        </div>
        {transactions.map((expense) => (
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
    </div>
  );
}
