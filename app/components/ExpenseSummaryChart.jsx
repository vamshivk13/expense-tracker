"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getFormattedDate } from "../util/DateUtility";

export const description = "An interactive line chart";

const chartConfig = {
  views: {
    label: "Expenses",
  },
  day: {
    label: "day",
    color: "#fff123",
  },
  week: {
    label: "week",
    color: "var(--chart-2)",
  },
};

function getCurrentWeekExpenseTotal(
  allTransactions,
  weekStartsOn /* 0=Sunday, 1=Monday */
) {
  weekStartsOn = weekStartsOn === 0 || weekStartsOn === 1 ? weekStartsOn : 1;
  var now = new Date();
  var start = new Date(now);
  start.setHours(0, 0, 0, 0);
  var day = start.getDay();
  var diff = (day + 7 - weekStartsOn) % 7;

  start.setDate(start.getDate() - diff);

  var end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
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

export function ExpenseSummaryChart({ transactions }) {
  const [activeChart, setActiveChart] = React.useState("dayAmount");
  const [transactionsByDate, setTransactionsByDate] = React.useState([]);
  const total = React.useMemo(
    () => ({
      day: getCurrentWeekExpenseTotal(transactions, 1),
      week: transactions.reduce((acc, curr) => acc + curr.amount, 0),
    }),
    [transactions]
  );

  React.useEffect(() => {
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
        key: date,
        transactions: transactionsByDate[date],
        dayAmount: transactionsByDate[date].reduce(
          (acc, curr) => acc + curr.amount,
          0
        ),
      });
    }
    console.log("Transactions grouped by date:", groupedTransactions);
    setTransactionsByDate(groupedTransactions);
  }, [transactions]);

  return (
    <Card className="py-4 sm:py-0 border-none outline-none shadow-none">
      <CardHeader className=" border-none flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="!p-0 flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle className={"!p-0"}>Expense Summary</CardTitle>
        </div>
        {/* <div className="flex">
          {["day"].map((key) => {
            const chart = key;
            return (
              <button
                key={chart}
                data-active={activeChart === chart + "Amount"}
                className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart("totalAmount")}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
              </button>
            );
          })}
        </div> */}
      </CardHeader>
      <CardContent className="px-2 sm:p-6 border-none outline-none">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto border-none outline-none h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={[...transactionsByDate]}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="key"
              tickLine={true}
              axisLine={false}
              tickMargin={0}
              minTickGap={0}
              display={"none"}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.getDate();
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return getFormattedDate(value);
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
