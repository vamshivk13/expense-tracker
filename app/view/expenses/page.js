import { getFormattedAmount, getFormattedDate } from "@/app/util/DateUtility";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-select";
import { Utensils } from "lucide-react";

export default function ExpensesView() {
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
    <div className="max-w-4xl mx-auto px-4 sm:px-20 lg:px-20 pb-2">
      <div className="text-lg z-20 bg-(--background) h-[55px] sticky top-[50px] gap-x-3 grid grid-cols-4 items-center">
        <div className={"col-span-3"}>Fixed Expenses</div>
        <Button variant="outline" className={"ml-auto rounded-2xl"}></Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-x-3 h-[34px] flex items-center text-gray-700 dark:text-gray-400 bg-(--background) sticky top-[105px]">
          <div className="text-sm col-span-3 sm:col-span-2">Expense</div>
          <div className="text-sm hidden sm:block text-center">Date</div>
          <div className="text-sm text-center">Amount</div>
          <Separator className={"absolute bottom-0"} />
        </div>

        {transactions.map((expense) => (
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
    </div>
  );
}
