"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DateSelect from "./components/DateSelect";
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
  return (
    <div className="w-full px-10 py-3 flex flex-col gap-4">
      <DateSelect />
      <div className="flex gap-5 ">
        <Card className={"flex-1/6"}>
          <CardHeader>
            <CardTitle>Monthly Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div>50,000</div>
          </CardContent>
        </Card>
        <Card className={"flex-1/2"}>
          <CardHeader>
            <CardTitle>Add Expense</CardTitle>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
        <Card className={"flex-1/6"}>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div>30,000</div>
          </CardContent>
        </Card>
      </div>
      <div>
        <div className="my-5">Your Transactions</div>
        <div className="flex flex-col gap-4">
          {transactions.map((expense) => (
            <Card className={"p-5 rounded-sm"}>
              <CardContent>
                <div className="grid grid-cols-2">
                  <div className="text-sm">{expense.description}</div>
                  <div className="text-sm text-center">{expense.amount}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
