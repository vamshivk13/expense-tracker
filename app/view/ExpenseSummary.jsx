import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Badge } from "lucide-react";
import { ExpenseSummaryChart } from "../components/ExpenseSummaryChart";
import { useEffect, useState } from "react";

const ExpenseSummary = ({ goBack, transactions: allTransactions }) => {
  const [transactions, setTransactions] = useState(null);
  const [todaysExpense, setTodaysExpense] = useState(0);
  const [weeksExpense, setWeeksExpense] = useState(0);
  const [monthlyExpense, setMonthlyExpense] = useState(0);

  function getCurrentWeekExpenseTotal(
    allTransactions,
    weekStartsOn /* 0=Sunday, 1=Monday */
  ) {
    // Default to Monday as start of week if not provided
    weekStartsOn = weekStartsOn === 0 || weekStartsOn === 1 ? weekStartsOn : 1;

    // Determine start and end of the current week in LOCAL time
    var now = new Date();

    // Start of today (local)
    var start = new Date(now);
    start.setHours(0, 0, 0, 0);

    // JS getDay(): 0=Sun,1=Mon,...,6=Sat
    var day = start.getDay();
    var diff = (day + 7 - weekStartsOn) % 7; // days since week start

    // Move to start of the week
    start.setDate(start.getDate() - diff);

    // End of the week
    var end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    // Sum amounts within [start, end]
    var total = (allTransactions || [])
      .filter(function (tx) {
        var dt = new Date(tx && tx.date);
        return !isNaN(dt.getTime()) && dt >= start && dt <= end;
      })
      .reduce(function (sum, tx) {
        var amt = Number((tx && tx.amount) || 0);
        return sum + (isNaN(amt) ? 0 : amt);
      }, 0);

    return total;
  }

  useEffect(() => {
    setTransactions(allTransactions);
    // Calculate todays expense
    const today = new Date();
    const todayString = today.toLocaleString();
    const total = allTransactions
      .filter(
        (tx) =>
          new Date(tx.date).toLocaleString().split(",")[0] ==
          todayString.split(",")[0]
      )
      .reduce((sum, tx) => sum + tx.amount, 0);

    setTodaysExpense(total);
    // Calculate this week's expense
    const weeksExpense = getCurrentWeekExpenseTotal(allTransactions, 1);
    setWeeksExpense(weeksExpense);

    // Calculate this month's expense
    const monthlyExpenses = allTransactions.reduce(
      (sum, tx) => sum + tx.amount,
      0
    );
    setMonthlyExpense(monthlyExpenses);
  }, [allTransactions]);

  return (
    <div
      className={
        "flex flex-col gap-5 sm:container mx-auto px-6 sm:px-16 lg:px-16 py-3"
      }
    >
      <div className="flex flex-col gap-4 text-lg bg-background py-4 w-full">
        <div className="flex gap-2 col-span-3 items-center relative">
          <ArrowLeft
            className="absolute left-2 top-[50%] translate-y-[-50%]"
            onClick={() => goBack()}
          />
          <div className="mx-auto subLabel px-4 py-2 rounded-full border-[0.3px] border-(--border-color)">
            Expenses Summary
          </div>
        </div>
        <Tabs defaultValue="today" className={"mt-5 rounded-md"}>
          <TabsList className={"flex justify-center w-full"}>
            <TabsTrigger value="today" className={"subLabel2"}>
              Today
            </TabsTrigger>
            <TabsTrigger className={"subLabel2"} value="week">
              This Week
            </TabsTrigger>
            <TabsTrigger className={"subLabel2"} value="month">
              This Month
            </TabsTrigger>
          </TabsList>
          <TabsContent value="today">
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Today's Expenses</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  ₹{todaysExpense}
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  More Expenses than Yesterday
                </div>
                <div className="text-muted-foreground">
                  Increase in expenses by 100 rupees
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="week">
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>This Week's Expenses</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  ₹{weeksExpense}
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  More Expenses than Yesterday
                </div>
                <div className="text-muted-foreground">
                  Increase in expenses by 100 rupees
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="month">
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>This Month's Expenses</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  ₹{monthlyExpense}
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  More Expenses than Yesterday
                </div>
                <div className="text-muted-foreground">
                  Increase in expenses by 100 rupees
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        <div>
          <ExpenseSummaryChart />
        </div>
      </div>
    </div>
  );
};
export default ExpenseSummary;
