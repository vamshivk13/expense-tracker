"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

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

function niceMinMax(minVal, maxVal, tickCount = 5) {
  if (!isFinite(minVal) || !isFinite(maxVal)) {
    return { min: 0, max: 1, ticks: [0, 1] };
  }
  if (minVal === maxVal) {
    // Expand a flat range a bit
    const pad = Math.max(1, Math.abs(minVal) * 0.1);
    minVal -= pad;
    maxVal += pad;
  }

  const range = niceNumber(maxVal - minVal, false);
  const step = niceNumber(range / Math.max(1, tickCount - 1), true);
  const niceMin = Math.floor(minVal / step) * step;
  const niceMax = Math.ceil(maxVal / step) * step;

  const ticks = [];
  for (let v = niceMin; v <= niceMax + 1e-9; v += step) {
    // handle floating point drift
    ticks.push(Number(v.toFixed(10)));
  }
  return { min: niceMin, max: niceMax, ticks };
}

/**
 * Rounds a number to a "nice" number for axis ticks.
 * Based on classic charting heuristics: 1, 2, 5 * 10^n
 */
function niceNumber(x, round) {
  const exp = Math.floor(Math.log10(Math.max(1e-12, Math.abs(x))));
  const f = x / Math.pow(10, exp);
  let nf;
  if (round) {
    if (f < 1.5) nf = 1;
    else if (f < 3) nf = 2;
    else if (f < 7) nf = 5;
    else nf = 10;
  } else {
    if (f <= 1) nf = 1;
    else if (f <= 2) nf = 2;
    else if (f <= 5) nf = 5;
    else nf = 10;
  }
  return nf * Math.pow(10, exp);
}

/**
 * Formats large values nicely with currency (e.g., ₹1.2K, ₹3.4L, ₹2.1M)
 */
function formatCurrencyShort(value, symbol = "₹") {
  const v = Number(value);
  if (!isFinite(v)) return `${symbol}0`;
  const abs = Math.abs(v);

  // Indian-style Lakh/Crore, else fall back to K/M/B
  if (abs >= 1e7) return `${symbol}${(v / 1e7).toFixed(1)}Cr`;
  if (abs >= 1e5) return `${symbol}${(v / 1e5).toFixed(1)}L`;
  if (abs >= 1e3) return `${symbol}${(v / 1e3).toFixed(1)}K`;
  return `${symbol}${v.toLocaleString()}`;
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

  const yMin = Math.min(...transactionsByDate?.map((d) => d.dayAmount));
  const yMax = Math.max(...transactionsByDate?.map((d) => d.dayAmount));
  const nice = niceMinMax(yMin, yMax, 3);

  return (
    <Card className="py-4 bg-background w-full sm:py-0 border-none outline-none shadow-none">
      <CardHeader className="border-none flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="!p-0 flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle className={"!p-0 mainLabel"}>Expense History</CardTitle>
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
      <CardContent className="px-0 w-full sm:p-6 border-none shadow-none outline-none">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto border-none outline-none h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={[...transactionsByDate]}
            margin={{
              left: 22,
              right: 0,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="key"
              ticks={[
                transactionsByDate[0]?.key,
                transactionsByDate[transactionsByDate.length - 1]?.key,
              ]}
              tickLine={true}
              axisLine={false}
              tickMargin={8}
              minTickGap={0}
              padding={{ left: 0, right: 0 }}
              domain={["dataMin", "dataMax"]} // continuous range from first to last
              // display={"none"}
              tickFormatter={(value) => {
                const date = new Date(value);
                return new Date(date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "2-digit",
                });
              }}
              className="subLabel2"
              interval={0}
            />

            <YAxis
              width={"50"}
              margin={{
                right: 0,
              }}
              className="z-50 !p-0 !m-0"
              padding={{ top: 0, right: 0, bottom: 0, left: 0 }}
              orientation="right"
              tickLine={false}
              axisLine={false}
              domain={[nice.min, nice.max]}
              ticks={nice.ticks}
              tickFormatter={(v) => formatCurrencyShort(v)}
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
