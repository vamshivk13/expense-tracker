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
import {
  ChartNoAxesColumn,
  Layers2,
  Lightbulb,
  Sparkles,
  TrendingUp,
} from "lucide-react";

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

function getWeeklyExpenseBuckets(transactions) {
  function toLocalDate(input) {
    if (input instanceof Date) return new Date(input); // copy
    if (typeof input === "string") {
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input);
      if (m) {
        const [, y, mo, da] = m;
        return new Date(Number(y), Number(mo) - 1, Number(da)); // local midnight
      }
      return new Date(input);
    }
    return new Date(input);
  }

  function startOfLocalDay(d) {
    const copy = new Date(d);
    copy.setHours(0, 0, 0, 0);
    return copy;
  }

  function startOfWeekMonday(d) {
    const day = d.getDay(); // 0=Sun,1=Mon,...6=Sat
    const diff = day === 0 ? -6 : 1 - day; // move back to Monday
    const start = startOfLocalDay(d);
    start.setDate(start.getDate() + diff);
    return start;
  }

  function addDays(d, days) {
    const copy = new Date(d);
    copy.setDate(copy.getDate() + days);
    return copy;
  }

  function formatLocalYYYYMMDD(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    return `${m}-${da}`;
  }

  const bucketsMap = new Map();

  for (const tx of transactions || []) {
    const parsed = toLocalDate(tx?.date);
    if (isNaN(parsed.getTime())) continue; // skip invalid date

    const amount = Number(tx?.amount);
    if (!Number.isFinite(amount)) continue; // skip invalid amount

    const weekStart = startOfWeekMonday(parsed);
    const weekEnd = startOfLocalDay(addDays(weekStart, 6));

    const key = `${formatLocalYYYYMMDD(weekStart)} to ${formatLocalYYYYMMDD(
      weekEnd
    )}`;

    let bucket = bucketsMap.get(key);
    if (!bucket) {
      bucket = { key: key, totalAmount: 0, transactions: [] };
      bucketsMap.set(key, bucket);
    }

    bucket.totalAmount += amount;
    bucket.transactions.push(tx);
  }

  return Array.from(bucketsMap.values()).sort((a, b) => {
    const aStart = a.key.slice(0, 10);
    const bStart = b.key.slice(0, 10);
    return aStart < bStart ? -1 : aStart > bStart ? 1 : 0;
  });
}

export function ExpenseSummaryChart({ transactions }) {
  const [activeChart, setActiveChart] = React.useState("totalAmount");
  const [transactionsByDate, setTransactionsByDate] = React.useState([]);
  const [transactionsByWeek, setTransactionsByWeek] = React.useState([]);
  const [lineChartData, setLineChartData] = React.useState([]);
  const [peakDay, setPeakDay] = React.useState(null);
  const [avgDailyExpense, setAvgDailyExpense] = React.useState(0);
  const [topCategory, setTopCategory] = React.useState("");
  console.log("DATA", lineChartData);
  const [lineChartMode, setLineChartMode] = React.useState([
    "Monthly View",
    "Weekly Spikes",
  ]);

  React.useEffect(() => {
    console.log("MODE CHANGED", lineChartMode);
    if (lineChartMode[0] == "Monthly View") {
      setLineChartData(transactionsByDate);
    } else if (lineChartMode[0] == "Weekly Spikes") {
      setLineChartData(transactionsByWeek);
    }
  }, [lineChartMode[0], transactionsByWeek, transactionsByDate]);

  React.useEffect(() => {
    const weeklyTransactions = getWeeklyExpenseBuckets(transactions);
    console.log("WEEKLY TRANSACTIONS", weeklyTransactions);
    setTransactionsByWeek(weeklyTransactions);
  }, [transactions]);

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
        totalAmount: transactionsByDate[date].reduce(
          (acc, curr) => acc + curr.amount,
          0
        ),
      });
    }
    console.log("Transactions grouped by date:", groupedTransactions);
    setTransactionsByDate(groupedTransactions);
  }, [transactions]);

  React.useEffect(() => {
    //Extract peak day from transactionsByDate
    if (transactionsByDate.length > 0) {
      const peakDay = transactionsByDate.reduce((prev, current) => {
        return prev.totalAmount > current.totalAmount ? prev : current;
      });
      setPeakDay(peakDay);
    }
    //Extract avg daily expense from transactionsByDate
    if (transactionsByDate.length > 0) {
      const totalAmount = transactionsByDate.reduce(
        (acc, curr) => acc + curr.totalAmount,
        0
      );
      const avgDailyExpense = totalAmount / transactionsByDate.length;
      setAvgDailyExpense(avgDailyExpense.toFixed(0));
    }

    // Extract top category from transactions with name and count of transactions
    const categoryCounts = transactions.reduce((acc, transaction) => {
      const category = transaction.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    if (Object.entries(categoryCounts).length == 0) return;

    const topCategory = Object.entries(categoryCounts).reduce(
      (prev, current) => {
        return prev[1] > current[1] ? prev : current;
      }
    )[0];

    console.log("TOP CATEGORY", topCategory);
    setTopCategory(topCategory);
  }, [transactionsByDate, transactions]);

  const yMin = Math.min(...lineChartData?.map((d) => d.totalAmount));
  const yMax = Math.max(...lineChartData?.map((d) => d.totalAmount));
  const nice = niceMinMax(yMin, yMax, 3);

  return (
    <div className="mt-4 flex flex-col gap-3">
      <Card className="py-4  bg-background w-full sm:py-0 border-none outline-none shadow-none">
        <CardHeader className="border-none flex flex-col items-stretch border-b !p-0 sm:flex-row">
          <div className="!p-0 flex flex-1 mb-2 items-start gap-1 px-6 pb-3 sm:pb-0">
            <div className="flex flex-col gap-2">
              <CardTitle className={"mainLabel"}>Expense History</CardTitle>
              <CardDescription className="flex items-center text-xs gap-2 !text-muted-foreground mr-auto mt-2 sm:mt-0">
                Overview of your expenses over time
                <TrendingUp size={13} className="text-foreground" />
              </CardDescription>
            </div>
            <div
              onClick={() => {
                setLineChartMode((prev) => {
                  const prev1 = [...prev];
                  const toRear = prev1.shift();
                  return [...prev1, toRear];
                });
              }}
              className="subLabel2 cursor-pointer select-none text-gray-600 border-b-[1px] border-gray-500 ml-auto"
            >
              {lineChartMode[0]}
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 w-full sm:p-6 border-none outline-none">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto border-none outline-none h-[250px] w-full"
          >
            <LineChart
              accessibilityLayer
              data={[...lineChartData]}
              margin={{
                left: 22,
                right: 0,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="key"
                ticks={[
                  lineChartData[0]?.key,
                  lineChartData[lineChartData.length - 1]?.key,
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

                  if (!isNaN(date.getTime())) {
                    return new Date(date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "2-digit",
                    });
                  } else {
                    return value;
                  }
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
                      if (!isNaN(getFormattedDate(value)))
                        return getFormattedDate(value);
                      else {
                        return value;
                      }
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
      <div className="flex flex-col gap-2">
        <div class="rounded-2xl  bg-surface-dark dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700 p-1 shadow-xs">
          <div class="grid grid-cols-3 items-center gap-3">
            <div class="flex gap-1 flex-col items-center justify-around p-1  bg-surface-light dark:bg-gray-800/50 border-none border-gray-100/50 dark:border-gray-700/50">
              <div className="flex flex-col items-center">
                <TrendingUp
                  size={18}
                  strokeWidth={1}
                  class="text-green-500 text-lg mb-1"
                />
                <span class="text-[9px] subLabel2 !text-muted-foreground font-bold uppercase mb-0.5">
                  Peak Day
                </span>
              </div>
              <span class="text-[11px] font-bold subLabel2  text-text-primary-light dark:text-text-primary-dark">
                ₹{peakDay?.totalAmount}
                {" - "}
                {peakDay?.key.split(",")[0].split(" ")[0].slice(0, 3)}{" "}
                {peakDay?.key.split(",")[0].split(" ")[1]}
              </span>
            </div>
            <div class="flex gap-1 flex-col items-center justify-around p-1  bg-surface-light dark:bg-gray-800/50 border-none border-gray-100/50 dark:border-gray-700/50">
              <div className="flex flex-col items-center">
                <ChartNoAxesColumn
                  size={18}
                  strokeWidth={1}
                  class="text-blue-500 text-lg mb-1"
                />
                <span class="text-[9px] font-bold !text-muted-foreground  uppercase mb-0.5">
                  Daily Avg
                </span>
              </div>
              <span class="text-[11px] font-bold text-text-primary-light dark:text-text-primary-dark">
                ₹{avgDailyExpense}
              </span>
            </div>
            <div class="flex gap-1 flex-col items-center justify-around p-1  bg-surface-light dark:bg-gray-800/50 border-none border-gray-100/50 dark:border-gray-700/50">
              <div className="flex flex-col items-center">
                <Layers2
                  size={18}
                  strokeWidth={1}
                  class="text-purple-500 text-lg mb-1"
                />
                <span class="text-[9px] font-bold !text-muted-foreground uppercase mb-0.5">
                  Top Category
                </span>
              </div>
              <span class="text-[11px] font-bold text-text-primary-light dark:text-text-primary-dark">
                {topCategory}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
